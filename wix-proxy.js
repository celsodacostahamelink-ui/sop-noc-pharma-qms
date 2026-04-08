const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ═══════════════ WIX CONFIG ═══════════════
const WIX_API_KEY = "IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcImE0MmM1ZGM5LTEzMDgtNDAwZi05MGEwLTExMGRhYjliOWQ4OVwiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcImNlZjEzMzE3LWQ0MzMtNGMwMy1iZDViLTA3OGQ5ZWFmOWRlMFwifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCI1MTRlZTRhNy0xMTdhLTQ1OWEtODE0MC02ZTk4MTAwZDA2NzRcIn19IiwiaWF0IjoxNzcyNDQ3ODQyfQ.YnE__cx5zrZ8TUS_7dJT_DZDbj-h_BnAqw5CVpai7BqJz7hcVRiQr8bmIEm4usdUupP3mtwynnqUA8MpdLe8wTnluwF3bLrxHRwu0MfO1dKf_aGam7ZtMuFKpcV-2lZRBo2wB6oEUnKPEy326RrMp8JxVi10vRGO95SUuvWEasjf_Hogdrt5mAKpj8Gob2eWqRS_n8rNFAG0R22DPqVKZGSEFWUPF6Uly_EfuotckiRX1g7Rtp0b4ZlAnH2_1-Mb8Yf2PnLT8A7uEXd7p9IMSo8F21cgxJuVy0M196SDDO2eoxRVjDSUVnP3TLzjL1NqWLBdKonp93IstGyJIL4XzA";
const WIX_SITE_ID = "2c364620-6bf9-447c-bde1-e292e8a03ec4";

// ═══════════════ SENDCLOUD CONFIG ═══════════════
const SC_PUBLIC_KEY = "6a43df58-4f73-43d4-a9be-34f33c312b7c";
const SC_SECRET_KEY = "462d1046c96c41f0b49ee6888e1ff16c";
const SC_AUTH = Buffer.from(SC_PUBLIC_KEY + ":" + SC_SECRET_KEY).toString('base64');

// ═══════════════ WIX: Fetch Orders ═══════════════
app.post('/api/wix/orders', async (req, res) => {
  try {
    const response = await fetch("https://www.wixapis.com/ecom/v1/orders/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": WIX_API_KEY, "wix-site-id": WIX_SITE_ID },
      body: JSON.stringify({ search: { cursorPaging: { limit: 50 } } })
    });
    if (!response.ok) { const errText = await response.text(); return res.status(response.status).json({ error: errText }); }
    res.json(await response.json());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══════════════ SENDCLOUD: Get All Parcels ═══════════════
app.get('/api/sendcloud/parcels', async (req, res) => {
  try {
    const response = await fetch("https://panel.sendcloud.sc/api/v2/parcels?limit=100", {
      headers: { "Authorization": "Basic " + SC_AUTH }
    });
    if (!response.ok) { const errText = await response.text(); return res.status(response.status).json({ error: errText }); }
    res.json(await response.json());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══════════════ SENDCLOUD: Create Parcel ═══════════════
app.post('/api/sendcloud/parcels', async (req, res) => {
  try {
    const response = await fetch("https://panel.sendcloud.sc/api/v2/parcels", {
      method: "POST",
      headers: { "Authorization": "Basic " + SC_AUTH, "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    if (!response.ok) { const errText = await response.text(); return res.status(response.status).json({ error: errText }); }
    res.json(await response.json());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══════════════ SENDCLOUD: Shipping Methods ═══════════════
app.get('/api/sendcloud/methods', async (req, res) => {
  try {
    const response = await fetch("https://panel.sendcloud.sc/api/v2/shipping_methods", {
      headers: { "Authorization": "Basic " + SC_AUTH }
    });
    if (!response.ok) { const errText = await response.text(); return res.status(response.status).json({ error: errText }); }
    res.json(await response.json());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ═══════════════ Health ═══════════════
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', wix: true, sendcloud: true });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n  🟢 NOC Pharma API Proxy on http://localhost:${PORT}`);
  console.log(`  📦 Wix Orders:  POST /api/wix/orders`);
  console.log(`  📬 SC Parcels:   GET /api/sendcloud/parcels`);
  console.log(`  📬 SC Create:   POST /api/sendcloud/parcels`);
  console.log(`  ✅ SendCloud connected\n`);
});
