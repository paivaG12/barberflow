document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#register-form");
    const steps = [...document.querySelectorAll(".form-step")];

    const backButton = document.querySelector("#back-button");
    const nextButton = document.querySelector("#next-button");
    const finishButton = document.querySelector("#finish-button");

    const progressStep = document.querySelector("#progress-step");
    const progressTitle = document.querySelector("#progress-title");
    const progressFill = document.querySelector("#progress-fill");

    const servicesList = document.querySelector("#services-list");
    const professionalsList = document.querySelector("#professionals-list");
    const scheduleList = document.querySelector("#schedule-list");

    const addServiceButton = document.querySelector(
        "#add-service-button"
    );

    const addProfessionalButton = document.querySelector(
        "#add-professional-button"
    );

    const barbershopNameInput = document.querySelector(
        "#barbershop-name"
    );

    const slugInput = document.querySelector("#barbershop-slug");
    const slugStatus = document.querySelector("#slug-status");

    const descriptionInput = document.querySelector(
        "#barbershop-description"
    );

    const descriptionCounter = document.querySelector(
        "#description-counter"
    );

    const professionalSetup = document.querySelector(
        "#professional-setup"
    );

    const termsInput = document.querySelector("#terms");
    const termsError = document.querySelector("#terms-error");

    const summaryPlan = document.querySelector("#summary-plan");
    const summarySetup = document.querySelector("#summary-setup");
    const summaryTotal = document.querySelector("#summary-total");

    const successModal = document.querySelector("#success-modal");
    const createdLinkText = document.querySelector(
        "#created-link-text"
    );

    const openCreatedPage = document.querySelector(
        "#open-created-page"
    );

    const customColorInput = document.querySelector("#custom-color");
    const customColorValue = document.querySelector(
        "#custom-color-value"
    );

    let currentStep = 1;
    let serviceCount = 0;
    let professionalCount = 0;
    let slugWasEdited = false;

    const days = [
        { key: "monday", label: "Segunda-feira", active: true },
        { key: "tuesday", label: "Terça-feira", active: true },
        { key: "wednesday", label: "Quarta-feira", active: true },
        { key: "thursday", label: "Quinta-feira", active: true },
        { key: "friday", label: "Sexta-feira", active: true },
        { key: "saturday", label: "Sábado", active: true },
        { key: "sunday", label: "Domingo", active: false }
    ];

    function updateStep() {
        steps.forEach((step) => {
            const stepNumber = Number(step.dataset.step);

            step.classList.toggle(
                "active",
                stepNumber === currentStep
            );
        });

        const activeStep = steps.find(
            (step) => Number(step.dataset.step) === currentStep
        );

        progressStep.textContent =
            `Etapa ${currentStep} de ${steps.length}`;

        progressTitle.textContent =
            activeStep?.dataset.title || "";

        progressFill.style.width =
            `${(currentStep / steps.length) * 100}%`;

        backButton.disabled = currentStep === 1;

        nextButton.hidden = currentStep === steps.length;
        finishButton.hidden = currentStep !== steps.length;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function showFieldError(field, message) {
        const group = field.closest(".form-group");

        if (!group) {
            return;
        }

        group.classList.add("invalid");

        const errorElement = group.querySelector(".field-error");

        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function clearFieldError(field) {
        const group = field.closest(".form-group");

        if (!group) {
            return;
        }

        group.classList.remove("invalid");

        const errorElement = group.querySelector(".field-error");

        if (errorElement) {
            errorElement.textContent = "";
        }
    }

    function validateStandardFields(step) {
        const requiredFields = [
            ...step.querySelectorAll("[required]")
        ].filter((field) => {
            return field.type !== "checkbox";
        });

        let isValid = true;

        requiredFields.forEach((field) => {
            clearFieldError(field);

            const value = field.value.trim();

            if (!value) {
                showFieldError(field, "Preencha este campo.");
                isValid = false;
                return;
            }

            if (
                field.type === "email" &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ) {
                showFieldError(field, "Digite um e-mail válido.");
                isValid = false;
                return;
            }

            if (
                field.id === "owner-password" &&
                value.length < 6
            ) {
                showFieldError(
                    field,
                    "A senha deve ter pelo menos 6 caracteres."
                );

                isValid = false;
            }
        });

        return isValid;
    }

    function validateServices() {
        const serviceCards = [
            ...servicesList.querySelectorAll(".service-card")
        ];

        const servicesError = document.querySelector(
            "#services-error"
        );

        if (serviceCards.length === 0) {
            servicesError.textContent =
                "Adicione pelo menos um serviço.";

            return false;
        }

        const hasEmptyField = serviceCards.some((card) => {
            const requiredInputs = [
                ...card.querySelectorAll("[required]")
            ];

            return requiredInputs.some(
                (input) => !input.value.trim()
            );
        });

        if (hasEmptyField) {
            servicesError.textContent =
                "Preencha todas as informações dos serviços.";

            return false;
        }

        servicesError.textContent = "";
        return true;
    }

    function validateProfessionals() {
        const professionalCards = [
            ...professionalsList.querySelectorAll(
                ".professional-card"
            )
        ];

        const professionalsError = document.querySelector(
            "#professionals-error"
        );

        if (professionalCards.length === 0) {
            professionalsError.textContent =
                "Adicione pelo menos um profissional.";

            return false;
        }

        const hasEmptyField = professionalCards.some((card) => {
            const requiredInputs = [
                ...card.querySelectorAll("[required]")
            ];

            return requiredInputs.some(
                (input) => !input.value.trim()
            );
        });

        if (hasEmptyField) {
            professionalsError.textContent =
                "Preencha os dados dos profissionais.";

            return false;
        }

        professionalsError.textContent = "";
        return true;
    }

    function validateSchedule() {
        const activeDays = [
            ...scheduleList.querySelectorAll(
                ".schedule-day-checkbox:checked"
            )
        ];

        const scheduleError = document.querySelector(
            "#schedule-error"
        );

        if (activeDays.length === 0) {
            scheduleError.textContent =
                "Selecione pelo menos um dia de funcionamento.";

            return false;
        }

        scheduleError.textContent = "";
        return true;
    }

    function validateSlug() {
        const value = slugInput.value.trim();

        const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

        if (!value) {
            slugStatus.textContent = "Escolha um link.";
            slugStatus.classList.add("unavailable");
            return false;
        }

        if (!slugPattern.test(value)) {
            slugStatus.textContent =
                "Use somente letras, números e hífens.";

            slugStatus.classList.add("unavailable");
            return false;
        }

        slugStatus.textContent = "Link disponível";
        slugStatus.classList.remove("unavailable");

        return true;
    }

    function validateCurrentStep() {
        const activeStep = steps.find(
            (step) => Number(step.dataset.step) === currentStep
        );

        if (!activeStep) {
            return false;
        }

        let isValid = validateStandardFields(activeStep);

        if (currentStep === 3) {
            isValid = validateServices() && isValid;
        }

        if (currentStep === 4) {
            isValid = validateProfessionals() && isValid;
        }

        if (currentStep === 5) {
            isValid = validateSchedule() && isValid;
        }

        if (currentStep === 7) {
            isValid = validateSlug() && isValid;

            if (!termsInput.checked) {
                termsError.textContent =
                    "Você precisa aceitar os termos.";

                isValid = false;
            } else {
                termsError.textContent = "";
            }
        }

        return isValid;
    }

    function sanitizeSlug(text) {
        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
    }

    function formatPhone(value) {
        const numbers = value.replace(/\D/g, "").slice(0, 11);

        if (numbers.length <= 2) {
            return numbers;
        }

        if (numbers.length <= 7) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        }

        if (numbers.length <= 10) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(
                2,
                6
            )}-${numbers.slice(6)}`;
        }

        return `(${numbers.slice(0, 2)}) ${numbers.slice(
            2,
            7
        )}-${numbers.slice(7)}`;
    }

    function createService(service = {}) {
        serviceCount += 1;

        const card = document.createElement("article");

        card.className = "dynamic-card service-card";
        card.dataset.serviceId = serviceCount;

        card.innerHTML = `
            <input
                type="text"
                class="service-name"
                placeholder="Nome do serviço"
                value="${service.name || ""}"
                required
                aria-label="Nome do serviço"
            >

            <input
                type="number"
                class="service-price"
                placeholder="Preço"
                min="0"
                step="0.01"
                value="${service.price || ""}"
                required
                aria-label="Preço do serviço"
            >

            <select
                class="service-duration"
                required
                aria-label="Duração do serviço"
            >
                <option value="">Duração</option>
                <option value="20">20 min</option>
                <option value="30">30 min</option>
                <option value="40">40 min</option>
                <option value="50">50 min</option>
                <option value="60">1 hora</option>
                <option value="90">1h30</option>
                <option value="120">2 horas</option>
            </select>

            <button
                type="button"
                class="remove-item-button"
                aria-label="Remover serviço"
            >
                ×
            </button>
        `;

        const durationSelect = card.querySelector(
            ".service-duration"
        );

        if (service.duration) {
            durationSelect.value = String(service.duration);
        }

        card
            .querySelector(".remove-item-button")
            .addEventListener("click", () => {
                card.remove();
            });

        servicesList.appendChild(card);
    }

    function createProfessional(professional = {}) {
        professionalCount += 1;

        const card = document.createElement("article");

        card.className =
            "dynamic-card professional-card";

        card.dataset.professionalId = professionalCount;

        card.innerHTML = `
            <input
                type="text"
                class="professional-name"
                placeholder="Nome do profissional"
                value="${professional.name || ""}"
                required
                aria-label="Nome do profissional"
            >

            <input
                type="text"
                class="professional-specialty"
                placeholder="Especialidade"
                value="${professional.specialty || ""}"
                required
                aria-label="Especialidade do profissional"
            >

            <button
                type="button"
                class="remove-item-button"
                aria-label="Remover profissional"
            >
                ×
            </button>
        `;

        card
            .querySelector(".remove-item-button")
            .addEventListener("click", () => {
                card.remove();
            });

        professionalsList.appendChild(card);
    }

    function createSchedule() {
        scheduleList.innerHTML = "";

        days.forEach((day) => {
            const item = document.createElement("article");

            item.className = `schedule-item ${
                day.active ? "" : "disabled"
            }`;

            item.dataset.day = day.key;

            item.innerHTML = `
                <label class="schedule-day">
                    <input
                        type="checkbox"
                        class="schedule-day-checkbox"
                        ${day.active ? "checked" : ""}
                    >

                    <span class="day-checkbox"></span>

                    <strong>${day.label}</strong>
                </label>

                <div class="schedule-time">
                    <input
                        type="time"
                        class="schedule-opening"
                        value="08:00"
                        aria-label="Horário de abertura"
                    >

                    <span>até</span>

                    <input
                        type="time"
                        class="schedule-closing"
                        value="18:00"
                        aria-label="Horário de fechamento"
                    >
                </div>
            `;

            const checkbox = item.querySelector(
                ".schedule-day-checkbox"
            );

            checkbox.addEventListener("change", () => {
                item.classList.toggle(
                    "disabled",
                    !checkbox.checked
                );
            });

            scheduleList.appendChild(item);
        });
    }

    function getServices() {
        return [
            ...servicesList.querySelectorAll(".service-card")
        ].map((card) => ({
            name: card.querySelector(".service-name").value.trim(),
            price: Number(
                card.querySelector(".service-price").value
            ),
            duration: Number(
                card.querySelector(".service-duration").value
            )
        }));
    }

    function getProfessionals() {
        return [
            ...professionalsList.querySelectorAll(
                ".professional-card"
            )
        ].map((card) => ({
            name: card
                .querySelector(".professional-name")
                .value.trim(),

            specialty: card
                .querySelector(".professional-specialty")
                .value.trim()
        }));
    }

    function getSchedule() {
        return [
            ...scheduleList.querySelectorAll(".schedule-item")
        ].map((item) => ({
            day: item.dataset.day,

            active: item.querySelector(
                ".schedule-day-checkbox"
            ).checked,

            opening: item.querySelector(
                ".schedule-opening"
            ).value,

            closing: item.querySelector(
                ".schedule-closing"
            ).value
        }));
    }

    function updateOrderSummary() {
        const billingInput = document.querySelector(
            'input[name="billing"]:checked'
        );

        const billing = billingInput?.value || "monthly";
        const hasSetup = professionalSetup.checked;

        const planValue =
            billing === "annual" ? 229.9 : 22.9;

        const total = planValue + (hasSetup ? 29.9 : 0);

        summaryPlan.textContent =
            billing === "annual"
                ? "Plano anual"
                : "Plano mensal";

        summarySetup.textContent =
            hasSetup ? "R$ 29,90" : "Não adicionada";

        summaryTotal.textContent = total.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
    }

    function collectFormData() {
        const selectedTheme = document.querySelector(
            'input[name="theme"]:checked'
        );

        const selectedBilling = document.querySelector(
            'input[name="billing"]:checked'
        );

        return {
            owner: {
                name: document
                    .querySelector("#owner-name")
                    .value.trim(),

                email: document
                    .querySelector("#owner-email")
                    .value.trim(),

                phone: document
                    .querySelector("#owner-phone")
                    .value.trim()
            },

            barbershop: {
                name: barbershopNameInput.value.trim(),

                description: descriptionInput.value.trim(),

                city: document
                    .querySelector("#barbershop-city")
                    .value.trim(),

                state: document
                    .querySelector("#barbershop-state")
                    .value,

                address: document
                    .querySelector("#barbershop-address")
                    .value.trim(),

                instagram: document
                    .querySelector("#barbershop-instagram")
                    .value.trim(),

                whatsapp: document
                    .querySelector("#barbershop-whatsapp")
                    .value.trim(),

                slug: slugInput.value.trim(),

                services: getServices(),

                professionals: getProfessionals(),

                schedule: getSchedule(),

                appearance: {
                    theme: selectedTheme?.value || "legacy",
                    customColor: customColorInput.value
                }
            },

            subscription: {
                billing: selectedBilling?.value || "monthly",
                professionalSetup: professionalSetup.checked
            },

            createdAt: new Date().toISOString()
        };
    }

    function saveRegistration(data) {
        localStorage.setItem(
            "barberflowRegistration",
            JSON.stringify(data)
        );

        localStorage.setItem(
            `barberflowBarbershop:${data.barbershop.slug}`,
            JSON.stringify(data.barbershop)
        );
    }

    nextButton.addEventListener("click", () => {
        if (!validateCurrentStep()) {
            return;
        }

        if (currentStep < steps.length) {
            currentStep += 1;
            updateStep();
        }
    });

    backButton.addEventListener("click", () => {
        if (currentStep > 1) {
            currentStep -= 1;
            updateStep();
        }
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!validateCurrentStep()) {
            return;
        }

        const registrationData = collectFormData();

        saveRegistration(registrationData);

        const slug = registrationData.barbershop.slug;

        createdLinkText.textContent =
            `barberflow.com/${slug}`;

        openCreatedPage.href =
            `./barbearia.html?barbearia=${encodeURIComponent(
                slug
            )}`;

        successModal.classList.add("open");
        successModal.setAttribute("aria-hidden", "false");
    });

    addServiceButton.addEventListener("click", () => {
        createService();
    });

    addProfessionalButton.addEventListener("click", () => {
        createProfessional();
    });

    barbershopNameInput.addEventListener("input", () => {
        if (!slugWasEdited) {
            slugInput.value = sanitizeSlug(
                barbershopNameInput.value
            );

            validateSlug();
        }
    });

    slugInput.addEventListener("input", () => {
        slugWasEdited = true;
        slugInput.value = sanitizeSlug(slugInput.value);
        validateSlug();
    });

    descriptionInput.addEventListener("input", () => {
        descriptionCounter.textContent =
            `${descriptionInput.value.length}/240`;
    });

    document
        .querySelectorAll("#owner-phone, #barbershop-whatsapp")
        .forEach((input) => {
            input.addEventListener("input", () => {
                input.value = formatPhone(input.value);
            });
        });

    document
        .querySelectorAll(".password-toggle")
        .forEach((button) => {
            button.addEventListener("click", () => {
                const input = document.querySelector(
                    `#${button.dataset.passwordTarget}`
                );

                if (!input) {
                    return;
                }

                const shouldShow =
                    input.type === "password";

                input.type = shouldShow
                    ? "text"
                    : "password";

                button.textContent = shouldShow
                    ? "Ocultar"
                    : "Mostrar";
            });
        });

    document
        .querySelectorAll('input[name="theme"]')
        .forEach((input) => {
            input.addEventListener("change", () => {
                document
                    .querySelectorAll(".theme-option")
                    .forEach((option) => {
                        option.classList.remove("active");
                    });

                input
                    .closest(".theme-option")
                    .classList.add("active");
            });
        });

    customColorInput.addEventListener("input", () => {
        customColorValue.textContent =
            customColorInput.value.toUpperCase();
    });

    document
        .querySelectorAll('input[name="billing"]')
        .forEach((input) => {
            input.addEventListener(
                "change",
                updateOrderSummary
            );
        });

    professionalSetup.addEventListener(
        "change",
        updateOrderSummary
    );

    termsInput.addEventListener("change", () => {
        if (termsInput.checked) {
            termsError.textContent = "";
        }
    });

    form.addEventListener("input", (event) => {
        const field = event.target;

        if (
            field.matches("input, textarea, select") &&
            field.closest(".form-group")
        ) {
            clearFieldError(field);
        }
    });

    createService({
        name: "Corte masculino",
        price: 35,
        duration: 40
    });

    createService({
        name: "Corte + barba",
        price: 55,
        duration: 60
    });

    createProfessional({
        name: "",
        specialty: "Cortes masculinos"
    });

    createSchedule();
    updateOrderSummary();
    updateStep();
});