const video1 = document.getElementById('projectVideo1');
const video2 = document.getElementById('projectVideo2');
const video3 = document.getElementById('projectVideo3');

// Sidebar elements //
const sideBar = document.querySelector('.sidebar');
const menu = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon');

const hoverSign = document.querySelector('.hover-sign');

// Only include videos that exist on the page to avoid runtime errors
const videoList = [video1, video2, video3].filter(Boolean);

videoList.forEach(function (video) {
    video.addEventListener("mouseover", function () {
        video.play();
        if (hoverSign) hoverSign.classList.add("active");
    });
    video.addEventListener("mouseout", function () {
        video.pause();
        if (hoverSign) hoverSign.classList.remove("active");
    });
});

// Guard sidebar/menu listeners so script doesn't fail if elements are missing
if (menu && sideBar) {
    menu.addEventListener("click", function (e) {
        e.stopPropagation();
        if (sideBar.classList.contains('open-sidebar')) {
            sideBar.classList.remove('open-sidebar');
            sideBar.classList.add('close-sidebar');
        } else {
            sideBar.classList.remove('close-sidebar');
            sideBar.classList.add('open-sidebar');
        }
    });

    // close sidebar when clicking outside of it
    document.addEventListener('click', function (e) {
        if (sideBar.classList.contains('open-sidebar')) {
            if (!sideBar.contains(e.target) && !menu.contains(e.target)) {
                sideBar.classList.remove('open-sidebar');
                sideBar.classList.add('close-sidebar');
            }
        }
    });

    // allow Esc key to close sidebar
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && sideBar.classList.contains('open-sidebar')) {
            sideBar.classList.remove('open-sidebar');
            sideBar.classList.add('close-sidebar');
        }
    });
}

if (closeIcon && sideBar) {
    closeIcon.addEventListener("click", function (e) {
        e.stopPropagation();
        sideBar.classList.remove("open-sidebar");
        sideBar.classList.add("close-sidebar");
    });
}