# Sentinel-X: Vanguard Defensive Gateway

**Sentinel-X** is a production-grade, self-defending security gateway designed to protect sensitive data nodes. It bridges the gap between **Policy as Code (PaC)** and **Active Threat Mitigation**.

## 🛡️ Key Features
* **Intentional BOLA Lab**: Features a controlled environment to test and mitigate Broken Object Level Authorization (BOLA) vulnerabilities—the #1 API security risk—using automated Policy as Code.
* **Automated 1-Hour Lockout**: Executes a mandatory 60-minute cooling-off period after 3 failed attempts, increasing the "cost" of an attack by 600%.
* **Proxy-Aware Detection**: Uses custom header parsing (x-forwarded-for) to identify the true source IP behind cloud proxies and load balancers.
* **Infrastructure-Level Secret Management**: Decoupled sensitive credentials from source code using environment variables to prevent credential leakage in version control.
* **High-Visibility UI**: Features a dynamic dashboard showing real-time system status (e.g., "ACTIVE: ENFORCED") using Server-Side Rendering (SSR).
* **Governance Framework:**: Implements Open Policy Agent (OPA) to decouple authorization logic from the core application code, ensuring auditable and scalable security policies.
  
## 🚀 Technical Architecture
* **Backend**: Node.js / Express.js
🔐 Security Policy as Code
The gateway enforces a "3-Strikes" access policy defined through Rego (OPA). Upon the third violation, the application logic dynamically updates the internal blacklist to deny all traffic from the offending node, effectively "shutting the gates" at the application layer.

🛠️ Tech Stack
* **Backend**: Node.js / Express.js
* **Policy Engine**: Open Policy Agent (OPA) for decoupled governance
* **Security Logic**: Stateful IP Monitoring & Rate Limiting
* **Infrastructure**: Render (Environment Variable Secret Management)
* **CI/CD**: GitHub Actions with integrated OPA syntax validation
* **UI**: High-contrast, mobile-optimized Vanguard CSS
* 
## 📈 Forensic Observability
The system produces high-fidelity security logs critical for incident response and audit trails:
* **Event Detection**: Logs failed attempts with precise sequence counts.
* **Automated Action**: Captures the exact timestamp of IP blacklisting events.
* **Identity Management**: Displays the authorized Research Lead (Simon Essien) to maintain a clear chain of command and accountability.
