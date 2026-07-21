const themeButton = document.getElementById("theme-button");
const themeIcon = document.getElementById("theme-icon");

function isLightMode() {
    return document.body.classList.contains("light-mode");
}

function updateThemeButton() {
    if (isLightMode()) {
        themeIcon.textContent = "☾";
        themeButton.setAttribute("aria-label", "Ativar modo escuro");
    } else {
        themeIcon.textContent = "☀";
        themeButton.setAttribute("aria-label", "Ativar modo claro");
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem("barberflow-theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
    } else {
        document.body.classList.remove("light-mode");
    }

    updateThemeButton();
}

function changeTheme() {
    document.body.classList.toggle("light-mode");

    const selectedTheme = isLightMode() ? "light" : "dark";

    localStorage.setItem("barberflow-theme", selectedTheme);

    updateThemeButton();
}

if (themeButton && themeIcon) {
    themeButton.addEventListener("click", changeTheme);
    loadTheme();
} else {
    console.error("Botão de tema não encontrado no HTML.");
}