const express = require('express');
const app = express();
app.use(express.json());

const SECURITY_MODE = process.env.SECURITY_MODE === 'ENABLED';

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Sentinel-X Private Gateway</title>
                <style>
                    body { font-family: 'Courier New', monospace; background: #0a0a0a; color: #00ff41; text-align: center; padding: 50px; }
                    .dashboard { border: 2px solid \${SECURITY_MODE ? '#00ff41' : '#ff3131'}; padding: 30px; border-radius: 15px; display: inline-block; background: #111; box-shadow: 0 0 20px \${SECURITY_MODE ? '#00ff4133' : '#ff313133'}; }
                    .btn { display: block; margin: 15px auto; padding: 12px 24px; background: #00ff41; color: black; font-weight: bold; border-radius: 5px; cursor: pointer; border: none; width: 280px; font-size: 14px; transition: 0.3s; }
                    .btn:hover { background: #00cc33; }
                    .btn-private { background: #444; color: white; border: 1px solid #00ff41; }
                    .research { margin-top: 30px; color: #888; border-top: 1px solid #333; padding-top: 20px; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="dashboard">
                    <h1>🛡️ SENTINEL-X GATEWAY</h1>
                    <p>SYSTEM STATUS: <span style="color: \${SECURITY_MODE ? '#00ff41' : '#ff3131'}">
                        \${SECURITY_MODE ? 'ENFORCED (JEKYLL)' : 'VULNERABLE (HYDE)'}
                    </span></p>
                    
                    <button class="btn" onclick="window.location.href='/api/v1/user/1'">1. PUBLIC GUEST VIEW</button>
                    <button class="btn btn-private" onclick="privateAccess()">2. SIMON ESSIEN PRIVATE BYPASS</button>
                    
                    <div class="research">
                        <p>RESEARCH LEAD: <strong>SIMON ESSIEN</strong></p>
                    </div>
                </div>

                <script>
                    function privateAccess() {
                        let code = prompt("Enter Simon's Private Research Key:");
                        
                        // Log attempt to server
                        fetch('/api/v1/monitor/log', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ attempted_key: code })
                        });

                        if (code === "Kelani123") {
                            fetch('/api/v1/user/1', {
                                headers: { 
                                    'x-user-id': '1',
                                    'x-research-key': 'SIMON_PRIVATE_KEY' 
                                }
                            })
                            .then(r => r.json())
                            .then(data => alert("ACCESS GRANTED:\\n" + JSON.stringify(data, null, 2)))
                            .catch(err => alert("Error: " + err));
                        } else {
                            alert("ACCESS DENIED: Unauthorized Key.");
                        }
                    }
                </script>
            </body>
        </html>
    `);
});

// --- Security Monitoring with Timestamps ---
app.post('/api/v1/monitor/log', (req, res) => {
    const { attempted_key } = req.body;
    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-GB') + " " + now.toLocaleDateString('en-GB');

    if (attempted_key !== "Kelani123") {
        console.warn("⚠️ [" + timestamp + "] SECURITY ALERT: Unauthorized Bypass Attempt! Key: " + attempted_key);
    } else {
        console.log("✅ [" + timestamp + "] SUCCESS: Simon Essien authenticated correctly.");
    }
    res.sendStatus(204);
});

app.get('/api/v1/user/:id', (req, res) => {
    const requestedId = req.params.id;
    const authHeaderId = req.headers['x-user-id'];
    const researchKey = req.headers['x-research-key'];
    const MY_SECRET = "SIMON_PRIVATE_KEY";

    if (SECURITY_MODE) {
        if (researchKey !== MY_SECRET) {
            return res.status(401).json({ error: "Unauthorized: Invalid Research Key" });
        }
        if (authHeaderId !== requestedId) {
            return res.status(403).json({ error: "Policy Violation: BOLA Detected" });
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
app.listen(PORT, () => console.log('Sentinel-X Dashboard Live with Forensics'));


