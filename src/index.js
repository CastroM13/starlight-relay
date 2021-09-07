const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

server.listen(3000, () => {
  console.log(`Socket aberto em localhost:${process.env.PORT || 3000}`);
});

io.on('connection', async socket => {
  console.log('Usuário Conectado: ', socket.id);

  socket.emit('previousMessages', await getMessages(1));

  socket.on('sendMessage', data => {
    sendMessage(1, data.id, data.text)
    socket.broadcast.emit('receivedMessage', data);
    socket.broadcast.emit('receivedNotification');
  });
})

app.listen(process.env.PORT || 3000, process.env.YOUR_HOST || "0.0.0.0", () => {
  console.log(`API aberta em localhost:${process.env.PORT || 3000}`);
});

const puppeteer = require('puppeteer');
global.fetch = require("node-fetch");

const connStr = {
  "user": 'admin',
  "password": '',
  "server": '192.168.0.115',
  "database": 'starhub',
  "port": 1433,
  "dialect": "mssql",
  "options": {
      "encrypt": true,
      "enableArithAbort": true
  }
};

async function main(email_to, verifyToken) {
  const user_name     = `noreply.starhub@gmail.com`;
  const refresh_token = '1//048W1XGI8V11OCgYIARAAGAQSNwF-L9IrdSP0bCuKvIUSzuToZ3V1yuiEtEPY9HsmXkwQtyxrfKr0w1e8ghTlsEv_g192828xAtE';
  const access_token  = 'ya29.a0ARrdaM-YLPFwORSJj1OzsW1Nka2gHmoBsd8OE--_cFnkDCy--g7D3KswsQjwV5AZpTVgc47KS0hgkDnmhYvdNh5CivSjlTUMWRrjcMvcu5n4brLry4xg7yCfo4ES2FHuHCDZLiwHyXJrDoFx2WJmAbIiTuEC';
  const client_id     = '683143169807-t16venht25c9isqdaf1pl22222ij93uk.apps.googleusercontent.com';
  const client_secret = '8hP7aLT5YrUe-PFmvW_8xSWz';

  const nodemailer = require('nodemailer');

  let transporter = nodemailer
  .createTransport({
      service: 'Gmail',
      auth: {
          type: 'OAuth2',
          clientId: client_id,
          clientSecret: client_secret
      }
  });
  transporter.on('token', token => {
      console.log('Um novo token de acesso foi gerado');
      console.log('Usuário: %s', token.user);
      console.log('Access Token: %s', token.accessToken);
      console.log('Expira em: %s', new Date(token.expires));
  });
  
  let mailOptions = {
      from    : user_name,
      to      : email_to, 
      ...{
        subject : 'Confirmação de Conta no Starhub', 
        text    : `Olá!
        \n
        \n
        Uma conta no aplicativo Starhub foi criada utilizando o seu e-mail, se foi você o autor dessa solicitação, valide sua conta com este TOKEN:
        \n
        \n
        ${verifyToken}
        \n      
        \n
        Caso a solicitação não seja de sua autoria, pedimos que ignore, mas se escolher ser removido permanentemente de nossa lista de contatos, utilize o seguinte link:
        \n
        \n      
        https://castrom13.studio/email/remove/${email_to}`, 
        html    : `<div><div><div bgcolor="#ebebeb"><div><div class="adM">
        </div><table width="100%" bgcolor="#ebebeb" cellpadding="0" cellspacing="0" border="0">
           <tbody>
              <tr>
                 <td width="100%">
                    <table width="580" cellpadding="0" cellspacing="0" border="0" align="center">
                       <tbody>
                          <tr>
                             <td width="100%" height="25"></td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
     </div>
     
     <div>
        <table width="100%" bgcolor="#ebebeb" cellpadding="0" cellspacing="0" border="0">
           <tbody>
              <tr>
                 <td>
             <table bgcolor="#ebebeb" width="596" align="center" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                       <tbody style="line-height:12px">
                         <tr>
                               <td background="https://ci3.googleusercontent.com/proxy/T59bSiqoPeYg4dpUSDXYsIUQ1clKDjyJM9Ig3eiPSwr6GfGssmvN5x_prY8XXC6AGJS66VSUEOWbW19yZebGhq63kgD3JVFkX_sbpOcZYl7fDyu9VQghndDc6dw=s0-d-e1-ft#https://namedotcom-cdn.name.tools/media/email/shadows/left-top-corner.png" width="8" height="7" style="background:url(https://ci3.googleusercontent.com/proxy/T59bSiqoPeYg4dpUSDXYsIUQ1clKDjyJM9Ig3eiPSwr6GfGssmvN5x_prY8XXC6AGJS66VSUEOWbW19yZebGhq63kgD3JVFkX_sbpOcZYl7fDyu9VQghndDc6dw=s0-d-e1-ft#https://namedotcom-cdn.name.tools/media/email/shadows/left-top-corner.png);background-repeat:no-repeat"></td>
                               <td background="https://ci4.googleusercontent.com/proxy/IJCc8zp_foH4FcY1Wn0bEVE2XOECyktHD2WsjyZs9DmtEJz6RD0f1Ld1uuDf86LsZizhSdbbEhOgTWHjbIFg54vOB8qhf9RLE8oKAk1IsvY6DqUPo147=s0-d-e1-ft#https://namedotcom-cdn.name.tools/media/email/shadows/top-shadow.png" style="background:url(https://ci4.googleusercontent.com/proxy/IJCc8zp_foH4FcY1Wn0bEVE2XOECyktHD2WsjyZs9DmtEJz6RD0f1Ld1uuDf86LsZizhSdbbEhOgTWHjbIFg54vOB8qhf9RLE8oKAk1IsvY6DqUPo147=s0-d-e1-ft#https://namedotcom-cdn.name.tools/media/email/shadows/top-shadow.png);background-repeat:repeat-x" height="7" valign="top"></td>
                               <td background="https://ci6.googleusercontent.com/proxy/OQCPPrHui7bg4Ety8rBC619BWoevdhDiaMHDjDAfH9Vdg-8a2awdakK9d4YbQUYEp7TA155QQ_JPXH1CZXhmPFIavXkx2rC2_Ew6NBcIIQexNSUYeAYhZ_ig1265=s0-d-e1-ft#https://namedotcom-cdn.name.tools/media/email/shadows/right-top-corner.png" width="8" height="7" style="background:url(https://ci6.googleusercontent.com/proxy/OQCPPrHui7bg4Ety8rBC619BWoevdhDiaMHDjDAfH9Vdg-8a2awdakK9d4YbQUYEp7TA155QQ_JPXH1CZXhmPFIavXkx2rC2_Ew6NBcIIQexNSUYeAYhZ_ig1265=s0-d-e1-ft#https://namedotcom-cdn.name.tools/media/email/shadows/right-top-corner.png);background-repeat:no-repeat"></td>
                           </tr>
                            <tr>
                                  <td background="https://ci5.googleusercontent.com/proxy/knB2kjJAdApTpoXANvHBvBN9VCEaAXRzX4cBnGjmo7jE5JUcEIXSorAewlOoiy8Xka_qQBDbLqKxC1AwHq3porUJoTD0DflJ9u8Levz0INyf47r1bYgkkg=s0-d-e1-ft#https://namedotcom-cdn.name.tools/media/email/shadows/left-shadow.png" style="background:url(https://ci5.googleusercontent.com/proxy/knB2kjJAdApTpoXANvHBvBN9VCEaAXRzX4cBnGjmo7jE5JUcEIXSorAewlOoiy8Xka_qQBDbLqKxC1AwHq3porUJoTD0DflJ9u8Levz0INyf47r1bYgkkg=s0-d-e1-ft#https://namedotcom-cdn.name.tools/media/email/shadows/left-shadow.png)" valign="top" width="8"></td>
                                 <td valign="top">
                     <table bgcolor="#ffffff" width="580" align="center" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #d9d8d8">
                       <tbody> 
                         <tr>
                           <td width="100%" height="25"></td>
                         </tr>
   
                         <tr>
                           <td width="100%">
                               <table width="550" align="center" cellspacing="0" cellpadding="0" border="0">
                                   <tbody>
                                       <tr>
                                           <td align="center">    
                                                <img src="https://i.imgur.com/hHzQqSY.png" alt="name.com logo" title="name.com" width="190" class="CToWUd" style="
     opacity: 0.6;
 ">
                                           </td>
                                       </tr> 
                                           
                                   </tbody>       
                               </table>
                           </td>
                         </tr>
                         
                         <tr>
                           <td width="100%" height="20"></td>
                         </tr>					                   
                              
                                                 <tr>
                             <td width="100%" bgcolor="B182F0">
                                 <table width="580" align="center" cellspacing="0" cellpadding="0" border="0" style="padding:0 10px 0 10px">
                                     <tbody>
                         
                                         <tr>
                                             <td width="100%" height="22"></td>
                                         </tr>			
                                         
                                         <tr>
                                             <td align="center" style="font-family:Helvetica,arial,sans-serif;font-size:22px;color:#ffffff;line-height:26px;padding:0 20px 0 20px">    
                                                 <b>Boas vindas!</b>
                                             </td>
                                         </tr> 
                                 
                                         <tr>
                                             <td width="100%" height="16"></td>
                                         </tr>		
                         
                                     </tbody>       
                                 </table>
                             </td>
                         </tr>
                                                 
                         <tr>
                           <td width="100%" height="20"></td>
                         </tr>
                         
                         <tr>
                           <td style="text-align:center">
                             <table width="550" align="center" cellspacing="0" cellpadding="10" border="0">
                               <tbody>  
                                       <tr>
                                           <td style="font-family:Helvetica,arial,sans-serif;font-size:13px;color:#4e4e4e;text-align:left;line-height:18px;padding:10px">
                                     
 <br>Uma conta no aplicativo Starhub foi criada utilizando o seu e-mail, se foi você o autor dessa solicitação, valide sua conta com este token:<br><br>
 
 <table border="0" cellspacing="0" cellpadding="0" width="530">
   <tbody><tr>
     <td>
       <center>
         <table border="0" cellpadding="0" cellspacing="0">
             <tbody>
               <tr>
               <td>
                 <div>
                       <a data-saferedirecturl="" target="_blank" style="background-color:#B182F0;border-radius:26px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:13px;letter-spacing:.1em;font-weight:bold;line-height:36px;text-align:center;text-decoration:none;padding:8px 30px 8px 30px" href="">${verifyToken}</a>
                       </div>	
               </td>
               </tr>
             </tbody>
         </table>
       </center>
     </td>
   </tr>
 </tbody></table>
 
 <br><br>
 
 <span style="font-size:18px"><b>Não foi o responsável pela criação dessa conta?<b></b></b></span>
 
 <br><br>Sem problemas, podemos remover você permanentemente dos nossos contatos para evitar ser contatado futor, clique <a href="https://castrom13.studio/email/remove/${email_to}">aqui</a>.<br><br>																    </td>
                                       </tr>		  
                               </tbody>
                             </table>                      
                           </td>
                         </tr>
                         
                         
                     
                         <tr>
                           <td width="100%" height="20"></td>
                         </tr>										 		
                         
                         <tr>
                                     <td bgcolor="#f7f7f7" height="12" style="border-top:1px solid #ececec"></td>
                                   </tr>
                       </tbody>
                            </table>
                                 </td> 
                                 <td background="https://ci5.googleusercontent.com/proxy/IaUlxYDHOcSP5q0ojUQSzy2BmbRhB8k28G_BKYtqX0XpcSNrFq-QM-x2BlO8JaDPdKjwfbDKQABMGBPAzBPcn_qLnAKqwkduqKsdE02t84Vez711waDo-t4=s0-d-e1-ft#https://namedotcom-cdn.name.tools/media/email/shadows/right-shadow.png" style="background:url(https://ci5.googleusercontent.com/proxy/IaUlxYDHOcSP5q0ojUQSzy2BmbRhB8k28G_BKYtqX0XpcSNrFq-QM-x2BlO8JaDPdKjwfbDKQABMGBPAzBPcn_qLnAKqwkduqKsdE02t84Vez711waDo-t4=s0-d-e1-ft#https://namedotcom-cdn.name.tools/media/email/shadows/right-shadow.png)" valign="top" width="8"></td>
                             </tr>
                             
                       </tbody>
                   </table>
                 </td>
              </tr>
           </tbody>
        </table>
     </div>	
     
     
   <div><div class="adM">
        </div><table width="100%" bgcolor="#ebebeb" cellpadding="0" cellspacing="0" border="0">
           <tbody>
              <tr>
                 <td width="100%">
                    <table width="580" cellpadding="0" cellspacing="0" border="0" align="center">
                       <tbody>
                          <tr>
                             <td width="100%" height="25"></td>
                          </tr>
                       </tbody>
                    </table>
                 </td>
              </tr>
           </tbody>
        </table>
     </div>
        </div>`, 
      },
      auth : {
          user         : user_name,
          refreshToken : refresh_token,
          accessToken  : access_token,
          expires      : 1494388182480
      }
  };

  transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
  });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true, type: ['image/*']}));


