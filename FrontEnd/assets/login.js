function navCurrentLocationBold(){
    const navItems = document.querySelectorAll("ul li a");
    
    for(let i=0; i < navItems.length; i++){
        if (navItems[i].href === location.href){
            navItems[i].className = "active";
        }
    };
};

navCurrentLocationBold();

//Recuperation des informations de connexion
async function logIn(){
    const userEmail = document.querySelector("#email").value;
    const userPassword = document.querySelector("#password").value;

    const user = {
        email: userEmail,
        password: userPassword
    };

    const userJSON = JSON.stringify(user);

    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: userJSON
      });

    const result = await response.json();

    if(result.message === "user not found"){
        alert(result.message);
        return;
    }else if(result.error){
        alert("wrong password");
        return;
    }else{
        const userLogged = JSON.stringify(result);
        window.localStorage.setItem("loggedUser", userLogged);
        window.location.replace("/index.html");
    }
};

const formLogIn = document.querySelector("#login form");
formLogIn.addEventListener("submit", function(event){
    event.preventDefault();
    logIn();
});
