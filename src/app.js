const express = require('express');
const app = express();
app.use(express.json());

const SECURITY_MODE = process.env.SECURITY_MODE === 'ENABLED';
const failedAttempts = {}; 

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Sentinel-X Private Gateway</title>
                <style>
                    body { 
                        font-family: 'Courier New', monospace; 
                        background: #0a0a0a; 
                        background-image: linear-gradient(rgba(0, 255, 65, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.05) 1px, transparent 1px);
                        background-size: 30px 30px;
                        color: #00ff41; 
                        text-align: center; 
                        padding: 50px; 
                        margin: 0;
                    }
                    .dashboard { 
                        border: 2px solid \${SECURITY_MODE ? '#00ff41' : '#ff3131'}; 
                        padding: 40px; 
                        border-radius: 15px; 
                        display: inline-block; 
                        background: rgba(17, 17, 17, 0.9); 
                        box-shadow: 0 0 30px \${SECURITY_MODE ? '#00ff4155' : '#ff313155'};
                        backdrop-filter: blur(5px);
                    }
                    .btn { display: block; margin: 15px auto; padding: 12px 24px; background: #00ff41; color: black; font-weight: bold; border-radius: 5px; cursor: pointer; border: none; width: 280px; font-size: 14px; transition: 0.3s; }
                    .btn:hover { background: #fff; box-shadow: 0 0 15px #00ff41; }
                    .btn-private { background: #222; color: #00ff41; border: 1px solid #00ff41; }
                    .research { margin-top: 30px; color: #888; border-top: 1px solid #333; padding-top: 20px; font-size: 11px; letter-spacing: 2px; }
                </style>
            </head>
            <body>
                <div class="dashboard">
                    <h1 style="text-shadow: 0 0 10px #00ff41;">🛡️ SENTINEL-X GATEWAY</h1>
                    <p style="letter-spacing: 3px;">STATUS: \${SECURITY_MODE ? 'ENFORCED' : 'VULNERABLE'}</p>
                    
                    <button class="btn" onclick="window.location.href='/api/v1/user/1'">1. PUBLIC GUEST VIEW</button>
                    <button class="btn btn-private" onclick="privateAccess()">2. SIMON ESSIEN PRIVATE BYPASS</button>
                    
                    <div class="research">SECURED BY KELANI-LOGIC // RESEARCH LEAD: SIMON ESSIEN</div>
                </div>

                <script>
                    async function privateAccess() {
                        let code = prompt("Enter Simon's Private Research Key:");
                        
                        // Check status and log attempt
                        const logResponse = await fetch('/api/v1/monitor/log', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ attempted_key: code })
                        });
                        const status = await logResponse.json();

                        if (status.blocked) {
                            alert("🚨 CRITICAL LOCKOUT: Too many failures. System frozen for 10 minutes.");
                            return;
                        }

                        if (code === "Kelani123") {
                            const dataResponse = await fetch('/api/v1/user/1', {
                                headers: { 
                                    'x-user-id': '1', 
                                    'x-research-key': 'SIMON_PRIVATE_KEY' 
                                }
                            });
                            
                            if (dataResponse.status === 429) {
                                alert("🚨 ACCESS DENIED: Your IP is currently blacklisted.");
                            } else {
                                const data = await dataResponse.json();
                                alert("ACCESS GRANTED:\\n" + JSON.stringify(data, null, 2));
                            }
                        } else {
                            alert("ACCESS DENIED: Attempt " + status.attempts + "/3");
                        }
                    }
                </script>
            </body>
        </html>
    `);
});

app.post('/api/v1/monitor/log', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { attempted_key } = req.body;
    const now = Date.now();

    if (!failedAttempts[ip]) failedAttempts[ip] = { count: 0, lockoutUntil: 0 };
    if (now < failedAttempts[ip].lockoutUntil) return res.json({ blocked: true });

    if (attempted_key !== "Kelani123") {
        failedAttempts[ip].count++;
        console.warn("⚠️ SECURITY ALERT: IP [" + ip + "] fail " + failedAttempts[ip].count + "/3. Key: " + attempted_key);
        if (failedAttempts[ip].count >= 3) {
            failedAttempts[ip].lockoutUntil = now + (10 * 60 * 1000); 
            console.error("🚫 BAN TRIGGERED: IP [" + ip + "] blacklisted.");
        }
        res.json({ blocked: false, attempts: failedAttempts[ip].count });
    } else {
        failedAttempts[ip].count = 0; 
        res.json({ blocked: false, attempts: 0 });
    }
});

app.get('/api/v1/user/:id', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (failedAttempts[ip] && Date.now() < failedAttempts[ip].lockoutUntil) {
        return res.status(429).json({ error: "IP Blacklisted" });
    }

    const requestedId = req.params.id;
    const authHeaderId = req.headers['x-user-id'];
    const researchKey = req.headers['x-research-key'];
    if (SECURITY_MODE) {
        if (researchKey !== "SIMON_PRIVATE_KEY") return res.status(401).json({ error: "Unauthorized" });
        if (authHeaderId !== requestedId) return res.status(403).json({ error: "BOLA Detected" });
    }
    res.json({ id: requestedId, intel: "Sensitive Project Alpha-7", status: "Access Granted" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Sentinel-X Dashboard: ACTIVE SHIELD ONLINE'));


