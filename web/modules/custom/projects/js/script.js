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
const container = document.getElementById("container");
let templateHtml = '';
let data = [];
let projectsArr = [];
let filteredProjects = [];

async function fetchData() {
    const response = await fetch('/bksi/projects/data');
    let temp = await response.json();
    return temp.data;
}

function filterWithDropdown (arr) {
  let filterdArr = [...arr];

  if(serviceEl.innerText.toLowerCase() !== 'service'){
    filterdArr = filterdArr.filter(e => e["service"].toLowerCase() === serviceEl.innerText.toLowerCase());
  }
  if(buildingEl.innerText.toLowerCase() !== 'building type'){
    filterdArr = filterdArr.filter(e => e["building type"].toLowerCase() === buildingEl.innerText.toLowerCase());
  }
  if(sectorEl.innerText.toLowerCase() !== 'sector'){
    filterdArr = filterdArr.filter(e => e["sector"].toLowerCase() === sectorEl.innerText.toLowerCase());
  }

  return filterdArr;
}

function displayData(arr) {
    output.innerHTML = "";
    templateHtml = '';
    projectsArr = [];

    //declaring html template for projects
    for (projectsData of arr) {
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

    let counter = 8;
    let i = projectsArr.length < counter ? projectsArr.length: counter;
    for (let k = projectsArr.length; k > projectsArr.length - i; k--){
      output.innerHTML += projectsArr[k-1];
    }

    document.querySelectorAll('.fade-in-image-container').forEach(fadeInIMageContainer => observer.observe(fadeInIMageContainer), { threshold: [0.2] });
    document.querySelectorAll('.text-fade').forEach(textFade => observer.observe(textFade), { threshold: [0.2] });

}

function filterWithCompany (arr) {
  let company = window.localStorage.getItem("client");
  window.localStorage.removeItem("client");

  if(company){
    return arr.filter(e => e.client == company);
  }
  return arr;
};

async function setup () {
  data = await fetchData();
  filteredProjects = filterWithCompany(data);

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

  container.addEventListener('click', e => {
    if(!e.target.closest(".project-dropdown")) return;
    let type = e.target.closest(".project-dropdown").id.split("-")[0];
    if(!e.target.closest(`#${type}-dropdown`)) return;

    let value = e.target.innerText.trim();
    document.getElementById(`${type}`).innerText = value;

    filteredProjects = filterWithDropdown(data);
    displayData(filteredProjects);
  });

  displayData(filteredProjects);
}
setup();
