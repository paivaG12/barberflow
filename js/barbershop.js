document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    const requestedSlug =
        params.get("barbearia") || "demo";

    const barbershop = DATABASE.barbershops.find(
        (shop) => shop.slug === requestedSlug
    );

    if (!barbershop) {
        showNotFoundPage();
        return;
    }

    renderBarbershop(barbershop);
    configureBooking(barbershop);
    configurePhoneMask();
});

function renderBarbershop(barbershop) {
    document.title =
        `${barbershop.name} | BarberFlow`;

    setText("shop-logo", barbershop.initials);
    setText("shop-name", barbershop.name);
    setText("shop-description", barbershop.description);
    setText("shop-location", `${barbershop.city} - ${barbershop.state}`);

    setText("about-title", barbershop.aboutTitle);
    setText("about-text", barbershop.about);
    setText("about-address", barbershop.address);
    setText("payment-methods", barbershop.paymentMethods);

    setText(
        "services-count",
        formatAmount(
            barbershop.services.length,
            "opção",
            "opções"
        )
    );

    setText(
        "professionals-count",
        formatAmount(
            barbershop.professionals.length,
            "profissional",
            "profissionais"
        )
    );

    setText(
        "footer-shop-name",
        `${barbershop.name} — página criada com BarberFlow.`
    );

    renderBanner(barbershop);
    renderBusinessHours(barbershop);
    renderServices(barbershop.services);
    renderProfessionals(barbershop.professionals);
    renderGallery(barbershop.gallery);
    renderContacts(barbershop);
}

function renderBanner(barbershop) {
    const banner = document.getElementById("shop-banner");

    if (!banner) {
        return;
    }

    banner.style.backgroundImage =
        `url("${barbershop.banner}")`;
}

function renderBusinessHours(barbershop) {
    const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
    ];

    const todayIndex = new Date().getDay();
    const todayKey = days[todayIndex];
    const today = barbershop.businessHours[todayKey];

    const shopStatus =
        document.getElementById("shop-status");

    if (!today || !today.open) {
        setText("shop-hours", "Fechado hoje");
        setText("today-hours", "Fechado hoje");
        setText("shop-status", "Fechado hoje");

        if (shopStatus) {
            shopStatus.classList.add("is-closed");
        }
    } else {
        const hoursText =
            `${today.start} às ${today.end}`;

        setText("shop-hours", hoursText);
        setText("today-hours", hoursText);
        setText(
            "shop-status",
            `Aberto hoje até ${today.end}`
        );

        if (shopStatus) {
            shopStatus.classList.remove("is-closed");
        }
    }

    const workingDaysText =
        createWorkingDaysText(barbershop.businessHours);

    setText("about-hours", workingDaysText);
}

function createWorkingDaysText(businessHours) {
    const monday = businessHours.monday;
    const saturday = businessHours.saturday;

    if (!monday || !monday.open) {
        return "Consulte os horários disponíveis";
    }

    const mondayHours =
        `${monday.start} às ${monday.end}`;

    if (saturday && saturday.open) {
        return `Segunda a sexta, das ${mondayHours}. Sábado, das ${saturday.start} às ${saturday.end}.`;
    }

    return `Segunda a sexta, das ${mondayHours}`;
}

function renderServices(services) {
    const servicesList =
        document.getElementById("services-list");

    if (!servicesList) {
        return;
    }

    servicesList.innerHTML = "";

    services.forEach((service) => {
        const article =
            document.createElement("article");

        article.className = "service-card";

        article.innerHTML = `
            <div class="service-card-content">
                <span class="service-duration">
                    ${service.duration} min
                </span>

                <h3>${escapeHTML(service.name)}</h3>

                <p>
                    ${escapeHTML(service.description)}
                </p>
            </div>

            <div class="service-card-footer">
                <strong>
                    ${formatCurrency(service.price)}
                </strong>

                <button
                    type="button"
                    class="service-select-button"
                    data-service-id="${service.id}"
                >
                    Escolher
                </button>
            </div>
        `;

        servicesList.appendChild(article);
    });
}

