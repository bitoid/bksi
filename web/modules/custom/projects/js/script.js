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
  if (!arr.length) {
    output.classList.remove('grid', 'grid-cols-1');
    output.classList.add('flex', 'justify-center');
    output.innerHTML += "Keine Projekte gefunden.";
  } else {
    output.classList.remove('flex', 'justify-center');
    output.classList.add('grid', 'grid-cols-1');
    for (projectsData of arr) {
      templateHtml = `
        <div class="group md:relative md:overflow-hidden">
               <a href="${projectsData['url']}" class="${parseInt(projectsData['tick']) !== 1 ? 'pointer-events-none relative block w-full  mb-5 md:mb-0' : 'relative block w-full   mb-[15px] md:mb-0'}">
                    <div class="relative fade-in-image-container h-full">
                        <picture>
                          <source srcset="${projectsData['image']['large_webp'] ? projectsData['image']['large_webp'] : ''}" media="only screen and (max-width: 450px)" type="image/webp" >
                          <source srcset="${projectsData['image']['large_jpg'] ? projectsData['image']['large_jpg'] : ''}" media="only screen and (max-width: 450px)" type="image/jpeg" >
                          <source srcset="${projectsData['image']['original_webp'] ? projectsData['image']['original_webp'] : ''}" media="only screen and (min-width: 450px)" type="image/webp">
                          <source srcset="${projectsData['image']['original_jpg'] ? projectsData['image']['original_jpg'] : ''}" media="only screen and (min-width: 450px)" type="image/jpeg">
                          <img class="w-full " src="${projectsData['image']['original_jpg'] ? projectsData['image']['original_jpg'] : ''}" alt=""/>
                        </picture>
                        <div  class='absolute w-full md:h-[147px] h-20 bottom-0 left-0 bg-transparent bg-no-repeat bg-clip-padding bg-gradient-to-t from-mainBlack to-[#19142800] group-hover:bg-none'></div>
                    </div>
                    <span class="absolute right-5 bottom-5 w-10 h-10 rounded-full bg-white flex items-center justify-center md:hidden"><img src="modules/custom/projects/images/arrow-textlinks.svg" alt=""/></span>
                    <h4 class="hidden text-2xl absolute bottom-10 left-10 text-white font-semibold group-hover:bottom-[calc(100%-60px)] group-hover:translate-y-1/2 z-10 md:block">${projectsData['title']}</h4>
               </a>
               <div class="opacity-100 flex flex-col gap-[15px] md:absolute md:translate-y-full md:w-full md:h-full md:bg-darkBlue md:opacity-0 md:top-0 md:text-white md:p-10 md:pt-[125px] md:pl-8 md:gap-8 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                    <h4 class="text-[20px]  leading-[24px] tracking-[1px] md:hidden">${projectsData['title']}</h4>

                    <div class="flex items-start gap-4 text-[15px] tracking-[0.75px] leading-[22px] md:gap-10">
                        <div class="flex flex-col w-1/2 gap-5">
                            <div  class="flex flex-col gap-3">
                                <p class="!font-['halbfett']">${Drupal.t("Gebäudeart")}</p>
                                <p>${projectsData['building']}</p>

                                <p class="!font-['halbfett']">${Drupal.t("Auftraggeber")}</p>
                                <p> ${projectsData['customer']}</p>
                            </div>
                        </div>
                        <div class="flex flex-col  gap-5">
                            <div class="flex flex-col gap-3">
                                <p class="!font-['halbfett']">${Drupal.t("Leistung")}</p>
                                <p>${projectsData['service']}</p>
                            </div>
                            <div class="flex flex-col gap-3">
                                <p class="!font-['halbfett']">${Drupal.t("Zeitraum")}</p>
                                <p> ${projectsData['period']}</p>
                            </div>

                        </div>
                    </div>
                    <a href="${projectsData['url']}"
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

}

async function setup() {
  data = await fetchData();
  filteredProjects = filterWithCompany(data);
  toggleClearAllBtn();

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
    filters = {};
    filteredProjects = [...data];

    toggleClearAllBtn();
    toggleClearCurrentBtn();
    checkProjectsToDisable(filteredProjects, groupItems)
    displayData(filteredProjects);
  });

  // remove single filter button
  currentprojectEl.addEventListener('click', (e) => {
    if (!e.target.closest('#curent-projects')) return;

    const type = e.target.dataset.type ? e.target.dataset.type : e.target.closest(".curently-chosen").dataset.type;
    e.target.closest('.curently-chosen').remove(); // remove button
    delete filters[type];

    toggleClearCurrentBtn();
    toggleClearAllBtn();
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
    const textValue = e.target.textContent ? e.target.textContent : e.target.parentElement.textContent;
    const listItem = e.target.dataset.value ? e.target.firstElementChild : e.target;

    if (!!listItem.dataset.disabled) return;

    if (!filters[type]) {
      filters[type] = value;

      createButton(type, textValue); // create button if its type doesn't exist in filter obj
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
  const company = query.get("kunden");
  const services= query.get("leistungen");
  console.log(arr);
  if (company) {
    filters.customer = company.toLowerCase();
    return arr.filter(e => e.customer.toLowerCase() == filters.customer);
  }else if(services){
    filters.services = services.toLowerCase();
    createButton("services", services);
    return arr.filter(e => e.service.toLowerCase() == filters.services);
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
      if (arr2[i].parentElement.dataset.value == filters[key]) {
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
  btnEl.classList.add('curently-chosen', 'px-5', 'py-4', 'flex', 'items-center', 'justify-between', 'gap-9', 'rounded-[50px]', 'border-2', 'bg-mainBlack', 'text-white', 'capitalized', 'border-mainBlack');
  let spanEl = document.createElement('span');
  spanEl.classList.add('text-[15px]', 'leading-[22px]', 'tracking-[0.75px]', 'truncate', 'max-w-[150px]');
  spanEl.textContent = value;
  let imEl = document.createElement('i');
  imEl.classList.add('fa', 'fa-times', 'text-2xl');
  imEl.ariaHidden = 'TRUE';
  btnEl.appendChild(spanEl);
  btnEl.appendChild(imEl);
  currentprojectEl.appendChild(btnEl);
  toggleClearCurrentBtn();
  toggleClearAllBtn();
}

function toggleClearAllBtn() {
  clearProjectsEl.classList.add('hidden');
  if (Object.keys(filters).length) {
    clearProjectsEl.classList.remove('hidden');
  }
}

function toggleClearCurrentBtn() {
  if (Array.from(currentprojectEl.childNodes).length >= 1) {
    currentprojectEl.classList.add('mr-0', 'md:mr-10');
  } else {
    currentprojectEl.classList.remove('mr-0', 'md:mr-10');
  }
}

