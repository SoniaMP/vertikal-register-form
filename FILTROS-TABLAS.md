# Plan: Mejora del Panel de Admin - Miembros

## Contexto

El panel actual (`/admin`) muestra una tabla de memberships sin filtro de temporada (muestra todo), sin ordenación por columnas, sin métricas, y usa un Sheet lateral para filtros avanzados. Queremos un panel robusto con temporada como contexto principal, búsqueda rápida, filtros en toolbar + panel colapsable, métricas, y vista "no renovados".

**Decisiones tomadas:**
- Mantener shadcn/ui (no MUI)
- Usar Season.name como selector (sin cambios de schema, filtrar por seasonId)

---

## Fase 0: Backend — Queries, tipos e índices

### 0.1 Índice en `prisma/schema.prisma`
Añadir `@@index([dni])` al modelo Member (los demás índices ya existen).

### 0.2 Tipos de filtros — `src/types/membership-filters.ts` (~50 LOC)

```typescript
export type SortField = "memberName" | "email" | "totalAmount" | "createdAt" | "status" | "paymentStatus";
export type SortDirection = "asc" | "desc";

export type MembershipFilterState = {
  seasonId: string;           // obligatorio
  search: string;             // nombre/DNI
  paymentStatus: string;      // "" | PENDING | COMPLETED | FAILED | REFUNDED
  membershipStatus: string;   // "" | PENDING_PAYMENT | ACTIVE | EXPIRED | CANCELLED
  federated: string;          // "" | "true" | "false"
  typeId: string;             // filtro avanzado
  subtypeId: string;
  categoryId: string;
  province: string;
  city: string;
  dateFrom: string;           // ISO date
  dateTo: string;
  view: string;               // "" | "not_renewed" | "morosos" | "federados"
  sortBy: SortField;
  sortDir: SortDirection;
  page: number;
};

export type SeasonOption = { id: string; name: string; isActive: boolean };
```

### 0.3 Módulo de queries — `src/lib/admin-queries.ts` (~180 LOC)

3 funciones principales:

**`fetchMembershipList(filters)`** — Listado con filtros, paginación y ordenación
- WHERE: siempre `seasonId`, luego AND de cada filtro activo
- Búsqueda rápida: OR en `member.firstName`, `member.lastName`, `member.dni`, `member.email` (contains)
- orderBy mapeado: `memberName` → `member.lastName`, `email` → `member.email`, etc.
- Paginación: skip/take con PAGE_SIZE = 15
- Include: member, type (select), subtype (select), category (select)

**`fetchSeasonMetrics(seasonId)`** — Métricas agregadas
- `count` total, `groupBy status`, `groupBy paymentStatus`, `aggregate _sum totalAmount` (donde paymentStatus=COMPLETED), `count isFederated=true`
- Retorna `SeasonMetrics { totalMembers, byStatus, byPaymentStatus, totalRevenue, federatedCount }`

**`fetchNotRenewedMembers(currentSeasonId, previousSeasonId, page)`** — No renovados
- Busca memberIds con ACTIVE en temporada anterior
- Filtra los que NO tienen membership en temporada actual
- Retorna Members paginados

Funciones auxiliares:
- `fetchAllSeasons()` — todas las temporadas ordenadas por startDate desc
- `getPreviousSeason(currentSeasonId)` — temporada anterior por startDate

### 0.4 Serialización de filtros — `src/lib/filter-params.ts` (~60 LOC)

- `parseFilterParams(params, defaultSeasonId)` → MembershipFilterState
- `serializeFilters(filters, defaultSeasonId)` → URLSearchParams (solo valores no-default)
- `getActiveFilterEntries(filters)` → array de {key, label, value} para chips

**URL de ejemplo:** `/admin?seasonId=clxx123&search=garcia&paymentStatus=PENDING&sortBy=memberName&sortDir=asc&page=2`

---

## Fase 1: Selector de temporada + tabla con paginación/ordenación server-side

### 1.1 Refactorizar `src/app/admin/(dashboard)/page.tsx` (~60 LOC)
- Obtener `activeSeason` + `allSeasons` al inicio
- Parsear filtros con `parseFilterParams(params, activeSeason.id)`
- Llamar `fetchMembershipList(filters)` en vez de query inline
- Pasar `sortBy`/`sortDir` a MembershipsTable

### 1.2 Crear `src/components/admin/season-selector.tsx` (~45 LOC)
- Client component con Select de shadcn/ui
- Al cambiar, actualiza `seasonId` en URL y resetea `page`

