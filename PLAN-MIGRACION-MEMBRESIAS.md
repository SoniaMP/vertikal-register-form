# Plan: Migrar Registration → Member + Membership

## Contexto

Actualmente el sistema usa un modelo `Registration` monolítico que mezcla datos de identidad personal (nombre, DNI, dirección) con datos anuales de membresía (federación, pago, estado). Esto impide tener historial por temporada y obliga a duplicar datos personales cada año. El objetivo es separar en `Member` (identidad, DNI único) y `Membership` (instancia anual por socio), siguiendo el diseño definido en `MIGRACION-MEMBRESIA.md`.

---

## Pasos

### Paso 1 — Tipos TypeScript nuevos
- **Archivo**: `src/types/index.ts`
- Agregar `MEMBERSHIP_STATUS` const + tipo `MembershipStatus`
- Agregar tipos `MemberRecord`, `MembershipRecord`, `MembershipSupplementRecord`
- NO eliminar los tipos `Registration*` existentes todavía
- **Verificar**: `npm run lint` pasa

### Paso 2 — Nuevos modelos Prisma (aditivo)
- **Archivo**: `prisma/schema.prisma`
- Agregar `Member`, `Membership`, `MembershipSupplement` al lado de los modelos existentes
- Agregar relación `memberships Membership[]` en `FederationType`, `FederationSubtype`, `Category`
- Agregar relación `membershipSupplements MembershipSupplement[]` en `Supplement`
- NO tocar `Registration` ni `RegistrationSupplement`
- **Ejecutar**: `npx prisma migrate dev --name add_member_and_membership`
- **Verificar**: migración exitosa, `npm run build` pasa

### Paso 3 — Helpers de migración con tests
- **Crear**: `src/helpers/migration-helpers.ts`
- **Crear**: `src/helpers/__tests__/migration-helpers.test.ts`
- Funciones: `inferYear(createdAt)`, `inferMembershipStatus(reg)`, `normalizeDni(dni)`
- Tests: cubrir los edge cases (dic 14 vs dic 15, combinaciones de active/paymentStatus)
- **Verificar**: `npm test` pasa

### Paso 4 — Script de migración de datos
- **Crear**: `prisma/migrate-to-members.ts`
- Fase 1: Crear `Member` por cada DNI único (datos del registro más reciente)
- Fase 2: Crear `Membership` por cada `Registration` con año inferido, resolver conflictos `(memberId, year)`
- Fase 3: Migrar `RegistrationSupplement` → `MembershipSupplement`
- Fase 4: Validación (counts, orphans)
- Agregar script `"db:migrate-members"` en `package.json`
- **Verificar**: ejecutar, comparar counts, spot-check en Prisma Studio

### Paso 5 — Actualizar API checkout
- **Archivo**: `src/app/api/checkout/route.ts`
- Reemplazar `prisma.registration.create` por: upsert `Member` por DNI + create `Membership` con `year` del `inferYear(new Date())`
- Actualizar `stripeSessionId` y `FAILED` update para operar sobre `Membership`
- Cambiar metadata Stripe: `membershipId` en vez de `registrationId`
- Cambiar cancel URL: `membership_id=` en vez de `registration_id=`
- **Archivo test**: `src/app/api/checkout/__tests__/route.test.ts` — actualizar mocks
- **Verificar**: `npm test` pasa, probar checkout manual

### Paso 6 — Actualizar lookup de renovación
- **Archivo**: `src/app/registro/actions.ts`
- `findRegistrationByDni` → `findMemberByDni`: query `prisma.member.findUnique({ where: { dni } })` con última membresía incluida
- Mapear resultado al mismo tipo `RenewalSearchResult`
- **Archivo**: `src/components/registration/renewal-lookup.tsx` — actualizar import
- **Verificar**: flujo de renovación funciona

### Paso 7 — Actualizar acciones admin de registros
- **Archivo**: `src/app/admin/(dashboard)/registros/actions.ts`
- `updateRegistration` → recibe `membershipId`, actualiza personal data en `Member` y payment en `Membership`
- `toggleRegistrationActive` → `updateMembershipStatus(id, status)` opera sobre `Membership.status`
- `toggleRegistrationFederated` → `toggleMembershipFederated` opera sobre `Membership`
- `createRegistration` → `createMemberWithMembership`: upsert Member + create Membership para año actual
- `searchByDni` → query `prisma.member.findUnique` con última membresía
- `deleteRegistration` → `deleteMembership`: elimina MembershipSupplement + Membership (y Member si no tiene otras)
- **Verificar**: `npm run lint` pasa

