const loggerMiddleware = (req, res, next) => {
    const method = req.method; // HTTP method
    const url = req.originalUrl; // URL of the request
    let body = JSON.stringify(req.body, null, 2); // Request body

    // If body is too large, truncate it to 100 characters
    if (body.length > 100) {
        body = body.substring(0, 100) + '...'; // Truncate and append ellipsis
    }

    // Log only the important details
    console.log(`\n🟢 NEW REQUEST 🟢`);
    console.log(`📝 Method: ${method}`);
    console.log(`🔗 URL: ${url}`);
    if (method === 'POST' || method === 'PUT') {
        console.log(`📦 Body: ${body}`);
    } else {
        console.log(`🗂 Body: No body`);
    }
    console.log(`-----------------------------------------`);

    // Proceed to the next middleware
    next();
};

module.exports = loggerMiddleware;
