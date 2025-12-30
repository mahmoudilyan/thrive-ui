# Form Builder

A comprehensive form builder interface for creating and managing contact list subscription forms.

## Overview

The Form Builder allows users to:
- Create multi-step forms with drag-and-drop interface
- Configure form fields with validation and conditional logic
- Customize email communications and subscription settings
- Preview forms in real-time
- Manage payment fields (products, shipping, billing, checkout)

## Architecture

### Components Structure

```
form-builder/
├── form-builder-wizard.tsx      # Main wizard with stepper
├── steps/
│   ├── builder-step.tsx         # Form builder interface
│   └── settings-step.tsx        # Form settings configuration
├── field-palette.tsx            # Draggable field library
├── form-canvas.tsx              # Form layout editor
├── field-item.tsx               # Individual field component
├── step-manager.tsx             # Multi-step form manager
├── field-properties-panel.tsx   # Field configuration panel
├── field-dependency-manager.tsx # Conditional logic
├── tiptap-editor.tsx            # Rich text editor
├── form-preview.tsx             # Live form preview
├── payment-settings-modal.tsx   # Payment configuration
└── field-types/                 # Field type renderers
    ├── text-field-preview.tsx
    ├── select-field-preview.tsx
    ├── radio-field-preview.tsx
    ├── checkbox-field-preview.tsx
    ├── date-field-preview.tsx
    ├── file-field-preview.tsx
    ├── phone-field-preview.tsx
    ├── number-field-preview.tsx
    ├── gdpr-field-preview.tsx
    └── field-renderer.tsx
```

### State Management

Uses Zustand store (`store/form-builder/use-form-builder-store.ts`) with:
- Form metadata (title, logo, buttons)
- Fields array with ordering
- Multi-step configuration
- Form settings (subscription, emails, etc.)
- Field dependencies for conditional logic
- Payment configuration

### Drag & Drop

Powered by `react-dnd` with HTML5Backend:
- **FIELD_PALETTE**: Dragging fields from library to canvas
- **FIELD_CANVAS**: Reordering fields within steps
- **STEP**: Reordering form steps

## Usage

```tsx
import { FormBuilderWizard } from '@/components/form-builder';

// In your page component
<FormBuilderWizard listId="123" />
```

## API Integration

### Endpoints (configured in `services/config/api.ts`)

- `GET /Lists/GetFormBuilder/{id}.json` - Load form data
- `POST /Lists/UpdateFormBuilder/{id}.json` - Save form
- `GET /Lists/GetDefaultFormFields.json` - Get default field library
- `GET /Lists/GetFieldsByList.json` - Get fields from other lists
- `GET /Lists/GetPaymentSettings/{id}.json` - Get payment configuration

### Mock Data

Located in `mock/form-builder/`:
- `form-fields.json` - Available field types
- `default-fields.json` - Default field groups
- `fields-by-list.json` - Fields from other lists
- `form-data.json` - Sample form configuration
- `payment-products.json` - Payment products catalog

## Features

### 1. Form Builder Step

**3-Panel Layout:**
- **Left**: Field library with search (Default Fields, Fields by List, Create New Field)
- **Center**: Form canvas with drag-drop areas, multi-step manager
- **Right**: Field properties panel (appears when field selected)

**Field Types:**
- Basic: text, email, url, textarea, phone, digits
- Choice: select, radio, checkbox
- Date: date, birthday
- Advanced: file upload, GDPR consent, reCAPTCHA
- Payment: products, shipping, billing, checkout

### 2. Form Settings Step

**Subscription Settings:**
- Multiple submissions
- Double opt-in with confirmation
- Autoresponder
- Admin notifications
- Redirect options
- Auto-tagging

**Sender Details:**
- From email/name
- Reply-to address

**Email Communications:**
- Rich text editors with Tiptap v3
- Shortcode support
- Template tabs: Confirmation, Success, Error, Admin Copy
- Customizable button labels

### 3. Field Configuration

- Label, description, placeholder
- Required/Private toggles
- Field-specific options (dropdown items, date format, file restrictions)
- Conditional logic (show/hide based on other fields)
- Default values

### 4. Multi-Step Forms

- Add/remove/reorder steps
- Step title and description
- Drag fields between steps
- Progress indicator in preview

### 5. Validation

- Email field required
- Required field checks
- URL validation
- Circular dependency detection
- Empty step warnings

## Future Enhancements

- [ ] Real-time collaboration
- [ ] Form templates
- [ ] A/B testing variants
- [ ] Advanced analytics integration
- [ ] Custom CSS styling
- [ ] Form embed code generator
- [ ] QR code generation
- [ ] Multi-language support

