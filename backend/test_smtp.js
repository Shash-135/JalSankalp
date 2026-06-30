require('dotenv').config();
const nodemailer = require('nodemailer');

async function testSMTP() {
    console.log("Testing SMTP connection...");
    
    // Test 1: With spaces (as in .env)
    const transporterWithSpaces = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        await transporterWithSpaces.verify();
        console.log("✅ Connection SUCCESSFUL with spaces in password!");
    } catch (err) {
        console.log("❌ Connection FAILED with spaces in password:");
        console.log("   " + err.message);
    }

    console.log("\nTesting SMTP connection with spaces removed...");
    
    // Test 2: Without spaces
    const passWithoutSpaces = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
    const transporterWithoutSpaces = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        auth: {
            user: process.env.SMTP_USER,
            pass: passWithoutSpaces
        }
    });

    try {
        await transporterWithoutSpaces.verify();
        console.log("✅ Connection SUCCESSFUL without spaces in password!");
    } catch (err) {
        console.log("❌ Connection FAILED without spaces in password:");
        console.log("   " + err.message);
    }
}

testSMTP();
