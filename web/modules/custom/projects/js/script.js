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
const listItems = document.querySelectorAll("img-div");

let templateHtml = '';
let projectsArr = [];
let data = [];
let filteredProjects = [];
let itemsToDisable = [];
let filters = {}

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
               <a href="/node/${projectsData['nid']}" class="${parseInt(projectsData['tick']) !== 1 ? 'pointer-events-none relative block w-full h-56 md:h-[400px] mb-5 md:mb-0' : 'relative block w-full h-56 md:h-[400px] mb-5 md:mb-0'}">
                    <div class="relative fade-in-image-container h-full">
                        <img class="w-full fade-in-image h-full object-cover" src="${projectsData['image'] ? projectsData['image'] : ''}" alt=""/>
                    </div>
                    <span class="absolute right-5 bottom-5 w-10 h-10 rounded-full bg-white flex items-center justify-center md:hidden"><img src="modules/custom/projects/images/arrow-textlinks.svg" alt=""/></span>
                    <h4 class="hidden text-2xl absolute bottom-10 left-10 text-white font-semibold group-hover:bottom-[calc(100%-60px)] group-hover:translate-y-1/2 z-10 md:block">${projectsData['title']}</h4>
               </a>
               <div class="opacity-100 flex flex-col gap-4 md:absolute md:translate-y-full md:w-full md:h-full md:bg-darkBlue md:opacity-0 md:top-0 md:text-white md:p-10 md:pt-[125px] md:pl-8 md:gap-8 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                    <h4 class="text-2xl md:hidden">${projectsData['title']}</h4>

                    <div class="flex items-start gap-4 text-[15px] tracking-[0.75px] leading-[22px] md:gap-10">
                        <div class="flex flex-col gap-5">
                            <div flex flex-col gap-3>
                                <p>Gebäudeart</p>
                                <p>${projectsData['building']}</p>
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
                        class="${parseInt(projectsData['tick']) !== 1 ? 'hidden pointer-events-none' : 'absolute right-5 bottom-5 w-10 h-10 rounded-full bg-white hidden md:flex items-center justify-center'} "><img
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

  // hide dropdown lists on window click
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

  // clear all filter button hendler
  allProjectsEl.addEventListener('click', () => {
    currentprojectEl.innerHTML = '';
    clearProjectsEl.classList.add('hidden');

    filters = {};
    filteredProjects = [...data];
    checkProjectsToDisable(filteredProjects, groupItems)
    displayData(filteredProjects);
  });

  // remove single filter button
  currentprojectEl.addEventListener('click', (e) => {
    if (!e.target.closest('#curent-projects')) return;

    const type = e.target.dataset.type ? e.target.dataset.type : e.target.closest(".curently-chosen").dataset.type;
    e.target.closest('.curently-chosen').remove(); // remove button
    delete filters[type];
    if (!Object.keys(filters).length) {
      clearProjectsEl.classList.add('hidden')
    }
    filteredProjects = filterWithDropdown(data, filters);
    checkProjectsToDisable(filteredProjects, groupItems);
    displayData(filteredProjects);
  })

  // filter data on dropdown click
  container.addEventListener('click', e => {
    if (!e.target.closest(".project-dropdown")) return;
    let type = e.target.closest(".project-dropdown").id.split("-")[0];
    if (!e.target.closest(`#${type}-dropdown`)) return;

    const value = e.target.dataset.value ? e.target.dataset.value : e.target.parentElement.dataset.value;
    const listItem = e.target.dataset.value ? e.target.firstElementChild : e.target;

    if (!!listItem.dataset.disabled) return;

    if (!filters[type]) {
      filters[type] = value;

      createButton(type, value); // create button if its type doesn't exist in filter obj
      listItem.parentElement.classList.add('active-item');
    }

    filteredProjects = filterWithDropdown(data, filters);
    checkProjectsToDisable(filteredProjects, groupItems);
    displayData(filteredProjects);
  });

  checkProjectsToDisable(filteredProjects, groupItems);
  displayData(filteredProjects);

}
setup();

function filterWithCompany(arr) {
  const query = new URLSearchParams(window.location.search);
  const company = query.get("customer");
  if (company) {
    return arr.filter(e => e.customer == company);
  }
  return arr;
};


function checkProjectsToDisable(arr1, arr2) {
  for (let i = 0; i < arr2.length; i++) {
    const listItem = arr2[i].parentElement;
    const listItemValue = listItem.dataset.value;
    const parentUlId = listItem.parentElement.id.split("-")[0];

    arr2[i].dataset.disabled = "true";
    arr1.forEach(elem => {
      if (elem[parentUlId] && elem[parentUlId].toLowerCase() === listItemValue) {
        arr2[i].dataset.disabled = ""; // turns into false
      }
    });
  }
  for (let i = 0; i < arr2.length; i++) {
    if (arr2[i].dataset.disabled) {
      arr2[i].parentElement.classList.remove('group');
      arr2[i].classList.add('opacity-60');
    } else {
      arr2[i].parentElement.classList.add('group');
      arr2[i].classList.remove('opacity-60');
    }

    arr2[i].parentElement.lastElementChild.classList.add("hidden");
    for (let key in filters) { 
      if(arr2[i].parentElement.dataset.value == filters[key]){
        arr2[i].parentElement.lastElementChild.classList.remove("hidden");
      }
    }

  }

}


function filterWithDropdown(data, filters) {
  let filterdArr = [...data];
  for (let key in filters) {
    filterdArr = filterdArr.filter(elem => {
      if (elem[key]) {
        return elem[key].toLowerCase() === filters[key];
      }
    });
  }
  return filterdArr;
}

function createButton(type, value) {
  let btnEl = document.createElement('button');
  btnEl.dataset.type = type;
  btnEl.classList.add('curently-chosen', 'px-5', 'py-4', 'flex', 'items-center', 'gap-9', 'rounded-[50px]', 'border-2', 'bg-mainBlack', 'text-white', 'border-mainBlack');
  let spanEl = document.createElement('span');
  spanEl.classList.add('text-[15px]', 'leading-[22px]', 'tracking-[0.75px]', 'truncate', 'max-w-[150px]');
  spanEl.textContent = value;
  let imEl = document.createElement('i');
  imEl.classList.add('fa', 'fa-times', 'text-2xl');
  imEl.ariaHidden = 'TRUE';
  btnEl.appendChild(spanEl);
  btnEl.appendChild(imEl);
  currentprojectEl.appendChild(btnEl);
  clearProjectsEl.classList.remove('hidden');
}


