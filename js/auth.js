import { supabase, ADMIN_CODE } from './config.js';

let currentUser = null;

export async function initAuth() {
    supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
            getUserProfile(session.user.id);
        } else {
            currentUser = null;
            updateUI();
        }
    });
}

export async function handleLogin(email, password) {
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) throw error;
    return user;
}

export async function handleRegister(email, password, username, adminCode) {
    const { user, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) throw authError;

    const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ 
            id: user.id, 
            username,
            role: adminCode === ADMIN_CODE ? 'admin' : 'user',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=4169E1&color=fff`
        }]);

    if (profileError) throw profileError;
    return user;
}

export async function handlePasswordReset(email) {
    const { error } = await supabase.auth.api.resetPasswordForEmail(email);
    if (error) throw error;
}

export async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

async function getUserProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (error) throw error;
    
    currentUser = {
        id: data.id,
        username: data.username,
        role: data.role,
        avatar: data.avatar
    };
    
    updateUI();
    return currentUser;
}

function updateUI() {
    const authElements = document.querySelectorAll('[data-auth]');
    authElements.forEach(el => {
        const state = el.getAttribute('data-auth');
        el.style.display = currentUser ? 
            (state === 'authenticated' ? 'block' : 'none') :
            (state === 'guest' ? 'block' : 'none');
    });

    if (currentUser) {
        const userElements = document.querySelectorAll('[data-user]');
        userElements.forEach(el => {
            const prop = el.getAttribute('data-user');
            if (prop === 'avatar') {
                el.src = currentUser.avatar;
            } else {
                el.textContent = currentUser[prop];
            }
        });
    }
}

export function getCurrentUser() {
    return currentUser;
}
