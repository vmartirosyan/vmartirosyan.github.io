// Main Application Controller
class MathExpressionApp {
    constructor() {
        this.expression = new MathExpression();
        this.navContext = new NavigationContext();
        this.navigationSystem = new NavigationSystem(this.expression, this.navContext);
        this.keyboardController = null;
        this.graphingController = null;
        this.transformationsController = null;
        this.drawingController = null;
        this.trainerController = null;
        
        this.displayElement = null;
        this.navRenderer = null;
        this.currentTab = 'editor';
        this.currentLanguage = 'en';
    }

    // Initialize the application
    init() {
        // Initialize language
        this.initLanguage();

        // Get DOM elements
        this.displayElement = document.getElementById('expressionDisplay');
        
        if (!this.displayElement) {
            console.error('Expression display element not found');
            return;
        }

        // Initialize navigation renderer
        this.navRenderer = new NavigationRenderer(this.displayElement);

        // Initialize keyboard controller
        this.keyboardController = new KeyboardController(
            this.expression,
            this.navContext,
            () => this.render()
        );
        this.keyboardController.init();

        // Initialize graphing controller
        this.graphingController = new GraphingController();
        this.graphingController.init('graphCanvas');
        
        // Initialize transformations controller
        this.transformationsController = new TransformationsController();
        this.transformationsController.init('transformCanvas');
        
        // Initialize drawing controller
        this.drawingController = new DrawingController();
        this.drawingController.init('drawingCanvas');

        // Initialize trainer controller
        this.trainerController = new TrainerController();
        this.trainerController.init('trainerTab');

        // Initialize control buttons
        this.initControls();
        
        // Initialize tabs
        this.initTabs();
        
        // Initialize graphing controls
        this.initGraphingControls();
        
        // Initialize transformation controls
        this.initTransformationControls();
        
        // Initialize drawing controls
        this.initDrawingControls();

        // Initialize evaluation
        this.initEvaluation();

        // Initialize mouse click handling
        this.initMouseHandling();

        // Initial render
        this.render();

        console.log('Math Expression Editor initialized');
    }
    
    // Initialize language
    initLanguage() {
        const langSelect = document.getElementById('languageSelect');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
        
        // Set initial language
        this.setLanguage('en');
        
        // Make translation function global
        window.t = (key) => {
            if (translations[this.currentLanguage] && translations[this.currentLanguage][key]) {
                return translations[this.currentLanguage][key];
            }
            return key;
        };
        
        // Also expose current language
        window.currentLanguage = this.currentLanguage;
    }
    
