# Form Builder - Getting Started

## Quick Start

### 1. Access the Form Builder

From the Lists page, click the **"Fields & Form"** button on any list row.

Or navigate directly to: `/contacts/lists/[listId]/form`

Example: `http://localhost:3000/contacts/lists/123/form`

### 2. Build Your Form

The form builder has two main steps:

#### Step 1: Form Builder

- **Drag fields** from the left palette into the form canvas
- **Click a field** to configure its properties in the right panel
- **Add steps** for multi-step forms
- **Toggle to Preview** mode to see how your form looks

#### Step 2: Form Settings

- Configure **subscription settings** (double opt-in, redirects, etc.)
- Set **sender details** (from email, from name, reply-to)
- Customize **email templates** with the rich text editor
- Enable **advanced options** (payment, validation, etc.)

### 3. Save Your Form

Click **"Save Form"** to save your changes and see the success confetti! 🎉

## Field Types

### Basic Fields

- **Text** - Single-line text input
- **Email** - Email with validation
- **URL** - Website address
- **Textarea** - Multi-line text
- **Phone** - Phone number with country code
- **Number** - Numeric input with optional currency

### Choice Fields

- **Select** - Dropdown (single choice)
- **Radio** - Radio buttons (single choice)
- **Checkbox** - Checkboxes (multiple choice)
  - Can be styled as multi-select dropdown

### Date Fields

- **Date** - Full date picker
- **Birthday** - Month/day only

### Advanced Fields

- **File Upload** - With extension and size validation
- **GDPR Consent** - Marketing consent checkboxes
- **reCAPTCHA** - Spam protection

### Payment Fields

- **Products** - Product selection
- **Shipping** - Shipping address
- **Billing** - Billing address
- **Checkout** - Payment summary

## Common Tasks

### Adding a Field

1. Find the field in the left palette (Default Fields, Fields by List, or Create New Field)
2. **Drag** the field to the form canvas drop zone
3. **Click** the field to configure it
4. Set label, description, placeholder, required status, etc.

### Creating Multi-Step Forms

1. Click **"Add New Step"** button in the form canvas
2. Give your step a **title** and **description**
3. **Drag fields** into the step's drop zone
4. **Reorder steps** by dragging the step cards

### Adding Conditional Logic

1. Select a field in the form canvas
2. Scroll down in the **Field Properties** panel
3. Click **"Add Rule"** in the Conditional Logic section
4. Choose:
   - **Source field** - which field to check
   - **Condition** - equals, contains, greater than, etc.
   - **Value** - what to compare against
5. Add multiple rules with AND/OR grouping

### Configuring Email Templates

1. Go to **Form Settings** step
2. Click **Email Communications** tab
3. Select the template you want to edit
4. Use the **Tiptap editor** to format your email:
   - Bold, italic, lists
   - Add links
   - Insert shortcodes (like [BUSINESS_NAME])
   - Add emojis

### Payment Forms

1. Go to **Advanced Options** in Form Settings
2. Click **Payment Settings**
3. Select your e-commerce store
4. Choose payment gateway
5. Add **Payment Products** field to your form
6. Configure products in field properties
7. Add **Shipping**, **Billing**, and **Checkout** fields as needed

## Tips & Best Practices

### ✅ Do's

- Always include an **Email field** (required)
- Use clear, descriptive **field labels**
- Add **descriptions** for complex fields
- Test your form in **Preview mode**
- Keep steps **logical and focused**
- Use **conditional logic** to simplify long forms
- Set proper **validation** rules

### ❌ Don'ts

- Don't create **circular dependencies** (field A depends on B, B depends on A)
- Don't create **empty steps** (always have at least one visible field)
- Don't forget to set **sender details** if using email features
- Don't use HTML in dropdown options (plain text only)

## Keyboard Shortcuts

- **Drag & Drop**: Click and hold, then move
- **Delete Field**: Select field → Click delete icon
- **Collapse/Expand**: Click the arrow icon on fields/steps
- **Navigate Tabs**: Click tab names in Settings step

## Troubleshooting

### "Field is disabled in the palette"

**Cause**: Field is already in your form, or it's a unique field (like reCAPTCHA) that can only be added once.

**Solution**: Remove the existing field first, or choose a different field type.

### "Can't delete a step"

**Cause**: Step contains fields.

**Solution**: Move or delete all fields from the step first.

### "Circular dependency error"

**Cause**: Field A's conditional logic depends on Field B, and Field B depends on Field A.

**Solution**: Break the circular chain by removing one of the dependencies.

### "No email field warning"

**Cause**: Forms must have an email field to collect contact information.

**Solution**: Add the Email field from Default Fields → Contact Information.

## Advanced Features

### Dynamic Location Fields

Add interconnected location dropdowns:

1. Add **Country** field (from Default Fields)
2. Add **State** field (only available after adding Country)
3. Add **City** field (only available after adding State)

These fields automatically populate based on previous selections.

### GDPR Compliance

The GDPR field provides:

- Customizable consent checkboxes
- Disclaimer text
- Required consent options
- Newsletter opt-in

Configure in Field Properties after adding to form.

### Multi-Select Checkbox Dropdown

1. Add a **Checkbox** field
2. In Field Properties, set Display Style to **"Dropdown (Multi-select)"**
3. Users can select multiple options from a dropdown

## Integration with Lists

- Forms are tied to a specific **List**
- Submissions create/update contacts in that list
- Field data is stored per contact
- Use fields from other lists to maintain consistency

## Next Steps

After building your form:

1. **Preview**: See exactly how users will experience it
2. **Settings**: Fine-tune email communications
3. **Test**: Submit a test entry
4. **Embed**: Get embed code for your website
5. **Track**: Monitor submissions in List Analytics

## Support

For detailed technical documentation, see `/components/form-builder/README.md`

For API documentation, see `/services/config/api.ts` (formBuilder section)

For state management details, see `/store/form-builder/use-form-builder-store.ts`
