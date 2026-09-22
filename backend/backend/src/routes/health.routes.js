const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/api/health', async (req, res) => {
    const estadoBD = mongoose.connection.readyState;
    const estados = { 0: 'Disconnected', 1: 'Connected', 2: 'Connecting', 3: 'Disconnecting' };
    let dbStatus = estados[estadoBD] || 'Unknown';

    try {
        // Ping real a MongoDB
        if (estadoBD === 1) {
            await mongoose.connection.db.admin().ping();
            dbStatus = 'Connected';
        }

        res.status(200).json({
            status: 'OK',
            uptime: `${process.uptime().toFixed(2)} segundos`,
            database: dbStatus,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            uptime: `${process.uptime().toFixed(2)} segundos`,
            database: 'Disconnected',
            error: 'Fallo al hacer ping a MongoDB'
        });
    }
});

module.exports = router;