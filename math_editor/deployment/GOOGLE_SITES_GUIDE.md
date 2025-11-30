# Google Sites Integration Guide

## Quick Start: 3 Easy Steps

### Step 1: Host the File

**Option A: Google Drive (Easiest)**
1. Open [Google Drive](https://drive.google.com)
2. Upload `math-editor-standalone.html`
3. Right-click → Share → Change to "Anyone with the link"
4. Copy the file ID from the URL

**Option B: GitHub Pages (Recommended)**
1. Go to [GitHub](https://github.com) and create a new repository
2. Upload `math-editor-standalone.html` and rename it to `index.html`
3. Go to Settings → Pages → Enable GitHub Pages
4. Your URL will be: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### Step 2: Get the Embed URL

**For Google Drive:**
```
https://drive.google.com/file/d/YOUR_FILE_ID/preview
```

**For GitHub Pages:**
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

### Step 3: Embed in Google Sites

1. Edit your Google Site
2. Click **Insert** → **Embed**
3. Paste your URL
4. Click **Insert**
5. Resize the frame (recommended: 1200px × 800px)

## 🎨 Customization Tips

### Adjust Frame Size
- Width: 1200-1400px (full features visible)
- Height: 800-1000px (comfortable workspace)

### Remove White Space
In Google Sites embed settings:
- Uncheck "Show border"
- Use "Fit to page" if available

## ⚠️ Known Issues & Solutions

### Issue: "Unable to load"
**Solution:** Check that file permissions are set to "Anyone with the link can view"

### Issue: Frame too small
**Solution:** Manually adjust iframe size in Google Sites embed settings

### Issue: Not responsive on mobile
**Solution:** The app is mobile-friendly, but ensure iframe allows responsive resizing

## 📱 Mobile Considerations

The editor works on mobile devices, but keyboard interaction is optimized for:
- Tablets (best experience)
- Desktop/Laptop (optimal)
- Large phones (acceptable)

## 🔗 Alternative Embedding Methods

### Method 1: Direct iFrame Code
If your site allows custom HTML:

```html
<iframe 
  src="YOUR_URL_HERE" 
  width="100%" 
  height="800" 
  frameborder="0"
  allow="clipboard-write"
  style="border: none; border-radius: 10px;">
</iframe>
```

### Method 2: Popup/Modal
Link to the editor in a new window:

```html
<a href="YOUR_URL_HERE" target="_blank">
  Open Math Editor
</a>
```

## 📊 Testing Checklist

Before publishing:
- [ ] Editor loads completely
- [ ] Keyboard buttons work
- [ ] Expression display is visible
- [ ] Export LaTeX works
- [ ] Export JPEG works
- [ ] Import from JPEG works
- [ ] Undo button works
- [ ] Clear button works

## 🆘 Troubleshooting

### Editor appears but buttons don't work
- **Cause:** JavaScript blocked
- **Solution:** Ensure site allows JavaScript from your hosting domain

### Styles look broken
- **Cause:** CSS not loading
- **Solution:** Use the standalone HTML file (all-in-one)

### Export doesn't work
- **Cause:** html2canvas CDN blocked
- **Solution:** Check site allows CDN: cdn.jsdelivr.net

## 💡 Pro Tips

1. **Test First:** Open the HTML file locally before uploading
2. **Backup:** Keep a copy of the HTML file
3. **Version:** Add version number to filename for tracking
4. **Updates:** Rebuild the file when you update features

## 📞 Need Help?

Common questions:
- **Can I use this commercially?** Check your license
- **Can I modify it?** Yes, edit the HTML file
- **Works offline?** Yes (except JPEG export needs internet for CDN)
- **Privacy?** No data is sent anywhere, all processing is local

---

**Last Updated:** November 2025  
**File:** math-editor-standalone.html  
**Size:** 96KB
