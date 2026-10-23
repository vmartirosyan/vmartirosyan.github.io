# Math Expression Editor - Deployment Guide

This folder contains a standalone, single-file version of the Math Expression Editor that can be easily embedded into Google Sites or any other web platform.

## 📁 File

- **math-editor-standalone.html** - Complete application in a single HTML file (96KB)

## 🚀 Deployment Options

### Option 1: Google Sites Embed

1. **Upload to Google Drive:**
   - Upload `math-editor-standalone.html` to your Google Drive
   - Right-click the file → "Get link" → Set to "Anyone with the link can view"
   - Copy the file ID from the URL (the long string between `/d/` and `/view`)

2. **Create shareable link:**
   - Use this format: `https://drive.google.com/file/d/YOUR_FILE_ID/preview`

3. **Embed in Google Sites:**
   - In Google Sites, click "Insert" → "Embed"
   - Paste the Google Drive preview URL
   - Adjust the frame size as needed (recommended: 1200px width × 800px height)

### Option 2: GitHub Pages (Free Hosting)

1. **Create a new GitHub repository**
2. **Upload** `math-editor-standalone.html`
3. **Rename** it to `index.html`
4. **Enable GitHub Pages** in repository settings
5. **Access** your app at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### Option 3: Direct Embed

Simply open `math-editor-standalone.html` in any web browser. It works completely offline!

### Option 4: Netlify/Vercel (One-Click Deploy)

1. Drag and drop `math-editor-standalone.html` to [Netlify Drop](https://app.netlify.com/drop)
2. Get an instant live URL

### Option 5: Iframe Embed

```html
<iframe 
  src="path/to/math-editor-standalone.html" 
  width="1200" 
  height="800" 
  frameborder="0"
  style="border: none; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
</iframe>
```

## ✨ Features Included

- ✅ Full math expression editor with visual keyboard
- ✅ Fractions, powers, subscripts, square roots, parentheses
- ✅ LaTeX export
- ✅ JPEG export with embedded LaTeX metadata
- ✅ Import from JPEG (with LaTeX parsing)
- ✅ Keyboard navigation (Arrow keys, Tab, Esc)
- ✅ Undo functionality
- ✅ Responsive design
- ✅ Works completely offline (except html2canvas CDN for JPEG export)

## 📝 Notes

- The file uses one external CDN: `html2canvas` for JPEG export functionality
- If you need a completely offline version, you can download html2canvas and embed it
- The application stores no data - everything is session-based
- Mobile-friendly and responsive

## 🔧 Customization

To customize colors, fonts, or layout, edit the `<style>` section at the top of the HTML file.

## 📞 Support

For issues or questions, refer to the main application documentation.

---

**File Size:** 96KB  
**Dependencies:** html2canvas (CDN)  
**Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge)
