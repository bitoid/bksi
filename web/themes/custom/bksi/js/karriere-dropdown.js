const dropdownKarriere = document.querySelectorAll('.dropdown-karriere');

dropdownKarriere.forEach(n => n.addEventListener('click', () => {
    n.parentElement.classList.toggle('active');
}))