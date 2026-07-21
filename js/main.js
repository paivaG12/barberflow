document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("#header");

    const menuButton = document.querySelector("#menu-button");

    const mobileMenu = document.querySelector("#mobile-menu");

    const mobileMenuLinks = [
        ...document.querySelectorAll("#mobile-menu a")
    ];

    const billingButtons = [
        ...document.querySelectorAll("[data-billing]")
    ];

    const priceValue = document.querySelector("#price-value");

    const pricePeriod = document.querySelector("#price-period");

    const priceDescription = document.querySelector(
        "#price-description"
    );

    const annualSaving = document.querySelector(
        "#annual-saving"
    );

    const pricingButton = document.querySelector(
        "#pricing-button"
    );

    const currentYear = document.querySelector("#current-year");

    const revealElements = [
        ...document.querySelectorAll(".reveal")
    ];

    function updateHeader() {
        header.classList.toggle(
            "scrolled",
            window.scrollY > 20
        );
    }

    function closeMobileMenu() {
        menuButton.classList.remove("active");

        mobileMenu.classList.remove("open");

        document.body.classList.remove("menu-open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.setAttribute(
            "aria-label",
            "Abrir menu"
        );
    }

    function toggleMobileMenu() {
        const opening = !mobileMenu.classList.contains("open");

        menuButton.classList.toggle("active", opening);

        mobileMenu.classList.toggle("open", opening);

        document.body.classList.toggle("menu-open", opening);

        menuButton.setAttribute(
            "aria-expanded",
            String(opening)
        );

        menuButton.setAttribute(
            "aria-label",
            opening ? "Fechar menu" : "Abrir menu"
        );
    }

    function updateBilling(billing) {
        billingButtons.forEach((button) => {
            button.classList.toggle(
                "active",
                button.dataset.billing === billing
            );
        });

        if (billing === "annual") {
            priceValue.textContent = "349,90";
            pricePeriod.textContent = "/ano";

            priceDescription.textContent =
                "Um único pagamento para utilizar o BarberFlow durante 12 meses.";

            annualSaving.hidden = false;

            pricingButton.href =
                "./pages/cadastro.html?plano=anual";

            return;
        }

        priceValue.textContent = "34,90";
        pricePeriod.textContent = "/mês";

        priceDescription.textContent =
            "Cobrado mensalmente. Cancele antes da próxima renovação.";

        annualSaving.hidden = true;

        pricingButton.href =
            "./pages/cadastro.html?plano=mensal";
    }

    function initializeRevealAnimation() {
        if (!("IntersectionObserver" in window)) {
            revealElements.forEach((element) => {
                element.classList.add("visible");
            });

            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach((element) => {
            observer.observe(element);
        });
    }

    menuButton.addEventListener(
        "click",
        toggleMobileMenu
    );

    mobileMenuLinks.forEach((link) => {
        link.addEventListener(
            "click",
            closeMobileMenu
        );
    });

    billingButtons.forEach((button) => {
        button.addEventListener("click", () => {
            updateBilling(button.dataset.billing);
        });
    });

    window.addEventListener("scroll", updateHeader);

    window.addEventListener("resize", () => {
        if (window.innerWidth > 780) {
            closeMobileMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    currentYear.textContent =
        new Date().getFullYear();

    updateHeader();
    updateBilling("monthly");
    initializeRevealAnimation();
});