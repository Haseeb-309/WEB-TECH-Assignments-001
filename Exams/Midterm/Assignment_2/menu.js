
function toggleMegaMenu() {
    const menu = document.getElementById("megaMenu");

    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}


document.addEventListener("click", function (event) {
    const menu = document.getElementById("megaMenu");
    const button = document.getElementById("menuToggle");

    if (!menu.contains(event.target) && event.target !== button) {
        menu.style.display = "none";
    }
});
