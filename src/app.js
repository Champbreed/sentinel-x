const express = require('express');
const app = express();
app.use(express.json());

// The 'Jekyll & Hyde' Toggle
const SECURITY_MODE = process.env.SECURITY_MODE === 'ENABLED';

app.get('/api/v1/user/:id', (req, res) => {
    const requestedId = req.params.id;
    const authHeaderId = req.headers['x-user-id']; 

    // Header Attestation
    res.setHeader('X-Sentinel-Status', SECURITY_MODE ? 'PROTECTED' : 'VULNERABLE');

    if (SECURITY_MODE) {
        // JEKYLL MODE: Strict BOLA Protection
        if (authHeaderId !== requestedId) {
            console.log(`[BLOCK] BOLA Attempt on ID: ${requestedId}`);
            return res.status(403).json({ error: "Policy Violation: BOLA Detected" });
        }
    } 
    
    // HYDE MODE: Allows the exploit if SECURITY_MODE is not 'ENABLED'
    res.json({ 
        id: requestedId, 
        data: "Sensitive Intel", 
        security: SECURITY_MODE ? "High" : "None" 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sentinel-X Active on Port ${PORT}`));



