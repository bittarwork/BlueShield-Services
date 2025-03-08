const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// إعداد الميدلوير الأساسي
app.use(express.json()); // دعم JSON
app.use(express.urlencoded({ extended: true })); // دعم بيانات النماذج
app.use(cors()); // تمكين CORS
app.use(morgan("dev")); // تسجيل الطلبات في وحدة التحكم

// نقطة اختبار
app.get("/", (req, res) => {
    res.send("BlueShield API is running...");
});

module.exports = app;
