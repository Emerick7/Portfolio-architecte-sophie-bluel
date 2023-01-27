
//Recuperation des projets depuis l'API et stockage dans la localStorage

let works = window.localStorage.getItem("works");
if (works === null){
    const answer = await fetch("http://localhost:5678/api/works")
    works = await answer.json();
    const worksJSON = JSON.stringify(works);
    window.localStorage.setItem("works", worksJSON);
}else{
    works = JSON.parse(works);
};

//Affichage des projets sur la page

async function generateWorks(works){
    for(let i=0; i < works.length; i++){
        const galleryWorks = document.querySelector(".gallery");
        const figureWorks = document.createElement("figure");
        figureWorks.dataset.id = works[i].id;

        const imgWork = document.createElement("img");
        imgWork.src = works[i].imageUrl;
        imgWork.alt = works[i].title;
        imgWork.setAttribute("crossorigin", "anonymous");

        const titleWork = document.createElement("figcaption");
        titleWork.innerText = works[i].title;
        
        figureWorks.appendChild(imgWork);
        figureWorks.appendChild(titleWork);
        galleryWorks.appendChild(figureWorks);
    };
};

generateWorks(works);

//MIse en place des boutons filtres pour les projets

const worksSectionH2 = document.querySelector("#portfolio h2");
const filtersWorks = document.createElement("div");
worksSectionH2.after(filtersWorks);

const filterButtonAll = document.createElement("button");
filterButtonAll.innerText = "Tous";
filtersWorks.appendChild(filterButtonAll);

filterButtonAll.addEventListener("click", function(){
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(works);
});

let categories = window.localStorage.getItem("categories");
if (categories === null){
    const answer = await fetch("http://localhost:5678/api/categories")
    categories = await answer.json();
    const categoriesJSON = JSON.stringify(categories);
    window.localStorage.setItem("categories", categoriesJSON);
}else{
    categories = JSON.parse(categories);
};

for(let i=0; i < categories.length; i++){
    const filterButton = document.createElement("button");
    filterButton.innerText = categories[i].name;
    filtersWorks.appendChild(filterButton);

    filterButton.addEventListener("click", function(){
        const filteredWorks = works.filter(function(work){
            return work.category.name === categories[i].name;
        });
        document.querySelector(".gallery").innerHTML = "";
        generateWorks(filteredWorks);
    });
};