const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initDB() {
    console.log("Connecting to TiDB...");
    try {
        const connection = await mysql.createConnection({
            host: 'gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com',
            port: 4000,
            user: 't3zXvQS9xP4KL3T.root',
            password: 'XyEmwERSY5LbT8im',
            ssl: {
                minVersion: 'TLSv1.2',
                rejectUnauthorized: true
            }
        });

        console.log("Connected successfully!");

        console.log("Creating jalsankalp_db...");
        await connection.query("CREATE DATABASE IF NOT EXISTS jalsankalp_db;");
        await connection.query("USE jalsankalp_db;");

        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        let schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Remove the CREATE USER and GRANT parts as they might fail on TiDB Serverless
        schemaSql = schemaSql.replace(/CREATE USER IF NOT EXISTS .*?;/gi, '');
        schemaSql = schemaSql.replace(/GRANT ALL PRIVILEGES ON .*?;/gi, '');
        schemaSql = schemaSql.replace(/FLUSH PRIVILEGES;/gi, '');

        const statements = schemaSql.split(';').filter(stmt => stmt.trim() !== '');

        console.log("Executing schema tables...");
        for (let statement of statements) {
            if (statement.trim()) {
                await connection.query(statement);
            }
        }

        console.log("✅ Database initialized successfully on TiDB!");
        await connection.end();
    } catch (error) {
        console.error("❌ Error initializing database:", error);
    }
}

initDB();
