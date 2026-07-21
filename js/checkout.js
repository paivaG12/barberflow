document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;

    const pendingRegistration = getStorage(
        "barberflowPendingRegistration"
    );

    const activeRegistration = getStorage(
        "barberflowActiveRegistration"
    );

    const data =
        page === "dashboard"
            ? activeRegistration
            : pendingRegistration;

    function getStorage(key) {
        try {
            const value = localStorage.getItem(key);

            return value ? JSON.parse(value) : null;
        } catch (error) {
            return null;
        }
    }

    function setStorage(key, value) {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );
    }

    function formatCurrency(value) {
        return Number(value).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function getInitials(name = "") {
        const words = name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2);

        if (!words.length) {
            return "BF";
        }

        return words
            .map((word) => word[0].toUpperCase())
            .join("");
    }

    function redirectWithoutRegistration() {
        if (!data) {
            window.location.href = "./cadastro.html";

            return true;
        }

        return false;
    }

    function getPlanInformation(registration) {
        const billing =
            registration.subscription?.billing || "monthly";

        const annual = billing === "annual";

        return {
            billing,
            name: annual
                ? "Plano anual"
                : "Plano mensal",

            renewal: annual
                ? "Acesso por 12 meses"
                : "Renovação mensal",

            price: annual ? 349.9 : 34.9
        };
    }

    function renderLogo(container, registration) {
        if (!container) {
            return;
        }

        const logo =
            registration.barbershop?.images?.logo;

        const name =
            registration.barbershop?.name || "";

        if (logo) {
            container.innerHTML = `
                <img
                    src="${logo}"
                    alt="Logo de ${name}"
                >
            `;

            return;
        }

        container.textContent = getInitials(name);
    }

    function initializeSummary() {
        if (redirectWithoutRegistration()) {
            return;
        }

        const shop = data.barbershop;
        const plan = getPlanInformation(data);

        document.querySelector(
            "#summary-shop-name"
        ).textContent = shop.name;

        document.querySelector(
            "#summary-business-name"
        ).textContent = shop.name;

        document.querySelector(
            "#summary-location"
        ).textContent = `${shop.city} - ${shop.state}`;

        document.querySelector(
            "#summary-link"
        ).textContent = `barberflow.com/${shop.slug}`;

        document.querySelector(
            "#summary-description"
        ).textContent = shop.description;

        renderLogo(
            document.querySelector("#summary-logo"),
            data
        );

        const services = shop.services || [];

        document.querySelector(
            "#services-count"
        ).textContent =
            `${services.length} ${
                services.length === 1
                    ? "serviço"
                    : "serviços"
            }`;

        const servicesContainer = document.querySelector(
            "#summary-services"
        );

        servicesContainer.innerHTML = services
            .map(
                (service) => `
                    <div class="summary-list-item">
                        <div>
                            <strong>${service.name}</strong>

                            <small>
                                ${service.duration} minutos
                            </small>
                        </div>

                        <span>
                            ${formatCurrency(service.price)}
                        </span>
                    </div>
                `
            )
            .join("");

        const professionals =
            shop.professionals || [];

        document.querySelector(
            "#professionals-count"
        ).textContent =
            `${professionals.length} ${
                professionals.length === 1
                    ? "profissional"
                    : "profissionais"
            }`;

        const professionalsContainer =
            document.querySelector(
                "#summary-professionals"
            );

        professionalsContainer.innerHTML =
            professionals
                .map(
                    (professional) => `
                        <div class="summary-list-item">
                            <div>
                                <strong>
                                    ${professional.name}
                                </strong>

                                <small>
                                    ${professional.specialty}
                                </small>
                            </div>

                            <span>
                                ${getInitials(professional.name)}
                            </span>
                        </div>
                    `
                )
                .join("");

        const daysNames = {
            monday: "Segunda",
            tuesday: "Terça",
            wednesday: "Quarta",
            thursday: "Quinta",
            friday: "Sexta",
            saturday: "Sábado",
            sunday: "Domingo"
        };

        const activeSchedule =
            (shop.schedule || []).filter(
                (schedule) => schedule.active
            );

        document.querySelector(
            "#summary-schedule"
        ).innerHTML = activeSchedule
            .map(
                (schedule) => `
                    <div class="schedule-summary-item">
                        <strong>
                            ${daysNames[schedule.day]}
                        </strong>

                        <span>
                            ${schedule.opening} às
                            ${schedule.closing}
                        </span>
                    </div>
                `
            )
            .join("");

        document.querySelector(
            "#order-plan-name"
        ).textContent = plan.name;

        document.querySelector(
            "#order-renewal"
        ).textContent = plan.renewal;

        document.querySelector(
            "#order-price"
        ).textContent = formatCurrency(plan.price);

        document.querySelector(
            "#order-total"
        ).textContent = formatCurrency(plan.price);

        document.querySelector(
            "#continue-payment-button"
        ).addEventListener("click", () => {
            window.location.href = "./pagamento.html";
        });
    }

    function initializePayment() {
        if (redirectWithoutRegistration()) {
            return;
        }

        const plan = getPlanInformation(data);

        document.querySelector(
            "#payment-business-name"
        ).textContent = data.barbershop.name;

        document.querySelector(
            "#payment-plan-name"
        ).textContent = plan.name;

        document.querySelector(
            "#payment-renewal"
        ).textContent = plan.renewal;

        document.querySelector(
            "#payment-price"
        ).textContent = formatCurrency(plan.price);

        document.querySelector(
            "#payment-total"
        ).textContent = formatCurrency(plan.price);

        const methodButtons = [
            ...document.querySelectorAll(
                "[data-payment-method]"
            )
        ];

        const paymentPanels = [
            ...document.querySelectorAll(
                "[data-payment-panel]"
            )
        ];

        methodButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const method =
                    button.dataset.paymentMethod;

                methodButtons.forEach((item) => {
                    item.classList.toggle(
                        "active",
                        item === button
                    );
                });

                paymentPanels.forEach((panel) => {
                    panel.classList.toggle(
                        "active",
                        panel.dataset.paymentPanel === method
                    );
                });
            });
        });

        const cardNumber =
            document.querySelector("#card-number");

        const cardExpiration =
            document.querySelector("#card-expiration");

        cardNumber?.addEventListener("input", () => {
            cardNumber.value = cardNumber.value
                .replace(/\D/g, "")
                .slice(0, 16)
                .replace(/(\d{4})(?=\d)/g, "$1 ");
        });

        cardExpiration?.addEventListener("input", () => {
            let value = cardExpiration.value
                .replace(/\D/g, "")
                .slice(0, 4);

            if (value.length > 2) {
                value =
                    `${value.slice(0, 2)}/${value.slice(2)}`;
            }

            cardExpiration.value = value;
        });

        document.querySelector(
            "#copy-pix-button"
        )?.addEventListener("click", (event) => {
            navigator.clipboard?.writeText(
                "BARBERFLOW-PAGAMENTO-SIMULADO"
            );

            event.currentTarget.textContent =
                "Código copiado";
        });

        document.querySelector(
            "#finish-payment-button"
        ).addEventListener("click", () => {
            const activeMethod =
                document.querySelector(
                    "[data-payment-method].active"
                )?.dataset.paymentMethod;

            if (activeMethod === "card") {
                const name =
                    document.querySelector("#card-name")
                        .value.trim();

                const number =
                    document.querySelector("#card-number")
                        .value.replace(/\D/g, "");

                const expiration =
                    document.querySelector(
                        "#card-expiration"
                    ).value.trim();

                const cvv =
                    document.querySelector("#card-cvv")
                        .value.trim();

                if (
                    !name ||
                    number.length < 16 ||
                    expiration.length < 5 ||
                    cvv.length < 3
                ) {
                    alert(
                        "Preencha corretamente os dados do cartão."
                    );

                    return;
                }
            }

            document.querySelector(
                "#payment-modal"
            ).classList.add("open");

            const payment = {
                status: "approved",
                method: activeMethod,
                approvedAt: new Date().toISOString()
            };

            data.payment = payment;

            setStorage(
                "barberflowPendingRegistration",
                data
            );

            setTimeout(() => {
                window.location.href = "./criando.html";
            }, 2200);
        });
    }

    function initializeCreating() {
        if (redirectWithoutRegistration()) {
            return;
        }

        if (data.payment?.status !== "approved") {
            window.location.href = "./pagamento.html";
            return;
        }

        const progressFill = document.querySelector(
            "#creation-progress-fill"
        );

        const progressNumber = document.querySelector(
            "#creation-progress-number"
        );

        const creationSteps = [
            ...document.querySelectorAll(
                "[data-creation-step]"
            )
        ];

        const progressValues = [20, 45, 72, 100];

        let currentIndex = 0;

        function runStep() {
            creationSteps.forEach((step, index) => {
                step.classList.toggle(
                    "active",
                    index === currentIndex
                );

                step.classList.toggle(
                    "completed",
                    index < currentIndex
                );
            });

            const progress =
                progressValues[currentIndex];

            progressFill.style.width = `${progress}%`;
            progressNumber.textContent = `${progress}%`;

            if (currentIndex < creationSteps.length - 1) {
                currentIndex += 1;

                setTimeout(runStep, 1050);

                return;
            }

            setTimeout(() => {
                creationSteps.forEach((step) => {
                    step.classList.remove("active");
                    step.classList.add("completed");
                });

                const activatedData = {
                    ...data,
                    status: "active",
                    activatedAt: new Date().toISOString()
                };

                setStorage(
                    "barberflowActiveRegistration",
                    activatedData
                );

                setStorage(
                    `barberflowBarbershop:${data.barbershop.slug}`,
                    data.barbershop
                );

                localStorage.removeItem(
                    "barberflowPendingRegistration"
                );

                window.location.href = "./painel.html";
            }, 1200);
        }

        runStep();
    }

    function initializeDashboard() {
        if (!activeRegistration) {
            window.location.href = "./cadastro.html";
            return;
        }

        const shop = data.barbershop;
        const owner = data.owner;
        const plan = getPlanInformation(data);

        document.querySelector(
            "#dashboard-greeting"
        ).textContent =
            `Bem-vindo, ${owner.name.split(" ")[0]}!`;

        document.querySelector(
            "#dashboard-business-name"
        ).textContent =
            `${shop.name} está pronta!`;

        document.querySelector(
            "#dashboard-user"
        ).textContent = getInitials(owner.name);

        document.querySelector(
            "#dashboard-plan"
        ).textContent =
            `BarberFlow ${
                plan.billing === "annual"
                    ? "anual"
                    : "mensal"
            }`;

        const publicLink =
            `barberflow.com/${shop.slug}`;

        document.querySelector(
            "#dashboard-public-link"
        ).textContent = publicLink;

        const publicPageUrl =
            `./barbearia.html?barbearia=${encodeURIComponent(
                shop.slug
            )}`;

        document.querySelector(
            "#open-public-page"
        ).href = publicPageUrl;

        document.querySelector(
            "#dashboard-services-count"
        ).textContent =
            shop.services?.length || 0;

        document.querySelector(
            "#dashboard-team-count"
        ).textContent =
            shop.professionals?.length || 0;

        renderLogo(
            document.querySelector("#dashboard-logo"),
            data
        );

        document.querySelector(
            "#copy-public-link"
        ).addEventListener("click", (event) => {
            navigator.clipboard?.writeText(publicLink);

            event.currentTarget.textContent = "Copiado";

            setTimeout(() => {
                event.currentTarget.textContent =
                    "Copiar link";
            }, 1800);
        });
    }

    const initializers = {
        summary: initializeSummary,
        payment: initializePayment,
        creating: initializeCreating,
        dashboard: initializeDashboard
    };

    initializers[page]?.();
});