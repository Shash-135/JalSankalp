const bcrypt = require('bcryptjs');
const pool = require('./database/db');

async function seed() {
    try {
        console.log("Connecting to TiDB and seeding data...");
        
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash('password123', salt);

        // 1. Seed Admin
        const adminEmail = 'admin@jalsankalp.com';
        const [adminExists] = await pool.query('SELECT id FROM Admin WHERE email = ?', [adminEmail]);
        if (adminExists.length === 0) {
            await pool.query(
                'INSERT INTO Admin (name, email, password_hash) VALUES (?, ?, ?)',
                ['Super Admin', adminEmail, password_hash]
            );
            console.log(`✅ Admin created: ${adminEmail} / password123`);
        } else {
            console.log(`⚠️ Admin already exists: ${adminEmail}`);
        }

        // 2. Seed Area
        const areaName = 'Main Village Area';
        let areaId;
        const [areaExists] = await pool.query('SELECT id FROM Area WHERE name = ?', [areaName]);
        if (areaExists.length === 0) {
            const [result] = await pool.query(
                'INSERT INTO Area (name, pincode, capacity_kl) VALUES (?, ?, ?)',
                [areaName, '400001', 50.00]
            );
            areaId = result.insertId;
            console.log(`✅ Area created: ${areaName}`);
        } else {
            areaId = areaExists[0].id;
            console.log(`⚠️ Area already exists: ${areaName}`);
        }

        // 3. Seed Operator
        const operatorMobile = '9876543210';
        const [operatorExists] = await pool.query('SELECT id FROM Operator WHERE mobile = ?', [operatorMobile]);
        if (operatorExists.length === 0) {
            await pool.query(
                'INSERT INTO Operator (name, mobile, password_hash, assigned_area_id) VALUES (?, ?, ?, ?)',
                ['Ramesh (Operator)', operatorMobile, password_hash, areaId]
            );
            console.log(`✅ Operator created: ${operatorMobile} / password123`);
        } else {
            console.log(`⚠️ Operator already exists: ${operatorMobile}`);
        }

        console.log("🎉 Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
}

seed();
