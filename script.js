// =========================================================================
// 1. GLOBAL FULL-STACK SYSTEM CONFIGURATION
// =========================================================================
const API_URL = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", () => {
    console.log("[System] TravelMate App loaded. Monitoring backend handshake channels on port 5000.");
    
    // Auto-load profile name styling if active session remains
    const cachedUser = localStorage.getItem('tm_user');
    if (cachedUser) {
        const navActions = document.getElementById('navActions');
        if (navActions) {
            navActions.innerHTML = `
                <span class='text-sm font-bold text-[#c5a36c] tracking-wide'>
                    <i class="fa-solid fa-user mr-2"></i>Active: ${cachedUser}
                </span>
            `;
        }
    }
});

// =========================================================================
// 2. INTERACTIVE USER INTERFACE LOGIC
// =========================================================================
function toggleModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.toggle('hidden');
    } else {
        console.error("UI Reference Missing: 'authModal' node element dropped.");
    }
}

// =========================================================================
// 3. FULL-STACK INTEGRATION: AUTHENTICATION (JWT)
// =========================================================================
async function handleLogin() {
    const emailInput = document.getElementById('userEmail');
    if (!emailInput) return alert("System target error. Missing input element reference.");

    const email = emailInput.value.trim();
    if (!email || !email.includes('@')) {
        return alert("Please enter a valid email address.");
    }

    try {
        console.log(`[API Request] Dispatching Auth validation for context client: ${email}`);
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: email.split('@')[0],
                email: email,
                password: "password123"
            })
        });

        if (!response.ok) throw new Error("Server rejected verification package payload.");

        const data = await response.json();

        if (data.token) {
            localStorage.setItem('tm_token', data.token);
            localStorage.setItem('tm_user', data.user.username);
            
            const navActions = document.getElementById('navActions');
            if (navActions) {
                navActions.innerHTML = `
                    <span class='text-sm font-bold text-[#c5a36c] tracking-wide'>
                        <i class="fa-solid fa-user mr-2"></i>Active: ${data.user.username}
                    </span>
                `;
            }
            toggleModal();
        }
    } catch (error) {
        console.error("[Auth System Defect]", error);
        alert("Failed to reach server pipeline. Check that 'node server.js' is running on port 5000.");
    }
}

// =========================================================================
// 4. FULL-STACK INTEGRATION: DISCOVERY ENGINE (MONGODB FETCH)
// =========================================================================
async function runDiscovery() {
    const countrySelect = document.getElementById('countrySelect');
    if (!countrySelect) return alert("Select element contextual pointer broken.");

    const country = countrySelect.value;
    if (!country) return alert("Please select an international destination choice first.");

    try {
        console.log(`[Database Fetch] Accessing cluster for document containing lookup code: ${country}`);
        const response = await fetch(`${API_URL}/destinations`);
        
        if (!response.ok) throw new Error("Cloud infrastructure returned invalid collection readout stream.");
        
        const databaseDestinations = await response.json();
        const data = databaseDestinations.find(entry => entry.id.toLowerCase() === country.toLowerCase());

        if (data) {
            const displayCard = document.getElementById('resultsArea');
            if (!displayCard) return console.error("Rendering node container element lost.");

            // Injecting database values securely inside the DOM structures
            document.getElementById('resultImg').src = data.img;
            document.getElementById('resultTitle').innerText = data.title;
            document.getElementById('resultDesc').innerText = data.desc;
            document.getElementById('resultTag').innerText = data.weather;
            document.getElementById('resDining').innerText = data.dining;
            document.getElementById('resSeason').innerText = data.season;

            // Make result visible with CSS class controls
            displayCard.style.display = 'block';
            displayCard.scrollIntoView({ behavior: 'smooth' });
            
            console.log(`[Display Matrix Engine] Renders mapped image node source targets pointing to: ${data.img}`);
        } else {
            alert("Specified target listing location entry is currently missing from your MongoDB cluster data points.");
        }
    } catch (error) {
        console.error("[Data Pipeline Fracture]", error);
        alert("Could not process dynamic records parsing execution routine from port 5000 API mapping routing.");
    }
}