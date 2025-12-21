const express = require('express');
const app = express();
app.use(express.json());

const SECURITY_MODE = process.env.SECURITY_MODE === 'ENABLED';

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Sentinel-X Playground</title>
                <style>
                    body { font-family: 'Courier New', monospace; background: #0a0a0a; color: #00ff41; text-align: center; padding: 50px; }
                    .dashboard { border: 2px solid ${SECURITY_MODE ? '#00ff41' : '#ff3131'}; padding: 30px; border-radius: 15px; display: inline-block; background: #111; box-shadow: 0 0 20px ${SECURITY_MODE ? '#00ff4133' : '#ff313133'}; }
                    .status-box { font-size: 1.2em; margin: 20px 0; padding: 10px; background: #222; border-radius: 5px; }
                    .btn { display: block; margin: 15px auto; padding: 12px 24px; background: #00ff41; color: black; text-decoration: none; font-weight: bold; border-radius: 5px; cursor: pointer; border: none; width: 80%; }
                    .btn-alt { background: #444; color: white; }
                    .research { margin-top: 30px; color: #888; border-top: 1px solid #333; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="dashboard">
                    <h1>🛡️ SENTINEL-X GATEWAY</h1>
                    <div class="status-box">
                        SYSTEM STATUS: <span style="color: ${SECURITY_MODE ? '#00ff41' : '#ff3131'}">
                            ${SECURITY_MODE ? 'ENFORCED (JEKYLL)' : 'VULNERABLE (HYDE)'}
                        </span>
                    </div>
                    
                    <p>Testing BOLA Protection:</p>
                    
                    <a class="btn" href="/api/v1/user/1">1. GUEST ACCESS (No Header)</a>

                    <button class="btn btn-alt" onclick="testBypass()">2. SIMON ESSIEN BYPASS (With Header)</button>
                    
                    <div class="research">
                        <p>RESEARCH LEAD: <strong>SIMON ESSIEN</strong></p>
                    </div>
                </div>

                <script>
                    function testBypass() {
                        fetch('/api/v1/user/1', {
                            headers: { 'x-user-id': '1' }
                        })
                        .then(response => response.json())
                        .then(data => {
                            alert("SECURITY OVERRIDE SUCCESS:\\n" + JSON.stringify(data, null, 2));
                        })
                        .catch(err => alert("Error: " + err));
                    }
                </script>
            </body>
        </html>
    `);
});

app.get('/api/v1/user/:id', (req, res) => {
    const requestedId = req.params.id;
    const authHeaderId = req.headers['x-user-id'];

    if (SECURITY_MODE) {
        if (authHeaderId !== requestedId) {
            return res.status(403).json({ 
                error: "Policy Violation: BOLA Detected",
                research_note: "Access Denied via Simon Essien Security Logic" 
            });
        }
    }

    res.json({
        id: requestedId,
        intel: "Sensitive Project Alpha-7",
        research_lead: "Simon Essien",
        status: "Access Granted"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Sentinel-X Dashboard Live'));


