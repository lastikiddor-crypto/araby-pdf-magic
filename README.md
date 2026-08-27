# Smart PDF Hub

Create a modern, fully responsive web application called "SmartPDF Studio" that replicates the core functionalities of Adobe PDF. 

The application must support multi-language, specifically Arabic (RTL) and English (LTR), with a visible language switcher toggle in the navbar. The default language should be Arabic, utilizing appropriate Arabic typography (like Cairo or Tajawal font).

Key Features to implement:

1. PDF Viewer & Editor: Users can upload a PDF and view pages, zoom in/out, and navigate smoothly.

2. Core PDF Tools (Dashboard View):

   - Merge PDFs: Drag and drop multiple PDF files to combine them into one.

   - Split PDF: Extract specific pages from a uploaded PDF file.

   - Image to PDF: Convert JPG/PNG files into a PDF document.

   - PDF to Word/Text: Simple text extraction placeholder.

3. Electronic Signature & Annotation: Allow users to draw or type their signature and place it on any page of the uploaded PDF, plus add text notes or highlight text.

4. Clean UI/UX: Use a modern dashboard layout (like Tailwind CSS) with a clean sidebar, dark mode toggle, and intuitive icons (using Lucide-React). 

Ensure all UI components, buttons, and placeholder texts translate accurately when switching between Arabic and English, adjusting the layout dynamically to RTL/LTR.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/78c6b6b7-bc09-45e5-bc1e-3c7908ad3cfc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
