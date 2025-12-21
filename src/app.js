const express = require('express');
const app = express();
app.use(express.json());

const SECURITY_MODE = process.env.SECURITY_MODE === 'ENABLED';
const failedAttempts = {}; 

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>SENTINEL-X | SECURE GATEWAY</title>
                <style>
                    :root { --neon: #00ff41; --bg: #050505; --card: #0f0f0f; --danger: #ff3131; }
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        background: var(--bg); 
                        background-image: radial-gradient(circle at 2px 2px, rgba(0, 255, 65, 0.15) 1px, transparent 0);
                        background-size: 40px 40px;
                        color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;
                    }
                    .dashboard { 
                        background: var(--card); 
                        padding: 50px; border-radius: 20px; 
                        border: 1px solid rgba(0, 255, 65, 0.3);
                        box-shadow: 0 0 50px rgba(0, 0, 0, 1), inset 0 0 20px rgba(0, 255, 65, 0.05);
                        width: 400px; text-align: center;
                    }
                    h1 { font-size: 22px; letter-spacing: 5px; margin-bottom: 30px; color: var(--neon); text-shadow: 0 0 10px var(--neon); }
                    .status-box { background: rgba(0,0,0,0.5); padding: 10px; border-radius: 5px; font-size: 12px; margin-bottom: 30px; border: 1px solid #333; }
                    .btn { 
                        display: block; width: 100%; padding: 15px; margin: 10px 0;
                        background: transparent; color: var(--neon); font-weight: bold;
                        border: 1px solid var(--neon); border-radius: 8px; cursor: pointer;
                        transition: all 0.3s; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;
                    }
                    .btn:hover { background: var(--neon); color: black; box-shadow: 0 0 20px var(--neon); }
                    .btn-main { background: var(--neon); color: black; }
                    .footer { margin-top: 40px; font-size: 10px; color: #444; letter-spacing: 2px; }
                </style>
            </head>
            <body>
                <div class="dashboard">
                    <h1>SENTINEL-X</h1>
                    <div class="status-box">SYSTEM: \${SECURITY_MODE ? 'ENFORCED' : 'VULNERABLE'} // LAYER: 03</div>
                    
                    <button class="btn btn-main" onclick="window.location.href='/api/v1/user/1'">Access Public Node</button>
                    <button class="btn" onclick="privateAccess()">Bypass Protocol</button>
                    
                    <div class="footer">OPERATOR: SIMON ESSIEN // KELANI-OS v4.2</div>
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
                            alert("🛑 LOCKOUT IN EFFECT: Your IP has been blacklisted for 10 minutes.");
                            return;
                        }

                        if (code === "Kelani123") {
                            const dataResponse = await fetch('/api/v1/user/1', {
                                headers: { 'x-user-id': '1', 'x-research-key': 'SIMON_PRIVATE_KEY' }
                            });
                            const data = await dataResponse.json();
                            alert("DECRYPTED DATA:\\n" + JSON.stringify(data, null, 2));
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
    // Correct IP detection for Render
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ip = rawIp.split(',')[0].trim(); 
    const { attempted_key } = req.body;
    const now = Date.now();

    if (!failedAttempts[ip]) failedAttempts[ip] = { count: 0, lockoutUntil: 0 };
    
    if (now < failedAttempts[ip].lockoutUntil) {
        return res.json({ blocked: true });
    }

    if (attempted_key !== "Kelani123") {
        failedAttempts[ip].count++;
        console.warn("⚠️ SECURITY: IP [" + ip + "] failed. Count: " + failedAttempts[ip].count);
        
        if (failedAttempts[ip].count >= 3) {
            failedAttempts[ip].lockoutUntil = now + (10 * 60 * 1000);
            console.error("🚫 BLACKLISTED: IP [" + ip + "] is now blocked.");
        }
        res.json({ blocked: false, attempts: failedAttempts[ip].count });
    } else {
        failedAttempts[ip].count = 0;
        res.json({ blocked: false, attempts: 0 });
    }
});

app.get('/api/v1/user/:id', (req, res) => {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ip = rawIp.split(',')[0].trim();

    if (failedAttempts[ip] && Date.now() < failedAttempts[ip].lockoutUntil) {
        return res.status(403).json({ error: "Access Denied: Your IP is blacklisted." });
    }

    if (SECURITY_MODE) {
        if (req.headers['x-research-key'] !== "SIMON_PRIVATE_KEY") return res.status(401).json({ error: "Unauthorized" });
        if (req.headers['x-user-id'] !== req.params.id) return res.status(403).json({ error: "BOLA Violation" });
    }

    res.json({ id: req.params.id, intel: "Alpha-7 Research", lead: "Simon Essien" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('SENTINEL-X: SHADOW MODE ACTIVE'));


