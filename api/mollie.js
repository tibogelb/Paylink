export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const response = await fetch("https://api.mollie.com/v2/payments?limit=25", {
      headers: {
        Authorization: "Bearer live_jEKd3TMSAHBspMHBdSkrPhk67Tf4RR",
      },
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
