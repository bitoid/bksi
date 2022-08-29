const fadeInIMageContainersList = document.querySelectorAll('.fade-in-image-container');
const fadeInImagesList = document.querySelectorAll('.fade-in-image');
const textContentFadeList = document.querySelectorAll('.text-fade');

function handleIntersection(entries) {
    entries.map((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }else {
        entry.target.classList.remove('active');
      }
    });
  }
  
  const observer = new IntersectionObserver(handleIntersection);
  
  fadeInIMageContainersList.forEach(fadeInIMageContainer => observer.observe(fadeInIMageContainer), { threshold: [0.2] });
  textContentFadeList.forEach(textFade => observer.observe(textFade), { threshold: [0.2] });
  