const sql = require("mssql");
const express = require("express");
const cors = require("cors");
const app = express();
const puppeteer = require('puppeteer');
global.fetch = require("node-fetch");

const connStr = {
  "user": 'admin',
  "password": '5398Matheussamanco@',
  "server": '187.85.207.56',
  "database": 'starhub',
  "port": 1433,
  "dialect": "mssql",
  "options": {
      "encrypt": true,
      "enableArithAbort": true
  }
};

app.listen(process.env.PORT || 3000, process.env.YOUR_HOST || "0.0.0.0", () => {
  console.log(`API Aberta em localhost:${process.env.PORT || 3000}`);
});

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true, type: ['image/*']}));

async function getVisual(origin) {
  const browser = await puppeteer.launch();
	try {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0); 
    switch(origin) {
      case "Adrenaline":
        await page.goto('https://adrenaline.com.br/noticias');
        return await page.$$eval("article", async (el) => {
          let arr = [];
          el.map((e) => (e.querySelector("h2") || "").outerText && arr.push(
            {
              img: (((e.querySelector("img") || "").attributes || "")[2] || "").value,
              url: (e.querySelector("a") || "").href,
              title: (e.querySelector("h2") || "").outerText,
              date: ((((((e.querySelector(".post-h__content-info") || "").children || "")[0] || "").childNodes || "")[1] || "").textContent || "").split(" ")[1],
              tag: (e.querySelector("span") || "").outerText
            }));
          return arr
        });
      case "Jovem Nerd":
        await page.goto('https://jovemnerd.com.br/nerdbunker/');
        return await page.$$eval("article", async (el) => {
          let arr = [];
          el.map((e) => arr.push(
            {
              img: e.children[0].children[0].currentSrc,
              url: e.children[0].href,
              title: e.children[1].innerText.split("\n")[1],
              date: e.children[1].innerText.split("\n")[2].replace(/\b(?:Janeiro|Fevereiro|Março|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro)\b/gi, (e) => Object({'janeiro': 1,'fevereiro': 2,'março': 3,'abril': 4,'maio': 5,'junho': 6,'julho': 7,'agosto': 8,'setembro': 9,'outubro': 10,'novembro': 11,'dezembro': 12})[e]).replaceAll(' de ', '/'),
              tag: e.children[1].innerText.split("\n")[0]
            }));
          return arr
        });
      case "Omelete":
        await page.goto('https://www.omelete.com.br/');
        return await page.$$eval("article", async (el) => {
          let arr = [];
          el.map((e) => arr.push(
            {
              title: e.querySelector('h2').innerText,
              tag: e.querySelector('p').innerText,
              date: new Date((((e.querySelector(".mark__time")||"").innerText||"").replace("([^/\n])w+","")||"").trim().split(" ")[0].replace(".","/"))instanceof Date&&!isNaN(new Date((((e.querySelector(".mark__time")||"").innerText||"").replace("([^/\n])w+","")||"").trim().split(" ")[0].replace(".","/")))?new Intl.DateTimeFormat("en-US").format(new Date((((e.querySelector(".mark__time")||"").innerText||"").replace("([^/\n])w+","")||"").trim().split(" ")[0].replace(".","/"))):new Intl.DateTimeFormat("pt-BR").format(new Date()),
              img: (e.querySelector('.picture > img')|| "").currentSrc,
              url: e.querySelector('a').attributes[0].baseURI.substring(0, e.querySelector('a').attributes[0].baseURI.length - 1) + e.querySelector('a').attributes[0].nodeValue
            }));
            return arr
          });
      default:
        return [];
    } 
	} catch (error) {
    console.error(error)
	} finally {
    await browser.close();
  } 
  await browser.close();
}

async function getOffers(origin) {
  const browser = await puppeteer.launch();
	try {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0); 
    switch(origin) {
      case "Prime Gaming":
        await page.goto('https://gaming.amazon.com/home', { waitUntil: 'networkidle0' });
        return await page.evaluate(() => document.querySelectorAll('.offer'));

      default:
        return [];
    } 
	} catch (error) {
    console.error(error)
	} finally {
    await browser.close();
  } 
  await browser.close();
}

app.get("/news/:origin", (req, res, next) => {
  const origin = req.params.origin;
  getVisual(origin)
    .then((e) => res.send(e));
});

