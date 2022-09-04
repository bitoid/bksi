//initial variables
let output = document.querySelector(".output");
let serviceEl = document.getElementById('service');
let serviceDropdown = document.getElementById('service-dropdown');
let buildingEl = document.getElementById('building');
let buildingDropdown = document.getElementById('building-dropdown');
let sectorEl = document.getElementById('sector');
let sectorDropdown = document.getElementById('sector-dropdown');
let sectorDrop = document.querySelector(".sector-drop");
let buildingDrop = document.querySelector(".building-drop");
let serviceDrop = document.querySelector(".service-drop");
let projectsArr = [];
let filteredProjects = [];
let templateHtml = '';

//adding events on all of dropdown menu items
Array.from(serviceDropdown.childNodes).map(item => item.addEventListener('click', (e) => {
    output.innerHTML = ''
    serviceEl.childNodes[0].textContent = e.target.textContent;
    displayData();
}));

Array.from(buildingDropdown.childNodes).map(item => item.addEventListener('click', (e) => {
    output.innerHTML = ''
    buildingEl.childNodes[0].textContent = e.target.textContent;
    displayData();
}));
Array.from(sectorDropdown.childNodes).map(item => item.addEventListener('click', (e) => {
    output.innerHTML = ''
    sectorEl.childNodes[0].textContent = e.target.textContent;
    displayData();
}));

