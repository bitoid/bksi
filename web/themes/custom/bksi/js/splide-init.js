

document.addEventListener("DOMContentLoaded", function(event) {
    new Splide(
        '.splide', 
        {
            type : 'slide',
            rewind:true,
            fixedWidth: '50%',
            perPage: 1,
            focus:"center",
            gap: 40,
            start: 0,
            trimSpace: false,
            drag:false,
            breakpoints: {
                768: {                 
                    perPage: 1,
                    gap: 0,
                    fixedWidth: '100%',                   
                },
            },
            arrows: 2,
            pagination: 0,
        }).mount()
});


