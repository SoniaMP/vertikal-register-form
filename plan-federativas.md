# Plan: Club Vertikal - Aplicación de Registro con Pago

## Contexto

El club Vertikal necesita una aplicación web donde los usuarios puedan registrarse como socios, elegir tipo de federativa y suplementos, pagar mediante Stripe, y recibir confirmación por email. Además, se necesita un panel de administración privado para gestionar los registros.

---

## Stack Tecnológico

| Tecnología                                        | Uso                                                             |
| ------------------------------------------------- | --------------------------------------------------------------- |
| **Next.js 15** (App Router)                       | Framework full-stack (frontend + API routes)                    |
| **TypeScript**                                    | Tipado estático                                                 |
| **shadcn/ui + TailwindCSS**                       | Componentes UI y estilos                                        |
| **SQLite + Prisma** (dev) / **PostgreSQL** (prod) | Base de datos y ORM                                             |
| **Stripe Checkout**                               | Pasarela de pago (página hospedada por Stripe)                  |
| **Resend + React Email**                          | Envío de emails de confirmación (tier gratuito: 100 emails/día) |
| **Auth.js v5** (NextAuth)                         | Autenticación del panel admin (Credentials + JWT)               |
| **react-hook-form + Zod**                         | Formularios y validación                                        |

**Justificación de Next.js sobre Vite + Express:** Un solo proyecto desplegable, API routes integradas para Stripe/webhooks, Server Components para el panel admin con queries directas a Prisma, middleware nativo para proteger rutas admin, y shadcn/ui está diseñado para Next.js.

**Idioma:** UI y textos en español. Código, variables y comentarios en inglés.

---

## Esquema de Base de Datos (Prisma)

```
FederationType: id, name, description, price (cents), active
Supplement: id, name, description, price (cents), active, federationTypeId (FK → FederationType)
Registration: id, firstName, lastName, email, phone, dni, dateOfBirth, address, city, postalCode, province, federationTypeId, totalAmount, paymentStatus (PENDING|COMPLETED|FAILED|REFUNDED), stripeSessionId, stripePaymentId, confirmationSent, timestamps
RegistrationSupplement: registrationId, supplementId, priceAtTime (snapshot del precio)
AdminUser: id, email, passwordHash, name
```

**Relación clave**: Cada `Supplement` pertenece a un `FederationType`. Cuando el usuario selecciona una federativa, se cargan solo los suplementos asociados a esa federativa.

- Precios en céntimos (4500 = 45.00 EUR) para evitar problemas de precisión
- `priceAtTime` captura el precio en el momento del registro (inmutable ante cambios futuros)
- **SQLite para desarrollo** (sin necesidad de instalar PostgreSQL). Cambio a PostgreSQL en producción solo requiere cambiar `provider` en schema.prisma y `DATABASE_URL`
- Datos de federativas y suplementos son **placeholder** editables, servidos desde BD via endpoint `/api/federation-types`

---

## Estrategia de Cálculo de Precios

1. **Frontend**: cálculo inmediato para feedback visual al usuario
2. **Backend**: recalcula al crear sesión de Stripe (nunca confiar en el total del frontend)
3. **Stripe**: fuente de verdad del pago real

Función compartida `calculateTotal()` usada en ambos lados.

---

## Flujo de Registro (5 pasos)

### Paso 1 - Datos Personales

- Datos personales obligatorios (nombre, apellidos, email, teléfono, DNI, fecha nacimiento, dirección)
- Validación de campos con Zod antes de avanzar

### Paso 2 - Selección de Federativa y Suplementos

- Selector de tipo de federativa (radio cards con precio)
- **Al seleccionar federativa**: se cargan dinámicamente los suplementos asociados a esa federativa
- Selector de suplementos (checkboxes con precio) — solo visible tras elegir federativa
- Resumen de precio en tiempo real (federativa + suplementos seleccionados)

### Paso 3 - Resumen

- Vista de todos los datos introducidos (solo lectura)
- Desglose de precio (federativa + suplementos = total)
- Botón "Editar" (vuelve al paso correspondiente) y "Proceder al pago"

### Paso 4 - Pago (Stripe Checkout hospedado)

- `POST /api/checkout`: valida datos, crea Registration en BD, crea Stripe Session, devuelve URL
- Redirect a página de pago de Stripe

### Paso 5 - Post-pago

- Webhook de Stripe (`checkout.session.completed`) → actualiza Registration → envía email
- Página de éxito con referencia del registro
- Página de cancelación con opción de reintentar

---

## Panel de Administración

- **Ruta**: `/admin/*` protegida por middleware de Auth.js
- **Login**: `/admin/login` con email/password contra tabla `AdminUser`
- **Lista**: tabla de registros con filtros (nombre, tipo federativa, estado pago, fecha) y paginación
- **Detalle**: vista completa de cada registro individual
- Server Components con queries directas a Prisma (sin API intermedia para lecturas)

---

## Estructura del Proyecto

