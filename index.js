/*jshint esversion: 6 */

const express = require("express");
const app = express();
const PORT = 8000;

app.use(express.static("website"));

app.listen(PORT, () => console.log(`listening on port ${PORT}`));