const themeButton = document.querySelector("#theme-button");
const themeIcon = document.querySelector("#theme-icon");

function getSavedTheme() {
    return localStorage.getItem("barberflow-theme");
}

function saveTheme(theme) {
    localStorage.setItem("barberflow-theme", theme);
}

function isLightMode() {
    return document.body.classList.contains("light-mode");
}

function updateThemeIcon() {
    if (isLightMode()) {
        themeIcon.textContent = "☾";
        themeButton.setAttribute(
            "aria-label",
            "Ativar modo escuro"
        );

        return;
    }

    themeIcon.textContent = "☀";
    themeButton.setAttribute(
        "aria-label",
        "Ativar modo claro"
    );
}

function applySavedTheme() {
    const savedTheme = getSavedTheme();

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
    }

    updateThemeIcon();
}

function toggleTheme() {
    document.body.classList.toggle("light-mode");

    const currentTheme = isLightMode()
        ? "light"
        : "dark";

    saveTheme(currentTheme);
    updateThemeIcon();
}

themeButton.addEventListener("click", toggleTheme);

applySavedTheme();