async function getVisual(origin) {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });
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

async function sendMessage(channelID, userID, text) {
  return sql
  .connect(connStr)
  .then(async function retorno(conn) {
    const result = await sql.query`DECLARE @responseMessage VARCHAR(80);

                                   EXEC dbo.addChannelComment @pID_Channel = ${channelID},         
                                                 @pID_User = ${userID},        
                                                 @pText = ${text},
                                                 @responseMessage = @responseMessage
                                   
                                   SELECT Response = @responseMessage;`;
    return result.recordset;
  })
  .catch((err) => console.log("(post)[/channel/:channelID/messages] Erro: " + err));
}

async function getMessages(id) {
  return sql
  .connect(connStr)
  .then(async function retorno(conn) {
    const result = await sql.query`SELECT UserID,
                                          DisplayName,
                                          LoginName,
                                          ProfileImage,
                                          [Date],
                                          [Message]
                                          FROM fn_channelMessages(${id})`;
    return result.recordset;
  })
  .catch((err) => console.log("[/channel/:channelID/messages] Erro: " + err));
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

app.get("/email", (req, res, next) => {
  const email = 'matheusbjorn@gmail.com';
  const verifyToken = '3D8888';
  main(email, verifyToken).catch(console.error)
  }
);

app.get("/channels", async (req, res, next) => {
  console.log("Request from " + (req.headers['x-forwarded-for'] || req.socket.remoteAddress || null));
  const userID = req.params.userID;
  sql
    .connect(connStr)
    .then(async function retorno(conn) {
      const result = await sql.query`SELECT * FROM Channels`;
      res.json(result.recordset);
    })
    .catch((err) => console.log("[/channels] Erro: " + err));
});

app.get("/channel/:channelID/messages", async (req, res, next) => {
  console.log("Request from " + (req.headers['x-forwarded-for'] || req.socket.remoteAddress || null));
  res.json(await getMessages(req.params.channelID));
});

app.post("/channel/:channelID/messages", async (req, res, next) => {
  console.log("Request from " + (req.headers['x-forwarded-for'] || req.socket.remoteAddress || null));
  res.json(await sendMessage(req.params.channelID, req.body.userID, req.body.text));
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
      const result = await sql.query`DECLARE @responseMessage VARCHAR(250)

                                     EXEC addComment
                                      @pID_User = ${ID_User},     
                                      @pNews_Identity =  ${News_Identity},    
                                      @pID_ResponseOf = ${ID_ResponseOf},
                                      @pText = ${Text},   
                                      @responseMessage = @responseMessage OUTPUT
                                     
                                     SELECT @responseMessage AS Resposta`;
      console.log(result)
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
      const result = await sql.query`DECLARE @responseMessage VARCHAR(60)

                                     EXEC likePost @pID_User = ${token},
                                                   @pNews_Identity =  ${News_Identity},
                                                   @responseMessage = @responseMessage OUTPUT
                                     
                                     SELECT @responseMessage AS Resposta`;
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
      const result = await sql.query`DECLARE @responseMessage VARCHAR(60)

                                     EXEC dislikePost @pID_User = ${token},
                                                      @pNews_Identity =  ${News_Identity},
                                                      @responseMessage = @responseMessage OUTPUT
                                     
                                     SELECT @responseMessage AS Resposta`;
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

app.post("/validate", (req, res, next) => {
  const userToken = req.body.userToken;
  const emailToken = req.body.emailToken;
  console.log("Request from " + (req.headers['x-forwarded-for'] || req.socket.remoteAddress || null));
  sql
    .connect(connStr)
    .then(async function retorno(conn) {
      const result = await sql.query`DECLARE @responseMessage NVARCHAR(250)

                                     EXEC dbo.validateUser @userToken = ${userToken},
                                                           @emailToken = ${emailToken},
                                                           @responseMessage = @responseMessage OUTPUT
                                     
                                     SELECT @responseMessage as 'Resposta'`;
      res.json(result.recordset[0]);
    })
    .catch((err) => console.log("[/login] Erro: " + err));
});

app.post("/invalidate", (req, res, next) => {
  const userToken = req.body.userToken;
  const email = req.body.email;
  console.log("Request from " + (req.headers['x-forwarded-for'] || req.socket.remoteAddress || null));
  sql
    .connect(connStr)
    .then(async function retorno(conn) {
      const result = await sql.query`DECLARE @responseMessage NVARCHAR(250)
                                     DECLARE @tokenValidation NVARCHAR(250)
                                     
                                     EXEC dbo.invalidateUser @userToken = ${userToken},
                                                 @tokenValidation = @tokenValidation OUTPUT,
                                                 @responseMessage = @responseMessage OUTPUT
                                     
                                     SELECT @responseMessage as 'Resposta', @tokenValidation AS EmailToken`;
      main(email, result.recordset[0].EmailToken);
      res.json(result);
    })
    .catch((err) => console.log("[/login] Erro: " + err));
});