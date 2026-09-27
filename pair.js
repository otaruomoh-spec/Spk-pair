const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req,res)=>{
  res.send(`
  <html><head><meta name="viewport" content="width=device-width,initial-scale=1">
  <style>body{background:#000;color:#0f0;font-family:monospace;text-align:center;padding:30px}input{padding:12px;width:80%;max-width:300px;margin:10px}button{padding:12px 25px;background:#0f0;color:#000;border:none;font-weight:bold;border-radius:5px}h1{color:#0f0}</style>
  </head><body>
  <h1>SPK PAIR 🔥</h1>
  <p>Enter number with country code (234...)</p>
  <input id="num" placeholder="2348012345678">
  <br><button onclick="document.getElementById('code').innerText='✅ Backend Ready! Deploy to Render to get real code for '+document.getElementById('num').value">GET CODE</button>
  <h2 id="code" style="color:white;margin-top:20px"></h2>
  <p style="color:#555;margin-top:40px">Powered by SPK - otaruomoh@gmail.com</p>
  </body></html>`);
});

app.listen(PORT, ()=>console.log('SPK running '+PORT));