### 1.3 Dividir `src/components/admin/memberships-table.tsx` (225 LOC actual → 4 archivos)

| Archivo nuevo | LOC | Contenido |
|---|---|---|
| `membership-status-badges.tsx` | ~40 | StatusBadges + constantes PAYMENT_VARIANTS/LABELS, STATUS_VARIANTS/LABELS |
| `membership-row-desktop.tsx` | ~65 | DesktopRow (extraído tal cual + imports) |
| `membership-row-mobile.tsx` | ~55 | MobileCard (extraído tal cual + imports) |
| `sortable-header.tsx` | ~35 | Client component: click → toggle sortBy/sortDir en URL |

Refactorizar `memberships-table.tsx` (~50 LOC): solo ensambla header (con SortableHeader) + body, recibe props `sortBy` y `sortDir`.

### 1.4 Actualizar `src/components/admin/pagination.tsx`
- Añadir prop `total` y mostrar "Mostrando X-Y de Z miembros"

---

## Fase 2: Búsqueda rápida + filtros rápidos

### 2.1 Crear `src/components/admin/memberships-toolbar.tsx` (~80 LOC)
Reemplaza `membership-filters.tsx`. Toolbar horizontal con:
1. Input búsqueda con debounce 300ms (nombre/DNI)
2. Select estado de pago (paymentStatus)
3. Select estado de membresía (membershipStatus)
4. Select federado (Sí/No/Todos)
5. Botón "Filtros avanzados" (toggle, para Fase 3)
6. Botón "Limpiar filtros" (si hay activos)

### 2.2 Crear `src/hooks/use-filter-navigation.ts` (~40 LOC)
Hook reutilizable: `updateParam(key, value)`, `updateParamDebounced(key, value, delay)`, `clearAll()` (preserva seasonId).

### 2.3 Eliminar archivos obsoletos
- `src/components/admin/membership-filters.tsx`
- `src/components/admin/advanced-filters-sheet.tsx`

---

## Fase 3: Filtros avanzados (panel colapsable) + chips

### 3.1 Crear `src/components/admin/advanced-filters-panel.tsx` (~100 LOC)
- Usa `Collapsible` de shadcn/ui (ya existe en `src/components/ui/collapsible.tsx`)
- Grid responsivo con selects: typeId, subtypeId (cascading), categoryId
- Inputs: province, city
- Inputs date: dateFrom, dateTo
- Botones Aplicar / Limpiar

### 3.2 Crear `src/components/admin/active-filter-chips.tsx` (~70 LOC)
- Badges con X para cada filtro activo (excluye seasonId, sort, page)
- Labels en español: "Estado pago: Pendiente", "Federado: Sí", etc.
- Click en X → elimina ese filtro de la URL

---

## Fase 4: Tarjetas de métricas

### 4.1 Crear `src/components/admin/season-metrics.tsx` (~90 LOC)
Server component, 4 cards en grid:
1. **Total miembros** — count + desglose por status
2. **Ingresos** — suma totalAmount completados + desglose por paymentStatus
3. **Activos** — count ACTIVE + pendientes de pago
4. **Federados** — count + % del total

### 4.2 Integrar en page.tsx
Añadir `fetchSeasonMetrics(filters.seasonId)` al Promise.all y renderizar `<SeasonMetricsCards>`.

---

## Fase 5: Vista "No renovados" + vistas guardadas

### 5.1 Crear `src/components/admin/saved-views-selector.tsx` (~45 LOC)
Botones de toggle en toolbar: Todos | No renovados | Morosos | Federados
- "Morosos" → aplica paymentStatus=PENDING + status=ACTIVE
- "Federados" → aplica federated=true
- "No renovados" → query especial

### 5.2 Lógica server-side en page.tsx
- `view=morosos` / `view=federados` → sobrescriben filtros y usan `fetchMembershipList`
- `view=not_renewed` → usa `fetchNotRenewedMembers()` con temporada anterior

### 5.3 Crear `src/components/admin/not-renewed-table.tsx` (~80 LOC)
Tabla de Members (no Memberships): nombre, DNI, email, teléfono, última temporada.

---

## Fase 6: Pulido + exportación + tests

### 6.1 Estados vacíos y carga
- Mejorar empty state con icono + botón "limpiar filtros"
- Actualizar `src/app/admin/(dashboard)/loading.tsx` con skeletons para métricas + toolbar + tabla

