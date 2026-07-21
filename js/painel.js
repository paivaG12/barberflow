document.addEventListener("DOMContentLoaded", () => {
    const dashboardPage = document.body.dataset.dashboardPage;

    if (dashboardPage !== "services") {
        return;
    }

    const STORAGE_ACTIVE = "barberflowActiveRegistration";

    let registration = readStorage(STORAGE_ACTIVE);
    let serviceBeingDeletedId = null;

    const elements = {
        servicesList: document.querySelector("#services-list"),
        emptyState: document.querySelector("#services-empty-state"),

        totalServices: document.querySelector("#total-services"),
        activeServices: document.querySelector("#active-services"),
        averagePrice: document.querySelector(
            "#average-service-price"
        ),

        search: document.querySelector("#services-search"),
        statusFilter: document.querySelector(
            "#services-status-filter"
        ),

        openModalButton: document.querySelector(
            "#open-service-modal"
        ),
        emptyAddButton: document.querySelector(
            "#empty-add-service"
        ),

        serviceModal: document.querySelector("#service-modal"),
        serviceModalOverlay: document.querySelector(
            "#service-modal-overlay"
        ),
        closeModalButton: document.querySelector(
            "#close-service-modal"
        ),
        cancelModalButton: document.querySelector(
            "#cancel-service-modal"
        ),

        modalLabel: document.querySelector(
            "#service-modal-label"
        ),
        modalTitle: document.querySelector(
            "#service-modal-title"
        ),

        form: document.querySelector("#service-form"),
        serviceId: document.querySelector("#service-id"),
        serviceName: document.querySelector("#service-name"),
        servicePrice: document.querySelector("#service-price"),
        serviceDuration: document.querySelector(
            "#service-duration"
        ),
        serviceDescription: document.querySelector(
            "#service-description"
        ),
        serviceActive: document.querySelector(
            "#service-active"
        ),

        nameError: document.querySelector(
            "#service-name-error"
        ),
        priceError: document.querySelector(
            "#service-price-error"
        ),
        durationError: document.querySelector(
            "#service-duration-error"
        ),

        descriptionCount: document.querySelector(
            "#description-character-count"
        ),

        deleteModal: document.querySelector(
            "#delete-service-modal"
        ),
        deleteModalOverlay: document.querySelector(
            "#delete-modal-overlay"
        ),
        deleteServiceName: document.querySelector(
            "#delete-service-name"
        ),
        cancelDeleteButton: document.querySelector(
            "#cancel-delete-service"
        ),
        confirmDeleteButton: document.querySelector(
            "#confirm-delete-service"
        ),

        ownerAvatar: document.querySelector(
            "#dashboard-owner-avatar"
        ),
        sidebarPlan: document.querySelector("#sidebar-plan"),
        openShopPage: document.querySelector("#open-shop-page"),

        toast: document.querySelector("#dashboard-toast"),
        toastMessage: document.querySelector(
            "#dashboard-toast-message"
        )
    };

    function readStorage(key) {
        try {
            const storedValue = localStorage.getItem(key);

            return storedValue
                ? JSON.parse(storedValue)
                : null;
        } catch (error) {
            console.error(
                "Não foi possível ler os dados:",
                error
            );

            return null;
        }
    }

    function writeStorage(key, value) {
        try {
            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

            return true;
        } catch (error) {
            console.error(
                "Não foi possível salvar os dados:",
                error
            );

            showToast(
                "Não foi possível salvar as alterações.",
                true
            );

            return false;
        }
    }

    function ensureRegistrationStructure() {
        if (!registration) {
            window.location.href = "./cadastro.html";
            return false;
        }

        if (!registration.barbershop) {
            registration.barbershop = {};
        }

        if (!Array.isArray(registration.barbershop.services)) {
            registration.barbershop.services = [];
        }

        registration.barbershop.services =
            registration.barbershop.services.map(
                (service, index) => normalizeService(
                    service,
                    index
                )
            );

        return true;
    }

    function normalizeService(service, index = 0) {
        const parsedPrice = parsePrice(
            service.price ?? service.value ?? 0
        );

        const duration = Number(
            service.duration ??
            service.durationMinutes ??
            30
        );

        return {
            id:
                service.id ||
                `service-${Date.now()}-${index}`,

            name:
                String(service.name || "Serviço").trim(),

            description:
                String(service.description || "").trim(),

            price:
                Number.isFinite(parsedPrice)
                    ? parsedPrice
                    : 0,

            duration:
                Number.isFinite(duration) && duration > 0
                    ? duration
                    : 30,

            active:
                service.active !== false,

            createdAt:
                service.createdAt ||
                new Date().toISOString(),

            updatedAt:
                service.updatedAt ||
                new Date().toISOString()
        };
    }

    function getServices() {
        return registration.barbershop.services;
    }

    function formatCurrency(value) {
        return Number(value || 0).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
    }

    function parsePrice(value) {
        if (typeof value === "number") {
            return value;
        }

        let normalizedValue = String(value || "")
            .trim()
            .replace(/\s/g, "")
            .replace("R$", "");

        if (
            normalizedValue.includes(",") &&
            normalizedValue.includes(".")
        ) {
            normalizedValue = normalizedValue
                .replace(/\./g, "")
                .replace(",", ".");
        } else if (normalizedValue.includes(",")) {
            normalizedValue =
                normalizedValue.replace(",", ".");
        }

        const parsedValue = Number(normalizedValue);

        return Number.isFinite(parsedValue)
            ? parsedValue
            : NaN;
    }

    function formatPriceInput(value) {
        const numericValue = String(value)
            .replace(/\D/g, "")
            .slice(0, 8);

        if (!numericValue) {
            return "";
        }

        const number = Number(numericValue) / 100;

        return number.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
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

    function escapeHtml(value = "") {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function generateId() {
        if (
            typeof crypto !== "undefined" &&
            typeof crypto.randomUUID === "function"
        ) {
            return crypto.randomUUID();
        }

        return (
            `service-${Date.now()}-` +
            Math.random().toString(16).slice(2)
        );
    }

    function persistServices() {
        registration.updatedAt = new Date().toISOString();

        const activeSaved = writeStorage(
            STORAGE_ACTIVE,
            registration
        );

        const slug = registration.barbershop.slug;

        if (slug) {
            writeStorage(
                `barberflowBarbershop:${slug}`,
                registration.barbershop
            );
        }

        return activeSaved;
    }

    function getFilteredServices() {
        const query = elements.search.value
            .trim()
            .toLowerCase();

        const status = elements.statusFilter.value;

        return getServices().filter((service) => {
            const matchesQuery =
                service.name.toLowerCase().includes(query) ||
                service.description
                    .toLowerCase()
                    .includes(query);

            let matchesStatus = true;

            if (status === "active") {
                matchesStatus = service.active;
            }

            if (status === "inactive") {
                matchesStatus = !service.active;
            }

            return matchesQuery && matchesStatus;
        });
    }

    function updateSummary() {
        const services = getServices();

        const activeCount = services.filter(
            (service) => service.active
        ).length;

        const priceSum = services.reduce(
            (total, service) =>
                total + Number(service.price || 0),
            0
        );

        const averagePrice = services.length
            ? priceSum / services.length
            : 0;

        elements.totalServices.textContent =
            services.length;

        elements.activeServices.textContent =
            activeCount;

        elements.averagePrice.textContent =
            formatCurrency(averagePrice);
    }

    function renderServices() {
        const filteredServices = getFilteredServices();

        elements.servicesList.innerHTML = "";

        elements.emptyState.hidden =
            filteredServices.length > 0;

        if (!filteredServices.length) {
            updateSummary();
            return;
        }

        filteredServices.forEach((service) => {
            const serviceElement =
                document.createElement("article");

            serviceElement.className =
                "service-dashboard-item";

            serviceElement.dataset.serviceId =
                service.id;

            serviceElement.innerHTML = `
                <div class="service-main-information">
                    <div class="service-list-icon">
                        ✂
                    </div>

                    <div>
                        <strong>
                            ${escapeHtml(service.name)}
                        </strong>

                        <small>
                            ${
                                service.description
                                    ? escapeHtml(
                                        service.description
                                    )
                                    : "Sem descrição"
                            }
                        </small>
                    </div>
                </div>

                <div class="service-duration-value">
                    <strong>
                        ${service.duration} min
                    </strong>
                </div>

                <div class="service-price-value">
                    <strong>
                        ${formatCurrency(service.price)}
                    </strong>
                </div>

                <div class="service-status-control">
                    <label
                        class="service-list-switch"
                        title="${
                            service.active
                                ? "Desativar serviço"
                                : "Ativar serviço"
                        }"
                    >
                        <input
                            type="checkbox"
                            data-action="toggle"
                            ${
                                service.active
                                    ? "checked"
                                    : ""
                            }
                        >

                        <span></span>
                    </label>

                    <small class="${
                        service.active
                            ? "status-active"
                            : "status-inactive"
                    }">
                        ${
                            service.active
                                ? "Ativo"
                                : "Desativado"
                        }
                    </small>
                </div>

                <div class="service-item-actions">
                    <button
                        type="button"
                        data-action="edit"
                        aria-label="Editar ${escapeHtml(
                            service.name
                        )}"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        data-action="delete"
                        class="delete-action"
                        aria-label="Excluir ${escapeHtml(
                            service.name
                        )}"
                    >
                        Excluir
                    </button>
                </div>
            `;

            elements.servicesList.appendChild(
                serviceElement
            );
        });

        updateSummary();
    }

    function clearErrors() {
        elements.nameError.textContent = "";
        elements.priceError.textContent = "";
        elements.durationError.textContent = "";

        elements.serviceName.classList.remove(
            "input-error"
        );

        elements.servicePrice.classList.remove(
            "input-error"
        );

        elements.serviceDuration.classList.remove(
            "input-error"
        );
    }

    function resetForm() {
        elements.form.reset();
        elements.serviceId.value = "";
        elements.serviceActive.checked = true;
        elements.descriptionCount.textContent = "0";

        clearErrors();
    }

    function openServiceModal(service = null) {
        resetForm();

        if (service) {
            elements.modalLabel.textContent =
                "Editar serviço";

            elements.modalTitle.textContent =
                "Editar serviço";

            elements.serviceId.value = service.id;
            elements.serviceName.value = service.name;

            elements.servicePrice.value =
                Number(service.price).toLocaleString(
                    "pt-BR",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                );

            elements.serviceDuration.value =
                service.duration;

            elements.serviceDescription.value =
                service.description || "";

            elements.serviceActive.checked =
                service.active;

            elements.descriptionCount.textContent =
                String(
                    elements.serviceDescription.value.length
                );
        } else {
            elements.modalLabel.textContent =
                "Novo serviço";

            elements.modalTitle.textContent =
                "Adicionar serviço";
        }

        elements.serviceModal.classList.add("open");

        elements.serviceModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "dashboard-modal-open"
        );

        setTimeout(() => {
            elements.serviceName.focus();
        }, 100);
    }

    function closeServiceModal() {
        elements.serviceModal.classList.remove("open");

        elements.serviceModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "dashboard-modal-open"
        );

        resetForm();
    }

    function validateForm() {
        clearErrors();

        const name =
            elements.serviceName.value.trim();

        const price = parsePrice(
            elements.servicePrice.value
        );

        const duration = Number(
            elements.serviceDuration.value
        );

        let valid = true;

        if (name.length < 2) {
            elements.nameError.textContent =
                "Informe um nome com pelo menos 2 caracteres.";

            elements.serviceName.classList.add(
                "input-error"
            );

            valid = false;
        }

        if (!Number.isFinite(price) || price <= 0) {
            elements.priceError.textContent =
                "Informe um preço maior que zero.";

            elements.servicePrice.classList.add(
                "input-error"
            );

            valid = false;
        }

        if (
            !Number.isFinite(duration) ||
            duration < 5 ||
            duration > 600
        ) {
            elements.durationError.textContent =
                "Informe uma duração entre 5 e 600 minutos.";

            elements.serviceDuration.classList.add(
                "input-error"
            );

            valid = false;
        }

        return valid;
    }

    function saveService(event) {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const serviceId = elements.serviceId.value;

        const currentService = getServices().find(
            (service) => service.id === serviceId
        );

        const serviceData = {
            id: serviceId || generateId(),

            name:
                elements.serviceName.value.trim(),

            price: parsePrice(
                elements.servicePrice.value
            ),

            duration: Number(
                elements.serviceDuration.value
            ),

            description:
                elements.serviceDescription.value.trim(),

            active:
                elements.serviceActive.checked,

            createdAt:
                currentService?.createdAt ||
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString()
        };

        if (currentService) {
            const serviceIndex = getServices().findIndex(
                (service) => service.id === serviceId
            );

            getServices()[serviceIndex] = serviceData;
        } else {
            getServices().push(serviceData);
        }

        if (!persistServices()) {
            return;
        }

        closeServiceModal();
        renderServices();

        showToast(
            currentService
                ? "Serviço atualizado com sucesso."
                : "Serviço adicionado com sucesso."
        );
    }

    function toggleService(serviceId, active) {
        const service = getServices().find(
            (item) => item.id === serviceId
        );

        if (!service) {
            return;
        }

        service.active = active;
        service.updatedAt = new Date().toISOString();

        persistServices();
        renderServices();

        showToast(
            active
                ? "Serviço ativado."
                : "Serviço desativado."
        );
    }

    function openDeleteModal(serviceId) {
        const service = getServices().find(
            (item) => item.id === serviceId
        );

        if (!service) {
            return;
        }

        serviceBeingDeletedId = serviceId;

        elements.deleteServiceName.textContent =
            `"${service.name}"`;

        elements.deleteModal.classList.add("open");

        elements.deleteModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "dashboard-modal-open"
        );
    }

    function closeDeleteModal() {
        serviceBeingDeletedId = null;

        elements.deleteModal.classList.remove("open");

        elements.deleteModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "dashboard-modal-open"
        );
    }

    function confirmDeleteService() {
        if (!serviceBeingDeletedId) {
            return;
        }

        registration.barbershop.services =
            getServices().filter(
                (service) =>
                    service.id !== serviceBeingDeletedId
            );

        if (!persistServices()) {
            return;
        }

        closeDeleteModal();
        renderServices();

        showToast(
            "Serviço excluído com sucesso."
        );
    }

    function handleServiceListClick(event) {
        const serviceItem = event.target.closest(
            "[data-service-id]"
        );

        if (!serviceItem) {
            return;
        }

        const serviceId =
            serviceItem.dataset.serviceId;

        const actionButton = event.target.closest(
            "[data-action]"
        );

        if (!actionButton) {
            return;
        }

        const action = actionButton.dataset.action;

        if (action === "edit") {
            const service = getServices().find(
                (item) => item.id === serviceId
            );

            if (service) {
                openServiceModal(service);
            }
        }

        if (action === "delete") {
            openDeleteModal(serviceId);
        }
    }

    function handleServiceListChange(event) {
        const toggle = event.target.closest(
            '[data-action="toggle"]'
        );

        if (!toggle) {
            return;
        }

        const serviceItem = toggle.closest(
            "[data-service-id]"
        );

        if (!serviceItem) {
            return;
        }

        toggleService(
            serviceItem.dataset.serviceId,
            toggle.checked
        );
    }

    let toastTimeout;

    function showToast(message, error = false) {
        clearTimeout(toastTimeout);

        elements.toastMessage.textContent = message;

        elements.toast.classList.toggle(
            "error",
            error
        );

        elements.toast.classList.add("show");

        toastTimeout = setTimeout(() => {
            elements.toast.classList.remove("show");
        }, 2600);
    }

    function initializeDashboardInformation() {
        const ownerName =
            registration.owner?.name ||
            registration.user?.name ||
            "BarberFlow";

        elements.ownerAvatar.textContent =
            getInitials(ownerName);

        const billing =
            registration.subscription?.billing ||
            "monthly";

        elements.sidebarPlan.textContent =
            billing === "annual"
                ? "BarberFlow anual"
                : "BarberFlow mensal";

        const slug =
            registration.barbershop.slug;

        if (slug) {
            elements.openShopPage.href =
                `./barbearia.html?barbearia=${encodeURIComponent(
                    slug
                )}`;
        }
    }

    function bindEvents() {
        elements.openModalButton.addEventListener(
            "click",
            () => openServiceModal()
        );

        elements.emptyAddButton.addEventListener(
            "click",
            () => openServiceModal()
        );

        elements.closeModalButton.addEventListener(
            "click",
            closeServiceModal
        );

        elements.cancelModalButton.addEventListener(
            "click",
            closeServiceModal
        );

        elements.serviceModalOverlay.addEventListener(
            "click",
            closeServiceModal
        );

        elements.form.addEventListener(
            "submit",
            saveService
        );

        elements.search.addEventListener(
            "input",
            renderServices
        );

        elements.statusFilter.addEventListener(
            "change",
            renderServices
        );

        elements.servicesList.addEventListener(
            "click",
            handleServiceListClick
        );

        elements.servicesList.addEventListener(
            "change",
            handleServiceListChange
        );

        elements.servicePrice.addEventListener(
            "input",
            () => {
                elements.servicePrice.value =
                    formatPriceInput(
                        elements.servicePrice.value
                    );
            }
        );

        elements.serviceDescription.addEventListener(
            "input",
            () => {
                elements.descriptionCount.textContent =
                    String(
                        elements.serviceDescription
                            .value.length
                    );
            }
        );

        elements.cancelDeleteButton.addEventListener(
            "click",
            closeDeleteModal
        );

        elements.deleteModalOverlay.addEventListener(
            "click",
            closeDeleteModal
        );

        elements.confirmDeleteButton.addEventListener(
            "click",
            confirmDeleteService
        );

        document.addEventListener(
            "keydown",
            (event) => {
                if (event.key !== "Escape") {
                    return;
                }

                if (
                    elements.deleteModal.classList.contains(
                        "open"
                    )
                ) {
                    closeDeleteModal();
                    return;
                }

                if (
                    elements.serviceModal.classList.contains(
                        "open"
                    )
                ) {
                    closeServiceModal();
                }
            }
        );
    }

    function initialize() {
        if (!ensureRegistrationStructure()) {
            return;
        }

        initializeDashboardInformation();
        bindEvents();
        persistServices();
        renderServices();
    }

    initialize();
});