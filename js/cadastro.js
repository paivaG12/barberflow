document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#register-form");
    const steps = [...document.querySelectorAll(".form-step")];

    const backButton = document.querySelector("#back-button");
    const nextButton = document.querySelector("#next-button");
    const finishButton = document.querySelector("#finish-button");

    const progressStep = document.querySelector("#progress-step");
    const progressTitle = document.querySelector("#progress-title");
    const progressFill = document.querySelector("#progress-fill");

    const progressDots = [
        ...document.querySelectorAll("[data-progress-dot]")
    ];

    const sidebarSteps = [
        ...document.querySelectorAll("[data-sidebar-step]")
    ];

    const servicesList = document.querySelector("#services-list");

    const professionalsList = document.querySelector(
        "#professionals-list"
    );

    const scheduleList = document.querySelector("#schedule-list");

    const professionalImagesList = document.querySelector(
        "#professional-images-list"
    );

    const barbershopNameInput = document.querySelector(
        "#barbershop-name"
    );

    const descriptionInput = document.querySelector(
        "#barbershop-description"
    );

    const descriptionCounter = document.querySelector(
        "#description-counter"
    );

    const slugInput = document.querySelector("#barbershop-slug");
    const slugStatus = document.querySelector("#slug-status");

    const customColorInput = document.querySelector("#custom-color");

    const customColorValue = document.querySelector(
        "#custom-color-value"
    );

    const logoInput = document.querySelector("#logo-input");

    const logoPreviewImage = document.querySelector(
        "#logo-preview-image"
    );

    const logoFallback = document.querySelector("#logo-fallback");

    const removeLogoButton = document.querySelector(
        "#remove-logo-button"
    );

    const bannerInput = document.querySelector("#banner-input");

    const bannerPreviewImage = document.querySelector(
        "#banner-preview-image"
    );

    const automaticBanner = document.querySelector(
        "#automatic-banner"
    );

    const automaticBannerName = document.querySelector(
        "#automatic-banner-name"
    );

    const removeBannerButton = document.querySelector(
        "#remove-banner-button"
    );

    const galleryInput = document.querySelector("#gallery-input");

    const galleryPreviewGrid = document.querySelector(
        "#gallery-preview-grid"
    );

    const termsInput = document.querySelector("#terms");
    const termsError = document.querySelector("#terms-error");

    const summaryPlan = document.querySelector("#summary-plan");
    const summaryTotal = document.querySelector("#summary-total");

    const successModal = document.querySelector("#success-modal");

    const createdLinkText = document.querySelector(
        "#created-link-text"
    );

    const openCreatedPage = document.querySelector(
        "#open-created-page"
    );

    let currentStep = 1;
    let professionalCounter = 0;
    let slugWasEdited = false;

    let logoData = "";
    let bannerData = "";
    let galleryImages = [];
    let professionalImages = {};

    const themes = {
        legacy: {
            primary: "#d6aa45",
            secondary: "#111111"
        },

        urban: {
            primary: "#f5f5f5",
            secondary: "#151515"
        },

        ocean: {
            primary: "#d6aa45",
            secondary: "#152747"
        },

        forest: {
            primary: "#4f9b70",
            secondary: "#173629"
        },

        royal: {
            primary: "#b45878",
            secondary: "#611f35"
        },

        sunset: {
            primary: "#e26d2f",
            secondary: "#171717"
        }
    };

    const days = [
        ["monday", "Segunda-feira", true],
        ["tuesday", "Terça-feira", true],
        ["wednesday", "Quarta-feira", true],
        ["thursday", "Quinta-feira", true],
        ["friday", "Sexta-feira", true],
        ["saturday", "Sábado", true],
        ["sunday", "Domingo", false]
    ];

    function getInitials(name) {
        const words = name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2);

        if (!words.length) {
            return "SB";
        }

        return words
            .map((word) => word.charAt(0).toUpperCase())
            .join("");
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

    function readImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => resolve(reader.result);

            reader.onerror = () => {
                reject(
                    new Error("Não foi possível carregar a imagem.")
                );
            };

            reader.readAsDataURL(file);
        });
    }

    function updateStep() {
        steps.forEach((step) => {
            step.classList.toggle(
                "active",
                Number(step.dataset.step) === currentStep
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

        progressDots.forEach((dot) => {
            const number = Number(dot.dataset.progressDot);

            dot.classList.toggle(
                "active",
                number === currentStep
            );

            dot.classList.toggle(
                "completed",
                number < currentStep
            );
        });

        sidebarSteps.forEach((item) => {
            const number = Number(item.dataset.sidebarStep);

            item.classList.toggle(
                "active",
                number === currentStep
            );

            item.classList.toggle(
                "completed",
                number < currentStep
            );
        });

        backButton.disabled = currentStep === 1;

        nextButton.hidden =
            currentStep === steps.length;

        finishButton.hidden =
            currentStep !== steps.length;

        if (currentStep === 7) {
            renderProfessionalImages();
            updateImageFallbacks();
        }

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

        const error = group.querySelector(".field-error");

        if (error) {
            error.textContent = message;
        }
    }

    function clearFieldError(field) {
        const group = field.closest(".form-group");

        if (!group) {
            return;
        }

        group.classList.remove("invalid");

        const error = group.querySelector(".field-error");

        if (error) {
            error.textContent = "";
        }
    }

    function validateStandardFields(step) {
        const fields = [
            ...step.querySelectorAll("[required]")
        ].filter((field) => field.type !== "checkbox");

        let valid = true;

        fields.forEach((field) => {
            clearFieldError(field);

            const value = field.value.trim();

            if (!value) {
                showFieldError(
                    field,
                    "Preencha este campo."
                );

                valid = false;
                return;
            }

            if (
                field.type === "email" &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ) {
                showFieldError(
                    field,
                    "Digite um e-mail válido."
                );

                valid = false;
            }

            if (
                field.id === "owner-password" &&
                value.length < 6
            ) {
                showFieldError(
                    field,
                    "A senha deve ter pelo menos 6 caracteres."
                );

                valid = false;
            }
        });

        return valid;
    }

    function validateServices() {
        const cards = [
            ...servicesList.querySelectorAll(".service-card")
        ];

        const error = document.querySelector("#services-error");

        if (!cards.length) {
            error.textContent =
                "Adicione pelo menos um serviço.";

            return false;
        }

        const incomplete = cards.some((card) => {
            return [...card.querySelectorAll("[required]")].some(
                (input) => !input.value.trim()
            );
        });

        if (incomplete) {
            error.textContent =
                "Preencha todas as informações dos serviços.";

            return false;
        }

        error.textContent = "";
        return true;
    }

    function validateProfessionals() {
        const cards = [
            ...professionalsList.querySelectorAll(
                ".professional-card"
            )
        ];

        const error = document.querySelector(
            "#professionals-error"
        );

        if (!cards.length) {
            error.textContent =
                "Adicione pelo menos um profissional.";

            return false;
        }

        const incomplete = cards.some((card) => {
            return [...card.querySelectorAll("[required]")].some(
                (input) => !input.value.trim()
            );
        });

        if (incomplete) {
            error.textContent =
                "Preencha os dados dos profissionais.";

            return false;
        }

        error.textContent = "";
        return true;
    }

    function validateSchedule() {
        const activeDays = scheduleList.querySelectorAll(
            ".schedule-day-checkbox:checked"
        );

        const error = document.querySelector("#schedule-error");

        if (!activeDays.length) {
            error.textContent =
                "Selecione pelo menos um dia de funcionamento.";

            return false;
        }

        error.textContent = "";
        return true;
    }

    function validateSlug() {
        const value = slugInput.value.trim();
        const pattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

        if (!value) {
            slugStatus.textContent =
                "Escolha um link.";

            slugStatus.classList.add("unavailable");
            return false;
        }

        if (!pattern.test(value)) {
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

        let valid = validateStandardFields(activeStep);

        if (currentStep === 3) {
            valid = validateServices() && valid;
        }

        if (currentStep === 4) {
            valid = validateProfessionals() && valid;
        }

        if (currentStep === 5) {
            valid = validateSchedule() && valid;
        }

        if (currentStep === 8) {
            valid = validateSlug() && valid;

            if (!termsInput.checked) {
                termsError.textContent =
                    "Você precisa aceitar os termos.";

                valid = false;
            } else {
                termsError.textContent = "";
            }
        }

        return valid;
    }

    function createService(service = {}) {
        const card = document.createElement("article");

        card.className = "dynamic-card service-card";

        card.innerHTML = `
            <input
                type="text"
                class="service-name"
                placeholder="Nome do serviço"
                value="${service.name || ""}"
                required
            >

            <input
                type="number"
                class="service-price"
                placeholder="Preço"
                min="0"
                step="0.01"
                value="${service.price || ""}"
                required
            >

            <select class="service-duration" required>
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

        if (service.duration) {
            card.querySelector(".service-duration").value =
                String(service.duration);
        }

        card
            .querySelector(".remove-item-button")
            .addEventListener("click", () => {
                card.remove();
            });

        servicesList.appendChild(card);
    }

    function createProfessional(professional = {}) {
        professionalCounter += 1;

        const id = `professional-${professionalCounter}`;

        const card = document.createElement("article");

        card.className =
            "dynamic-card professional-card";

        card.dataset.professionalId = id;

        card.innerHTML = `
            <input
                type="text"
                class="professional-name"
                placeholder="Nome do profissional"
                value="${professional.name || ""}"
                required
            >

            <input
                type="text"
                class="professional-specialty"
                placeholder="Especialidade"
                value="${professional.specialty || ""}"
                required
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
                delete professionalImages[id];
                card.remove();
            });

        professionalsList.appendChild(card);
    }

    function createSchedule() {
        days.forEach(([key, label, active]) => {
            const item = document.createElement("article");

            item.className =
                `schedule-item ${active ? "" : "disabled"}`;

            item.dataset.day = key;

            item.innerHTML = `
                <label class="schedule-day">
                    <input
                        type="checkbox"
                        class="schedule-day-checkbox"
                        ${active ? "checked" : ""}
                    >

                    <span class="day-checkbox"></span>

                    <strong>${label}</strong>
                </label>

                <div class="schedule-time">
                    <input
                        type="time"
                        class="schedule-opening"
                        value="08:00"
                    >

                    <span>até</span>

                    <input
                        type="time"
                        class="schedule-closing"
                        value="18:00"
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

    function getProfessionals() {
        return [
            ...professionalsList.querySelectorAll(
                ".professional-card"
            )
        ].map((card) => {
            const id = card.dataset.professionalId;

            return {
                id,

                name: card
                    .querySelector(".professional-name")
                    .value.trim(),

                specialty: card
                    .querySelector(".professional-specialty")
                    .value.trim(),

                image: professionalImages[id] || ""
            };
        });
    }

    function renderProfessionalImages() {
        const professionals = getProfessionals();

        professionalImagesList.innerHTML = "";

        professionals.forEach((professional) => {
            const card = document.createElement("article");

            const initials = getInitials(professional.name);

            card.className = "professional-image-card";

            card.innerHTML = `
                <div class="professional-avatar">
                    ${
                        professional.image
                            ? `
                                <img
                                    src="${professional.image}"
                                    alt="${professional.name}"
                                >
                            `
                            : `<span>${initials}</span>`
                    }
                </div>

                <div>
                    <strong>
                        ${professional.name || "Profissional"}
                    </strong>

                    <label>
                        Escolher foto

                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                        >
                    </label>
                </div>
            `;

            const input = card.querySelector("input");

            input.addEventListener("change", async () => {
                const file = input.files?.[0];

                if (!file) {
                    return;
                }

                try {
                    professionalImages[professional.id] =
                        await readImage(file);

                    renderProfessionalImages();
                } catch (error) {
                    alert(error.message);
                }
            });

            professionalImagesList.appendChild(card);
        });
    }

    function getSelectedTheme() {
        return document.querySelector(
            'input[name="theme"]:checked'
        )?.value || "legacy";
    }

    function updateAutomaticBanner() {
        const themeName = getSelectedTheme();

        const theme =
            themes[themeName] || themes.legacy;

        automaticBanner.style.setProperty(
            "--banner-primary",
            customColorInput.value || theme.primary
        );

        automaticBanner.style.setProperty(
            "--banner-secondary",
            theme.secondary
        );

        automaticBannerName.textContent =
            barbershopNameInput.value.trim() ||
            "Sua Barbearia";
    }

    function updateImageFallbacks() {
        const name =
            barbershopNameInput.value.trim() ||
            "Sua Barbearia";

        logoFallback.textContent = getInitials(name);

        automaticBannerName.textContent = name;

        updateAutomaticBanner();
    }

    function renderGallery() {
        galleryPreviewGrid.innerHTML = "";

        if (!galleryImages.length) {
            galleryPreviewGrid.innerHTML = `
                <div
                    class="empty-gallery"
                    id="empty-gallery"
                >
                    <span>+</span>

                    <strong>
                        Nenhuma foto adicionada
                    </strong>

                    <p>
                        A galeria não aparecerá na página
                        enquanto não houver imagens.
                    </p>
                </div>
            `;

            return;
        }

        galleryImages.forEach((image, index) => {
            const item = document.createElement("article");

            item.className = "gallery-item";

            item.innerHTML = `
                <img
                    src="${image}"
                    alt="Imagem da galeria"
                >

                <button
                    type="button"
                    aria-label="Remover imagem"
                >
                    ×
                </button>
            `;

            item
                .querySelector("button")
                .addEventListener("click", () => {
                    galleryImages.splice(index, 1);
                    renderGallery();
                });

            galleryPreviewGrid.appendChild(item);
        });
    }

    function updateOrderSummary() {
        const billing = document.querySelector(
            'input[name="billing"]:checked'
        )?.value || "monthly";

        const planPrice =
            billing === "annual"
                ? 349.9
                : 34.9;

        summaryPlan.textContent =
            billing === "annual"
                ? "Pagamento anual"
                : "Pagamento mensal";

        summaryTotal.textContent =
            planPrice.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });
    }

    function getServices() {
        return [
            ...servicesList.querySelectorAll(".service-card")
        ].map((card) => ({
            name: card
                .querySelector(".service-name")
                .value.trim(),

            price: Number(
                card.querySelector(".service-price").value
            ),

            duration: Number(
                card.querySelector(".service-duration").value
            )
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

    function collectData() {
        const billing = document.querySelector(
            'input[name="billing"]:checked'
        )?.value || "monthly";

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

                description:
                    descriptionInput.value.trim(),

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
                    theme: getSelectedTheme(),
                    customColor: customColorInput.value
                },

                images: {
                    logo: logoData,
                    banner: bannerData,
                    automaticBanner: !bannerData,
                    gallery: galleryImages
                }
            },

            subscription: {
                billing,

                price:
                    billing === "annual"
                        ? 349.9
                        : 34.9
            },

            createdAt: new Date().toISOString()
        };
    }

    function saveData(data) {
        try {
            localStorage.setItem(
                "barberflowRegistration",
                JSON.stringify(data)
            );

            localStorage.setItem(
                `barberflowBarbershop:${data.barbershop.slug}`,
                JSON.stringify(data.barbershop)
            );

            return true;
        } catch (error) {
            alert(
                "As imagens ficaram grandes demais para serem " +
                "salvas neste navegador. Tente adicionar imagens menores."
            );

            return false;
        }
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

        const data = collectData();

        if (!saveData(data)) {
            return;
        }

        const slug = data.barbershop.slug;

        createdLinkText.textContent =
            `barberflow.com/${slug}`;

        openCreatedPage.href =
            `./barbearia.html?barbearia=${encodeURIComponent(slug)}`;

        successModal.classList.add("open");

        successModal.setAttribute(
            "aria-hidden",
            "false"
        );
    });

    document
        .querySelector("#add-service-button")
        .addEventListener("click", () => {
            createService();
        });

    document
        .querySelector("#add-professional-button")
        .addEventListener("click", () => {
            createProfessional();
        });

    barbershopNameInput.addEventListener("input", () => {
        if (!slugWasEdited) {
            slugInput.value = sanitizeSlug(
                barbershopNameInput.value
            );

            validateSlug();
        }

        updateImageFallbacks();
    });

    slugInput.addEventListener("input", () => {
        slugWasEdited = true;

        slugInput.value = sanitizeSlug(
            slugInput.value
        );

        validateSlug();
    });

    descriptionInput.addEventListener("input", () => {
        descriptionCounter.textContent =
            `${descriptionInput.value.length}/240`;
    });

    document
        .querySelectorAll(
            "#owner-phone, #barbershop-whatsapp"
        )
        .forEach((input) => {
            input.addEventListener("input", () => {
                input.value = formatPhone(input.value);
            });
        });

    document
        .querySelector("#password-toggle")
        .addEventListener("click", (event) => {
            const passwordInput = document.querySelector(
                "#owner-password"
            );

            const showing =
                passwordInput.type === "text";

            passwordInput.type =
                showing ? "password" : "text";

            event.currentTarget.textContent =
                showing ? "Mostrar" : "Ocultar";
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

                const theme = themes[input.value];

                customColorInput.value =
                    theme.primary;

                customColorValue.textContent =
                    theme.primary.toUpperCase();

                updateAutomaticBanner();
            });
        });

    customColorInput.addEventListener("input", () => {
        customColorValue.textContent =
            customColorInput.value.toUpperCase();

        updateAutomaticBanner();
    });

    logoInput.addEventListener("change", async () => {
        const file = logoInput.files?.[0];

        if (!file) {
            return;
        }

        try {
            logoData = await readImage(file);

            logoPreviewImage.src = logoData;
            logoPreviewImage.hidden = false;
            logoFallback.hidden = true;
            removeLogoButton.hidden = false;
        } catch (error) {
            alert(error.message);
        }
    });

    removeLogoButton.addEventListener("click", () => {
        logoData = "";
        logoInput.value = "";
        logoPreviewImage.src = "";
        logoPreviewImage.hidden = true;
        logoFallback.hidden = false;
        removeLogoButton.hidden = true;
    });

    bannerInput.addEventListener("change", async () => {
        const file = bannerInput.files?.[0];

        if (!file) {
            return;
        }

        try {
            bannerData = await readImage(file);

            bannerPreviewImage.src = bannerData;
            bannerPreviewImage.hidden = false;
            automaticBanner.hidden = true;
            removeBannerButton.hidden = false;
        } catch (error) {
            alert(error.message);
        }
    });

    removeBannerButton.addEventListener("click", () => {
        bannerData = "";
        bannerInput.value = "";
        bannerPreviewImage.src = "";
        bannerPreviewImage.hidden = true;
        automaticBanner.hidden = false;
        removeBannerButton.hidden = true;

        updateAutomaticBanner();
    });

    galleryInput.addEventListener("change", async () => {
        const availableSpaces =
            Math.max(0, 8 - galleryImages.length);

        const files = [
            ...galleryInput.files
        ].slice(0, availableSpaces);

        for (const file of files) {
            try {
                const image = await readImage(file);
                galleryImages.push(image);
            } catch (error) {
                console.error(error);
            }
        }

        galleryInput.value = "";

        renderGallery();
    });

    document
        .querySelectorAll('input[name="billing"]')
        .forEach((input) => {
            input.addEventListener(
                "change",
                updateOrderSummary
            );
        });

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
    renderGallery();
    updateOrderSummary();
    updateAutomaticBanner();
    updateStep();
});