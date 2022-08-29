const sliderButtomLeft = document.querySelector('.slider-button-left')
const sliderButtomRight = document.querySelector('.slider-button-right')
const sliderPages = document.querySelector('.slider-pages')
const currentSlideHTML = document.querySelector('.current-slide');
const totalSlides = document.querySelector('.total-slides');
const sliderContainer = document.querySelector('.slider-container')
const arrayOfSliderContents = sliderContainer.querySelectorAll('.slider-content')
const sliderContentWidth = document.querySelector('.slider-content').getBoundingClientRect().width
let currentSlide = 0;

window.onload = () => {
    totalSlides.innerHTML = arrayOfSliderContents.length;
    currentSlideHTML.innerHTML = currentSlide + 1;
}

sliderButtomLeft.addEventListener('click', () => {
    if(currentSlide > 0){
        currentSlide--;
        sliderContainer.scrollLeft -= sliderContentWidth
        currentSlideHTML.innerHTML = currentSlide;
    }else{
        sliderContainer.scrollLeft += (sliderContentWidth * arrayOfSliderContents.length)
        currentSlide = arrayOfSliderContents.length - 1;
        currentSlideHTML.innerHTML = arrayOfSliderContents.length
    }
})

sliderButtomRight.addEventListener('click', () => {
    if(currentSlide < arrayOfSliderContents.length - 1){
        currentSlide++;    
        currentSlideHTML.innerHTML = currentSlide + 1;
        sliderContainer.scrollLeft += sliderContentWidth
    }else if(currentSlide === arrayOfSliderContents.length - 1){
        currentSlide = 0;
        currentSlideHTML.innerHTML = currentSlide + 1;
        sliderContainer.scrollLeft -= (sliderContentWidth * arrayOfSliderContents.length)
    }
})