    setLanguage(lang) {
        if (!translations[lang]) return;
        
        this.currentLanguage = lang;
        window.currentLanguage = lang;
        
        // Update all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                // Check if it's an input with placeholder
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    if (el.hasAttribute('placeholder')) {
                        // For inputs, we might want to translate placeholder
                        // But currently our keys are mostly for text content
                        // If we have specific placeholder keys, we'd use them
                    }
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });
        
        // Update specific placeholders if needed
        if (lang === 'hy') {
            document.getElementById('functionInput').placeholder = 'օրինակ՝ x^2, sin(x)';
            document.getElementById('chartLabels').placeholder = 'Ա, Բ, Գ, Դ';
        } else {
            document.getElementById('functionInput').placeholder = 'e.g., x^2, sin(x), x^3 - 2*x';
            document.getElementById('chartLabels').placeholder = 'A, B, C, D';
        }
        
        // Re-render shape inputs if they exist (to update labels)
        if (this.graphingController && this.graphingController.currentShape) {
            this.generateShapeInputs(this.graphingController.currentShape);
        }
    }
    
    // Initialize tab navigation
    initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active tab content
                tabContents.forEach(content => {
                    if (content.id === tabName + 'Tab') {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
                
                this.currentTab = tabName;
                
                // Show/hide editor controls based on active tab
                this.updateControlsVisibility(tabName);
                
                // Enable/disable keyboard controller based on active tab
                if (this.keyboardController) {
                    this.keyboardController.setEnabled(tabName === 'editor');
                }
                
                // Resize canvas when switching to graphing tab
                if (tabName === 'graphing') {
                    setTimeout(() => this.graphingController.resizeCanvas(), 100);
                }
                
                // Resize canvas when switching to transformations tab
                if (tabName === 'transformations') {
                    setTimeout(() => this.transformationsController.resizeCanvas(), 100);
                }
                
                // Resize canvas when switching to drawing tab
                if (tabName === 'drawing') {
                    setTimeout(() => this.drawingController.resizeCanvas(), 100);
                }
            });
        });
        
        // Initialize trainer subsection navigation
        this.initTrainerSubsections();
    }
    
    // Initialize trainer subsection switching (Arithmetic / Algebra)
    initTrainerSubsections() {
        const subsectionBtns = document.querySelectorAll('.subsection-btn');
        const subsections = document.querySelectorAll('.trainer-subsection');
        
        subsectionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const subsectionName = btn.dataset.subsection;
                
                // Update active button
                subsectionBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active subsection
                subsections.forEach(section => {
                    if (section.id === subsectionName + 'Section') {
                        section.classList.add('active');
                    } else {
                        section.classList.remove('active');
                    }
                });
            });
        });
    }
    
    updateControlsVisibility(tabName) {
        const editorControls = document.querySelectorAll('#clearBtn, #undoBtn, #exportBtn, #exportJpegBtn, #importJpegBtn, #evaluateBtn');
        
        if (tabName === 'editor') {
            editorControls.forEach(ctrl => ctrl.style.display = 'inline-block');
        } else {
            editorControls.forEach(ctrl => ctrl.style.display = 'none');
        }
    }
    
    // Initialize graphing controls
    initGraphingControls() {
        // Chart type buttons
        const chartBtns = document.querySelectorAll('.chart-btn');
        chartBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                chartBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const chartType = btn.dataset.chart;
                
                // Show/hide appropriate input sections
                if (chartType === 'function') {
                    document.getElementById('functionInputSection').style.display = 'block';
                    document.getElementById('chartDataSection').style.display = 'none';
                    document.getElementById('shapeParamsSection').style.display = 'none';
                    document.getElementById('shape3DControls').style.display = 'none';
                } else {
                    document.getElementById('functionInputSection').style.display = 'none';
                    document.getElementById('chartDataSection').style.display = 'block';
                    document.getElementById('shapeParamsSection').style.display = 'none';
                    document.getElementById('shape3DControls').style.display = 'none';
                }
            });
        });
        
        // Shape buttons
        const shapeBtns = document.querySelectorAll('.shape-btn');
        shapeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const shape = btn.dataset.shape;
                
                // Hide chart sections, show shape section
                document.getElementById('functionInputSection').style.display = 'none';
                document.getElementById('chartDataSection').style.display = 'none';
                document.getElementById('shapeParamsSection').style.display = 'block';
                document.getElementById('shape3DControls').style.display = 'block';
                
                // Deactivate chart buttons
                chartBtns.forEach(b => b.classList.remove('active'));
                
                // Generate shape-specific inputs
                this.generateShapeInputs(shape);
            });
        });
        
        // Plot function button
        const plotBtn = document.getElementById('plotBtn');
        if (plotBtn) {
            plotBtn.addEventListener('click', () => {
                const funcStr = document.getElementById('functionInput').value;
                const xMin = parseFloat(document.getElementById('xMin').value);
                const xMax = parseFloat(document.getElementById('xMax').value);
                const yMin = parseFloat(document.getElementById('yMin').value);
                const yMax = parseFloat(document.getElementById('yMax').value);
                
                this.graphingController.plotFunction(funcStr, xMin, xMax, yMin, yMax);
            });
        }
        
        // Plot chart button
        const plotChartBtn = document.getElementById('plotChartBtn');
        if (plotChartBtn) {
            plotChartBtn.addEventListener('click', () => {
                const chartType = document.querySelector('.chart-btn.active')?.dataset.chart || 'bar';
                const labelsStr = document.getElementById('chartLabels').value;
                const valuesStr = document.getElementById('chartValues').value;
                
                const labels = labelsStr.split(',').map(s => s.trim());
                const values = valuesStr.split(',').map(s => parseFloat(s.trim()));
                
                this.graphingController.plotChart(chartType, labels, values);
            });
        }
        
        // Render shape button
        const renderShapeBtn = document.getElementById('renderShapeBtn');
        if (renderShapeBtn) {
            renderShapeBtn.addEventListener('click', () => {
                const shape = document.querySelector('.shape-btn:focus')?.dataset.shape || 
                             this.graphingController.currentShape;
                
                if (!shape) return;
                
                const params = this.collectShapeParams();
                this.graphingController.render3DShape(shape, params);
            });
        }
    }
    
    generateShapeInputs(shape) {
        const container = document.getElementById('shapeInputs');
        container.innerHTML = '';
        
        const inputs = {
            cube: [
                { name: 'size', label: window.t('lblSize'), value: 150, step: 10 }
            ],
            cuboid: [
                { name: 'width', label: window.t('lblWidth'), value: 180, step: 10 },
                { name: 'height', label: window.t('lblHeight'), value: 120, step: 10 },
                { name: 'depth', label: window.t('lblDepth'), value: 100, step: 10 }
            ],
            pyramid: [
                { name: 'baseSize', label: window.t('lblBaseSize'), value: 150, step: 10 },
                { name: 'height', label: window.t('lblHeight'), value: 180, step: 10 }
            ],
            cylinder: [
                { name: 'radius', label: window.t('lblRadius'), value: 80, step: 5 },
                { name: 'height', label: window.t('lblHeight'), value: 200, step: 10 }
            ],
            sphere: [
                { name: 'radius', label: window.t('lblRadius'), value: 100, step: 5 }
            ],
            cone: [
                { name: 'radius', label: window.t('lblRadius'), value: 80, step: 5 },
                { name: 'height', label: window.t('lblHeight'), value: 180, step: 10 }
            ]
        };
        
        const shapeInputs = inputs[shape] || [];
        shapeInputs.forEach(input => {
            const group = document.createElement('div');
            group.className = 'input-group';
            
            const label = document.createElement('label');
            label.textContent = input.label + ':';
            label.htmlFor = 'shape-' + input.name;
            
            const inputEl = document.createElement('input');
            inputEl.type = 'number';
            inputEl.id = 'shape-' + input.name;
            inputEl.name = input.name;
            inputEl.value = input.value;
            inputEl.step = input.step;
            
            // Add real-time update on input change
            inputEl.addEventListener('input', () => {
                const params = this.collectShapeParams();
                this.graphingController.render3DShape(shape, params);
            });
            
            group.appendChild(label);
            group.appendChild(inputEl);
            container.appendChild(group);
        });
        
        // Store current shape
        this.graphingController.currentShape = shape;
        
        // Auto-render the shape
        const params = this.collectShapeParams();
        this.graphingController.render3DShape(shape, params);
        
        // Setup 3D control listeners if not already set up
        this.setup3DControls();
    }
    
    setup3DControls() {
        // Rotation X
        const rotationX = document.getElementById('rotationX');
        const rotationXValue = document.getElementById('rotationXValue');
        if (rotationX && !rotationX.hasAttribute('data-listener')) {
            rotationX.setAttribute('data-listener', 'true');
            rotationX.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                rotationXValue.textContent = value + '°';
                this.graphingController.setRotation(
                    value,
                    parseInt(document.getElementById('rotationY').value),
                    parseInt(document.getElementById('rotationZ').value)
                );
            });
        }
        
        // Rotation Y
        const rotationY = document.getElementById('rotationY');
        const rotationYValue = document.getElementById('rotationYValue');
        if (rotationY && !rotationY.hasAttribute('data-listener')) {
            rotationY.setAttribute('data-listener', 'true');
            rotationY.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                rotationYValue.textContent = value + '°';
                this.graphingController.setRotation(
                    parseInt(document.getElementById('rotationX').value),
                    value,
                    parseInt(document.getElementById('rotationZ').value)
                );
            });
        }
        
        // Rotation Z
        const rotationZ = document.getElementById('rotationZ');
        const rotationZValue = document.getElementById('rotationZValue');
        if (rotationZ && !rotationZ.hasAttribute('data-listener')) {
            rotationZ.setAttribute('data-listener', 'true');
            rotationZ.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                rotationZValue.textContent = value + '°';
                this.graphingController.setRotation(
                    parseInt(document.getElementById('rotationX').value),
                    parseInt(document.getElementById('rotationY').value),
                    value
                );
            });
        }
        
        // Zoom
        const zoomLevel = document.getElementById('zoomLevel');
        const zoomValue = document.getElementById('zoomValue');
        if (zoomLevel && !zoomLevel.hasAttribute('data-listener')) {
            zoomLevel.setAttribute('data-listener', 'true');
            zoomLevel.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                zoomValue.textContent = value + '%';
                this.graphingController.setZoom(value / 100);
            });
        }
        
        // Reset button
        const reset3DBtn = document.getElementById('reset3DBtn');
        if (reset3DBtn && !reset3DBtn.hasAttribute('data-listener')) {
            reset3DBtn.setAttribute('data-listener', 'true');
            reset3DBtn.addEventListener('click', () => {
                document.getElementById('rotationX').value = 30;
                document.getElementById('rotationXValue').textContent = '30°';
                document.getElementById('rotationY').value = 45;
                document.getElementById('rotationYValue').textContent = '45°';
                document.getElementById('rotationZ').value = 0;
                document.getElementById('rotationZValue').textContent = '0°';
                document.getElementById('zoomLevel').value = 100;
                document.getElementById('zoomValue').textContent = '100%';
                this.graphingController.resetView();
            });
        }
    }
    
    collectShapeParams() {
        const params = {};
        const inputs = document.querySelectorAll('#shapeInputs input');
        inputs.forEach(input => {
            params[input.name] = parseFloat(input.value);
        });
        return params;
    }
    
    // Initialize transformation controls
    initTransformationControls() {
        // Shape selection buttons
        const shape2DBtns = document.querySelectorAll('.shape-2d-btn');
        shape2DBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                shape2DBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const shape = btn.dataset.shape;
                
                if (shape === 'custom') {
                    document.getElementById('customPointsSection').style.display = 'block';
                } else {
                    document.getElementById('customPointsSection').style.display = 'none';
                    this.transformationsController.setShape(shape);
                }
            });
        });
        
        // Translation X
        const translationX = document.getElementById('translationX');
        const transXValue = document.getElementById('transXValue');
        if (translationX) {
            translationX.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                transXValue.textContent = value;
                this.transformationsController.setTranslation(
                    value,
                    parseFloat(document.getElementById('translationY').value)
                );
            });
        }
        
        // Translation Y
        const translationY = document.getElementById('translationY');
        const transYValue = document.getElementById('transYValue');
        if (translationY) {
            translationY.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                transYValue.textContent = value;
                this.transformationsController.setTranslation(
                    parseFloat(document.getElementById('translationX').value),
                    value
                );
            });
        }
        
        // Rotation
        const rotation2D = document.getElementById('rotation2D');
        const rotation2DValue = document.getElementById('rotation2DValue');
        if (rotation2D) {
            rotation2D.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                rotation2DValue.textContent = value + '°';
                this.transformationsController.setRotation(value);
            });
        }
        
        // Scale
        const scale2D = document.getElementById('scale2D');
        const scaleValue = document.getElementById('scaleValue');
        if (scale2D) {
            scale2D.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                scaleValue.textContent = value;
                this.transformationsController.setScale(value);
            });
        }
        
        // Reflection buttons
        const reflectX = document.getElementById('reflectX');
        if (reflectX) {
            reflectX.addEventListener('click', () => {
                this.transformationsController.reflectX();
                this.resetTransformSliders();
            });
        }
        
        const reflectY = document.getElementById('reflectY');
        if (reflectY) {
            reflectY.addEventListener('click', () => {
                this.transformationsController.reflectY();
                this.resetTransformSliders();
            });
        }
        
        const reflectOrigin = document.getElementById('reflectOrigin');
        if (reflectOrigin) {
            reflectOrigin.addEventListener('click', () => {
                this.transformationsController.reflectOrigin();
                this.resetTransformSliders();
            });
        }
        
        const reflectYeqX = document.getElementById('reflectYeqX');
        if (reflectYeqX) {
            reflectYeqX.addEventListener('click', () => {
                this.transformationsController.reflectYeqX();
                this.resetTransformSliders();
            });
        }
        
        // Special transformations
        const shearX = document.getElementById('shearX');
        if (shearX) {
            shearX.addEventListener('click', () => {
                this.transformationsController.shearX();
                this.resetTransformSliders();
            });
        }
        
        const shearY = document.getElementById('shearY');
        if (shearY) {
            shearY.addEventListener('click', () => {
                this.transformationsController.shearY();
                this.resetTransformSliders();
            });
        }
        
        const rotate90 = document.getElementById('rotate90');
        if (rotate90) {
            rotate90.addEventListener('click', () => {
                this.transformationsController.rotate90();
                this.resetTransformSliders();
            });
        }
        
        const rotate180 = document.getElementById('rotate180');
        if (rotate180) {
            rotate180.addEventListener('click', () => {
                this.transformationsController.rotate180();
                this.resetTransformSliders();
            });
        }
        
        // Action buttons
        const showOriginal = document.getElementById('showOriginal');
        if (showOriginal) {
            showOriginal.addEventListener('click', () => {
                this.transformationsController.toggleOriginal();
            });
        }
        
        const showGrid = document.getElementById('showGrid');
        if (showGrid) {
            showGrid.addEventListener('click', () => {
                this.transformationsController.toggleGrid();
            });
        }
        
        const resetTransform = document.getElementById('resetTransform');
        if (resetTransform) {
            resetTransform.addEventListener('click', () => {
                this.transformationsController.resetAll();
                this.resetTransformSliders();
            });
        }
        
        // Custom points
        const applyPoints = document.getElementById('applyPoints');
        if (applyPoints) {
            applyPoints.addEventListener('click', () => {
                const pointsText = document.getElementById('customPoints').value;
                this.transformationsController.setCustomPoints(pointsText);
            });
        }
        
        // Rotation center controls
        const rotationCenterX = document.getElementById('rotationCenterX');
        const rotCenterXValue = document.getElementById('rotCenterXValue');
        if (rotationCenterX) {
            rotationCenterX.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                rotCenterXValue.textContent = value;
                this.transformationsController.setRotationCenter(
                    value,
                    parseFloat(document.getElementById('rotationCenterY').value)
                );
            });
        }
        
        const rotationCenterY = document.getElementById('rotationCenterY');
        const rotCenterYValue = document.getElementById('rotCenterYValue');
        if (rotationCenterY) {
            rotationCenterY.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                rotCenterYValue.textContent = value;
                this.transformationsController.setRotationCenter(
                    parseFloat(document.getElementById('rotationCenterX').value),
                    value
                );
            });
        }
        
        const setCenterToShape = document.getElementById('setCenterToShape');
        if (setCenterToShape) {
            setCenterToShape.addEventListener('click', () => {
                const centroid = this.transformationsController.setRotationCenterToShape();
                // Update slider values to match calculated centroid
                rotationCenterX.value = centroid.x;
                rotCenterXValue.textContent = centroid.x.toFixed(1);
                rotationCenterY.value = centroid.y;
                rotCenterYValue.textContent = centroid.y.toFixed(1);
            });
        }
    }
    
    resetTransformSliders() {
        document.getElementById('translationX').value = 0;
        document.getElementById('transXValue').textContent = '0';
        document.getElementById('translationY').value = 0;
        document.getElementById('transYValue').textContent = '0';
        document.getElementById('rotation2D').value = 0;
        document.getElementById('rotation2DValue').textContent = '0°';
        document.getElementById('scale2D').value = 1;
        document.getElementById('scaleValue').textContent = '1';
        document.getElementById('rotationCenterX').value = 0;
        document.getElementById('rotCenterXValue').textContent = '0';
        document.getElementById('rotationCenterY').value = 0;
        document.getElementById('rotCenterYValue').textContent = '0';
    }
    
    // Initialize drawing controls
    initDrawingControls() {
        // Tool buttons (support both old .tool-btn and new .toolbar-btn)
        const toolBtns = document.querySelectorAll('.tool-btn[data-tool], .toolbar-btn[data-tool]');
        toolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                toolBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const tool = btn.dataset.tool;
                this.drawingController.setTool(tool);
            });
        });
        
        // Color picker
        const drawingColor = document.getElementById('drawingColor');
        if (drawingColor) {
            drawingColor.addEventListener('input', (e) => {
                this.drawingController.setColor(e.target.value);
            });
        }
        
        // Color presets
        const colorPresets = document.querySelectorAll('.color-preset');
        colorPresets.forEach(btn => {
            btn.addEventListener('click', () => {
                const color = btn.dataset.color;
                this.drawingController.setColor(color);
                if (drawingColor) {
                    drawingColor.value = color;
                }
            });
        });
        
        // Brush size
        const brushSize = document.getElementById('brushSize');
        const brushSizeValue = document.getElementById('brushSizeValue');
        if (brushSize) {
            brushSize.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                if (brushSizeValue) brushSizeValue.textContent = value;
                this.drawingController.setBrushSize(value);
            });
        }
        
        // Background buttons
        const setBgWhite = document.getElementById('setBgWhite');
        if (setBgWhite) {
            setBgWhite.addEventListener('click', () => {
                this.drawingController.setBackgroundColor('#ffffff');
            });
        }
        
        const setBgBlack = document.getElementById('setBgBlack');
        if (setBgBlack) {
            setBgBlack.addEventListener('click', () => {
                this.drawingController.setBackgroundColor('#000000');
            });
        }
        
        const setBgTransparent = document.getElementById('setBgTransparent');
        if (setBgTransparent) {
            setBgTransparent.addEventListener('click', () => {
                this.drawingController.setBackgroundColor('transparent');
            });
        }
        
        // Action buttons
        const clearDrawing = document.getElementById('clearDrawing');
        if (clearDrawing) {
            clearDrawing.addEventListener('click', () => {
                if (confirm(window.t('msgClearCanvas'))) {
                    this.drawingController.clearCanvas();
                }
            });
        }
        
        const undoDrawing = document.getElementById('undoDrawing');
        if (undoDrawing) {
            undoDrawing.addEventListener('click', () => {
                this.drawingController.undo();
            });
        }
        
        const saveDrawing = document.getElementById('saveDrawing');
        if (saveDrawing) {
            saveDrawing.addEventListener('click', () => {
                this.drawingController.saveImage();
            });
        }
        
        // Grid controls
        const toggleGrid = document.getElementById('toggleGrid');
        if (toggleGrid) {
            toggleGrid.addEventListener('click', () => {
                this.drawingController.toggleGrid();
            });
        }
        
        const gridSize = document.getElementById('gridSize');
        const gridSizeValue = document.getElementById('gridSizeValue');
        if (gridSize) {
            gridSize.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                if (gridSizeValue) gridSizeValue.textContent = value;
                this.drawingController.setGridSize(value);
            });
        }
        
        // Axis toggle
        const toggleAxis = document.getElementById('toggleAxis');
        if (toggleAxis) {
            toggleAxis.addEventListener('click', () => {
                this.drawingController.toggleAxis();
            });
        }
        
        // Unit circle toggle
        const toggleUnitCircle = document.getElementById('toggleUnitCircle');
        if (toggleUnitCircle) {
            toggleUnitCircle.addEventListener('click', () => {
                this.drawingController.toggleUnitCircle();
            });
        }
        
        // Fullscreen toggle
        const toggleFullscreen = document.getElementById('toggleFullscreen');
        if (toggleFullscreen) {
            toggleFullscreen.addEventListener('click', () => {
                this.toggleDrawingFullscreen();
            });
        }
        
        // Keyboard shortcut for fullscreen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F11' && document.getElementById('drawingTab').classList.contains('active')) {
                e.preventDefault();
                this.toggleDrawingFullscreen();
            } else if (e.key === 'Escape' && document.body.classList.contains('drawing-fullscreen')) {
                this.toggleDrawingFullscreen(false);
            }
        });
    }
    
    toggleDrawingFullscreen(forceState = null) {
        const isFullscreen = document.body.classList.contains('drawing-fullscreen');
        const newState = forceState !== null ? forceState : !isFullscreen;
        
        if (newState) {
            document.body.classList.add('drawing-fullscreen');
        } else {
            document.body.classList.remove('drawing-fullscreen');
        }
        
        // Resize canvas after transition
        setTimeout(() => {
            if (this.drawingController) {
                this.drawingController.resizeCanvas();
            }
        }, 100);
    }

    // Initialize evaluation
    initEvaluation() {
        const evaluateBtn = document.getElementById('evaluateBtn');
        if (evaluateBtn) {
            evaluateBtn.addEventListener('click', () => {
                this.evaluateExpression();
            });
        }
    }

    // Evaluate expression
    evaluateExpression() {
        const resultContainer = document.getElementById('evaluationResult');
        const resultValue = document.getElementById('resultValue');
        
        if (!resultContainer || !resultValue) return;
        
        try {
            let mathString = this.expression.toMathString();
            console.log('Evaluating:', mathString);
            
            if (!mathString || mathString.trim() === '') {
                resultContainer.style.display = 'none';
                return;
            }

            // Remove trailing equals sign if present
            mathString = mathString.trim();
            if (mathString.endsWith('=')) {
                mathString = mathString.slice(0, -1);
            }
            
            // Use pure JS to evaluate
            // Security note: new Function is safer than eval but still risky with user input
            // In a real app, we should sanitize or use a parser
            const result = new Function('return ' + mathString)();
            
            // Format result
            let formattedResult = result;
            if (typeof result === 'number') {
                // Limit decimal places to avoid floating point issues
                formattedResult = parseFloat(result.toPrecision(14));
                // Remove trailing zeros if integer
                if (Math.abs(formattedResult - Math.round(formattedResult)) < 1e-10) {
                    formattedResult = Math.round(formattedResult);
                }
            }
            
            resultValue.textContent = formattedResult;
            resultContainer.classList.remove('error');
            resultContainer.style.display = 'flex';
            
        } catch (error) {
            console.error('Evaluation error:', error);
            resultValue.textContent = error.message;
            resultContainer.classList.add('error');
            resultContainer.style.display = 'flex';
        }
    }

    // Initialize control buttons
    initControls() {
        const clearBtn = document.getElementById('clearBtn');
        const undoBtn = document.getElementById('undoBtn');
        const exportBtn = document.getElementById('exportBtn');
        const exportJpegBtn = document.getElementById('exportJpegBtn');
        const importJpegBtn = document.getElementById('importJpegBtn');
        const jpegFileInput = document.getElementById('jpegFileInput');

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.expression.clear();
                this.navContext.clear();
                this.render();
            });
        }

        if (undoBtn) {
            undoBtn.addEventListener('click', () => {
                if (this.expression.undo()) {
                    this.navContext.clear();
                    this.render();
                }
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportLatex();
            });
        }

        if (exportJpegBtn) {
            exportJpegBtn.addEventListener('click', () => {
                this.exportJpeg();
            });
        }

        if (importJpegBtn && jpegFileInput) {
            importJpegBtn.addEventListener('click', () => {
                jpegFileInput.click();
            });

            jpegFileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.importFromJpeg(file);
                }
                // Reset input so same file can be selected again
                jpegFileInput.value = '';
            });
        }

        // Latin letters expand/collapse button
        const expandLatinBtn = document.getElementById('expandLatinBtn');
        const allLatinLetters = document.getElementById('allLatinLetters');
        if (expandLatinBtn && allLatinLetters) {
            expandLatinBtn.addEventListener('click', () => {
                if (allLatinLetters.style.display === 'none') {
                    allLatinLetters.style.display = 'block';
                    expandLatinBtn.textContent = 'Show Less';
                } else {
                    allLatinLetters.style.display = 'none';
                    expandLatinBtn.textContent = 'Show All';
                }
            });
        }
    }

    // Initialize mouse click handling
    initMouseHandling() {
        this.displayElement.addEventListener('click', (e) => {
            this.handleDisplayClick(e);
        });
    }

    // Handle clicks on the expression display
    handleDisplayClick(event) {
        const target = event.target;
        
        // Check if clicked on a cursor
        if (target.classList.contains('cursor')) {
            const position = parseInt(target.dataset.position);
            if (!isNaN(position)) {
                this.setCursorPosition(position);
                this.render();
            }
            return;
        }

        // Check if clicked on a section (numerator, denominator, etc.)
        let sectionElement = target;
        while (sectionElement && sectionElement !== this.displayElement) {
            const section = sectionElement.dataset.section;
            if (section) {
                // Find the parent complex element
                const complexElement = this.findComplexElementForSection(sectionElement);
                if (complexElement) {
                    this.navContext.clear();
                    this.navContext.enter(complexElement.element, section);
                    
                    // Try to find cursor position within section
                    const cursorInSection = sectionElement.querySelector('.cursor');
                    if (cursorInSection && cursorInSection.dataset.position) {
                        this.navContext.currentPosition = parseInt(cursorInSection.dataset.position);
                    }
                    
                    this.render();
                    return;
                }
            }
            sectionElement = sectionElement.parentElement;
        }

        // If clicked on main display, move cursor to nearest position
        const clickX = event.clientX;
        const clickY = event.clientY;
        this.setCursorToNearestPosition(clickX, clickY);
    }

    // Find the complex element that contains this section
    findComplexElementForSection(sectionElement) {
        // Search through all elements to find matching one
        for (let i = 0; i < this.expression.elements.length; i++) {
            const element = this.expression.elements[i];
            if (this.isComplexElementType(element)) {
                // Check if this section belongs to this element
                const elementNode = this.displayElement.querySelector(`[data-element-index="${i}"]`);
                if (elementNode && elementNode.contains(sectionElement)) {
                    return { element, index: i };
                }
            }
        }
        return null;
    }

    // Check if element is a complex type
    isComplexElementType(element) {
        return element && (
            element.type === 'fraction' ||
            element.type === 'power' ||
            element.type === 'subscript' ||
            element.type === 'sqrt' ||
            element.type === 'parens'
        );
    }

    // Set cursor to nearest position based on click coordinates
    setCursorToNearestPosition(clickX, clickY) {
        const cursors = this.displayElement.querySelectorAll('.cursor');
        let nearestCursor = null;
        let minDistance = Infinity;

        cursors.forEach((cursor) => {
            const rect = cursor.getBoundingClientRect();
            const cursorX = rect.left + rect.width / 2;
            const cursorY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(clickX - cursorX, 2) + 
                Math.pow(clickY - cursorY, 2)
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearestCursor = cursor;
            }
        });

        if (nearestCursor && nearestCursor.dataset.position) {
            const position = parseInt(nearestCursor.dataset.position);
            this.setCursorPosition(position);
            this.render();
        }
    }

    // Set cursor position
    setCursorPosition(position) {
        this.navContext.clear();
        this.expression.cursorPosition = position;
    }

    // Render the expression
    render() {
        if (!this.displayElement) return;

        // Clear display
        this.displayElement.innerHTML = '';

        // Render main expression
        if (this.navContext.isInsideElement()) {
            // Render with context awareness
            this.renderWithContext();
        } else {
            // Normal rendering
            this.renderMainExpression();
        }

        // Update navigation highlights
        // Note: We already add 'active' class during rendering, so we don't need
        // the NavigationRenderer to do it again. Comment this out to avoid conflicts.
        // const activePos = this.navigationSystem.getActivePosition();
        // if (activePos.type === 'section') {
        //     this.navRenderer.highlightActiveSection(activePos.section);
        // }

        // Update breadcrumbs
        const breadcrumbs = this.navigationSystem.getBreadcrumbs();
        this.navRenderer.updateBreadcrumbs(breadcrumbs);
    }

    // Render main expression
    renderMainExpression() {
        const fragment = document.createDocumentFragment();

        // Add cursor at start if position is 0
        if (this.expression.cursorPosition === 0) {
            fragment.appendChild(this.createCursor(true, 0));
        } else {
            fragment.appendChild(this.createCursor(false, 0));
        }

        // Render each element
        this.expression.elements.forEach((element, index) => {
            const elementNode = this.renderElement(element);
            fragment.appendChild(elementNode);

            // Add cursor after this element if needed
            const position = index + 1;
            if (this.expression.cursorPosition === position) {
                fragment.appendChild(this.createCursor(true, position));
            } else {
                fragment.appendChild(this.createCursor(false, position));
            }
        });

        this.displayElement.appendChild(fragment);
    }

    // Render with navigation context (inside complex element)
    renderWithContext() {
        const fragment = document.createDocumentFragment();

        // Add cursor at start if position is 0
        if (this.expression.cursorPosition === 0) {
            fragment.appendChild(this.createCursor(true, 0));
        } else {
            fragment.appendChild(this.createCursor(false, 0));
        }

        // Render each element, highlighting the active one
        this.expression.elements.forEach((element, index) => {
            const isActive = this.navContext.currentElement === element;
            const elementNode = this.renderElement(element, isActive);
            fragment.appendChild(elementNode);

            // Add cursor after this element
            const position = index + 1;
            const cursorActive = !this.navContext.isInsideElement() && 
                                 this.expression.cursorPosition === position;
            fragment.appendChild(this.createCursor(cursorActive, position));
        });

        this.displayElement.appendChild(fragment);
    }

    // Render a single element
    renderElement(element, isActive = false) {
        const container = document.createElement('span');
        container.classList.add('expr-element');
        
        if (isActive) {
            container.classList.add('focused');
        }

        // Store element index for click handling
        const elementIndex = this.expression.elements.indexOf(element);
        if (elementIndex >= 0) {
            container.dataset.elementIndex = elementIndex;
        }

        switch (element.type) {
            case 'number':
            case 'symbol':
                container.classList.add(`expr-${element.type}`);
                container.textContent = element.value;
                break;

            case 'operator':
                container.classList.add('expr-operator');
                const opSymbols = {
                    '+': '+',
                    '-': '−',
                    '*': '×',
                    '/': '÷',
                    '=': '='
                };
                container.textContent = opSymbols[element.value] || element.value;
                break;

            case 'fraction':
                this.renderFraction(container, element);
                break;

            case 'power':
                this.renderPower(container, element);
                break;

            case 'subscript':
                this.renderSubscript(container, element);
                break;

            case 'sqrt':
                this.renderSqrt(container, element);
                break;

            case 'function':
                container.classList.add('expr-function');
                container.textContent = element.value;
                break;

            case 'parens':
                this.renderParens(container, element);
                break;

            case 'linebreak':
                container.classList.add('expr-linebreak');
                container.style.flexBasis = '100%';
                container.style.height = '0';
                break;

            default:
                container.textContent = '?';
        }

        return container;
    }

    // Render fraction
    renderFraction(container, element) {
        container.classList.add('expr-fraction');

        // Check if this element is the currently active element
        // Use object identity - this works for nested elements too
        const isCurrentElement = this.navContext.currentElement === element;

        const numerator = document.createElement('div');
        numerator.classList.add('fraction-numerator');
        numerator.setAttribute('data-section', 'numerator');
        
        const isNumeratorActive = this.navContext.currentSection === 'numerator' && isCurrentElement;
        
        if (isNumeratorActive) {
            numerator.classList.add('active');
        }
        
        // Add empty class if no elements
        if (!element.numerator || element.numerator.length === 0) {
            numerator.classList.add('empty');
        }

        this.renderSection(numerator, element.numerator, isNumeratorActive);
        container.appendChild(numerator);

        const denominator = document.createElement('div');
        denominator.classList.add('fraction-denominator');
        denominator.setAttribute('data-section', 'denominator');
        
        const isDenominatorActive = this.navContext.currentSection === 'denominator' && isCurrentElement;
        
        if (isDenominatorActive) {
            denominator.classList.add('active');
        }
        
        // Add empty class if no elements
        if (!element.denominator || element.denominator.length === 0) {
            denominator.classList.add('empty');
        }

        this.renderSection(denominator, element.denominator, isDenominatorActive);
        container.appendChild(denominator);
    }

    // Render power (exponent)
    renderPower(container, element) {
        container.classList.add('expr-power');

        // Check if this element is the currently active element
        const isCurrentElement = this.navContext.currentElement === element;

        const base = document.createElement('span');
        base.classList.add('power-base');
        base.setAttribute('data-section', 'base');
        
        const isBaseActive = this.navContext.currentSection === 'base' && isCurrentElement;
        
        if (isBaseActive) {
            base.classList.add('active');
        }
        
        // Add empty class if no elements
        if (!element.base || element.base.length === 0) {
            base.classList.add('empty');
        }

        this.renderSection(base, element.base, isBaseActive);
        container.appendChild(base);

        const exponent = document.createElement('span');
        exponent.classList.add('power-exponent');
        exponent.setAttribute('data-section', 'exponent');
        
        const isExponentActive = this.navContext.currentSection === 'exponent' && isCurrentElement;
        
        if (isExponentActive) {
            exponent.classList.add('active');
        }
        
        // Add empty class if no elements
        if (!element.exponent || element.exponent.length === 0) {
            exponent.classList.add('empty');
        }

        this.renderSection(exponent, element.exponent, isExponentActive);
        container.appendChild(exponent);
    }

    // Render subscript
    renderSubscript(container, element) {
        container.classList.add('expr-subscript');

        // Check if this element is the currently active element
        const isCurrentElement = this.navContext.currentElement === element;

        const base = document.createElement('span');
        base.classList.add('subscript-base');
        base.setAttribute('data-section', 'base');
        
        const isBaseActive = this.navContext.currentSection === 'base' && isCurrentElement;
        
        if (isBaseActive) {
            base.classList.add('active');
        }
        
        // Add empty class if no elements
        if (!element.base || element.base.length === 0) {
            base.classList.add('empty');
        }

        this.renderSection(base, element.base, isBaseActive);
        container.appendChild(base);

        const index = document.createElement('span');
        index.classList.add('subscript-index');
        index.setAttribute('data-section', 'index');
        
        const isIndexActive = this.navContext.currentSection === 'index' && isCurrentElement;
        
        if (isIndexActive) {
            index.classList.add('active');
        }
        
        // Add empty class if no elements
        if (!element.index || element.index.length === 0) {
            index.classList.add('empty');
        }

        this.renderSection(index, element.index, isIndexActive);
        container.appendChild(index);
    }

    // Render square root
    renderSqrt(container, element) {
        container.classList.add('expr-sqrt');

        // Create a wrapper for the radical symbol
        const radicalWrapper = document.createElement('span');
        radicalWrapper.classList.add('sqrt-radical-wrapper');
        
        // Create SVG radical symbol that scales with content
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.classList.add('sqrt-symbol');
        svg.setAttribute('viewBox', '0 0 30 50');
        svg.setAttribute('preserveAspectRatio', 'none');
        
        const path = document.createElementNS(svgNS, "path");
        // Path: gentle down diagonal, sharp up, then connect to horizontal line
        path.setAttribute('d', 'M 0 32 L 10 50 L 22 1 L 33 1');
        path.setAttribute('stroke', '#333');
        path.setAttribute('stroke-width', '3');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'butt');
        path.setAttribute('stroke-linejoin', 'miter');
        
        svg.appendChild(path);
        radicalWrapper.appendChild(svg);
        container.appendChild(radicalWrapper);

        // Check if this element is the currently active element
        const isCurrentElement = this.navContext.currentElement === element;

        const content = document.createElement('span');
        content.classList.add('sqrt-content');
        content.setAttribute('data-section', 'content');
        
        const isContentActive = this.navContext.currentSection === 'content' && isCurrentElement;
        
        if (isContentActive) {
            content.classList.add('active');
        }
        
        // Add empty class if no elements
        if (!element.content || element.content.length === 0) {
            content.classList.add('empty');
        }

        this.renderSection(content, element.content, isContentActive);
        container.appendChild(content);
    }

    // Render parentheses
    renderParens(container, element) {
        container.classList.add('expr-parens');

        const open = document.createElement('span');
        open.textContent = '(';
        container.appendChild(open);

        // Check if this element is the currently active element
        const isCurrentElement = this.navContext.currentElement === element;

        const content = document.createElement('span');
        content.classList.add('parens-content');
        content.setAttribute('data-section', 'content');
        
        const isContentActive = this.navContext.currentSection === 'content' && isCurrentElement;
        
        if (isContentActive) {
            content.classList.add('active');
        }
        
        // Add empty class if no elements
        if (!element.content || element.content.length === 0) {
            content.classList.add('empty');
        }

        this.renderSection(content, element.content, isContentActive);
        container.appendChild(content);

        const close = document.createElement('span');
        close.textContent = ')';
        container.appendChild(close);
    }

    // Render a section (array of elements)
    renderSection(container, elements, isActiveSection = false) {
        if (!elements || elements.length === 0) {
            // Show placeholder cursor if this is the active section
            const cursor = this.createCursor(
                isActiveSection && this.navContext.currentPosition === 0,
                0
            );
            container.appendChild(cursor);
            return;
        }

        // Render cursor at start if needed
        if (isActiveSection && this.navContext.currentPosition === 0) {
            container.appendChild(this.createCursor(true, 0));
        } else {
            container.appendChild(this.createCursor(false, 0));
        }

        // Render each element in section
        elements.forEach((element, index) => {
            const elementNode = this.renderElement(element);
            container.appendChild(elementNode);

            // Add cursor after element if needed
            const position = index + 1;
            const cursorActive = isActiveSection && 
                                 this.navContext.currentPosition === position;
            container.appendChild(this.createCursor(cursorActive, position));
        });
    }

    // Create cursor element
    createCursor(isActive, position = 0) {
        const cursor = document.createElement('span');
        cursor.classList.add('cursor');
        cursor.dataset.position = position;
        if (isActive) {
            cursor.classList.add('active');
        }
        return cursor;
    }

    // Export to LaTeX
    exportLatex() {
        const latex = this.expression.toLatex();
        
        // Create a modal or alert with the LaTeX
        const message = latex || 'Expression is empty';
        
        // Copy to clipboard
        navigator.clipboard.writeText(message).then(() => {
            alert(window.t('msgLatexCopied') + message);
        }).catch(() => {
            alert(window.t('lblLatex') + ':\n\n' + message);
        });
    }

    // Export to JPEG
    async exportJpeg() {
        if (!this.displayElement) {
            alert(window.t('msgDisplayNotFound'));
            return;
        }

        if (this.expression.elements.length === 0) {
            alert(window.t('msgExprEmptyCreate'));
            return;
        }

        try {
            // Temporarily hide cursors for export
            const cursors = this.displayElement.querySelectorAll('.cursor');
            cursors.forEach(cursor => {
                cursor.style.display = 'none';
            });

            // Remove focus highlights for cleaner export
            const focused = this.displayElement.querySelectorAll('.focused');
            focused.forEach(el => {
                el.classList.remove('focused');
            });

            const active = this.displayElement.querySelectorAll('.active');
            active.forEach(el => {
                el.classList.remove('active');
            });

            // Hide all dotted borders by temporarily removing them
            const borderedElements = this.displayElement.querySelectorAll(
                '.fraction-numerator, .fraction-denominator, ' +
                '.power-base, .power-exponent, ' +
                '.subscript-base, .subscript-index, ' +
                '.parens-content'
            );
            const originalBorders = [];
            borderedElements.forEach(el => {
                // Save original border styles
                originalBorders.push({
                    left: el.style.borderLeft,
                    right: el.style.borderRight,
                    top: el.style.borderTop,
                    bottom: el.style.borderBottom
                });
                // Hide side and top dotted borders
                el.style.borderLeft = 'none';
                el.style.borderRight = 'none';
                el.style.borderTop = 'none';
                // Hide bottom border except for fraction-numerator (which has the fraction line)
                if (!el.classList.contains('fraction-numerator')) {
                    el.style.borderBottom = 'none';
                }
            });
            
            // For sqrt-content, hide only the side/bottom borders but keep the top border
            const sqrtContents = this.displayElement.querySelectorAll('.sqrt-content');
            const originalSqrtBorders = [];
            sqrtContents.forEach(el => {
                originalSqrtBorders.push({
                    left: el.style.borderLeft,
                    right: el.style.borderRight,
                    bottom: el.style.borderBottom
                });
                el.style.borderLeft = 'none';
                el.style.borderRight = 'none';
                el.style.borderBottom = 'none';
            });

            // Use html2canvas to capture the expression
            const canvas = await html2canvas(this.displayElement, {
                backgroundColor: '#fafafa',
                scale: 2, // Higher quality
                logging: false,
                width: this.displayElement.scrollWidth,
                height: this.displayElement.scrollHeight
            });

            // Restore borders
            borderedElements.forEach((el, index) => {
                el.style.borderLeft = originalBorders[index].left;
                el.style.borderRight = originalBorders[index].right;
                el.style.borderTop = originalBorders[index].top;
                el.style.borderBottom = originalBorders[index].bottom;
            });
            
            // Restore sqrt borders
            sqrtContents.forEach((el, index) => {
                el.style.borderLeft = originalSqrtBorders[index].left;
                el.style.borderRight = originalSqrtBorders[index].right;
                el.style.borderBottom = originalSqrtBorders[index].bottom;
            });

            // Get LaTeX representation
            const latex = this.expression.toLatex();

            // Convert canvas to base64 data URL
            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
            
            // Convert data URL to blob with embedded LaTeX metadata
            // We'll embed LaTeX in the JPEG comment segment
            fetch(dataUrl)
                .then(res => res.blob())
                .then(blob => {
                    return blob.arrayBuffer();
                })
                .then(arrayBuffer => {
                    // Convert to Uint8Array for manipulation
                    const bytes = new Uint8Array(arrayBuffer);
                    
                    // Create comment marker (0xFFFE) with LaTeX data
                    const latexBytes = new TextEncoder().encode(latex);
                    const commentMarker = new Uint8Array([
                        0xFF, 0xFE, // COM marker
                        (latexBytes.length + 2) >> 8, // Length high byte
                        (latexBytes.length + 2) & 0xFF, // Length low byte
                        ...latexBytes
                    ]);
                    
                    // Insert comment after JPEG header (after SOI marker 0xFFD8)
                    const newBytes = new Uint8Array(bytes.length + commentMarker.length);
                    newBytes.set(bytes.slice(0, 2), 0); // Copy SOI marker
                    newBytes.set(commentMarker, 2); // Insert comment
                    newBytes.set(bytes.slice(2), 2 + commentMarker.length); // Copy rest
                    
                    // Create blob from modified bytes
                    const finalBlob = new Blob([newBytes], { type: 'image/jpeg' });
                    
                    // Create download link
                    const url = URL.createObjectURL(finalBlob);
                    const link = document.createElement('a');
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                    link.download = `math-expression-${timestamp}.jpg`;
                    link.href = url;
                    link.click();

                    // Clean up
                    URL.revokeObjectURL(url);

                    // Show cursors again
                    cursors.forEach(cursor => {
                        cursor.style.display = '';
                    });

                    // Restore highlights
                    this.render();
                })
                .catch(error => {
                    console.error('Failed to embed metadata:', error);
                    alert(window.t('msgExportFailed'));
                    
                    // Show cursors again
                    cursors.forEach(cursor => {
                        cursor.style.display = '';
                    });
                    this.render();
                });

        } catch (error) {
            console.error('Export failed:', error);
            alert(window.t('msgExportFailed'));
            
            // Show cursors again in case of error
            const cursors = this.displayElement.querySelectorAll('.cursor');
            cursors.forEach(cursor => {
                cursor.style.display = '';
            });
            this.render();
        }
    }

    async importFromJpeg(file) {
        try {
            // Read file as array buffer
            const arrayBuffer = await file.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
            
            // Look for COM marker (0xFFFE) after SOI (0xFFD8)
            let latex = null;
            for (let i = 2; i < bytes.length - 4; i++) {
                if (bytes[i] === 0xFF && bytes[i + 1] === 0xFE) {
                    // Found COM marker
                    const length = (bytes[i + 2] << 8) | bytes[i + 3];
                    const commentBytes = bytes.slice(i + 4, i + 2 + length);
                    latex = new TextDecoder().decode(commentBytes);
                    break;
                }
            }
            
            if (!latex) {
                alert(window.t('msgNoLatexMeta'));
                return;
            }
            
            // Parse and import the LaTeX
            console.log('Found LaTeX:', latex);
            
            // Clear current expression
            this.expression.clear();
            this.navContext.clear();
            
            // Parse LaTeX and rebuild expression
            this.parseLatex(latex);
            this.render();
            
            //alert('Expression imported successfully!');
            
        } catch (error) {
            console.error('Import failed:', error);
            alert(window.t('msgImportFailed') + error.message);
        }
    }

    parseLatex(latex) {
        // Remove outer $ signs if present
        latex = latex.trim().replace(/^\$+|\$+$/g, '');
        
        let pos = 0;
        
        const parseToken = () => {
            if (pos >= latex.length) return null;
            
            // Skip whitespace
            while (pos < latex.length && latex[pos] === ' ') pos++;
            
            if (pos >= latex.length) return null;
            
            const char = latex[pos];
            
            // Handle wrapped expressions {content}
            if (char === '{') {
                pos++; // skip {
                let depth = 1;
                while (pos < latex.length && depth > 0) {
                    if (latex[pos] === '{') depth++;
                    if (latex[pos] === '}') {
                        depth--;
                        if (depth === 0) break;
                    }
                    parseToken();
                }
                pos++; // skip closing }
                return 'group';
            }
            
            // Numbers
            if (char >= '0' && char <= '9') {
                pos++;
                this.keyboardController.insertElement(ElementFactory.createNumber(char));
                this.render();
                return 'number';
            }
            
            // Variables (single letters)
            if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
                // Check if it's a command
                if (latex[pos] === '\\') {
                    return parseCommand();
                }
                pos++;
                this.keyboardController.insertElement(ElementFactory.createSymbol(char));
                this.render();
                return 'variable';
            }
            
            // Special symbols (literal characters)
            if (char === '±') {
                pos++;
                this.keyboardController.insertElement(ElementFactory.createSymbol('±'));
                this.render();
                return 'symbol';
            }
            
            // Operators
            if (char === '+' || char === '-' || char === '*' || char === '=') {
                pos++;
                this.keyboardController.insertElement(ElementFactory.createOperator(char));
                this.render();
                return 'operator';
            }
            
            // Division
            if (latex.substr(pos, 5) === '\\div ') {
                pos += 5;
                this.keyboardController.insertElement(ElementFactory.createOperator('/'));
                this.render();
                return 'operator';
            }
            
            // Division (alternative)
            if (latex.substr(pos, 4) === '\\div') {
                pos += 4;
                this.keyboardController.insertElement(ElementFactory.createOperator('/'));
                this.render();
                return 'operator';
            }
            
            // Times
            if (latex.substr(pos, 6) === '\\times') {
                pos += 6;
                this.keyboardController.insertElement(ElementFactory.createOperator('*'));
                this.render();
                return 'operator';
            }
            
            // Plus-minus
            if (latex.substr(pos, 3) === '\\pm') {
                pos += 3;
                this.keyboardController.insertElement(ElementFactory.createSymbol('±'));
                this.render();
                return 'symbol';
            }
            
            // Line break
            if (latex.substr(pos, 2) === '\\\\') {
                pos += 2;
                this.keyboardController.insertElement(ElementFactory.createLineBreak());
                this.render();
                return 'linebreak';
            }
            
            // Fraction
            if (latex.substr(pos, 5) === '\\frac') {
                pos += 5;
                return parseFraction();
            }
            
            // Power
            if (char === '^') {
                pos++;
                return parsePower();
            }
            
            // Subscript
            if (char === '_') {
                pos++;
                return parseSubscript();
            }
            
            // Square root
            if (latex.substr(pos, 5) === '\\sqrt') {
                pos += 5;
                return parseSqrt();
            }
            
            // Parentheses
            if (char === '(') {
                pos++;
                this.keyboardController.handleFunction('parens');
                return 'paren-open';
            }
            
            if (char === ')') {
                pos++;
                if (this.navContext.currentElement && this.navContext.currentElement.type === 'parens') {
                    this.navContext.exit();
                    this.render();
                }
                return 'paren-close';
            }
            
            // Left and right parentheses commands
            if (latex.substr(pos, 6) === '\\left(') {
                pos += 6;
                this.keyboardController.handleFunction('parens');
                return 'paren-open';
            }
            
            if (latex.substr(pos, 7) === '\\right)') {
                pos += 7;
                if (this.navContext.currentElement && this.navContext.currentElement.type === 'parens') {
                    this.navContext.exit();
                    this.render();
                }
                return 'paren-close';
            }
            
            // Skip unknown characters
            pos++;
            return parseToken();
        };
        
        const parseFraction = () => {
            // \frac{numerator}{denominator}
            // Expect {
            if (latex[pos] !== '{') return null;
            pos++; // skip {
            
            // Add fraction
            this.keyboardController.handleFunction('fraction');
            
            // Parse numerator (already in numerator after creation)
            let depth = 1;
            while (pos < latex.length && depth > 0) {
                if (latex[pos] === '{') depth++;
                if (latex[pos] === '}') {
                    depth--;
                    if (depth === 0) break;
                }
                parseToken();
            }
            pos++; // skip closing }
            
            // Expect {
            if (latex[pos] !== '{') return null;
            pos++; // skip {
            
            // Move to denominator
            this.keyboardController.handleArrowDown();
            
            // Parse denominator
            depth = 1;
            while (pos < latex.length && depth > 0) {
                if (latex[pos] === '{') depth++;
                if (latex[pos] === '}') {
                    depth--;
                    if (depth === 0) break;
                }
                parseToken();
            }
            pos++; // skip closing }
            
            // Exit fraction
            this.navContext.exit();
            this.render();
            return 'fraction';
        };
        
        const parsePower = () => {
            // ^{exponent} or ^x
            // Need to be at main expression level for power to work correctly
            if (this.navContext.isInsideElement()) {
                // Exit to main level first
                while (this.navContext.isInsideElement()) {
                    this.navContext.exit();
                }
                this.render();
            }
            
            this.keyboardController.handleFunction('power');
            
            if (latex[pos] === '{') {
                pos++; // skip {
                let depth = 1;
                while (pos < latex.length && depth > 0) {
                    if (latex[pos] === '{') depth++;
                    if (latex[pos] === '}') {
                        depth--;
                        if (depth === 0) break;
                    }
                    parseToken();
                }
                pos++; // skip closing }
            } else {
                // Single character exponent
                parseToken();
            }
            
            this.navContext.exit();
            this.render();
            return 'power';
        };
        
        const parseSubscript = () => {
            // _{subscript} or _x
            // Need to be at main expression level for subscript to work correctly
            if (this.navContext.isInsideElement()) {
                // Exit to main level first
                while (this.navContext.isInsideElement()) {
                    this.navContext.exit();
                }
                this.render();
            }
            
            this.keyboardController.handleFunction('subscript');
            
            if (latex[pos] === '{') {
                pos++; // skip {
                let depth = 1;
                while (pos < latex.length && depth > 0) {
                    if (latex[pos] === '{') depth++;
                    if (latex[pos] === '}') {
                        depth--;
                        if (depth === 0) break;
                    }
                    parseToken();
                }
                pos++; // skip closing }
            } else {
                // Single character subscript
                parseToken();
            }
            
            this.navContext.exit();
            this.render();
            return 'subscript';
        };
        
        const parseSqrt = () => {
            // \sqrt{content}
            // Expect {
            if (latex[pos] !== '{') return null;
            pos++; // skip {
            
            // Add sqrt
            this.keyboardController.handleFunction('sqrt');
            
            // Parse content (already inside sqrt after creation)
            let depth = 1;
            while (pos < latex.length && depth > 0) {
                if (latex[pos] === '{') depth++;
                if (latex[pos] === '}') {
                    depth--;
                    if (depth === 0) break;
                }
                parseToken();
            }
            pos++; // skip closing }
            
            this.navContext.exit();
            this.render();
            return 'sqrt';
        };
        
        // Parse entire expression
        while (pos < latex.length) {
            parseToken();
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new MathExpressionApp();
    app.init();
});