app.get("/offers/:origin", (req, res, next) => {
  const origin = req.params.origin;
  getOffers(origin)
    .then((e) => res.send(e));
});

app.get("/post/:postID/stats", (req, res, next) => {
  const postID = req.params.postID;
  if (postID) {
    sql
      .connect(connStr)
      .then(async function retorno(conn) {
        const result = await sql.query`
          DECLARE @ID_NewsComments INT;
          DECLARE @ID_NewsStats INT;
          DECLARE @News_Identity VARCHAR(500) = ${postID};
          
          SELECT NewsStats.ID_NewsStats,
              ID_NewsComments,
              [Text],
              ProfileImage,
              DisplayName,
              LoginName
            FROM NewsStats
            INNER JOIN NewsComments
            ON NewsComments.ID_NewsStats = NewsStats.ID_NewsStats
            INNER JOIN [User]
            ON NewsComments.ID_User = [User].UserID
            WHERE News_Identity = @News_Identity
          
          SELECT TOP 1 @ID_NewsStats = ID_NewsStats
            FROM NewsStats
            WHERE News_Identity = @News_Identity
          
          SELECT TOP 1 @ID_NewsComments = ID_NewsComments
            FROM NewsStats
            INNER JOIN NewsComments
            ON NewsComments.ID_NewsStats = NewsStats.ID_NewsStats
            INNER JOIN [User]
            ON NewsComments.ID_User = [User].UserID
            WHERE News_Identity = @News_Identity
          
          SELECT ID_ResponseOf,
               [Text],
               ProfileImage,
               DisplayName,
               LoginName
            FROM NewsComments
            INNER JOIN [User]
            ON NewsComments.ID_User = [User].UserID
            WHERE ID_ResponseOf IS NOT NULL
          
          SELECT ID_User FROM NewsLikes WHERE ID_NewsStats = @ID_NewsStats
            `;
        if (result.recordsets) {
          result.recordsets[0].map(e => {
            e.responses = [];
          })
          var newResult = {
            likes: [],
            comments: [
              ...result.recordsets[0],
            ],
          };
          result.recordsets[2].map(e => {
            newResult.likes.push(e.ID_User);
          });
          result.recordsets[1].map(e => {
            if (newResult.comments[newResult.comments.findIndex(i => i.ID_NewsComments === e.ID_ResponseOf)]) {
              newResult.comments[newResult.comments.findIndex(i => i.ID_NewsComments === e.ID_ResponseOf)].responses.push(e)
            }
          })
          res.json(newResult);
        } else {
          res.json(result);
        }
      })
      .catch((err) => console.log("[/stats/:postID] Erro: " + err));
  } else {
    res.json();
  }
});

app.post("/post/:postID/comment", (req, res, next) => {
  const ID_User = req.body.ID_User;
  const News_Identity = decodeURIComponent(req.params.postID);
  const ID_ResponseOf = req.body.ID_ResponseOf;
  const Text = req.body.Text;
  console.log("Request from " + (req.headers['x-forwarded-for'] || req.socket.remoteAddress || null));
  sql
    .connect(connStr)
    .then(async function retorno(conn) {
      const result = await sql.query`DECLARE @responseMessage VARCHAR

                                     EXEC addComment
                                      @pID_User = ${ID_User},     
                                      @pNews_Identity =  ${News_Identity},    
                                      @pID_ResponseOf = ${ID_ResponseOf},
                                      @pText = ${Text},   
                                      @responseMessage = @responseMessage OUTPUT
                                     
                                     SELECT @responseMessage`;
      res.json(result.recordset[0]);
    })
    .catch((err) => console.log("[/post/:postID/comment] Erro: " + err));
});

app.post("/post/:postID/like", (req, res, next) => {
  const token = req.body.token;
  const News_Identity = decodeURIComponent(req.params.postID);
  console.log("Request from " + (req.headers['x-forwarded-for'] || req.socket.remoteAddress || null));
  sql
    .connect(connStr)
    .then(async function retorno(conn) {
      const result = await sql.query`DECLARE @responseMessage VARCHAR

                                     EXEC likePost @pID_User = ${token},
                                                   @pNews_Identity =  ${News_Identity},
                                                   @responseMessage = @responseMessage OUTPUT
                                     
                                     SELECT @responseMessage`;
      res.json(result.recordset[0]);
    })
    .catch((err) => console.log("[/post/:postID/comment] Erro: " + err));
});

