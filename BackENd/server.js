const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
require("dotenv").config();

// تحديد المنفذ من المتغيرات البيئية أو استخدام 5000 افتراضيًا
const PORT = process.env.PORT || 5000;

// الاتصال بقاعدة البيانات ثم تشغيل السيرفر
connectDB().then(() => {
    const server = http.createServer(app);
    server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1);
});
