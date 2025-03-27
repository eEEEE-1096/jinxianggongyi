import { supabase } from './config.js';

export async function handleLogin(email, password) {
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) throw error;
    return user;
}

document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
        await handleLogin(form[0].value, form[1].value);
        window.location.href = '../index.html';
    } catch (error) {
        alert(error.message);
    }
});
