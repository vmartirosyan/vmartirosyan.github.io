# Quick Deployment Guide

## Deploy to GitHub Pages in 3 Steps

### Step 1: Commit the github_pages directory

```bash
git add github_pages/
git commit -m "Add GitHub Pages deployment with digit recognition demo"
git push origin polynomial
```

### Step 2: Enable GitHub Pages

1. Go to: https://github.com/vmartirosyan/newnn/settings/pages
2. Under "Build and deployment":
   - **Source**: Deploy from a branch
   - **Branch**: `polynomial`
   - **Folder**: `/github_pages`
3. Click **Save**

### Step 3: Wait and Access

- GitHub will build and deploy (takes 1-2 minutes)
- Your site will be live at: `https://vmartirosyan.github.io/newnn/`
- You'll get a notification when deployment is complete

## Testing Locally First (Recommended)

Before deploying, test locally:

```bash
# Navigate to github_pages
cd github_pages

# Start a web server
python3 -m http.server 8000

# Open in browser
# http://localhost:8000
```

**Test checklist**:
- [ ] Index page loads and displays properly
- [ ] Clicking "Try Demo →" opens digit recognition
- [ ] Models load successfully (check browser console)
- [ ] Drawing on canvas works
- [ ] Predict button becomes enabled after models load
- [ ] Prediction returns results with confidence bars
- [ ] Back button returns to index page

## Troubleshooting

### Models not loading?
- Check browser console for errors
- Verify all 10 `.bin` files are in `models/` directory
- Ensure you're using a web server (not `file://`)

### 404 errors on GitHub Pages?
- Wait 2-3 minutes after enabling GitHub Pages
- Check deployment status in Actions tab
- Verify the path: `/github_pages` folder is set correctly

### Styling broken?
- Check that CSS files are in `css/` directory
- Verify relative paths in HTML files
- Clear browser cache

## Alternative: Deploy from Root

If you prefer to deploy from repository root:

```bash
# Method 1: Copy files to root (not recommended, clutters repo)
cp -r github_pages/* .
git add *.html css/ js/ models/
git commit -m "Deploy to root"

# Method 2: Use subtree (better)
git subtree push --prefix github_pages origin gh-pages
# Then set GitHub Pages to use gh-pages branch, / folder
```

## Custom Domain (Optional)

To use a custom domain:

1. Create file `github_pages/CNAME` with your domain:
   ```
   demo.yourdomain.com
   ```

2. In your DNS settings, add a CNAME record:
   ```
   demo.yourdomain.com -> vmartirosyan.github.io
   ```

3. In GitHub Pages settings, enter your custom domain

## Updating the Site

After making changes:

```bash
# Make changes to files in github_pages/
cd github_pages
# ... edit files ...

# Test locally
python3 -m http.server 8000

# Commit and push
git add .
git commit -m "Update GitHub Pages site"
git push origin polynomial

# GitHub will auto-redeploy (1-2 minutes)
```

## Performance Tips

1. **Model Loading**: Models are ~12MB total, cached after first load
2. **Image Optimization**: If adding images, compress them first
3. **CDN**: GitHub Pages automatically uses CDN for fast global access
4. **Caching**: Browser caches models and assets automatically

## Next Steps

Once deployed, you can:
- Share the URL with others
- Add more demo features (see README.md for how to extend)
- Customize styling and branding
- Add analytics (Google Analytics, etc.)

## Getting Help

- Check deployment logs: Repository → Actions
- Browser console: F12 → Console tab
- Network tab: F12 → Network (check for 404s)
