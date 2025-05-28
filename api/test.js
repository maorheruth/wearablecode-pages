export default function handler(req, res) {
  // Allow all methods for testing
  res.status(200).json({
    message: "Test endpoint works!",
    method: req.method,
    timestamp: new Date().toISOString(),
    status: "success"
  });
}