### 6.2 Exportación CSV — `src/app/admin/(dashboard)/export/route.ts` (~80 LOC)
- Route handler GET con mismos query params
- Query sin paginación (take: 5000 como protección)
- Genera CSV con BOM para Excel
- Botón "Exportar" en toolbar: `<a href="/admin/export?${params}" download>`

### 6.3 Accesibilidad
- `aria-sort` en SortableHeader
- `aria-label` en chips y botones de filtro
- `<nav aria-label="Paginación">` en Pagination

### 6.4 Tests
- `src/lib/__tests__/admin-queries.test.ts` — buildMembershipWhere, buildOrderBy
- `src/lib/__tests__/filter-params.test.ts` — parseFilterParams, serializeFilters
- `src/components/admin/__tests__/active-filter-chips.test.tsx`
- `src/components/admin/__tests__/season-metrics.test.tsx`

---

## Jerarquía de componentes (resultado final)

```
page.tsx (server)
├── SeasonSelector (client)
├── CreateMemberButton (client, existente)
├── SeasonMetricsCards (server)
├── MembershipsToolbar (client)
│   ├── Input búsqueda (debounce)
│   ├── Select paymentStatus
│   ├── Select membershipStatus
│   ├── Select federated
│   ├── SavedViewsSelector (client)
│   ├── Button exportar
│   └── AdvancedFiltersPanel (client, Collapsible)
├── ActiveFilterChips (client)
├── MembershipsTable (server) | NotRenewedTable (server)
│   ├── SortableHeader (client)
│   ├── MembershipRowDesktop
│   ├── MembershipRowMobile
│   └── MembershipStatusBadges
└── Pagination (client)
```

## Resumen de archivos

| Acción | Ruta | LOC | Fase |
|--------|------|-----|------|
| CREAR | `src/types/membership-filters.ts` | ~50 | 0 |
| CREAR | `src/lib/admin-queries.ts` | ~180 | 0 |
| CREAR | `src/lib/filter-params.ts` | ~60 | 0 |
| CREAR | `src/hooks/use-filter-navigation.ts` | ~40 | 2 |
| CREAR | `src/components/admin/season-selector.tsx` | ~45 | 1 |
| CREAR | `src/components/admin/sortable-header.tsx` | ~35 | 1 |
| CREAR | `src/components/admin/membership-row-desktop.tsx` | ~65 | 1 |
| CREAR | `src/components/admin/membership-row-mobile.tsx` | ~55 | 1 |
| CREAR | `src/components/admin/membership-status-badges.tsx` | ~40 | 1 |
| CREAR | `src/components/admin/memberships-toolbar.tsx` | ~80 | 2 |
| CREAR | `src/components/admin/advanced-filters-panel.tsx` | ~100 | 3 |
| CREAR | `src/components/admin/active-filter-chips.tsx` | ~70 | 3 |
| CREAR | `src/components/admin/season-metrics.tsx` | ~90 | 4 |
| CREAR | `src/components/admin/saved-views-selector.tsx` | ~45 | 5 |
| CREAR | `src/components/admin/not-renewed-table.tsx` | ~80 | 5 |
| CREAR | `src/app/admin/(dashboard)/export/route.ts` | ~80 | 6 |
| MODIF | `prisma/schema.prisma` | +1 | 0 |
| MODIF | `src/app/admin/(dashboard)/page.tsx` | ~60 | 1 |
| MODIF | `src/components/admin/memberships-table.tsx` | ~50 | 1 |
| MODIF | `src/components/admin/pagination.tsx` | ~55 | 1 |
| MODIF | `src/app/admin/(dashboard)/loading.tsx` | ~25 | 6 |
| ELIM | `src/components/admin/membership-filters.tsx` | — | 2 |
| ELIM | `src/components/admin/advanced-filters-sheet.tsx` | — | 3 |
| TEST | `src/lib/__tests__/admin-queries.test.ts` | ~80 | 6 |
| TEST | `src/lib/__tests__/filter-params.test.ts` | ~60 | 6 |

## Verificación

Después de cada fase:
1. `npx prisma migrate dev` (Fase 0)
2. `npm run build` — sin errores de TypeScript
3. `npm run dev` → navegar a `/admin` y verificar:
   - Selector de temporada funciona y filtra
   - Ordenación por columnas actualiza URL y resultados
   - Búsqueda con debounce funciona
   - Filtros rápidos + avanzados + chips
   - Métricas reflejan datos reales
   - Vista "no renovados" muestra miembros correctos
   - Exportar CSV descarga archivo válido
4. `npm test` — todos los tests pasan
5. `npm run lint` — sin warnings
