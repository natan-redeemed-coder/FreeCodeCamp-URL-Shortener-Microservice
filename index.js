const cors = require("cors");
const dns = require('dns');
require("dotenv").config();
const express = require("express");
const { url } = require("inspector");


const app = express();


const urls = [];


app.use(cors());

app.use(express.urlencoded({extended: true}));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", (request, response) => {
  response.sendFile(process.cwd() + "/views/index.html");
});

app.post('/api/shorturl', (request, response) => {
  try {
    const urlToShorten = new URL(request.body.url);
    dns.lookup(
      urlToShorten.hostname,
      (error, address, family) => {
        if (error === null) {
          const indexOfUrl = urls.indexOf(request.body.url);
          if (indexOfUrl === -1) {
            urls.push(request.body.url);
            response.json({
              original_url: request.body.url,
              short_url: urls.length - 1
            });
          } else {
            response.json({
              original_url: request.body.url,
              short_url: indexOfUrl
            });
          }
        } else {
          response.json({
            error: "invalid url"
          });
        }
      }
    );
  } catch (error) {
    response.json({
      error: "invalid url"
    });
  }
});

app.get("/api/shorturl/:shorturl", (request, response) => {
  const shorturl = Number(request.params.shorturl);
  if (shorturl >= 0 && shorturl < urls.length) {
    response.redirect(urls[shorturl]);
  } else {
    response.json({
      error: "invalid shorturl"
    });
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});