function renderProfessionals(professionals) {
    const teamList =
        document.getElementById("team-list");

    if (!teamList) {
        return;
    }

    teamList.innerHTML = "";

    professionals.forEach((professional) => {
        const article =
            document.createElement("article");

        article.className = "team-card";

        article.innerHTML = `
            <div class="team-photo">
                <img
                    src="${professional.photo}"
                    alt="${escapeHTML(professional.name)}"
                    loading="lazy"
                >
            </div>

            <div class="team-information">
                <h3>
                    ${escapeHTML(professional.name)}
                </h3>

                <p>
                    ${escapeHTML(professional.role)}
                </p>

                <button
                    type="button"
                    class="professional-select-button"
                    data-professional-id="${professional.id}"
                >
                    Agendar com este profissional
                </button>
            </div>
        `;

        teamList.appendChild(article);
    });
}

function renderGallery(gallery) {
    const galleryList =
        document.getElementById("gallery-list");

    if (!galleryList) {
        return;
    }

    galleryList.innerHTML = "";

    gallery.forEach((photo) => {
        const figure =
            document.createElement("figure");

        figure.className = "gallery-item";

        figure.innerHTML = `
            <img
                src="${photo.image}"
                alt="${escapeHTML(photo.alt)}"
                loading="lazy"
            >
        `;

        galleryList.appendChild(figure);
    });
}

function renderContacts(barbershop) {
    const whatsappLink =
        document.getElementById("whatsapp-link");

    const instagramLink =
        document.getElementById("instagram-link");

    const mapsLink =
        document.getElementById("maps-link");

    if (whatsappLink) {
        const message =
            encodeURIComponent(
                `Olá! Encontrei a ${barbershop.name} pelo BarberFlow e gostaria de mais informações.`
            );

        whatsappLink.href =
            `https://wa.me/${barbershop.phone}?text=${message}`;
    }

    if (instagramLink) {
        instagramLink.href = barbershop.instagram;
    }

    if (mapsLink) {
        mapsLink.href = barbershop.maps;
    }
}

function configureBooking(barbershop) {
    const form =
        document.getElementById("booking-form");

    const serviceSelect =
        document.getElementById("booking-service");

    const professionalSelect =
        document.getElementById("booking-professional");

    const dateInput =
        document.getElementById("booking-date");

    const timeSelect =
        document.getElementById("booking-time");

    const priceElement =
        document.getElementById("booking-price");

    const messageElement =
        document.getElementById("booking-message");

    if (
        !form ||
        !serviceSelect ||
        !professionalSelect ||
        !dateInput ||
        !timeSelect
    ) {
        return;
    }

    populateServiceSelect(
        serviceSelect,
        barbershop.services
    );

    populateProfessionalSelect(
        professionalSelect,
        barbershop.professionals
    );

    populateTimeSelect(
        timeSelect,
        barbershop.availableTimes
    );

    configureMinimumDate(dateInput);

    serviceSelect.addEventListener("change", () => {
        const selectedService =
            barbershop.services.find(
                (service) =>
                    String(service.id) === serviceSelect.value
            );

        if (!selectedService) {
            priceElement.textContent =
                "Selecione um serviço";

            return;
        }

        priceElement.textContent =
            formatCurrency(selectedService.price);
    });

    document.addEventListener("click", (event) => {
        const serviceButton =
            event.target.closest(
                ".service-select-button"
            );

        if (serviceButton) {
            serviceSelect.value =
                serviceButton.dataset.serviceId;

            serviceSelect.dispatchEvent(
                new Event("change")
            );

            scrollToBooking();
        }

        const professionalButton =
            event.target.closest(
                ".professional-select-button"
            );

        if (professionalButton) {
            professionalSelect.value =
                professionalButton.dataset.professionalId;

            scrollToBooking();
        }
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const selectedService =
            barbershop.services.find(
                (service) =>
                    String(service.id) === serviceSelect.value
            );

        const selectedProfessional =
            barbershop.professionals.find(
                (professional) =>
                    String(professional.id) ===
                    professionalSelect.value
            );

        const customerName =
            document
                .getElementById("customer-name")
                .value
                .trim();

        const customerPhone =
            document
                .getElementById("customer-phone")
                .value
                .trim();

        if (
            !selectedService ||
            !selectedProfessional ||
            !dateInput.value ||
            !timeSelect.value ||
            !customerName ||
            !customerPhone
        ) {
            showBookingMessage(
                messageElement,
                "Preencha todos os campos para continuar.",
                "error"
            );

            return;
        }

        const formattedDate =
            formatDate(dateInput.value);

        const confirmationText =
            `${customerName}, seu horário foi reservado para ${formattedDate}, às ${timeSelect.value}, com ${selectedProfessional.name}. Serviço: ${selectedService.name}.`;

        showBookingMessage(
            messageElement,
            confirmationText,
            "success"
        );

        saveBooking({
            barbershop: barbershop.name,
            service: selectedService.name,
            professional: selectedProfessional.name,
            date: dateInput.value,
            time: timeSelect.value,
            customerName,
            customerPhone,
            price: selectedService.price
        });

        form.reset();

        priceElement.textContent =
            "Selecione um serviço";
    });
}

