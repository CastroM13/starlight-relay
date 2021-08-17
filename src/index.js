const connStr = {
  "user": 'admin',
  "password": '3[n.svEy5X7@a4r)',
  "server": 'localhost',
  "database": 'starhub',
  "port": 1433,
  "dialect": "mssql",
  "options": {
      "encrypt": true,
      "enableArithAbort": true
  }
};
//  'Server=localhost;Database=vgstudio;User Id=admin;Password=3[n.svEy5X7@a4r); Encrypt=true';
var crypto = require('crypto');
const sql = require("mssql");
var express = require("express");
var cors = require("cors");
var app = express();
var http = require("http").createServer(app);
const puppeteer = require('puppeteer')

// const PORT = 8080;

// http.listen(PORT, () => {
//   console.log(`listening socket requests on *:${PORT}`);
// });

app.listen(process.env.PORT || 3000, process.env.YOUR_HOST || "0.0.0.0", () => {
  console.log("listening API requests on ", process.env.PORT || 3000);
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res, next) => {
  res.write(`
        <a href="/">/</a><br/>
        <a href="/test">/test</a><br/>
        <a href="/login">/login</a><br/>
        `);
});

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


app.get("/comments/:postID", (req, res, next) => {
  const postID = req.params.postID;
  res.json([
    {
      profileImage: "https://lorempixel.com/48/48",
      name: "SkillnexRoband",
      comment: "Top!",
      likes: [0,1,2,3,4,5,6],
      dislikes: [0,1,2,3],
      responses: [
        {
          profileImage: "https://lorempixel.com/48/48",
          name: "Blubbering",
          comment: "Não achei, não achei mesmo, discordo completamente, acho que se tivesse como discordar mais eu tinha discordado, se tivesse foto no dicionário, lá no de 'Discordar' ia estar minha foto.",
          likes: [0,1,2,3],
          dislikes: [],
          responses: [
            {
              profileImage: "https://lorempixel.com/48/48",
              name: "ShihTzu",
              comment: "Panaca",
              likes: [0,1,2,3,4,5,6],
              dislikes: [],
              responses: [],
            },
          ],
        },
        {
          profileImage: "https://lorempixel.com/48/48",
          name: "Kavaper9909",
          comment: "OK, mas eu gosto de pastel",
          likes: [0,4,5,6],
          dislikes: [0,1,2,3,4,5,6],
          responses: [],
        },
      ],
    },
    {
      profileImage: "https://lorempixel.com/48/48",
      name: "SkillnexRoband",
      comment: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsum et, tempora repellat delectus provident odio cupiditate, necessitatibus, quos porro quas nesciunt praesentium? Fugiat enim quidem aut et tempore unde quod?",
      likes: [0,1,2,3,4,5,6],
      dislikes: [0,1,2,3,4,5,6],
      responses: [
        {
          profileImage: "https://lorempixel.com/48/48",
          name: "John Bob",
          comment: "o maluco tá possuído wtf",
          likes: [0,1,2,3,4,5,6],
          dislikes: [0,1,2,3,4,5,6],
          responses: [],
        },
        {
          profileImage: "https://lorempixel.com/48/48",
          name: "Kavaper9909",
          comment: "pastel",
          likes: [0,1,2,3,4,5,6],
          dislikes: [0,1,2,3,4,5,6],
          responses: [],
        },
      ],
    },
  ])
});

app.get("/user/:userID", (req, res, next) => {
  const userID = req.params.userID;
  sql
    .connect(connStr)
    .then(async function retorno(conn) {
      const result = await sql.query`SELECT * FROM [dbo].[User] WHERE UserID = ${userID}`;
      res.json(result.recordset[0]);
    })
    .catch((err) => console.log("erro! " + err));
})

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
    .catch((err) => console.log("erro! " + err));
});