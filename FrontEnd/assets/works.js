//Mode edition pour Log In
function editionMode(){
    //Creation de la top section
    const divBody = document.querySelector("body > div");
    const editionModeTopSection = document.createElement("section");
    divBody.before(editionModeTopSection);

    const editionModeTopSectionIcon = document.createElement("img");
    editionModeTopSectionIcon.src = "assets/icons/edition-icon.png";
    editionModeTopSection.appendChild(editionModeTopSectionIcon);

    const editionModeTopSectionP = document.createElement("p");
    editionModeTopSectionP.innerText = "Mode édition";
    editionModeTopSection.appendChild(editionModeTopSectionP);

    const editionModeTopSectionPubButton = document.createElement("button");
    editionModeTopSectionPubButton.innerText = "publier les changements";
    editionModeTopSection.appendChild(editionModeTopSectionPubButton);

    //Creation du bouton pour modifier projets et ouvrir modale

    const portfolioSection = document.querySelector("#portfolio");
    const divTitleModify = document.createElement("div");
    portfolioSection.prepend(divTitleModify);

    const worksTitleH2 = document.querySelector("#portfolio h2");
    divTitleModify.appendChild(worksTitleH2);

    const linkModifyWorks = document.createElement("a");
    linkModifyWorks.href = "#modal";
    worksTitleH2.after(linkModifyWorks);

    const modifyIcon = document.createElement("img");
    modifyIcon.src = "assets/icons/edition-icon-black.png";
    linkModifyWorks.appendChild(modifyIcon);

    const modifyP = document.createElement("p");
    modifyP.innerText = "modifier";
    linkModifyWorks.appendChild(modifyP);
};

//Ajout du lien de deconnexion a la place du lien pour se connecter
function loginLogout(){
    const loginLogoutLink = document.querySelector(".login-logout");
    loginLogoutLink.innerText = "logout";

    loginLogoutLink.addEventListener("click", function(event){
        event.preventDefault();
        window.localStorage.removeItem("loggedUser");
        alert("You will be disconnected");
        window.location.replace("/index.html");
    });
};

//Log In

let userLogged = window.localStorage.getItem("loggedUser");
if(userLogged !== null){
    userLogged = JSON.parse(userLogged);
    editionMode();
    loginLogout();
};

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

//Mise en place des boutons filtres pour les projets

const galleryWorks = document.querySelector(".gallery");
const filtersWorks = document.createElement("div");
filtersWorks.classList.add("filter-buttons");
galleryWorks.before(filtersWorks);

const filterButtonAll = document.createElement("button");
filterButtonAll.innerText = "Tous";
filtersWorks.appendChild(filterButtonAll);
filterButtonAll.className = "active";

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

//Changement de CSS si le filtre est actif

filtersWorks.addEventListener("click", function(button) {
    if (button.target.classList.contains("active")){
        return;
    }
    if (document.querySelector('.filter-buttons button.active') !== null) {
      document.querySelector('.filter-buttons button.active').classList.remove('active');
    }
    button.target.classList.add("active");
  });

//Modale

const modal = document.createElement("aside");
modal.id = "modal";
modal.classList.add("modal");
modal.setAttribute("aria-hidden", "true");
modal.setAttribute("aria-labelledby", "title-modal");

const mainDivModal = document.createElement("div");
mainDivModal.classList.add("modal-wrapper");
modal.appendChild(mainDivModal);