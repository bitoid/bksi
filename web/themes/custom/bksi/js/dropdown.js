const projectDropdown = document.querySelectorAll('.project-dropdown');

projectDropdown.forEach(n => {
    n.addEventListener('click', () => {
        n.classList.toggle('active');
    })
})