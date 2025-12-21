const express = require('express');
const app = express();
app.use(express.json());

const SECURITY_MODE = process.env.SECURITY_MODE === 'ENABLED';
// Secret pulled from Render Environment Variables for safety
const SYSTEM_BYPASS_KEY = process.env.BYPASS_KEY || "ADMIN_SECRET_REPLACE_ME";

const failedAttempts = {}; 

app.get('/', (req, res) => {
    const statusLabel = SECURITY_MODE ? "ACTIVE: ENFORCED" : "ACTIVE: VULNERABLE";
    const statusColor = SECURITY_MODE ? "#00ff41" : "#ff3131";

    res.send(`
        <html>
            <head>
                <title>SENTINEL-X VANGUARD</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { 
                        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
                        background-color: #000; color: #fff; 
                        display: flex; align-items: center; justify-content: center; 
                        height: 100vh; margin: 0;
                    }
                    .dashboard { 
                        background: #111; padding: 40px 30px; border-radius: 12px; 
                        border: 2px solid #00ff41;
                        box-shadow: 0 0 40px rgba(0, 255, 65, 0.2);
                        width: 90%; max-width: 400px; text-align: center;
                    }
                    h1 { color: #00ff41; font-size: 24px; letter-spacing: 3px; margin: 0 0 10px 0; }
                    .status-line { 
                        font-weight: bold; font-size: 14px; margin-bottom: 30px; 
                        color: ${statusColor}; border: 1px solid ${statusColor};
                        padding: 8px; border-radius: 4px; display: inline-block;
                    }
                    .btn { 
                        display: block; width: 100%; padding: 16px; margin: 15px 0;
                        background: #00ff41; color: #000; font-weight: 900;
                        border: none; border-radius: 8px; cursor: pointer;
                        font-size: 14px; text-transform: uppercase; transition: 0.2s;
                    }
                    .btn-bypass { background: #222; color: #00ff41; border: 1px solid #00ff41; }
                    .footer { margin-top: 30px; font-size: 11px; color: #666; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="dashboard">
                    <h1>SENTINEL-X</h1>
                    <div class="status-line">${statusLabel}</div>
                    
                    <button class="btn" onclick="window.location.href='/api/v1/user/1'">ACCESS PUBLIC NODE</button>
                    <button class="btn btn-bypass" onclick="privateAccess()">BYPASS PROTOCOL</button>
                    
                    <div class="footer">RESEARCH LEAD: SIMON ESSIEN</div>
                </div>

                <script>
                    async function privateAccess() {
                        let code = prompt("Enter Research Key:");
                        if (!code) return;

                        const response = await fetch('/api/v1/monitor/log', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ attempted_key: code })
                        });
                        const result = await response.json();

                        if (result.blocked) {
                            alert("🛑 CRITICAL LOCKOUT: Access restricted for 1 HOUR.");
                            return;
                        }

                        if (result.success) {
                            const dataResponse = await fetch('/api/v1/user/1', {
                                headers: { 'x-user-id': '1', 'x-research-key': 'GHOST_LAYER_03' }
                            });
                            const data = await dataResponse.json();
                            alert("DECRYPTED INTEL:\\n" + JSON.stringify(data, null, 2));
                        } else {
                            alert("ACCESS DENIED: " + (3 - result.attempts) + " attempts remaining.");
                        }
                    }
                </script>
            </body>
        </html>
    `);
});

app.post('/api/v1/monitor/log', (req, res) => {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ip = rawIp.split(',')[0].trim(); 
    const { attempted_key } = req.body;
    const now = Date.now();

    if (!failedAttempts[ip]) failedAttempts[ip] = { count: 0, lockoutUntil: 0 };
    if (now < failedAttempts[ip].lockoutUntil) return res.json({ blocked: true });

    if (attempted_key === SYSTEM_BYPASS_KEY) {
        failedAttempts[ip].count = 0;
        res.json({ success: true, attempts: 0 });
    } else {
        failedAttempts[ip].count++;
        console.warn("⚠️ SECURITY: IP [" + ip + "] fail " + failedAttempts[ip].count + "/3.");
        
        if (failedAttempts[ip].count >= 3) {
            failedAttempts[ip].lockoutUntil = now + (60 * 60 * 1000); // 1 Hour Ban
            console.error("🚫 BLACKLISTED (1 HR): IP [" + ip + "]");
        }
        res.json({ success: false, blocked: (failedAttempts[ip].count >= 3), attempts: failedAttempts[ip].count });
    }
});

app.get('/api/v1/user/:id', (req, res) => {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ip = rawIp.split(',')[0].trim();

    if (failedAttempts[ip] && Date.now() < failedAttempts[ip].lockoutUntil) {
        return res.status(403).json({ error: "Access Denied: IP Blacklisted for 1hr." });
    }

    if (SECURITY_MODE) {
        if (req.headers['x-research-key'] !== "GHOST_LAYER_03") return res.status(401).json({ error: "Unauthorized" });
        if (req.headers['x-user-id'] !== req.params.id) return res.status(403).json({ error: "BOLA Violation" });
    }

    res.json({ id: req.params.id, intel: "Alpha-7 Research", lead: "Simon Essien" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('SENTINEL-X: VANGUARD ONLINE'));


