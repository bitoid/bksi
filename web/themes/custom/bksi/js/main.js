const searchContainer = document.querySelector(".search-container");
const closeSearchContainer = document.querySelector("#closeSearch");
const hamburger = document.querySelector('.hamburger')
const burgerMenuShown = document.querySelector('.burger-menu')
const headerTop = document.querySelector('.header-top')
const dropDownButton = document.querySelectorAll('.dropdown-button');
const hamburgerButton = document.querySelector('.hamburger');



const getPageUrl = () => {
  const url = window.location.pathname;
  const page = url.split("/");
  if (!page.includes("layout")) {
    headerTop.classList.remove('hidden');
  }

  const hero = document.querySelectorAll(".bg-header");
  return hero.length == 0;
}
const temp = getPageUrl();

const searchWidth = () => {
    searchContainer.classList.add("active");
}
const closeSearch = () => {
    searchContainer.classList.remove('active');
}

const burgerMenu = () => {
    headerTop.style.position = 'fixed';
    if(parseInt(headerTop.style.top) > 40){
      headerTop.style.background = 'none';
    }else {
      headerTop.style.background = '#191428';
    }
    headerTop.style.top = `0`
    hamburger.classList.toggle('active');
    burgerMenuShown.classList.toggle('active');
    headerTop.style.zIndex = '500'
    if(burgerMenuShown.classList.contains('active')){
      document.body.style.overflow = 'hidden'
    }else {
      document.body.style.overflow = 'auto'
      document.body.style.overflowX = 'hidden'
    }
  }

dropDownButton.forEach(n => n.addEventListener('click', () => {
    n.parentElement.parentElement.classList.toggle('active');
}))

  let prevScrollpos = window.pageYOffset;


temp ? headerTop.classList.add("bg-darkBlue") : headerTop.style.background = "none";
window.onscroll = function() {
  if(!hamburger.classList.contains('active')){

    // Appearing Header on scrolling up and dissapearing when scrolling down.
    let currentScrollPos = window.pageYOffset;
    if(prevScrollpos < headerTop.clientHeight){
      temp ? headerTop.classList.add("bg-darkBlue") : headerTop.style.background = "none";
      headerTop.style.top = `${typeof drupalSettings.toolbar === 'undefined' ? '0px' : '60px'}`;
    }else if (prevScrollpos > currentScrollPos) {
      headerTop.style.background = '#191428';
      headerTop.style.top = `${typeof drupalSettings.toolbar === 'undefined' ? '0px' : '60px'}`;
      headerTop.style.position = 'fixed'
      headerTop.style.zIndex = '500'
    } else {
      headerTop.style.background = 'none';
      headerTop.style.top = `-${headerTop.clientHeight}px`;
    }
    prevScrollpos = currentScrollPos;

  }
}

const searchBlock = document.getElementById("block-bksi-content");
const searchLable = searchBlock.querySelectorAll('h2');

Array.from(searchLable).forEach(elem=> {
  if (elem.innerText == 'Search results') {
    elem.style.display = 'none';
}
});


const ginToolbar = document.getElementsByClassName('glb-toolbar');
if(ginToolbar[0]){
  ginToolbar[0].style.position = 'unset';
}



