//Log In

let userLogged = window.sessionStorage.getItem("loggedUser");
if(userLogged !== null){
    userLogged = JSON.parse(userLogged);
    editionMode();
    loginLogout();
};

//Recuperation des projets depuis l'API et stockage dans la sessionStorage

let works = window.sessionStorage.getItem("works");
if (works === null){
    const answer = await fetch("http://localhost:5678/api/works")
    works = await answer.json();
    const worksJSON = JSON.stringify(works);
    window.sessionStorage.setItem("works", worksJSON);
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

let categories = window.sessionStorage.getItem("categories");
if (categories === null){
    const answer = await fetch("http://localhost:5678/api/categories")
    categories = await answer.json();
    const categoriesJSON = JSON.stringify(categories);
    window.sessionStorage.setItem("categories", categoriesJSON);
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

//Creation de la modale
const main = document.querySelector("main");

const modal = document.createElement("aside");
modal.id = "modal";
modal.classList.add("modal");
modal.style.display = "none";
modal.setAttribute("aria-hidden", "true");
modal.setAttribute("aria-labelledby", "title-modal");
main.appendChild(modal);

const mainDivModal = document.createElement("div");
mainDivModal.classList.add("modal-wrapper");
modal.appendChild(mainDivModal);

const closeButtonDiv = document.createElement("div");
const closeModal = document.createElement("button");
closeModal.id = "close-modal-button";
const closeModalImg = document.createElement("img");
closeModalImg.src = "assets/icons/close-icon.png";
closeModal.appendChild(closeModalImg);
closeButtonDiv.appendChild(closeModal);
mainDivModal.appendChild(closeButtonDiv);

const goBackModal = document.createElement("button");
goBackModal.id = "go-back-modal-button";
const goBackModalImg = document.createElement("img");
goBackModalImg.src = "assets/icons/back-arrow-icon.png";
goBackModal.appendChild(goBackModalImg);
closeButtonDiv.prepend(goBackModal);

const divMainContent = document.createElement("div");
mainDivModal.appendChild(divMainContent);

const divGrid = document.createElement("div");

function generateModalContent(){
    goBackModal.style.display = "none";
    closeButtonDiv.style.justifyContent = "end";

    const titleModalGallery = document.createElement("h3");
    titleModalGallery.innerText = "Galerie photo";
    divMainContent.appendChild(titleModalGallery);

    divGrid.classList.add("gallery-modal");
    divMainContent.appendChild(divGrid);
    document.querySelector(".gallery-modal").innerHTML = "";
    generateWorksModal();

    const hrSeperator = document.createElement("hr");
    divMainContent.appendChild(hrSeperator);

    const addWorkGallery = document.createElement("button");
    addWorkGallery.innerText = "Ajouter une photo";
    divMainContent.appendChild(addWorkGallery);

    addWorkGallery.addEventListener("click", function(){
        divMainContent.innerText = "";
        generateAddWorkModalContent();
    })

    const deleteGallery = document.createElement("a");
    deleteGallery.innerText = "Supprimer la galerie";
    divMainContent.appendChild(deleteGallery);
};

function generateAddWorkModalContent(){
    goBackModal.style.display = "";
    closeButtonDiv.style.justifyContent = "space-between";

    goBackModal.addEventListener("click", function(){
        divMainContent.innerText = "";
        generateModalContent();
        goBackModal.removeEventListener("click");
    });

    const titleAddWorkModal = document.createElement("h3");
    titleAddWorkModal.innerText = "Ajout photo";
    divMainContent.appendChild(titleAddWorkModal);

    const formAddWork = document.createElement("form");
    formAddWork.id = "form-add-work";
    divMainContent.appendChild(formAddWork);

    const divAddPhoto = document.createElement("div");
    formAddWork.appendChild(divAddPhoto);

    const divAddPhotoImg = document.createElement("img");
    divAddPhotoImg.src = "assets/icons/image-icon.png";
    divAddPhoto.appendChild(divAddPhotoImg);

    const divAddPhotoButton = document.createElement("button");
    divAddPhotoButton.innerText = "+ Ajouter photo";
    divAddPhotoButton.addEventListener("click", function(event){
        event.preventDefault();
        divAddPhotoInput.click();
    });
    divAddPhoto.appendChild(divAddPhotoButton);

    const divAddPhotoInput = document.createElement("input");
    divAddPhotoInput.type = "file";
    divAddPhotoInput.id = "select-photo";
    divAddPhotoInput.name = "select-photo";
    divAddPhotoInput.setAttribute("accept", "image/png, image/jpeg");
    divAddPhotoInput.style.display = "none";
    divAddPhoto.appendChild(divAddPhotoInput);

    const divAddPhotoP = document.createElement("p");
    divAddPhotoP.innerText = "jpg, png : 4mo max";
    divAddPhoto.appendChild(divAddPhotoP);

    //ajout new FileReader pour apercu de l'image du nouveau projet

    divAddPhotoInput.addEventListener("change", function(){
        const fileExtension = /\.(jpg|png)$/i;
        if(this.files.length === 0 || !fileExtension.test(this.files[0].name)){
            return
        }

        divAddPhoto.innerHTML = "";

        const file = this.files[0];
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.addEventListener("load", (e) => displayImage(e, file));
    });

    function displayImage(e, file){
        const figureElement = document.createElement("figure");
        figureElement.id = "selected-image";

        const image = document.createElement("img");
        const imageBlob = new Blob([e.target.result], {type: file.type});
        image.src = URL.createObjectURL(imageBlob);
        image.style.height = "160px";
        figureElement.style.height = "160px";
        divAddPhoto.style.justifyContent = "center";

        figureElement.appendChild(image);
        divAddPhoto.appendChild(figureElement);
    };

    const labelTitleInput = document.createElement("label");
    labelTitleInput.setAttribute("for", "title-input");
    labelTitleInput.innerText = "Titre";
    formAddWork.appendChild(labelTitleInput);

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "title-input";
    titleInput.name = "title-input";
    formAddWork.appendChild(titleInput);

    const labelCategory = document.createElement("label");
    labelCategory.setAttribute("for", "category-select");
    labelCategory.innerText = "Catégorie";
    formAddWork.appendChild(labelCategory);

    const categorySelect = document.createElement("select");
    categorySelect.id = "category-select";
    categorySelect.name = "category-select";
    formAddWork.appendChild(categorySelect);

    const emptyOptionSelectCategory = document.createElement("option");
    emptyOptionSelectCategory.style.display = "none";
    categorySelect.appendChild(emptyOptionSelectCategory);

    for(let i=0; i < categories.length; i++){
        const optionSelectCategory = document.createElement("option");
        optionSelectCategory.innerText = categories[i].name;
        optionSelectCategory.value = categories[i].id;
        categorySelect.appendChild(optionSelectCategory);
    };

    const hrSeperator = document.createElement("hr");
    formAddWork.appendChild(hrSeperator);

    const submitFormAddWork = document.createElement("input");
    submitFormAddWork.type = "submit";
    submitFormAddWork.value = "Valider";
    formAddWork.appendChild(submitFormAddWork);

    const newWorkPhoto = document.querySelector("#select-photo");
    const newWorkTitle = document.querySelector("#title-input");
    const newWorkCategory = document.querySelector("#category-select");
    
    async function addWork(){
        const newWorkPhotoFile = newWorkPhoto.files[0];
        const newWorkTitleValue = newWorkTitle.value;
        const newWorkCategoryValue = newWorkCategory.value;

        let formData = new FormData();

        formData.append("image", newWorkPhotoFile, newWorkPhotoFile.name);
        formData.append("title", newWorkTitleValue);
        formData.append("category", newWorkCategoryValue);

        return fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${userLogged.token}`,
        },
        body: formData
        }).then(response => response.json());

        //Meme requete via XMLHttpRequest

        /*let request = new XMLHttpRequest();
        request.open("POST", "http://localhost:5678/api/works");
        request.setRequestHeader("Content-Type", "multipart/form-data");
        request.setRequestHeader("Authorization", `Bearer ${userLogged.token}`);
        request.send(formData);*/
    };

    if (newWorkPhoto.files[0] && newWorkTitle.value && newWorkCategory.value){
        submitFormAddWork.style.backgroundColor = "#1D6154";
    };

    formAddWork.addEventListener("submit", async function(event){
        event.preventDefault();
        if (newWorkPhoto.files[0] && newWorkTitle.value && newWorkCategory.value){
            await addWork();
            await refreshWorks();
            divMainContent.innerText = "";
            generateAddWorkModalContent();
            alert("Your work has been succesfully added");
            document.querySelector(".gallery").innerHTML = "";
            generateWorks(works);
            document.querySelector(".gallery-modal").innerHTML = "";
            generateWorksModal(works);
        }else{
            alert("All the fields should be filled");
            return;
        };
    });
};

async function refreshWorks(){
    const answer = await fetch("http://localhost:5678/api/works")
    works = await answer.json();
    const worksJSON = JSON.stringify(works);
    window.sessionStorage.setItem("works", worksJSON);
};

function generateWorksModal(){
    for(let i=0; i < works.length; i++){
        const figureWorks = document.createElement("figure");
        figureWorks.dataset.id = works[i].id;

        const imgWork = document.createElement("img");
        imgWork.src = works[i].imageUrl;
        imgWork.alt = works[i].title;
        imgWork.setAttribute("crossorigin", "anonymous");

        const titleWork = document.createElement("figcaption");
        titleWork.innerText = "éditer";

        const deleteWorkButton = document.createElement("button");
        const imgDeleteButton = document.createElement("img");
        imgDeleteButton.src = "assets/icons/trash-icon.png";

        deleteWorkButton.appendChild(imgDeleteButton);
        figureWorks.appendChild(deleteWorkButton);
        figureWorks.appendChild(imgWork);
        figureWorks.appendChild(titleWork);
        divGrid.appendChild(figureWorks);

        deleteWorkButton.addEventListener("click", async function(){
            const deleteWork = await fetch(`http://localhost:5678/api/works/${works[i].id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${userLogged.token}`,
                }
            });
            await refreshWorks();
            document.querySelector(".gallery").innerHTML = "";
            generateWorks(works);
            document.querySelector(".gallery-modal").innerHTML = "";
            generateWorksModal();
        })
    };
};

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

    //Creation du bouton pour modifier projets et ouvrir/fermer modale

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

    let openedModal = null;

    linkModifyWorks.addEventListener("click", function(event){
        event.preventDefault();
        modal.style.display = null;
        modal.setAttribute("aria-hidden", "false");
        generateModalContent();
        openedModal = modal;
        openedModal.addEventListener("click", closeModalFunction);
        openedModal.querySelector("#close-modal-button").addEventListener("click", closeModalFunction);
        openedModal.querySelector(".modal-wrapper").addEventListener("click", function(event){
            event.stopPropagation();
        });
    });

    const closeModalFunction = function(event){
        if (openedModal === null) return;
        event.preventDefault();
        window.setTimeout(function(){
            openedModal.style.display = "none";
            openedModal = null;
        }, 500);
        openedModal.setAttribute("aria-hidden", "true");
        openedModal.removeEventListener("click", closeModalFunction);
        openedModal.querySelector("#close-modal-button").removeEventListener("click", closeModalFunction);
        openedModal.querySelector(".modal-wrapper").removeEventListener("click", function(event){
            event.stopPropagation();
        });
        divMainContent.innerText = "";
    };

    window.addEventListener("keydown", function(event){
        if (event.key === "Escape" || event.key === "Esc"){
            closeModalFunction(event);
        };
    });
};

//Ajout du lien de deconnexion a la place du lien pour se connecter
function loginLogout(){
    const loginLogoutLink = document.querySelector(".login-logout");
    loginLogoutLink.innerText = "logout";

    loginLogoutLink.addEventListener("click", function(event){
        event.preventDefault();
        window.sessionStorage.removeItem("loggedUser");
        alert("You will be disconnected");
        window.location.replace("/index.html");
    });
};