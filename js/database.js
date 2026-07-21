const DATABASE = {
    barbershops: [
        {
            slug: "demo",

            name: "Sua Barbearia",

            initials: "SB",

            description:
                "Cortes modernos, barba e cuidados com o visual em um ambiente confortável e profissional.",

            aboutTitle:
                "Atendimento, qualidade e cuidado",

            about:
                "Somos uma barbearia especializada em cortes masculinos, barba e cuidados com o visual. Nossa equipe oferece atendimento profissional em um ambiente confortável e moderno.",

            city: "Sua cidade",

            state: "UF",

            address:
                "Rua de exemplo, 100 — Centro",

            fullAddress:
                "Rua de exemplo, 100, Centro, Sua cidade - UF",

            phone:
                "5500000000000",

            instagram:
                "https://www.instagram.com/",

            maps:
                "https://www.google.com/maps/search/?api=1&query=Sua+Barbearia",

            paymentMethods:
                "Pix, dinheiro e cartão",

            banner:
                "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=85",

            businessHours: {
                sunday: {
                    open: false,
                    label: "Fechado"
                },

                monday: {
                    open: true,
                    start: "08:00",
                    end: "20:00"
                },

                tuesday: {
                    open: true,
                    start: "08:00",
                    end: "20:00"
                },

                wednesday: {
                    open: true,
                    start: "08:00",
                    end: "20:00"
                },

                thursday: {
                    open: true,
                    start: "08:00",
                    end: "20:00"
                },

                friday: {
                    open: true,
                    start: "08:00",
                    end: "20:00"
                },

                saturday: {
                    open: true,
                    start: "08:00",
                    end: "18:00"
                }
            },

            services: [
                {
                    id: 1,
                    name: "Corte masculino",
                    description:
                        "Corte personalizado de acordo com seu estilo.",
                    price: 35,
                    duration: 40
                },

                {
                    id: 2,
                    name: "Barba",
                    description:
                        "Modelagem, acabamento e cuidados com a barba.",
                    price: 25,
                    duration: 30
                },

                {
                    id: 3,
                    name: "Corte + barba",
                    description:
                        "Combo completo para renovar seu visual.",
                    price: 55,
                    duration: 60
                },

                {
                    id: 4,
                    name: "Pezinho e acabamento",
                    description:
                        "Acabamento rápido para manter o corte alinhado.",
                    price: 15,
                    duration: 20
                }
            ],

            professionals: [
                {
                    id: 1,
                    name: "Barbeiro 1",
                    role: "Barbeiro profissional",
                    photo:
                        "https://images.unsplash.com/photo-1582893561942-d61adcb2e534?auto=format&fit=crop&w=800&q=85"
                },

                {
                    id: 2,
                    name: "Barbeiro 2",
                    role: "Barbeiro profissional",
                    photo:
                        "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=85"
                }
            ],

            gallery: [
                {
                    id: 1,
                    alt: "Corte masculino moderno",
                    image:
                        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=85"
                },

                {
                    id: 2,
                    alt: "Acabamento de corte masculino",
                    image:
                        "https://images.unsplash.com/photo-1593702288056-f35abc98f9aa?auto=format&fit=crop&w=900&q=85"
                },

                {
                    id: 3,
                    alt: "Serviço de barba",
                    image:
                        "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?auto=format&fit=crop&w=900&q=85"
                },

                {
                    id: 4,
                    alt: "Corte realizado na barbearia",
                    image:
                        "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?auto=format&fit=crop&w=900&q=85"
                },

                {
                    id: 5,
                    alt: "Detalhes de corte masculino",
                    image:
                        "https://images.unsplash.com/photo-1590540179852-2110a54f813a?auto=format&fit=crop&w=900&q=85"
                },

                {
                    id: 6,
                    alt: "Ambiente da barbearia",
                    image:
                        "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=85"
                }
            ],

            availableTimes: [
                "08:00",
                "08:40",
                "09:20",
                "10:00",
                "10:40",
                "11:20",
                "13:00",
                "13:40",
                "14:20",
                "15:00",
                "15:40",
                "16:20",
                "17:00",
                "17:40",
                "18:20",
                "19:00"
            ]
        }
    ]
};