app.post("/post/:postID/dislike", (req, res, next) => {
  const token = req.body.token;
  const News_Identity = decodeURIComponent(req.params.postID);
  console.log("Request from " + (req.headers['x-forwarded-for'] || req.socket.remoteAddress || null));
  sql
    .connect(connStr)
    .then(async function retorno(conn) {
      const result = await sql.query`DECLARE @responseMessage VARCHAR

                                     EXEC dislikePost @pID_User = ${token},
                                                      @pNews_Identity =  ${News_Identity},
                                                      @responseMessage = @responseMessage OUTPUT
                                     
                                     SELECT @responseMessage`;
      res.json(result.recordset[0]);
    })
    .catch((err) => console.log("[/post/:postID/comment] Erro: " + err));
});

app.get("/user/:userID", (req, res, next) => {
  const userID = req.params.userID;
  if (userID) {
    sql
      .connect(connStr)
      .then(async function retorno(conn) {
        const result = await sql.query`SELECT * FROM [dbo].[User] WHERE UserID = ${userID}`;
        res.json(result.recordset[0]);
      })
      .catch((err) => console.log("[/user/:userID] Erro: " + err));
  } else {
    res.json();
  }
});

app.post("/user/:userID/image", (req, res, next) => {
  const ID_User = req.params.ID_User;
  const file = new Buffer.from(req.body);
  console.log(file);
  console.log("Request from " + (req.headers['x-forwarded-for'] || req.socket.remoteAddress || null));
  console.log(require('fs').createReadStream(file));
  fetch('https://api.imgur.com/3/image', { // Your POST endpoint
    method: 'POST',
    encoding: null,
    headers: {
      'content-type' : 'image/jpg',
      'Authorization': 'Client-ID ca92714459254a2'
    },
    body: require('fs').createReadStream(file)
  }).then(
    response => response.json() // if the response is a JSON object
  ).then(
    success => console.log(success) // Handle the success response object
  ).catch(
    error => console.log(error) // Handle the error response object
  );
  // sql
  //   .connect(connStr)
  //   .then(async function retorno(conn) {
  //     const result = await sql.query`DECLARE @responseMessage VARCHAR

  //                                    EXEC addComment
  //                                     @pID_User = ${ID_User},     
  //                                     @pNews_Identity =  ${News_Identity},    
  //                                     @pID_ResponseOf = ${ID_ResponseOf},
  //                                     @pText = ${Text},   
  //                                     @responseMessage = @responseMessage OUTPUT
                                     
  //                                    SELECT @responseMessage`;
  //     res.json(result.recordset[0]);
  //   })
  //   .catch((err) => console.log("[/post/:postID/comment] Erro: " + err));
});

app.post("/login", (req, res, next) => {
  const user = req.body.user;
  const password = req.body.password;
  console.log("Request from " + (req.headers['x-forwarded-for'] || req.socket.remoteAddress || null));
  sql
    .connect(connStr)
    .then(async function retorno(conn) {
      const result = await sql.query`DECLARE @token INTEGER
                                     EXEC dbo.safeLogin
                                          @pLoginName = ${user},
                                          @pPassword = ${password},
                                          @token = @token OUTPUT
                                     SELECT @token as N'token'`;
      res.json(result.recordset[0]);
    })
    .catch((err) => console.log("[/login] Erro: " + err));
});

app.post("/register", (req, res, next) => {
  const user = req.body.user;
  const displayName = req.body.displayName;
  const password = req.body.password;
  console.log("Request from " + (req.headers['x-forwarded-for'] || req.socket.remoteAddress || null));
  sql
    .connect(connStr)
    .then(async function retorno(conn) {
      const result = await sql.query`DECLARE @token INTEGER
                                     DECLARE @responseMessage NVARCHAR(250)
                                     EXEC dbo.addUser @pLogin = ${user},
                                             @pPassword = ${password},
                                             @profileImage = '',
                                             @displayName = ${displayName},
                                             @token = @token OUTPUT,
                                             @responseMessage = @responseMessage OUTPUT
                                     SELECT @token as N'token', @responseMessage as N'response'`;
      res.json(result.recordset[0]);
    })
    .catch((err) => console.log("[/login] Erro: " + err));
});