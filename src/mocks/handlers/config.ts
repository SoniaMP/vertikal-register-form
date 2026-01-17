/**
 * MSW Handlers for Configuration API
 */

import { http, HttpResponse, delay } from "msw";

const API_BASE = "/api";

// Global configuration
const globalConfig = {
  clubFee: 20,
  currency: "EUR",
  clubInfo: {
    name: "VERTIKAL",
    address: "C/ Espronceda, 16 2-B",
    postalCode: "30140",
    city: "Santomera (Murcia)",
    email: "gestion@clubvertikal.es",
  },
  federations: [
    {
      id: "FERM",
      title: "Licencia FERM - Federación de Espeleología de la Región de Murcia",
      imageUrl: "/assets/precio-licencias-ferm.png",
      physicalCardPrice: 3,
      complementsFixedPrice: 5,
      options: [
        { value: "FERM_BASICA_A", label: "Básica A" },
        { value: "FERM_BASICA_B", label: "Básica B" },
        { value: "FERM_BASICA_B1", label: "Básica B1" },
        { value: "FERM_PLUS_A", label: "Plus A" },
        { value: "FERM_PLUS_B", label: "Plus B" },
        { value: "FERM_PLUS_B1", label: "Plus B1" },
        { value: "FERM_HABILITACION", label: "Habilitación" },
      ],
      complements: [
        { key: "technician", label: "Técnico" },
        { key: "referee", label: "Árbitro" },
        { key: "caveRescuer", label: "Espeleosocorrista" },
      ],
    },
    {
      id: "FMRM",
      title: "Licencia FMRM - Federación de Montañismo de la Región de Murcia",
      imageUrl: "/assets/precio-licencias-fmrm.png",
      physicalCardPrice: 2,
      options: [
        {
          value: "FMRM_A",
          label:
            "A (España, Andorra, Pirineo Francés, Portugal y Marruecos - Sólo excursionismo, montañismo, senderismo, marcha nórdica, campamentos y marchas)",
        },
        {
          value: "FMRM_B",
          label: "B (España, Andorra, Pirineo Francés, Portugal y Marruecos)",
        },
        { value: "FMRM_C", label: "C (Europa y Marruecos)" },
        {
          value: "FMRM_D",
          label: "D (Mundial hasta 7.000m, sin excursiones polares)",
        },
        {
          value: "FMRM_E",
          label: "E (Expediciones polares y montañas de más de 7.000m)",
        },
        {
          value: "FMRM_OT",
          label:
            "OT (Octubre y Diciembre en España, Andorra, Pirineo Francés, Portugal y Marruecos)",
        },
        {
          value: "FMRM_AU",
          label: "AU (Región de Murcia - NO válida para competición)",
        },
        { value: "FMRM_HABILITACION", label: "Habilitación" },
      ],
      complements: [
        { key: "mountainBike", label: "Bicicleta de montaña", price: 9 },
        { key: "alpineSki", label: "Esquí alpino", price: 35.5 },
        { key: "snow", label: "Snow", price: 49 },
      ],
    },
    {
      id: "FEDME",
      title: "Licencia FEDME - Federación Española de Deportes de Montaña y Escalada",
      imageUrl: "/assets/precio-licencias-fedme.png",
      physicalCardPrice: 2,
      options: [
        {
          value: "FEDME_A",
          label:
            "A (España, Andorra, Pirineo Francés, Portugal y Marruecos - Sólo excursionismo, montañismo, senderismo, marcha nórdica, campamentos y marchas)",
        },
        {
          value: "FEDME_B",
          label: "B (España, Andorra, Pirineo Francés, Portugal y Marruecos)",
        },
        { value: "FEDME_C", label: "C (Europa y Marruecos)" },
        {
          value: "FEDME_D",
          label: "D (Mundial hasta 7.000m, sin excursiones polares)",
        },
        {
          value: "FEDME_E",
          label: "E (Expediciones polares y montañas de más de 7.000m)",
        },
        {
          value: "FEDME_OT",
          label:
            "OT (Octubre y Diciembre en España, Andorra, Pirineo Francés, Portugal y Marruecos)",
        },
      ],
      complements: [
        { key: "mountainBike", label: "Bicicleta de montaña", price: 9 },
        { key: "alpineSki", label: "Esquí alpino", price: 35.5 },
        { key: "snow", label: "Snow", price: 49 },
      ],
    },
  ],
};

export const configHandlers = [
  // GET /api/config - Get global configuration
  http.get(`${API_BASE}/config`, async () => {
    await delay(300);

    return HttpResponse.json({
      success: true,
      data: globalConfig,
    });
  }),

  // GET /api/config/federations - Get all federations
  http.get(`${API_BASE}/config/federations`, async () => {
    await delay(200);

    return HttpResponse.json({
      success: true,
      data: globalConfig.federations,
    });
  }),

  // GET /api/config/federations/:id - Get specific federation config
  http.get(`${API_BASE}/config/federations/:id`, async ({ params }) => {
    await delay(150);

    const { id } = params as { id: string };
    const federation = globalConfig.federations.find(
      (f) => f.id === id.toUpperCase()
    );

    if (!federation) {
      return HttpResponse.json(
        {
          success: false,
          error: `Federation ${id} not found`,
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: federation,
    });
  }),

  // GET /api/config/club - Get club info
  http.get(`${API_BASE}/config/club`, async () => {
    await delay(100);

    return HttpResponse.json({
      success: true,
      data: {
        ...globalConfig.clubInfo,
        fee: globalConfig.clubFee,
        currency: globalConfig.currency,
      },
    });
  }),
];
