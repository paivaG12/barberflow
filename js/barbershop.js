function getBarbershopSlug() {
    const params = new URLSearchParams(window.location.search);

    return params.get("barbearia") || "jl-barbearia";
}

function getCurrentBarbershop() {
    const slug = getBarbershopSlug();

    return DATABASE.barbershops.find(
        (barbershop) => barbershop.slug === slug
    );
}

function updateBarbershopPage() {
    const shop = getCurrentBarbershop();

    if (!shop) {
        document.body.innerHTML = `
            <main style="
                min-height: 100vh;
                display: grid;
                place-items: center;
                padding: 30px;
                text-align: center;
            ">
                <div>
                    <h1>Barbearia não encontrada</h1>

                    <p style="margin-top: 12px;">
                        Verifique se o link está correto.
                    </p>

                    <a
                        href="../index.html"
                        style="
                            display: inline-block;
                            margin-top: 24px;
                            padding: 14px 22px;
                            border-radius: 999px;
                            background: #f5b942;
                            color: #111111;
                            font-weight: 700;
                        "
                    >
                        Voltar ao BarberFlow
                    </a>
                </div>
            </main>
        `;

        return;
    }

    const heroTitle = document.getElementById("hero-title");

    if (heroTitle) {
        heroTitle.textContent = shop.name;
    }

    document.title = `${shop.name} | BarberFlow`;
}

updateBarbershopPage();