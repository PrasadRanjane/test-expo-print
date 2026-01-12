# Print Component - Expo Snack

A professional showcase of expo-print with various print options and templates. Demonstrates printing HTML content, PDF generation, custom orientations, margins, and pre-built templates for invoices, reports, and labels.

## Features

- ✅ **Direct Printing** - Print HTML content directly to printer
- ✅ **PDF Generation** - Convert HTML to PDF files
- ✅ **Custom Orientations** - Portrait and landscape printing
- ✅ **Custom Margins** - Configure print margins
- ✅ **Invoice Templates** - Professional invoice/receipt templates
- ✅ **Report Templates** - Formatted report templates
- ✅ **Label Templates** - Shipping/shipping label templates
- ✅ **Share PDF** - Generate and share PDF files
- ✅ **Professional UI** - Beautiful, modern interface

## Installation in Expo Snack

1. Copy all files to your Snack
2. Dependencies will be automatically installed:
   - `expo-print`
   - `expo-file-system`
   - `expo-sharing`
   - `expo-linear-gradient`
   - `@expo/vector-icons`
3. Run!

## Usage

### Basic Print

```tsx
import { PrintService } from './services/PrintService';

const html = '<html><body><h1>Hello World</h1></body></html>';

// Print directly
await PrintService.printHTML(html);

// Generate PDF
const { uri } = await PrintService.printToFile(html);
```

### Print with Options

```tsx
// Custom orientation
await PrintService.printWithOrientation(html, 'landscape');

// Custom margins
await PrintService.printWithMargins(html, {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20,
});
```

### Invoice Template

```tsx
const invoiceHTML = PrintService.generateInvoiceHTML({
  title: 'Invoice #12345',
  date: '2024-01-15',
  items: [
    { name: 'Product A', quantity: 2, price: 29.99 },
    { name: 'Product B', quantity: 1, price: 49.99 },
  ],
  total: 109.97,
});

await PrintService.printHTML(invoiceHTML);
```

### Report Template

```tsx
const reportHTML = PrintService.generateReportHTML({
  title: 'Monthly Report',
  author: 'John Doe',
  date: '2024-01-15',
  content: '<h2>Report Content</h2><p>Details...</p>',
});

await PrintService.printToFile(reportHTML);
```

### Generate and Share PDF

```tsx
await PrintService.generateAndSharePDF(
  html,
  'document.pdf'
);
```

## Print Options

| Option | Type | Description |
|--------|------|-------------|
| `html` | `string` | HTML content to print |
| `orientation` | `'portrait' \| 'landscape'` | Print orientation |
| `margins` | `object` | Custom margins (top, bottom, left, right) |
| `width` | `number` | Page width |
| `height` | `number` | Page height |
| `base64` | `boolean` | Return base64 encoded PDF |

## Templates

### Invoice Template
- Professional invoice layout
- Itemized list with quantities and prices
- Total calculation
- Customizable styling

### Report Template
- Formatted report layout
- Header with title, author, date
- Content area for report body
- Footer

### Label Template
- Compact label format
- Address support
- Barcode support
- Border styling

## Example Snack

See `App.tsx` for complete examples showcasing all print options and templates.

## Platform Support

- ✅ iOS
- ✅ Android
- ⚠️ Web (limited support)

## Notes

- Printing requires physical device or simulator with print capabilities
- PDF generation works on all platforms
- Some features may vary by platform

## License

Free to use in your projects!
