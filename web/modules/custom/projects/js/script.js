//initial variables
const output = document.querySelector(".output");
const sectorDrop = document.querySelector(".sector-drop");
const buildingDrop = document.querySelector(".building-drop");
const serviceDrop = document.querySelector(".service-drop");
const container = document.getElementById("container");
const allProjectsEl = document.getElementById('all-projects');
const currentprojectEl = document.getElementById('curent-projects');
const clearProjectsEl = document.getElementById('clear-projects');
let groupItems = Array.from(document.querySelectorAll('.group-item'));
let templateHtml = '';
let data = [];
let projectsArr = [];
let filteredProjects = [];
let chosenItems = [];

async function fetchData() {
  const response = await fetch('/bksi/projects/data');
  let temp = await response.json();
  return temp.data;
}

function displayData(arr) {
  output.innerHTML = "";
  templateHtml = '';
  projectsArr = [];

  //declaring html template for projects
  for (projectsData of arr) {
    templateHtml = `
        <div class="group md:relative md:overflow-hidden">
               <a href="/node/${projectsData['nid']}" class="${parseInt(projectsData['tick']) === 1 ? 'pointer-events-none relative block w-full h-56 md:h-[400px] mb-5 md:mb-0' : 'relative block w-full h-56 md:h-[400px] mb-5 md:mb-0'}">
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
                                <p> ${projectsData['customer']}</p>
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
                    <a href="/node/${projectsData['nid']}"
                        class="${parseInt(projectsData['tick']) === 1 ? 'hidden pointer-events-none' : 'absolute right-5 bottom-5 w-10 h-10 rounded-full bg-white hidden md:flex items-center justify-center'} "><img
                            src="modules/custom/projects/images/arrow-textlinks.svg" alt=""></a>
                  </div>
            </div>
             `;
    projectsArr.push(templateHtml);
  }
  let counter = 8;
  let i = projectsArr.length < counter ? projectsArr.length : counter;
  for (let k = projectsArr.length; k > projectsArr.length - i; k--) {
    output.innerHTML += projectsArr[k - 1];
  }

  document.querySelectorAll('.fade-in-image-container').forEach(fadeInIMageContainer => observer.observe(fadeInIMageContainer), { threshold: [0.2] });
  document.querySelectorAll('.text-fade').forEach(textFade => observer.observe(textFade), { threshold: [0.2] });

}

async function setup() {
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
    if (!e.target.closest(".project-dropdown")) return;
    let type = e.target.closest(".project-dropdown").id.split("-")[0];
    if (!e.target.closest(`#${type}-dropdown`)) return;
    let value = e.target;
    console.log(e.target.closest(`#${type}-dropdown`))
    let trimedValue = value.innerText.trim();
    // e.target.closest('.group').classList.toggle('active');
    clearProjectsEl.classList.remove('hidden');
    if (!currentprojectEl.innerHTML.includes(`${trimedValue.slice(0, 6)}`)) {
      let btnEl = document.createElement('button');
      btnEl.classList.add('curently-chosen', 'px-5', 'py-4', 'flex', 'items-center', 'gap-9', 'rounded-[50px]', 'border-2', 'bg-mainBlack', 'text-white', 'border-mainBlack');
      let spanEl = document.createElement('span');
      spanEl.classList.add('text-[15px]', 'leading-[22px]', 'tracking-[0.75px]', 'truncate', 'max-w-[150px]');
      spanEl.textContent = trimedValue;
      let imEl = document.createElement('i');
      imEl.classList.add('fa', 'fa-times', 'text-2xl');
      imEl.ariaHidden = 'TRUE';
      btnEl.appendChild(spanEl);
      btnEl.appendChild(imEl);
      currentprojectEl.appendChild(btnEl);
    }

    allProjectsEl.addEventListener('click', () => {
      currentprojectEl.innerHTML = '';
      clearProjectsEl.classList.add('hidden');
      displayData(data);
    })

    currentprojectEl.addEventListener('click', (e) => {
      if (!e.target.closest('.curently-chosen')) return;
      e.target.closest('.curently-chosen').remove();
      if (currentprojectEl.childNodes.length < 1) {
        clearProjectsEl.classList.add('hidden')
      }
      // filteredProjects = filterWithDropdown(data);
      displayData(filteredProjects);
    })
    // filteredProjects = filterWithDropdown(data);
    displayData(filteredProjects)
  });
  displayData(filteredProjects);
  checkProjectsToDisable(data, currentprojectEl.childNodes)
}
setup();


function filterWithCompany(arr) {
  let company = window.localStorage.getItem("client");
  window.localStorage.removeItem("client");

  if (company) {
    return arr.filter(e => e.client == company);
  }

  return arr;
};


function checkProjectsToDisable(arr1, arr2) {
  let filteredProjects = [...arr1];
  let itemsToDisable = [];
  for (let i = 0; i < groupItems.length; i++) {
    itemsToDisable[i] = groupItems[i].innerText.toLowerCase().trim();
  }

  for (let j = 0; j < filteredProjects.length; j++) {
    for (let i = 0; i < itemsToDisable.length; i++) {
      if (filteredProjects[j]['service'].toLowerCase().trim() !== itemsToDisable[i] || filteredProjects[j]['building type'].toLowerCase().trim() !== itemsToDisable[i] || filteredProjects[j]['sector'].toLowerCase().trim() !== itemsToDisable[i]) {
        itemsToDisable.splice(itemsToDisable[i], 1)
      }
    }
  }
  console.log(itemsToDisable)

}


