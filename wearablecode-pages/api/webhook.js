export default function handler(req, res) {
  res.status(200).json({ 
    message: "IT WORKS!", 
    method: req.method,
    time: new Date().toISOString()
  });
}