//adding event on document,which makes dropdown menus hidden if mouse is clicked outside of specific menus
document.addEventListener('click', (e) => {
    if (!sectorDrop.contains(e.target)) {
        sectorDrop.classList.remove('active')
    }
    if (!serviceDrop.contains(e.target)) {
        serviceDrop.classList.remove('active')
    }
    if (!buildingDrop.contains(e.target)) {
        buildingDrop.classList.remove('active')
    }
});
//fetching data from endpoint
async function fetchData() {
    const response = await fetch('/bksi/projects/data');
    let temp = await response.json();
    let json = temp.data;
    return json;
}
// displaing projects data on document if dropdown menu items are'nt clicked , on the ather way
// projects are being filtered according to above logic
async function displayData() {
    filteredProjects = [];
    projectsArr = [];
    templateHtml = '';
    let data = await fetchData();
    if (serviceEl.innerText.toLowerCase() === 'service' && buildingEl.innerText.toLowerCase() === 'building type' && sectorEl.innerText.toLowerCase() === 'sector') {
        for (projects of data) {
            filteredProjects.push(projects);
        }
    } else if (serviceEl.innerText.toLowerCase() !== 'service' && buildingEl.innerText.toLowerCase() === 'building type' && sectorEl.innerText.toLowerCase() === 'sector') {
        for (projects of data) {
            if (projects['service'].toLowerCase() === serviceEl.innerText.toLowerCase()) {
                filteredProjects.push(projects);
            }
        }
    } else if (serviceEl.innerText.toLowerCase() !== 'service' && buildingEl.innerText.toLowerCase() !== 'building type' && sectorEl.innerText.toLowerCase() === 'sector') {
        for (projects of data) {
            if (projects['service'].toLowerCase() === serviceEl.innerText.toLowerCase() && projects['building type'].toLowerCase() === buildingEl.innerText.toLowerCase()) {
                filteredProjects.push(projects);
            }
        }
    } else if (serviceEl.innerText.toLowerCase() === 'service' && buildingEl.innerText.toLowerCase() !== 'building type' && sectorEl.innerText.toLowerCase() === 'sector') {
        for (projects of data) {
            if (projects['building type'].toLowerCase() === buildingEl.innerText.toLowerCase()) {
                filteredProjects.push(projects);
            }
        }
    } else if (serviceEl.innerText.toLowerCase() === 'service' && buildingEl.innerText.toLowerCase() === 'building type' && sectorEl.innerText.toLowerCase() !== 'sector') {
        for (projects of data) {
            if (projects['sector'].toLowerCase() === sectorEl.innerText.toLowerCase()) {
                filteredProjects.push(projects);
            }
        }
    } else if (serviceEl.innerText.toLowerCase() === 'service' && buildingEl.innerText.toLowerCase() !== 'building type' && sectorEl.innerText.toLowerCase() !== 'sector') {
        for (projects of data) {
            if (projects['building type'].toLowerCase() === buildingEl.innerText.toLowerCase() && projects['sector'].toLowerCase() === sectorEl.innerText.toLowerCase()) {
                filteredProjects.push(projects);
            }
        }
    } else if (serviceEl.innerText.toLowerCase() !== 'service' && buildingEl.innerText.toLowerCase() === 'building type' && sectorEl.innerText.toLowerCase() !== 'sector') {
        for (projects of data) {
            if (projects['service'].toLowerCase() === serviceEl.innerText.toLowerCase() && projects['sector'].toLowerCase() === sectorEl.innerText.toLowerCase()) {
                filteredProjects.push(projects);
            }
        }
    } else if (serviceEl.innerText.toLowerCase() !== 'service' && !buildingEl.innerText.toLowerCase() !== 'building type' && sectorEl.innerText.toLowerCase() !== 'sector') {
        for (projects of data) {
            if (projects['service'].toLowerCase() === serviceEl.innerText.toLowerCase() && projects['building type'].toLowerCase() === buildingEl.innerText.toLowerCase() && projects['sector'].toLowerCase() === sectorEl.innerText.toLowerCase()) {
                filteredProjects.push(projects);
            }
        }
    }
    //declaring html template for projects
    for (projectsData of filteredProjects) {
        templateHtml = `
        <div class="group md:relative md:overflow-hidden">
               <a href="/node/${projectsData['nid']}" class="relative block w-full h-56 md:h-[400px] mb-5 md:mb-0">
                    <div class="relative fade-in-image-container h-full">
                        <img class="w-full fade-in-image h-full object-cover" src="${projectsData['image']}" alt=""/>
                    </div>
                    <span class="absolute right-5 bottom-5 w-10 h-10 rounded-full bg-white flex items-center justify-center md:hidden"><img src="modules/custom/projects/images/arrow-textlinks.svg" alt=""/></span>
                    <h4 class="hidden text-2xl absolute bottom-10 left-10 text-white font-semibold group-hover:bottom-[calc(100%-60px)] group-hover:translate-y-1/2 z-10 md:block">Wohnanlage Denkendorf</h4>
               </a>
               <div class="opacity-100 flex flex-col gap-4 md:absolute md:translate-y-full md:w-full md:h-full md:bg-darkBlue md:opacity-0 md:top-0 md:text-white md:p-10 md:pt-[125px] md:pl-8 md:gap-8 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                    <h4 class="text-2xl md:hidden">${projectsData['title']}</h4>

                    <div class="flex items-start gap-4 text-[15px] tracking-[0.75px] leading-[22px] md:gap-10">
                        <div class="flex flex-col gap-5">
                            <div flex flex-col gap-3>
                                <p>Gebäudeart</p>
                                <p>${projectsData['building type']}</p>
                            </div>
                            <div flex flex-col gap-3>
                                <p>Auftraggeber</p>
                                <p> ${projectsData['client']}</p>
                            </div>
                        </div>
                        <div class="flex flex-col gap-5">
                            <div flex flex-col gap-3>
                                <p>Leistung</p>
                                <p>${projectsData['service']}</p>
                            </div>
                            <div flex flex-col gap-3>
                                <p>Zeitraum</p>
                                <p> ${projectsData['period']}</p>
                            </div>

                        </div>
                    </div>
                    <a href="/node/${projectsData['nid']}" class="absolute right-5 bottom-5 w-10 h-10 rounded-full bg-white hidden md:flex items-center justify-center"><img src="modules/custom/projects/images/arrow-textlinks.svg" alt=""/></a>
               </div>
            </div>
             `;
        projectsArr.push(templateHtml);
    }
    //displays all of projects from endpoint , if there is less then 8 of them
    //if there are moRe then 8 , we display last 8 of that projects
    if (projectsArr.length < 8) {
        for (let i = 0; i < projectsArr.length; i++) {
            output.innerHTML += projectsArr[i];
        }
    } else {
        for (let i = projectsArr.length - 8; i < projectsArr.length; i++) {
            output.innerHTML += projectsArr[i];
        }
    }

    document.querySelectorAll('.fade-in-image-container').forEach(fadeInIMageContainer => observer.observe(fadeInIMageContainer), { threshold: [0.2] });
    document.querySelectorAll('.text-fade').forEach(textFade => observer.observe(textFade), { threshold: [0.2] });

}

displayData();
