const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, delay, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const pino = require('pino');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
  <html><body style="background:black;color:#0f0;text-align:center;padding-top:50px;font-family:sans-serif">
  <h1 style="color:#0f0">SPK PAIR 🔥 REAL</h1>
  <p>Enter number with country code (234...)</p>
  <input id="num" placeholder="23470288758" style="padding:12px;width:250px;text-align:center"><br><br>
  <button onclick="getCode()" style="background:#0f0;padding:12px 25px;border:none;font-weight:bold;cursor:pointer">GET CODE</button>
  <h2 id="result" style="color:white;margin-top:30px;letter-spacing:3px"></h2>
  <script>
  async function getCode(){
    let n=document.getElementById('num').value;
    if(!n) return alert('Enter number');
    document.getElementById('result').innerText='Generating... Wait 20 seconds...';
    let res=await fetch('/code?number='+n);
    let data=await res.json();
    if(data.code) document.getElementById('result').innerText=data.code;
    else document.getElementById('result').innerText=data.error||'Error, retry';
  }
  </script>
  <p style="color:#555;margin-top:40px">Powered by SPK</p>
  </body></html>
  `);
});

app.get('/code', async (req, res) => {
  let num = req.query.number?.replace(/[^0-9]/g,'');
  if(!num) return res.json({error:'Enter number with country code'});
  try {
    const { state, saveCreds } = await useMultiFileAuthState('./temp/'+num);
    const sock = makeWASocket({
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'})) },
      printQRInTerminal: false,
      logger: pino({level:'silent'}),
      browser: ['SPK Pair', 'Chrome', '1.0']
    });
    if(!sock.authState.creds.registered){
      await delay(2000);
      let code = await sock.requestPairingCode(num);
      res.json({code: code});
    }
    sock.ev.on('creds.update', saveCreds);
    setTimeout(() => { try{ require('fs').rmSync('./temp/'+num, {recursive:true, force:true}) }catch{} }, 60000);
  } catch(e) {
    console.log(e);
    res.json({error:'Failed, try again. '+e.message});
  }
});

app.listen(PORT, () => console.log('SPK Pair running on '+PORT));
