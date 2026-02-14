# Plan: Mejoras en la sección de cursos del admin

## Context
The courses admin form (`/admin/cursos`) needs several improvements: rich text description, image URL field, no required fields, visual rename of "Tipo de curso" to "Categoría", and inline management of multiple prices per course. The `CoursePrice` model and `image` field already exist in the schema — no migrations needed.

---

## Step 1: Install Tiptap
```
npm install @tiptap/react @tiptap/starter-kit @tiptap/pm
```

## Step 2: Create `RichTextEditor` component
**New file:** `src/components/ui/rich-text-editor.tsx` (~80 LOC)
- Headless Tiptap editor with `StarterKit`
- Simple toolbar: bold, italic, headings, bullet/ordered list
- Props: `defaultValue`, `onChange(html)`, `placeholder`
- Add minimal ProseMirror styles in `globals.css`

## Step 3: Relax Zod validations
**File:** `src/validations/course.ts`
- Make all `courseCatalogSchema` fields optional with defaults (title→`""`, courseDate→`nullable`, courseTypeId→`""`, address→`""`, description→`""`, maxCapacity→`nullable`)
- Add `coursePriceEntrySchema`: `{ id?: string, name: string, amountCents: number }`

## Step 4: Rename "Tipo de curso" → "Categoría" (visual only)
Label-only changes in:
- `src/components/admin/courses/course-form-dialog.tsx` — label, placeholder, aria-label
- `src/components/admin/courses/course-type-form-dialog.tsx` — dialog title
- `src/components/admin/courses/courses-toolbar.tsx` — filter label if present
- Table/card components if they show "tipo"

Model name `CourseType` stays unchanged in code.

## Step 5: Split form dialog + add new fields
Current `course-form-dialog.tsx` is 195 LOC; needs splitting to stay under limits.

**Refactored `course-form-dialog.tsx`** (~90 LOC) — Dialog shell, `useActionState`, state for `description` and `prices`, hidden inputs for both, submit/cancel buttons.

**New `course-form-fields.tsx`** (~80 LOC) — Basic fields extracted: title, category select + inline "new category" button, date, address, maxCapacity. Remove all `required`/`minLength` HTML attributes.

**New `course-image-field.tsx`** (~40 LOC) — URL text input (`name="image"`) + image preview with `onError` hide.

**New `course-description-field.tsx`** (~20 LOC) — Label + `RichTextEditor` wrapper, calls `onChange` to sync HTML to parent state.

**New `course-price-list.tsx`** (~90 LOC) — Dynamic price rows (name + euros input). Add/remove rows. `PriceRow` type: `{ id?: string, name: string, amountCents: number }`. Euros↔cents conversion in the component.

## Step 6: Update types and queries
**File:** `src/components/admin/courses/types.ts`
- Add `description`, `image`, `prices[]` to `CourseRow`

**File:** `src/lib/course-queries.ts`
- Include `prices` (active only) and `description`/`image` in `fetchCourseList` Prisma query

## Step 7: Update server actions to handle prices
**File:** `src/app/admin/(dashboard)/cursos/actions/course-catalog-actions.ts`
- Parse `formData.get("pricesJson")` → validate with `z.array(coursePriceEntrySchema)`
- `createCourse`: after creating course, `createMany` for prices
- `updateCourse`: in a `$transaction`: delete removed prices, upsert kept/new prices
- Extract `syncCoursePrices()` to separate file if actions file exceeds 200 LOC

---

## Files to modify
| File | Change |
|------|--------|
| `src/validations/course.ts` | Relax schema, add price entry schema |
| `src/components/admin/courses/course-form-dialog.tsx` | Refactor: keep dialog shell only |
| `src/components/admin/courses/course-type-form-dialog.tsx` | Rename labels |
| `src/components/admin/courses/courses-toolbar.tsx` | Rename "tipo" → "categoría" |
| `src/components/admin/courses/types.ts` | Add description, image, prices |
| `src/lib/course-queries.ts` | Include prices in query |
| `src/app/admin/(dashboard)/cursos/actions/course-catalog-actions.ts` | Handle prices JSON |

## New files
| File | Purpose |
|------|---------|
| `src/components/ui/rich-text-editor.tsx` | Reusable Tiptap editor |
| `src/components/admin/courses/course-form-fields.tsx` | Basic form fields extracted |
| `src/components/admin/courses/course-image-field.tsx` | Image URL + preview |
| `src/components/admin/courses/course-description-field.tsx` | Rich text wrapper |
| `src/components/admin/courses/course-price-list.tsx` | Inline price management |

## Verification
1. `npm run build` — no type errors
2. `npm run lint` — passes
3. Manual test: create a course with no fields filled → should save
4. Manual test: create a course with rich text description, image URL, and 2+ prices → all data persists
5. Manual test: edit a course → existing prices load, can add/remove, description shows in editor
6. Manual test: verify "Categoría" labels appear everywhere "Tipo de curso" was shown