```
vertikal-with-claude/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts                         # Datos iniciales (tipos, suplementos, admin)
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Layout raíz
│   │   ├── page.tsx                    # Landing / redirect a /registro
│   │   ├── registro/
│   │   │   ├── page.tsx                # Formulario multi-paso
│   │   │   ├── exito/page.tsx          # Página éxito post-pago
│   │   │   └── cancelado/page.tsx      # Página pago cancelado
│   │   ├── admin/
│   │   │   ├── layout.tsx              # Layout admin (sidebar, auth check)
│   │   │   ├── page.tsx                # Tabla de registros
│   │   │   ├── registros/[id]/page.tsx # Detalle de registro
│   │   │   └── login/page.tsx          # Login admin
│   │   └── api/
│   │       ├── checkout/route.ts       # Crear sesión Stripe
│   │       ├── webhooks/stripe/route.ts # Webhook Stripe
│   │       ├── federation-types/route.ts # Tipos + suplementos asociados
│   │       └── auth/[...nextauth]/route.ts
│   ├── components/
│   │   ├── ui/                         # shadcn/ui (button, card, input, table...)
│   │   ├── registration/              # Wizard multi-paso:
│   │   │   ├── registration-wizard.tsx # Controlador de pasos (1→2→3→4→5)
│   │   │   ├── step-indicator.tsx      # Barra de progreso visual
│   │   │   ├── personal-data-form.tsx  # Paso 1: datos personales
│   │   │   ├── federation-selector.tsx # Paso 2: selector federativa (radio cards)
│   │   │   ├── supplement-selector.tsx # Paso 2: suplementos (aparece tras elegir federativa)
│   │   │   ├── price-summary.tsx       # Paso 2: resumen precio en vivo
│   │   │   ├── registration-summary.tsx# Paso 3: resumen completo antes de pagar
│   │   │   └── success-message.tsx     # Paso 5: confirmación
│   │   ├── admin/                     # Tabla, filtros, detalle, sidebar
│   │   └── layout/                    # Header, footer
│   ├── lib/
│   │   ├── prisma.ts                  # Singleton Prisma
│   │   ├── stripe.ts                  # Cliente Stripe
│   │   ├── resend.ts                  # Cliente Resend
│   │   ├── auth.ts                    # Configuración Auth.js
│   │   └── utils.ts                   # cn() helper
│   ├── helpers/
│   │   └── price-calculator.ts        # calculateTotal(), formatPrice()
│   ├── validations/
│   │   └── registration.ts            # Esquemas Zod
│   ├── types/index.ts
│   ├── emails/
│   │   └── confirmation-email.tsx     # Template React Email
│   └── middleware.ts                  # Protección rutas /admin/*
└── scripts/
    └── create-admin.ts               # Script CLI crear admin
```

---

## API Endpoints

| Método   | Ruta                      | Auth         | Descripción                                                           |
| -------- | ------------------------- | ------------ | --------------------------------------------------------------------- |
| GET      | `/api/federation-types`   | Público      | Listar tipos federativa activos (con suplementos asociados incluidos) |
| POST     | `/api/checkout`           | Público      | Validar, crear registro, crear sesión Stripe                          |
| POST     | `/api/webhooks/stripe`    | Firma Stripe | Confirmar pago, enviar email                                          |
| GET/POST | `/api/auth/[...nextauth]` | Público      | Auth.js (login/logout/session)                                        |

---

## Orden de Implementación

### Fase 1: Scaffolding

1. Inicializar proyecto Next.js con TypeScript + Tailwind
2. Instalar dependencias (Prisma, Stripe, Resend, Auth.js, react-hook-form, Zod)
3. Configurar shadcn/ui e instalar componentes
4. Configurar Prisma, crear schema y migrar
5. Crear `.env.local` con variables de entorno
6. Crear singletons (prisma.ts, stripe.ts, resend.ts)
7. Seed de datos iniciales (tipos federativa, suplementos, usuario admin)

### Fase 2: Lógica Compartida

1. Esquemas Zod de validación
2. Funciones de cálculo de precio
3. Tipos TypeScript compartidos

### Fase 3: Formulario de Registro

1. Endpoint GET `/api/federation-types` que devuelve tipos con sus suplementos asociados
2. Wizard multi-paso (container + state management, 5 pasos)
3. Paso 1: formulario datos personales
4. Paso 2: selección federativa → carga dinámica de suplementos asociados → precio en vivo
5. Paso 3: resumen completo con desglose de precio
6. API POST `/api/checkout` (validación server-side + Stripe Session)
7. Redirect a Stripe y páginas éxito/cancelación

### Fase 4: Webhook + Email

1. Handler webhook Stripe (verificar firma, actualizar BD, enviar email)
2. Template email confirmación con React Email
3. Función de envío con Resend

### Fase 5: Panel Admin

1. Configurar Auth.js con Credentials provider
2. Middleware protección rutas /admin/\*
3. Página login admin
4. Layout admin con sidebar
5. Tabla de registros con filtros y paginación
6. Página detalle de registro
7. Script crear usuario admin

### Fase 6: Polish

1. Error boundaries y loading states
2. Responsividad móvil
3. Persistencia formulario en sessionStorage

---

## Variables de Entorno Necesarias

```
DATABASE_URL="file:./dev.db"                        # SQLite local (Prisma)
STRIPE_SECRET_KEY="sk_test_..."                     # Ya disponible
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."    # Ya disponible
STRIPE_WEBHOOK_SECRET="whsec_..."                   # stripe listen genera esto
RESEND_API_KEY="re_..."                             # Crear cuenta gratuita en resend.com
RESEND_FROM_EMAIL="onboarding@resend.dev"           # Default gratuito de Resend
NEXTAUTH_SECRET="..."                               # Generar con: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Servicios a configurar:**

- **Stripe**: Ya disponible. Usar claves de test mode
- **Resend**: Registrarse en resend.com (gratuito, 100 emails/día). Para desarrollo, el sender por defecto `onboarding@resend.dev` funciona
- **BD**: SQLite local, no requiere instalación

---

## Verificación

1. **Registro completo**: Rellenar formulario → ver resumen → pagar con tarjeta test de Stripe (4242...) → verificar email recibido → verificar registro en BD
2. **Webhook local**: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. **Panel admin**: Login → ver tabla con el registro → aplicar filtros → ver detalle
4. **Validación**: Intentar enviar formulario con campos vacíos/inválidos → verificar mensajes de error
5. **Protección admin**: Acceder a `/admin` sin login → verificar redirect a `/admin/login`
