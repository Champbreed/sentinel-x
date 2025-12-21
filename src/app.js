const express = require('express');
const app = express();
app.use(express.json());

// The 'Jekyll & Hyde' Toggle
const SECURITY_MODE = process.env.SECURITY_MODE === 'ENABLED';

// --- Visual Playground (Frontend) ---
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Sentinel-X Playground</title>
                <style>
                    body { font-family: 'Courier New', monospace; background: #0a0a0a; color: #00ff41; text-align: center; padding: 50px; }
                    .dashboard { border: 2px solid ${SECURITY_MODE ? '#00ff41' : '#ff3131'}; padding: 30px; border-radius: 15px; display: inline-block; background: #111; box-shadow: 0 0 20px ${SECURITY_MODE ? '#00ff4133' : '#ff313133'}; }
                    .status-box { font-size: 1.2em; margin: 20px 0; padding: 10px; background: #222; border-radius: 5px; }
                    .btn { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #00ff41; color: black; text-decoration: none; font-weight: bold; border-radius: 5px; }
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
                    <p>This lab environment demonstrates <strong>BOLA (Broken Object Level Authorization)</strong>.</p>
                    <a class="btn" href="/api/v1/user/1">ENTER USER PORTAL</a>
                    
                    <div class="research">
                        <p>RESEARCH LEAD: <strong>SIMON ESSIEN</strong></p>
                    </div>
                </div>
            </body>
        </html>
    `);
});

// --- API Layer ---
app.get('/api/v1/user/:id', (req, res) => {
    const requestedId = req.params.id;
    const authHeaderId = req.headers['x-user-id'];

    res.setHeader('X-Sentinel-Status', SECURITY_MODE ? 'PROTECTED' : 'VULNERABLE');
    res.setHeader('X-Research-Attribution', 'Simon Essien');

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
        data: "Sensitive Intel: Project Alpha-7",
        security: SECURITY_MODE ? "High" : "None",
        research_lead: "Simon Essien"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sentinel-X Active on Port ${PORT}`));


