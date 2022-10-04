//initial variabels
const projectsEl = document.querySelector('.random-projects');
const projectType = document.querySelector('.project-type').textContent.toLowerCase().trim();
let projectsArr = [];
let data = [];
let projectsToDisplay = 2;
//fetch data from endpoint
async function fetchData() {
    const response = await fetch('/bksi/projects/data');
    let temp = await response.json();
    return temp.data;
}

function displayData(arr) {
    projectsEl.innerHTML = "";
    templateHtml = '';
    projectsArr = [];

    //declaring html template for random projects array
    for (projectsData of arr) {
        templateHtml = `
                <div class="group md:relative md:overflow-hidden">
                    <a href="/node/${projectsData['nid']}" class="${parseInt(projectsData['tick']) !== 1 ? 'pointer-events-none relative block w-full h-56 md:h-[400px] mb-5 md:mb-0' : 'relative block w-full h-56 md:h-[400px] mb-5 md:mb-0'}" class="relative block w-full h-56 md:h-[400px] mb-5 md:mb-0">
                        <div class="relative fade-in-image-container h-full active">
                            <img class="w-full fade-in-image h-full object-cover" src="${projectsData['image'] ? projectsData['image'] : ''}" alt="">
                        </div>
                        <span class="absolute right-5 bottom-5 w-10 h-10 rounded-full bg-white flex items-center justify-center md:hidden"><img src="../assets/Bilder/Arrows&amp;Navigation/arrow-textlinks.svg" alt=""></span>
                        <h4 class="hidden text-2xl absolute bottom-10 left-10 text-white font-semibold group-hover:bottom-[calc(100%-60px)] group-hover:translate-y-1/2 z-10 md:block">${projectsData['title']}</h4>
                    </a>
                    <div class="opacity-100 flex flex-col gap-4 md:absolute md:translate-y-full md:w-full md:h-full md:bg-darkBlue md:opacity-0 md:top-0 md:text-white md:p-10 md:pt-[125px] md:pl-8 md:gap-8 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                        <h4 class="text-2xl md:hidden">${projectsData['title']}</h4>
                        
                        <div class="flex items-start gap-4 text-[15px] tracking-[0.75px] leading-[22px] md:gap-10">
                            <div class="flex flex-col gap-5">
                                <span>Gebäudeart ${projectsData['building']}</span>
                                <span> Auftraggeber ${projectsData['customer']}</span>
                            </div>
                            <div class="flex flex-col gap-5">
                                <span>Leistung ${projectsData['service']}</span>
                                <span> Zeitraum ${projectsData['period']}</span>
                            </div>
                        </div>
                        <a href="/node/${projectsData['nid']}" class="${parseInt(projectsData['tick']) !== 1 ? 'hidden pointer-events-none' : 'absolute right-5 bottom-5 w-10 h-10 rounded-full bg-white hidden md:flex items-center justify-center'} "><img src="/themes/custom/bksi/images/Arrows&Navigation/arrow-textlinks.svg" alt=""></a>
                </div>     
            </div>
               `;


        projectsArr.push(templateHtml);
    }

    //get random projects from filtered projects array according to building type of current projects building type
    getRandomProjects(projectsArr, projectsToDisplay, projectsEl);

    document.querySelectorAll('.fade-in-image-container').forEach(fadeInIMageContainer => observer.observe(fadeInIMageContainer), { threshold: [0.2] });
    document.querySelectorAll('.text-fade').forEach(textFade => observer.observe(textFade), { threshold: [0.2] });

}

async function setup() {
    data = await fetchData();
    //filter gotten projects according to current projects building type and display 2 of them randomly
    filteredProjects = similarProjects(data, projectType);
    displayData(filteredProjects);
}
setup();

//function to check if current projects building type is similar to projects from endpoint
function similarProjects(data, projectType) {
    let filterdArr = [...data];
    filterdArr = filterdArr.filter(elem => {
        if (elem['building']) {
            if (elem['building'].toLowerCase().trim()) {
                return elem['building'].toLowerCase() === projectType;
            }
        }
    });
    return filterdArr;
}
//function for get 2 random projects from data
function getRandomProjects(arr, numprojects, output) {
    for (let j = 0; j < numprojects; j++) {
        let randNum = Math.floor(Math.random() * arr.length);
        arr[randNum] ? output.innerHTML += arr[randNum] : "";
        arr.splice(randNum, 1)
    }
}