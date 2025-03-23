const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionBottom = section.getBoundingClientRect().bottom;

        if (sectionTop < window.innerHeight && sectionBottom > 0) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
});

window.dispatchEvent(new Event('scroll'));

document.getElementById('copy-ip').addEventListener('click', () => {
    const ip = '949043991';
    navigator.clipboard.writeText(ip).then(() => {
        alert('服务器QQ群号已复制到剪贴板！');
    });
});

document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('感谢您的留言！我们将会以更好的服务回馈您！');
});

document.getElementById('news-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const content = document.getElementById('news-content').value;
    const post = document.createElement('div');
    post.className = 'sub-section';
    post.innerHTML = `<p>${content}</p>`;
    document.getElementById('news-posts').appendChild(post);
    document.getElementById('news-content').value = '';
});

document.getElementById('progress-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const content = document.getElementById('progress-content').value;
    const post = document.createElement('div');
    post.className = 'sub-section';
    post.innerHTML = `<p>${content}</p>`;
    document.getElementById('progress-posts').appendChild(post);
    document.getElementById('progress-content').value = '';
});

document.getElementById('penalty-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const content = document.getElementById('penalty-content').value;
    const post = document.createElement('div');
    post.className = 'sub-section';
    post.innerHTML = `<p>${content}</p>`;
    document.getElementById('penalty-posts').appendChild(post);
    document.getElementById('penalty-content').value = '';
});
