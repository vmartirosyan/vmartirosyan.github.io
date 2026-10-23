# Neural Network Demos - GitHub Pages

This directory contains a client-side implementation of polynomial neural networks that can be deployed to GitHub Pages.

## 🚀 Features

### Currently Available
- **Single Digit Recognition**: Draw digits (0-9) and watch the AI recognize them instantly
  - 10 specialized binary classifiers working in ensemble
  - ~5ms inference time
  - ~84% accuracy on MNIST test data
  - 100% client-side (no server required)

### Coming Soon
- Multi-digit recognition
- Face recognition
- Movement detection

## 📂 Structure

```
vmartirosyan.github.io/
├── index.html              # Personal homepage (portfolio)
├── css/                    # Homepage styles
├── assets/                 # Profile photo
├── cv/                     # generated CV artifacts only (served at /cv/)
│   ├── cv.html
│   └── *.pdf
├── demos/                  # Client-side AI demos
├── math_editor/            # Math expression editor
├── parallel/               # HPC++ / LEAP speed-up report
└── README.md
```

This repository contains **public assets only**. The CV pipeline
(`data/cv.yaml`, `build.py`, references) and the paper tracker live in a separate
**private** repository. Generated CV outputs are built there and copied into
`cv/`; the paper tracker is never published.

> The paper tracker is the authoritative source for publication status and feeds
> the CV at build time (in the private repository).

## 🛠 Build / publish

There is nothing to build in this repository. From the private source repository:

```bash
make publish        # build the CV and copy cv.html + *.pdf into this repo's cv/
```

Then commit and push this repository.

## 🌐 Deployment to GitHub Pages

This repository is the GitHub Pages **user site** and is served from the `main`
branch root (`https://vmartirosyan.github.io/`). No `gh-pages` branch or
subtree is used: commit the intended assets and Pages serves them directly.

1. **Repository settings → Pages**: source = *Deploy from a branch*, branch =
   `main`, folder = `/ (root)`.
2. Publish the CV artifacts from the private source repository (see above).
3. Commit and push; Pages redeploys automatically.

## 🛠️ Local Development

```bash
# From the repository root
python3 -m http.server 8000
# Open http://localhost:8000
```

**Important**: Use a local web server (not `file://`); the digit-recognition demo
loads model files via `fetch`, which browsers block for `file://` URLs.

## 📦 Model Files

The `models/` directory contains 10 binary neural network files:
- `digit_0_sparse.bin` through `digit_9_sparse.bin`
- Total size: ~12MB
- These will be downloaded once by users' browsers and cached

Each model is a sparse polynomial neural network trained to recognize a specific digit using:
- First-order terms (linear)
- Second-order terms (quadratic)
- 3x3 neighborhood features (9th-order)
- 5x5 neighborhood features (25th-order)
- Cross features (3-length and 5-length)

## 🎨 Customization

### Adding More Demos

The `index.html` is designed to be easily extensible. To add a new demo:

1. Create a new HTML file (e.g., `new-feature.html`)
2. Create corresponding CSS in `css/`
3. Add JavaScript logic in `js/`
4. Update `index.html` to add a demo card:

```html
<div class="demo-card">
    <div class="demo-icon">🎯</div>
    <h2>Your Feature</h2>
    <p>Description here</p>
    <div class="demo-stats">
        <span class="stat-badge">✓ Feature 1</span>
    </div>
    <a href="new-feature.html" class="demo-button">Try Demo →</a>
</div>
```

### Styling

All styles use CSS custom properties and can be easily customized by modifying the color schemes in the CSS files:
- Primary gradient: `#667eea` to `#764ba2`
- Adjust these colors throughout the CSS for a different theme

## 🔬 Technical Details

### Neural Network Architecture

The implementation uses a custom sparse polynomial neural network architecture:

- **Input**: 28×28 grayscale images (784 pixels)
- **Preprocessing**: Normalize to [0, 2] range
- **Features**:
  - Linear terms: 784 coefficients
  - Quadratic terms: ~307K coefficients (sparse)
  - Spatial features: neighborhoods and crosses
- **Output**: Single value (distance from target)
- **Classification**: Ensemble voting across 10 networks

### Browser Compatibility

- Tested on Chrome, Firefox, Safari, Edge
- Requires JavaScript enabled
- Uses standard Web APIs (Canvas, Fetch, ArrayBuffer)
- No external dependencies

## 📄 License

Part of the NewNN project. See main repository for license information.

## 🐛 Issues and Contributions

If you find issues or want to contribute:
1. Report issues on the main repository
2. Submit pull requests to the `polynomial` branch
3. Test locally before submitting

## 📊 Performance

- **Model loading**: ~200-500ms (one-time, then cached)
- **Inference time**: ~5ms per digit
- **Model size**: 12MB total (1.2MB per digit classifier)
- **Accuracy**: ~84% on MNIST test set

## 🔐 Privacy

All computation happens in your browser. No data is sent to any server. The models are downloaded once and cached by your browser.
