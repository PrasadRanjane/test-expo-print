# Test Expo Print

A comprehensive print showcase using expo-print with image picker, file picker, permission handling, and modern card-based UI design.

## Features

- ✅ **Image Printing** - Pick images from gallery or take photos, then print them
- ✅ **File Printing** - Pick files (PDF, images, text) and print them
- ✅ **Permission Handling** - Automatic permission requests for camera and media library
- ✅ **HTML Printing** - Print HTML content directly
- ✅ **PDF Generation** - Convert HTML to PDF files
- ✅ **Templates** - Invoice, report, and label templates
- ✅ **Print Options** - Portrait/landscape orientation, custom margins
- ✅ **Modern UI** - Card-based design with clean, professional interface

## Installation in Expo Snack

1. Copy all files to your Snack
2. Dependencies will be automatically installed:
   - `expo-print`
   - `expo-image-picker`
   - `expo-document-picker`
   - `expo-file-system`
   - `expo-sharing`
   - `@expo/vector-icons`
3. Run!

## Usage

### Image Printing

```tsx
import { ImageService } from './services/ImageService';

// Pick image from gallery
const result = await ImageService.pickImageFromGallery();
if (!result.canceled && result.assets[0]) {
  await ImageService.printImage(result.assets[0].uri);
}

// Take photo
const photo = await ImageService.takePhoto();
if (!photo.canceled && photo.assets[0]) {
  await ImageService.printImage(photo.assets[0].uri);
}
```

### File Printing

```tsx
import { FileService } from './services/FileService';

// Pick file
const file = await FileService.pickDocument();
if (!file.canceled && file.assets[0]) {
  // Print PDF
  await FileService.printPDF(file.assets[0].uri);
  
  // Print image file
  await FileService.printImageFile(file.assets[0].uri);
  
  // Print text file
  await FileService.printTextFile(file.assets[0].uri);
}
```

### HTML Printing

```tsx
import { PrintService } from './services/PrintService';

const html = '<html><body><h1>Hello</h1></body></html>';

// Print directly
await PrintService.printHTML(html);

// Generate PDF
const { uri } = await PrintService.printToFile(html);
```

### Permission Handling

Permissions are automatically requested when needed:
- Camera permission for taking photos
- Media library permission for picking images
- Document picker doesn't require explicit permissions

## Services

### ImageService
- `pickImageFromGallery()` - Pick image from gallery
- `takePhoto()` - Take photo with camera
- `printImage(uri)` - Print image
- `generateImagePDF(uri)` - Generate PDF from image
- `requestCameraPermissions()` - Request camera permission
- `requestMediaLibraryPermissions()` - Request media library permission

### FileService
- `pickDocument()` - Pick any file
- `pickPDF()` - Pick PDF file
- `printPDF(uri)` - Print PDF file
- `printImageFile(uri)` - Print image file
- `printTextFile(uri)` - Print text file
- `readFileAsBase64(uri)` - Read file as base64
- `readFileAsString(uri)` - Read file as string

### PrintService
- `printHTML(html, options?)` - Print HTML directly
- `printToFile(html, options?)` - Generate PDF
- `printWithOrientation(html, orientation)` - Print with orientation
- `printWithMargins(html, margins)` - Print with custom margins
- `generateInvoiceHTML(data)` - Generate invoice template
- `generateReportHTML(data)` - Generate report template
- `generateLabelHTML(data)` - Generate label template

## Design

- **Card-based Layout** - Clean, modern card design
- **Color Variants** - Different colors for different action types
- **Image Preview** - Preview selected images before printing
- **File Info Display** - Show selected file information
- **Loading States** - Visual feedback during operations
- **Error Handling** - User-friendly error messages

## Platform Support

- ✅ iOS
- ✅ Android
- ⚠️ Web (limited support)

## Permissions

The app automatically requests permissions when needed:
- **Camera** - Required for taking photos
- **Media Library** - Required for picking images
- **Storage** - Required for file access (handled automatically)

## Example Snack

See `App.tsx` for complete examples showcasing all features.

## License

Free to use in your projects!
