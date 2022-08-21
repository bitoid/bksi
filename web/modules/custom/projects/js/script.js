let dropdownEl = document.getElementById('dropdowns');
let outputEl = document.querySelector(".output");
let drop = document.querySelector('.project-dropdown')
async function fetchProjectsData() {
    const response = await fetch('/bksi/projects/data');
    let fetched = await response.json();
    projects = fetched.data;
}


async function renderData() {
    await fetchProjectsData();
    let projectsArr = [];
    let templateHtml = "";
    for (let item in projects) {
        templateHtml = `
        <div class="group md:relative md:overflow-hidden">
            <a href="/node/${projects[item]['nid']}" class="relative block w-full h-56 md:h-[400px] mb-5 md:mb-0">
                <div class="relative fade-in-image-container h-full ">
                    <img class="w-full fade-in-image h-full object-cover" src="${projects[item]['image']}" alt="">
                </div>
                <span class="absolute right-5 bottom-5 w-10 h-10 rounded-full bg-white flex items-center justify-center md:hidden"><img src="../assets/Bilder/Arrows&Navigation/arrow-textlinks.svg" alt=""></span>
                <h4 class="hidden text-2xl absolute bottom-10 left-10 text-white font-semibold group-hover:bottom-[calc(100%-60px)] group-hover:translate-y-1/2 z-10 md:block">${projects[item]['title']}</h4>
            </a>
            <div class="opacity-100 flex flex-col gap-4 md:absolute md:translate-y-full md:w-full md:h-full md:bg-darkBlue md:opacity-0 md:top-0 md:text-white md:p-10 md:pt-[125px] md:pl-8 md:gap-8 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                <h4 class="text-2xl md:hidden">${projects[item]['title']}</h4>
                
                <div class="flex items-start gap-4 text-[15px] tracking-[0.75px] leading-[22px] md:gap-10">
                    <div class="flex flex-col gap-5">
                        <span>${projects[item]['title']}</span>
                        <span> ${projects[item]['client']}</span>
                    </div>
                    <div class="flex flex-col gap-5">
                        <span>${projects[item]['title']}</span>
                        <span> ${projects[item]['client']}</span>
                    </div>
                </div>
                <a href="/node/${projects[item]['nid']}" class="absolute right-5 bottom-5 w-10 h-10 rounded-full bg-white hidden md:flex items-center justify-center"><img src="../assets/Bilder/Arrows&Navigation/arrow-textlinks.svg" alt=""></a>
            </div>     
        </div>
    `;
        projectsArr.push(templateHtml);
        console.log(projectsArr)
    }
    if (projectsArr.length < 8) {
        for (let i = 0; i < projectsArr.length; i++) {
            outputEl.innerHTML += projectsArr[i];
        }
    } else if (projectsArr.length > 8) {
        for (let i = projectsArr.length - 8; i < projectsArr.length; i++) {
            outputEl.innerHTML += projectsArr[i];
        }
    }
}
renderData();


