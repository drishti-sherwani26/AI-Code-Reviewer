const menuButton =
    document.getElementById("menuButton");

const navLinks =
    document.querySelector(".nav-links");

const navRight =
    document.querySelector(".nav-right");


menuButton.addEventListener("click", function () {

    if (navLinks.style.display === "flex") {

        navLinks.style.display = "none";

        navRight.style.display = "none";

    }

    else {

        navLinks.style.display = "flex";

        navRight.style.display = "flex";

        navLinks.style.position = "absolute";

        navLinks.style.top = "70px";

        navLinks.style.left = "0";

        navLinks.style.width = "100%";

        navLinks.style.padding = "25px";

        navLinks.style.background = "#16213A";

        navLinks.style.flexDirection = "column";

        navLinks.style.alignItems = "center";


        navRight.style.position = "absolute";

        navRight.style.top = "300px";

        navRight.style.left = "0";

        navRight.style.width = "100%";

        navRight.style.padding = "20px";

        navRight.style.background = "#16213A";

        navRight.style.justifyContent = "center";

    }

});