### Paso 8 — Actualizar página admin dashboard
- **Archivo**: `src/app/admin/(dashboard)/page.tsx`
- Query cambia de `prisma.registration.findMany` a `prisma.membership.findMany` con `include: { member: true, ... }`
- `buildWhere`: filtros de texto van por `member: { firstName: { contains } }`, filtro `active` se reemplaza por `status`
- **Verificar**: página carga, filtros funcionan, paginación funciona

### Paso 9 — Actualizar componentes admin (tabla, detalle, acciones, filtros, formularios)
- **Archivos** (renombrar y actualizar):
  - `registrations-table.tsx` → `memberships-table.tsx`: acceder datos personales via `membership.member.*`, reemplazar `active` boolean por badge de `status`
  - `registration-detail.tsx` → `membership-detail.tsx`: separar datos personales (member) de datos de membresía
  - `registration-actions.tsx` → `membership-actions.tsx`: usar nuevas server actions
  - `registration-form-dialog.tsx` → `member-form-dialog.tsx`: form update usa `membershipId` + `memberId`
  - `registration-form-fields.tsx` → `member-form-fields.tsx`
  - `registration-filters.tsx` → `membership-filters.tsx`: reemplazar filtro `active` por `status` dropdown
  - `advanced-filters-sheet.tsx`: quitar campo `active`, agregar `status`
  - `federated-toggle.tsx`: prop `registrationId` → `membershipId`
  - `create-registration-dialog.tsx` → `create-member-dialog.tsx`
  - `create-registration-button.tsx` → `create-member-button.tsx`
- **Archivo**: `src/app/admin/(dashboard)/registros/[id]/page.tsx` — query `prisma.membership.findUnique` con includes
- **Verificar**: `npm run build` pasa, todas las vistas admin funcionan

### Paso 10 — Actualizar guards de catálogo
- **Archivos**:
  - `tipos-federacion/actions/federation-type-actions.ts`
  - `tipos-federacion/actions/subtype-actions.ts`
  - `tipos-federacion/actions/category-actions.ts`
- Cambiar `prisma.registration.count(...)` → `prisma.membership.count(...)`
- Actualizar mensajes de error
- **Verificar**: tests existentes actualizados y pasan

### Paso 11 — Actualizar y agregar tests
- Actualizar mocks en todos los test files existentes (`registration` → `member`/`membership`)
- Agregar tests para la lógica de upsert de Member
- **Verificar**: `npm test` pasa completamente

### Paso 12 — Eliminar modelos viejos
- **Archivo**: `prisma/schema.prisma`
- Eliminar `Registration` y `RegistrationSupplement`
- Quitar relaciones `registrations` de `FederationType`, `FederationSubtype`, `Category`
- Quitar `registrationSupplements` de `Supplement`
- **Ejecutar**: `npx prisma migrate dev --name drop_registration`
- **Archivo**: `src/types/index.ts` — eliminar `RegistrationRecord`, `RegistrationSupplementRecord`, `RegistrationFormData`
- **Verificar**: `npm run build` y `npm test` pasan

### Paso 13 — Setting CURRENT_SEASON_YEAR
- **Archivo**: `src/lib/settings.ts` — agregar `getCurrentSeasonYear()` que lee de `AppSetting` o fallback a `inferYear(new Date())`
- Usar en admin page y checkout route en vez de calcular inline
- **Verificar**: admin muestra el año correcto, checkout crea membership con año correcto

---

## Archivos clave
| Archivo | Cambio |
|---------|--------|
| `prisma/schema.prisma` | Agregar Member/Membership, luego eliminar Registration |
| `src/types/index.ts` | Nuevos tipos, luego limpiar viejos |
| `src/app/api/checkout/route.ts` | Member upsert + Membership create |
| `src/app/admin/(dashboard)/registros/actions.ts` | Todas las acciones CRUD reescritas |
| `src/app/admin/(dashboard)/page.tsx` | Query y filtros cambian a Membership-centric |
| `src/app/registro/actions.ts` | Lookup por DNI → Member model |
| `src/components/admin/*.tsx` | ~10 componentes renombrados y actualizados |
| `src/helpers/migration-helpers.ts` | Nuevo: inferYear, inferStatus, normalizeDni |
| `prisma/migrate-to-members.ts` | Nuevo: script de migración de datos |

## Verificación final
1. `npm run lint` — sin errores
2. `npm test` — todos los tests pasan
3. `npm run build` — build exitoso
4. Prueba manual completa: nuevo registro → checkout → éxito, renovación por DNI, admin lista/detalle/editar/eliminar/filtros, crear socio manual, toggle federado
