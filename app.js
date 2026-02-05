// 1. CONFIGURATION
const SUPABASE_URL = "https://hwaubxhcclgkcznlqqtk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_i7iB2vtL50H6tsTDWO_kYA_Mx6ZPpMw";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. UI: CUSTOM MODAL LOGIC (Restored)
function showModal(message, portal) {
    window.signupPortal = portal; // Remember which portal to switch back to
    const modal = document.getElementById('custom-modal');
    const content = document.getElementById('modal-content');
    const msg = document.getElementById('modal-message');

    if (msg) msg.innerText = message;
    if (modal) modal.classList.remove('hidden');
    
    setTimeout(() => {
        if (content) {
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('custom-modal');
    const content = document.getElementById('modal-content');
    if (content) content.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        if (modal) modal.classList.add('hidden');
        if (window.signupPortal) toggleForm(window.signupPortal);
    }, 200);
}

// 3. UI: FORM TOGGLING (Restored)
function toggleForm(portal) {
    const loginForm = document.getElementById(`${portal}-login-form`);
    const signupForm = document.getElementById(`${portal}-signup-form`);
    if (loginForm && signupForm) {
        loginForm.classList.toggle('hidden');
        signupForm.classList.toggle('hidden');
    }
}

// 4. LOGIC: HANDLE SIGNUP
async function handleSignup(portal) {
    const name = document.getElementById(`${portal}-name`).value.trim();
    const email = document.getElementById(`${portal}-email-signup`).value.trim();
    const password = document.getElementById(`${portal}-password-signup`).value.trim();

    if (!name || !email || !password) {
        alert("Please fill all fields!");
        return;
    }

    try {
        const { data, error } = await supabaseClient.auth.signUp({ email, password });
        if (error) throw error;

        if (data.user) {
            // Save to profiles table
            const { error: profErr } = await supabaseClient.from('profiles').upsert([
                { id: data.user.id, full_name: name, role: portal }
            ]);
            if (profErr) throw profErr;

            showModal("Account created successfully! Click OK to Login.", portal);
        }
    } catch (err) {
        alert("Signup Error: " + err.message);
    }
}

// 5. LOGIC: HANDLE LOGIN
// 5. LOGIC: HANDLE LOGIN
async function handleLogin(portal) {
    const email = document.getElementById(`${portal}-email`).value.trim();
    const password = document.getElementById(`${portal}-password`).value.trim();

    if (!email || !password) {
        alert("Enter your credentials.");
        return;
    }

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;

        if (data.user) {
            // DIRECT MAPPING TO YOUR FILENAMES
            let targetPage;
            
            switch(portal) {
                case 'student':
                    targetPage = 'stu.html';
                    break;
                case 'salaried':
                    targetPage = 'sal.html';
                    break;
                case 'business':
                    targetPage = 'bus.html';
                    break;
                case 'pensioned':
                    targetPage = 'pen.html';
                    break;
                default:
                    targetPage = 'index.html'; // Fallback
            }
            
            window.location.href = `./${targetPage}`;
        }
    } catch (err) {
        alert("Login Failed: " + err.message);
    }
}