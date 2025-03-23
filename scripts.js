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
        alert('群号已复制到剪贴板！');
    });
});

document.getElementById('contact-form').addEventListener('submit', (e) =） {
    e.preventDefault();
    alert('感谢您的留言！我们会尽快联系您。');
});
