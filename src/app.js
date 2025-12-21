const express = require('express');
const app = express();
app.use(express.json());

const SECURITY_MODE = process.env.SECURITY_MODE === 'ENABLED';
const failedAttempts = {}; 

app.get('/', (req, res) => {
    // Fixed: Standard strings used to ensure UI visibility on all devices
    const statusText = SECURITY_MODE ? 'ENFORCED' : 'VULNERABLE';
    
    res.send(`
        <html>
            <head>
                <title>SENTINEL-X | SECURE GATEWAY</title>
                <style>
                    :root { --neon: #00ff41; --bg: #050505; --card: #0f0f0f; }
                    body { 
                        font-family: 'Courier New', monospace; 
                        background: var(--bg); 
                        background-image: radial-gradient(circle at 2px 2px, rgba(0, 255, 65, 0.1) 1px, transparent 0);
                        background-size: 30px 30px;
                        color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;
                    }
                    .dashboard { 
                        background: var(--card); 
                        padding: 40px; border-radius: 10px; 
                        border: 2px solid var(--neon);
                        box-shadow: 0 0 30px rgba(0, 255, 65, 0.2);
                        width: 350px; text-align: center;
                    }
                    h1 { font-size: 20px; letter-spacing: 4px; margin-bottom: 20px; color: var(--neon); }
                    .status-box { background: #000; padding: 10px; border: 1px solid #333; font-size: 11px; margin-bottom: 25px; color: #aaa; }
                    .btn { 
                        display: block; width: 100%; padding: 14px; margin: 12px 0;
                        background: var(--neon); color: black; font-weight: bold;
                        border: none; border-radius: 4px; cursor: pointer;
                        font-size: 12px; text-transform: uppercase;
                    }
                    .btn-alt { background: #222; color: var(--neon); border: 1px solid var(--neon); }
                    .footer { margin-top: 30px; font-size: 9px; color: #555; letter-spacing: 1px; }
                </style>
            </head>
            <body>
                <div class="dashboard">
                    <h1>SENTINEL-X</h1>
                    <div class="status-box">GATEWAY STATUS: ${statusText} // LAYER: 03</div>
                    
                    <button class="btn" onclick="window.location.href='/api/v1/user/1'">ACCESS PUBLIC NODE</button>
                    <button class="btn btn-alt" onclick="privateAccess()">BYPASS PROTOCOL</button>
                    
                    <div class="footer">OPERATOR: SIMON ESSIEN // KELANI-OS v5.0</div>
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
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ip = rawIp.split(',')[0].trim(); 
    const { attempted_key } = req.body;
    const now = Date.now();

    if (!failedAttempts[ip]) failedAttempts[ip] = { count: 0, lockoutUntil: 0 };
    if (now < failedAttempts[ip].lockoutUntil) return res.json({ blocked: true });

    if (attempted_key !== "Kelani123") {
        failedAttempts[ip].count++;
        console.warn("⚠️ SECURITY: IP [" + ip + "] fail " + failedAttempts[ip].count + "/3.");
        if (failedAttempts[ip].count >= 3) {
            failedAttempts[ip].lockoutUntil = now + (10 * 60 * 1000);
            console.error("🚫 BLACKLISTED: IP [" + ip + "]");
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
        return res.status(403).json({ error: "IP Blacklisted" });
    }

    if (SECURITY_MODE) {
        if (req.headers['x-research-key'] !== "SIMON_PRIVATE_KEY") return res.status(401).json({ error: "Unauthorized" });
        if (req.headers['x-user-id'] !== req.params.id) return res.status(403).json({ error: "BOLA Violation" });
    }

    res.json({ id: req.params.id, intel: "Alpha-7 Research", lead: "Simon Essien" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('SENTINEL-X: ELITE ONLINE'));


