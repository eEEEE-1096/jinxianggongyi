import { supabase } from './config.js';
import { initAuth, getCurrentUser } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAuth();
    loadContent();
    initModals();
});

function initNavigation() {
    document.querySelectorAll('[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = e.target.getAttribute('data-section');
            switchSection(sectionId);
        });
    });
}

function switchSection(sectionId) {
    document.querySelectorAll('[data-page]').forEach(page => {
        page.classList.toggle('active', page.id === sectionId);
    });
    window.history.pushState(null, null, `#${sectionId}`);
}

async function loadContent() {
    await Promise.all([
        loadSection('intro'),
        loadSection('rules'),
        loadBuildings(),
        loadPosts('news'),
        loadPosts('progress'),
        loadPosts('punishment'),
        loadMessages()
    ]);
}

async function loadSection(section) {
    const { data } = await supabase
        .from('sections')
        .select('content')
        .eq('name', section)
        .single();
    
    if (data) {
        document.getElementById(`${section}-content`).innerHTML = data.content;
    }
}

async function loadBuildings() {
    const { data } = await supabase
        .from('buildings')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (data) {
        const container = document.getElementById('buildings-container');
        container.innerHTML = data.map((building, i) => `
            <div class="building-container ${i % 2 === 0 ? '' : 'reverse'}">
                <div class="building-image">
                    <img src="${building.image_url}" alt="${building.title}">
                </div>
                <div class="building-info">
                    <h3>${building.title}</h3>
                    <p>${building.description}</p>
                </div>
            </div>
        `).join('');
    }
}

async function loadPosts(type) {
    const { data } = await supabase
        .from('posts')
        .select('*, profiles(username)')
        .eq('type', type)
        .order('created_at', { ascending: false });
    
    if (data) {
        const container = document.getElementById(`${type}-container`);
        container.innerHTML = data.map(post => `
            <div class="post-card">
                <h3>${post.title}</h3>
                <div class="post-meta">
                    ${post.profiles.username} • ${new Date(post.created_at).toLocaleDateString()}
                </div>
                <p>${post.content}</p>
            </div>
        `).join('');
    }
}

async function loadMessages() {
    const { data } = await supabase
        .from('messages')
        .select('*, profiles(username, avatar)')
        .order('created_at', { ascending: false });
    
    if (data) {
        const container = document.getElementById('message-container');
        container.innerHTML = data.map(msg => `
            <div class="message">
                <img src="${msg.profiles.avatar}" class="avatar">
                <div>
                    <div class="message-header">
                        <strong>${msg.profiles.username}</strong>
                        <span>${new Date(msg.created_at).toLocaleString()}</span>
                    </div>
                    <p>${msg.content}</p>
                </div>
            </div>
        `).join('');
    }
}

function initModals() {
    document.getElementById('auth-modal').addEventListener('submit', async e => {
        e.preventDefault();
        const form = e.target.id;
        
        try {
            if (form === 'login-form') {
                await handleLogin(
                    document.getElementById('login-email').value,
                    document.getElementById('login-password').value
                );
            } else if (form === 'register-form') {
                await handleRegister(
                    document.getElementById('register-email').value,
                    document.getElementById('register-password').value,
                    document.getElementById('register-username').value,
                    document.getElementById('register-admin-code').value
                );
            } else if (form === 'forgot-form') {
                await handlePasswordReset(
                    document.getElementById('forgot-email').value
                );
            }
            closeModal('auth-modal');
        } catch (error) {
            showFeedback(form.replace('-form', ''), error.message, false);
        }
    });

    document.getElementById('message-form').addEventListener('submit', async e => {
        e.preventDefault();
        const content = document.getElementById('message-content').value;
        
        try {
            const { error } = await supabase
                .from('messages')
                .insert([{ 
                    content, 
                    user_id: getCurrentUser().id 
                }]);
            
            if (error) throw error;
            
            document.getElementById('message-content').value = '';
            loadMessages();
        } catch (error) {
            showFeedback('message', error.message, false);
        }
    });
}

function showFeedback(context, message, isSuccess) {
    const element = document.getElementById(`${context}-feedback`);
    element.textContent = message;
    element.className = `feedback ${isSuccess ? 'success' : 'error'}`;
    element.style.display = 'block';
    
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}
