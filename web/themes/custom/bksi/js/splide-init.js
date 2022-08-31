document.addEventListener("DOMContentLoaded", function(event) {
    new Splide(
        '.splide', 
        {
            type   : 'slide',
            rewind: true,
            fixedWidth: '50%',
            perPage: 3,
            focus: "center",
            gap: 40,
            start: 1,
            trimSpace: false,
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
