const pool = require('./database/db');
async function checkPhotos() {
    try {
        const [rows] = await pool.query('SELECT id, photo_url FROM Complaint WHERE photo_url IS NOT NULL LIMIT 5');
        console.log("Complaints photos:");
        console.log(rows);
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
checkPhotos();