function populateServiceSelect(select, services) {
    services.forEach((service) => {
        const option =
            document.createElement("option");

        option.value = service.id;

        option.textContent =
            `${service.name} — ${formatCurrency(service.price)}`;

        select.appendChild(option);
    });
}

function populateProfessionalSelect(
    select,
    professionals
) {
    professionals.forEach((professional) => {
        const option =
            document.createElement("option");

        option.value = professional.id;
        option.textContent = professional.name;

        select.appendChild(option);
    });
}

function populateTimeSelect(select, times) {
    times.forEach((time) => {
        const option =
            document.createElement("option");

        option.value = time;
        option.textContent = time;

        select.appendChild(option);
    });
}

function configureMinimumDate(dateInput) {
    const today = new Date();

    const year = today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const day =
        String(today.getDate()).padStart(2, "0");

    dateInput.min =
        `${year}-${month}-${day}`;
}

function configurePhoneMask() {
    const phoneInput =
        document.getElementById("customer-phone");

    if (!phoneInput) {
        return;
    }

    phoneInput.addEventListener("input", () => {
        let value =
            phoneInput.value.replace(/\D/g, "");

        value = value.slice(0, 11);

        if (value.length <= 2) {
            phoneInput.value =
                value.replace(
                    /(\d{0,2})/,
                    "($1"
                );

            return;
        }

        if (value.length <= 6) {
            phoneInput.value =
                value.replace(
                    /(\d{2})(\d+)/,
                    "($1) $2"
                );

            return;
        }

        if (value.length <= 10) {
            phoneInput.value =
                value.replace(
                    /(\d{2})(\d{4})(\d+)/,
                    "($1) $2-$3"
                );

            return;
        }

        phoneInput.value =
            value.replace(
                /(\d{2})(\d{5})(\d+)/,
                "($1) $2-$3"
            );
    });
}

function saveBooking(booking) {
    const savedBookings =
        JSON.parse(
            localStorage.getItem(
                "barberflow-bookings"
            )
        ) || [];

    savedBookings.push({
        id: Date.now(),
        createdAt: new Date().toISOString(),
        ...booking
    });

    localStorage.setItem(
        "barberflow-bookings",
        JSON.stringify(savedBookings)
    );
}

function showBookingMessage(
    element,
    message,
    type
) {
    if (!element) {
        return;
    }

    element.textContent = message;

    element.classList.remove(
        "success",
        "error"
    );

    element.classList.add(type);
}

function scrollToBooking() {
    const bookingSection =
        document.getElementById("agendamento");

    if (!bookingSection) {
        return;
    }

    bookingSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function showNotFoundPage() {
    const page =
        document.getElementById("barbershop-page");

    const notFoundSection =
        document.getElementById("not-found-section");

    const footer =
        document.querySelector(".footer");

    if (page) {
        page.hidden = true;
    }

    if (notFoundSection) {
        notFoundSection.hidden = false;
    }

    if (footer) {
        footer.hidden = true;
    }

    document.title =
        "Barbearia não encontrada | BarberFlow";
}

function setText(elementId, text) {
    const element =
        document.getElementById(elementId);

    if (element) {
        element.textContent = text;
    }
}

function formatCurrency(value) {
    return new Intl.NumberFormat(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    ).format(value);
}

function formatDate(dateString) {
    const date =
        new Date(`${dateString}T12:00:00`);

    return new Intl.DateTimeFormat(
        "pt-BR"
    ).format(date);
}

function formatAmount(
    amount,
    singular,
    plural
) {
    const word =
        amount === 1 ? singular : plural;

    return `${amount} ${word}`;
}

function escapeHTML(value) {
    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}