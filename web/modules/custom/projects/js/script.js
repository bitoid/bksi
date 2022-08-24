let outputEl = document.querySelector(".output");
let listItemEl = document.querySelectorAll(".list-items");
let dropdownEl = document.querySelectorAll('.project-dropdown');
let parent, children, dropMenu;
let projectsArr = [];
let templateHtml = "";
let ProjectsFiltered = [];
let templateHtmlFiltered = '';
// makes each dropdown clickable and changes menu display mode; 
Array.from(dropdownEl).forEach(item => item.addEventListener('click', (e) => {
    parent = e.currentTarget.parentNode;
    children = parent.childNodes;
    dropMenu = children[children.length - 2];
    dropMenu.classList.toggle('hidden');
}));
// adds click event for each menus
Array.from(listItemEl).forEach(element => {
    // adds click for each of menu items
    Array.from(element.childNodes).forEach(item => item.addEventListener('click', (e) => {
        // for each element in projecst array , check if there property which value  is  equal to filtered option 
        // if so , generate new template for twig
        for (let i = 0; i < projects.length; i++) {
            if (projects[i].hasOwnProperty('title') && projects[i]['title'].toLowerCase() == item.innerText.toLowerCase()) {
                templateHtmlFiltered = `
                    <div class="group md:relative md:overflow-hidden">
                    <a href="/node/${projects[i]['nid']}" class="relative block w-full h-56 md:h-[400px] mb-5 md:mb-0">
                        <div class="relative fade-in-image-container h-full ">
                            <img class="w-full fade-in-image h-full object-cover" src="${projects[i]['image']}" alt="">
                        </div>
                        <span class="absolute right-5 bottom-5 w-10 h-10 rounded-full bg-white flex items-center justify-center md:hidden"><img src="modules/custom/projects/images/arrow-textlinks.svg" alt=""></span>
                        <h4 class="hidden text-2xl absolute bottom-10 left-10 text-white font-semibold group-hover:bottom-[calc(100%-60px)] group-hover:translate-y-1/2 z-10 md:block">${projects[i]['title']}</h4>
                    </a>
                    <div class="opacity-100 flex flex-col gap-4 md:absolute md:translate-y-full md:w-full md:h-full md:bg-darkBlue md:opacity-0 md:top-0 md:text-white md:p-10 md:pt-[125px] md:pl-8 md:gap-8 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                        <h4 class="text-2xl md:hidden">${projects[i]['title']}</h4>
                        <div class="flex items-start gap-4 text-[15px] tracking-[0.75px] leading-[22px] md:gap-10">
                            <div class="flex flex-col gap-5">
                                <span>${projects[i]['title']}</span>
                                <span> ${projects[i]['client']}</span>
                            </div>
                            <div class="flex flex-col gap-5">
                                <span>${projects[i]['title']}</span>
                                <span> ${projects[i]['client']}</span>
                            </div>
                        </div>
                        <a href="/node/${projects[i]['nid']}" class="absolute right-5 bottom-5 w-10 h-10 rounded-full bg-white hidden md:flex items-center justify-center"><img src="modules/custom/projects/images/arrow-textlinks.svg" alt=""></a>
                    </div>     
                </div>
            `;
                // push newly generated html in filtered projects array
                ProjectsFiltered.push(templateHtmlFiltered);
            }
        }
        // clear output element content,after that render newly generated,filtered projects if there are some in filtered projects array 
        // if not , show error 
        outputEl.innerHTML = '';
        if (ProjectsFiltered.length >= 1) {
            for (let i = 0; i < ProjectsFiltered.length; i++) {
                outputEl.innerHTML += ProjectsFiltered[i];
            }
        } else {
            outputEl.innerHTML = 'No Such Result';
        }
        // console.log(ProjectsFiltered.join()) doesnt works. clarify this case  with athers
        // this array always should become empty everytime user clicks on list items, to push into it new html according to filte roption,from main projects array 
        ProjectsFiltered = [];
        // changes menu List display mode to none after filtering
        Array.from(listItemEl).forEach(item => item.classList.add('hidden'));
    }))
});

//fetching data from endpoint
async function fetchProjectsData() {
    const response = await fetch('/bksi/projects/data');
    let fetched = await response.json();
    projects = fetched.data;
}

async function renderNotFilteredData() {
    await fetchProjectsData();
    //creating html template for projects twig file which will be rendered according to some logic
    for (let item in projects) {
        templateHtml = `
        <div class="group md:relative md:overflow-hidden">
            <a href="/node/${projects[item]['nid']}" class="relative block w-full h-56 md:h-[400px] mb-5 md:mb-0">
                <div class="relative fade-in-image-container h-full ">
                    <img class="w-full fade-in-image h-full object-cover" src="${projects[item]['image']}" alt="">
                </div>
                <span class="absolute right-5 bottom-5 w-10 h-10 rounded-full bg-white flex items-center justify-center md:hidden"><img src="modules/custom/projects/images/arrow-textlinks.svg" alt=""></span>
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
                <a href="/node/${projects[item]['nid']}" class="absolute right-5 bottom-5 w-10 h-10 rounded-full bg-white hidden md:flex items-center justify-center"><img src="modules/custom/projects/images/arrow-textlinks.svg" alt=""></a>
            </div>     
        </div>
    `;
        projectsArr.push(templateHtml);
    }

    //renders all of projects if there are less then 8 of them
    //else renders last 8 of them
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
renderNotFilteredData();




