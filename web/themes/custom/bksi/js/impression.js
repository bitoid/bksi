
const previusButton=document.getElementById("prev-button");
const nextButton=document.getElementById("next-button");


const titleDiv=document.getElementById("title");
const imgNum=document.getElementById("title-num");

const imageSlider = document.querySelector('.image_slider')


const titles = Array.from(
    document.getElementsByClassName('title-html')
  );
  
 

let titlesArr=[];

let filter={
    num: 0
}

function impression(){ 

    previusButton.addEventListener('click', filterImgNumber);
    nextButton.addEventListener('click', filterImgNumber);

 getTitleHtml(titles)

 if(titlesArr.length<=1){
    filter.num=0;
 }
 
 displaytitle(titlesArr)
}

if(imageSlider){
    impression();  
}
   
function getTitleHtml(arr){

    for(let item in arr){  
        titlesArr.push(arr[item].innerHTML);
        
    }

}


function filterImgNumber(e){
    let idValue=e.target.closest(".splide__arrow").id; 


    if(idValue=='prev-button'){
        
        filter.num--
    }else{
        filter.num++
    }

    if(filter.num<0){
        filter.num=titlesArr.length-1
    }else if(filter.num>titlesArr.length-1){
        filter.num=0
    }

    displaytitle(titlesArr)

}


function displaytitle(arr){
    
    imgNum.innerHTML=''

    if(arr.length>1){
        imgNum.innerHTML=` <span> ${ filter.num+1 } </span> / <span class="last-image">${ arr.length }</span>`   
    }else{
        titleDiv.classList.remove('md:ml-[77px]')
        titleDiv.classList.add('md:ml-[0]')
    }
    if(arr[filter.num]!=''){
        titleDiv.innerText=arr[filter.num]
    }
}