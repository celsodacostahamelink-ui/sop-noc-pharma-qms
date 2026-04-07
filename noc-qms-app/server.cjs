const express = require('express');
const cors = require('cors');
const path = require('path');
// Auto-load .env file so ANTHROPIC_API_KEY persists across restarts
try { require('dotenv').config({ path: path.join(__dirname, '.env') }); } catch(e) {}
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const API_KEY = process.env.ANTHROPIC_API_KEY;
const WIX_KEY = process.env.WIX_API_KEY || 'IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcImE0MmM1ZGM5LTEzMDgtNDAwZi05MGEwLTExMGRhYjliOWQ4OVwiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcImNlZjEzMzE3LWQ0MzMtNGMwMy1iZDViLTA3OGQ5ZWFmOWRlMFwifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCI1MTRlZTRhNy0xMTdhLTQ1OWEtODE0MC02ZTk4MTAwZDA2NzRcIn19IiwiaWF0IjoxNzcyNDQ3ODQyfQ.YnE__cx5zrZ8TUS_7dJT_DZDbj-h_BnAqw5CVpai7BqJz7hcVRiQr8bmIEm4usdUupP3mtwynnqUA8MpdLe8wTnluwF3bLrxHRwu0MfO1dKf_aGam7ZtMuFKpcV-2lZRBo2wB6oEUnKPEy326RrMp8JxVi10vRGO95SUuvWEasjf_Hogdrt5mAKpj8Gob2eWqRS_n8rNFAG0R22DPqVKZGSEFWUPF6Uly_EfuotckiRX1g7Rtp0b4ZlAnH2_1-Mb8Yf2PnLT8A7uEXd7p9IMSo8F21cgxJuVy0M196SDDO2eoxRVjDSUVnP3TLzjL1NqWLBdKonp93IstGyJIL4XzA';
const WIX_SITE = '2c364620-6bf9-447c-bde1-e292e8a03ec4';
const SC_KEY = process.env.SENDCLOUD_API_KEY || '';
const SC_SECRET = process.env.SENDCLOUD_SECRET || '';

app.post('/api/anthropic', async (req, res) => {
  console.log('[Anthropic] Size:', (JSON.stringify(req.body).length / 1024 / 1024).toFixed(1) + 'MB');
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01', 'anthropic-beta': 'pdfs-2024-09-25' },
      body: JSON.stringify(req.body)
    });
    console.log('[Anthropic] Response:', r.status);
    res.status(r.status).send(await r.text());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/wix/orders', async (req, res) => {
  try {
    const r = await fetch('https://www.wixapis.com/ecom/v1/orders/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': WIX_KEY, 'wix-site-id': WIX_SITE },
      body: JSON.stringify({ query: { paging: { limit: 100 } } })
    });
    res.json(await r.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/sendcloud/parcels', async (req, res) => {
  if (!SC_KEY) return res.json({ parcels: [] });
  try {
    const r = await fetch('https://panel.sendcloud.sc/api/v2/parcels', {
      headers: { 'Authorization': 'Basic ' + Buffer.from(SC_KEY + ':' + SC_SECRET).toString('base64') }
    });
    res.json(await r.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/sendcloud/methods', async (req, res) => {
  if (!SC_KEY) return res.json({ shipping_methods: [] });
  try {
    const r = await fetch('https://panel.sendcloud.sc/api/v2/shipping_methods', {
      headers: { 'Authorization': 'Basic ' + Buffer.from(SC_KEY + ':' + SC_SECRET).toString('base64') }
    });
    res.json(await r.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/sendcloud/parcels', async (req, res) => {
  if (!SC_KEY) return res.status(400).json({ error: 'SendCloud not configured' });
  try {
    const r = await fetch('https://panel.sendcloud.sc/api/v2/parcels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Basic ' + Buffer.from(SC_KEY + ':' + SC_SECRET).toString('base64') },
      body: JSON.stringify(req.body)
    });
    res.json(await r.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(3001, () => {
  console.log(
    '✅ NOC Pharma proxy on http://localhost:3001\n' +
    '   Anthropic: ' + (API_KEY ? '✅' : '❌ Set ANTHROPIC_API_KEY') + '\n' +
    '   Wix: ✅\n' +
    '   SendCloud: ' + (SC_KEY ? '✅' : '⏳ Set SENDCLOUD_API_KEY + SENDCLOUD_SECRET')
  );
  setInterval(() => {}, 1 << 30);
});
