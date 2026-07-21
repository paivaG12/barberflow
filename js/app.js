function getCurrentBarbershop() {
    return DATABASE.barbershops[0];
}

function updateBarbershopPage() {
    const shop = getCurrentBarbershop();
    const heroTitle = document.getElementById("hero-title");

    if (!heroTitle) {
        return;
    }

    heroTitle.textContent = shop.name;
}

updateBarbershopPage();