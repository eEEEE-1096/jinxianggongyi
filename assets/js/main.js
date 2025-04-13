document.addEventListener('DOMContentLoaded', function() {
    // 加载首页内容
    fetch('data/home.json')
        .then(response => response.json())
        .then(data => {
            const homeContent = document.getElementById('home-content');
            homeContent.innerHTML = `
                <h3>${data.title}</h3>
                <p>${data.content}</p>
                ${data.sections.map(section => `
                    <div class="section">
                        <h4>${section.title}</h4>
                        <p>${section.content}</p>
                        ${section.image ? `<img src="${section.image}" alt="${section.title}">` : ''}
                    </div>
                `).join('')}
            `;
        });

    // 加载最新公告
    fetch('data/announcements.json')
        .then(response => response.json())
        .then(data => {
            const newsCarousel = document.getElementById('news-carousel');
            // 只显示最新的3条公告
            const latestAnnouncements = data.slice(0, 3);
            newsCarousel.innerHTML = latestAnnouncements.map(announcement => `
                <div class="news-item">
                    <h4>${announcement.title}</h4>
                    <div class="date">${announcement.date}</div>
                    <p>${announcement.content}</p>
                    ${announcement.image ? `<img src="${announcement.image}" alt="${announcement.title}">` : ''}
                </div>
            `).join('');
        });

    // 设置当前活动导航项
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-menu a').forEach(link => {
        const linkHref = link.getAttribute('href');
        if (currentPage === linkHref) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
