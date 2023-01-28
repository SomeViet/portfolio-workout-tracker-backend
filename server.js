//Back-end

require("dov.env").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const router = express.router();

app.use(express.json());
app.use(cors());
