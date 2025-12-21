// ... (keep the rest of your app.js the same)

// UPDATE ONLY THE HTML PORTION IN YOUR app.js:
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Sentinel-X Private Gateway</title>
                <style>
                    body { font-family: 'Courier New', monospace; background: #0a0a0a; color: #00ff41; text-align: center; padding: 50px; }
                    .dashboard { border: 2px solid ${SECURITY_MODE ? '#00ff41' : '#ff3131'}; padding: 30px; border-radius: 15px; display: inline-block; background: #111; }
                    .btn { display: block; margin: 15px auto; padding: 12px 24px; background: #00ff41; color: black; font-weight: bold; border-radius: 5px; cursor: pointer; border: none; width: 80%; }
                    .btn-private { background: #444; color: white; border: 1px solid #00ff41; }
                </style>
            </head>
            <body>
                <div class="dashboard">
                    <h1>🛡️ SENTINEL-X GATEWAY</h1>
                    <p>SYSTEM STATUS: ${SECURITY_MODE ? 'ENFORCED (JEKYLL)' : 'VULNERABLE (HYDE)'}</p>
                    
                    <a class="btn" href="/api/v1/user/1">1. PUBLIC GUEST VIEW</a>

                    <button class="btn btn-private" onclick="privateAccess()">2. SIMON ESSIEN PRIVATE BYPASS</button>
                    
                    <p>RESEARCH LEAD: SIMON ESSIEN</p>
                </div>

                <script>
                    function privateAccess() {
                        // This pops up a box on your phone asking for the code
                        let code = prompt("Enter Simon's Private Research Key:");
                        
                        if (code === "SIMON123") { // This is your password
                            fetch('/api/v1/user/1', {
                                headers: { 
                                    'x-user-id': '1',
                                    'x-research-key': 'SIMON_PRIVATE_KEY' 
                                }
                            })
                            .then(r => r.json())
                            .then(data => alert("ACCESS GRANTED:\\n" + JSON.stringify(data)))
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

// ... (keep your app.get('/api/v1/user/:id', ...) logic exactly as it is)

