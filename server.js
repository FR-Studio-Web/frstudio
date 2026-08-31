const express = require("express");
const path = require("path");
const { execSync } = require("child_process");

// Execute initial build to generate all HTML templates and data scripts
try {
  console.log("Building static pages...");
  execSync("node build.js", { stdio: "inherit" });
} catch (err) {
  console.error("Error during build.js execution:", err);
}

const app = express();
const PORT = 3000;
const HOST = "0.0.0.0";

// Serve static files from root directory
app.use(express.static(path.join(__dirname)));

// Fallback to index.html for non-asset routes
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.includes(".")) {
    return res.sendFile(path.join(__dirname, "index.html"));
  }
  next();
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
