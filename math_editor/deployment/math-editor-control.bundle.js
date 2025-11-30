/**
 * Math Editor Control Bundle
 * A reusable math expression editor component with LaTeX visualization
 * 
 * Usage:
 *   <link rel="stylesheet" href="math-editor-control.bundle.css">
 *   <script src="math-editor-control.bundle.js"></script>
 *   
 *   const editor = new MathEditorControl('#container');
 *   editor.init();
 */

const translations = {
    en: {
        // Header & Tabs
        "appTitle": "Math Expression Editor",
        "tabEditor": "Expression Editor",
        "tabGraphing": "Graphing & 3D Shapes",
        "tabTransformations": "2D Transformations",
        "tabDrawing": "Freeform Drawing",
        
        // Controls
        "clear": "Clear",
        "undo": "Undo",
        "exportLatex": "Export LaTeX",
        "exportJpeg": "Export JPEG",
        "importJpeg": "Import from JPEG",
        "evaluate": "Evaluate",
        "result": "Result: ",
        "msgEvalError": "Evaluation Error: ",
        
        // Editor
        "secNumbers": "Numbers",
        "secSpecialFunctions": "Special Functions",
        "secLatinLetters": "Latin Letters",
        "secGreekSymbols": "Greek & Symbols",
        "secNavigation": "Navigation",
        "btnShowAll": "Show All",
        "btnShowLess": "Show Less",
        "navHelp1": "Use Arrow Keys to navigate between expression elements",
        "navHelp2": "Tab / Shift+Tab to move between sub-elements",
        "navHelp3": "Backspace to delete • Esc to exit sub-element",
        "navHelp4": "Enter to insert line break for multiline expressions",
        
        // Graphing
        "secChartType": "Chart Type",
        "btnFunctionGraph": "Function Graph",
        "btnBarChart": "Bar Chart",
        "btnLineChart": "Line Chart",
        "btnPieChart": "Pie Chart",
        "sec3DShapes": "3D Shapes",
        "sec3DControls": "3D Controls",
        "btnPyramid": "Pyramid",
        "btnCube": "Cube",
        "btnCylinder": "Cylinder",
        "btnCuboid": "Cuboid",
        "btnSphere": "Sphere",
        "btnCone": "Cone",
        "secFunctionInput": "Function Input",
        "lblXMin": "X Min:",
        "lblXMax": "X Max:",
        "lblYMin": "Y Min:",
        "lblYMax": "Y Max:",
        "btnPlotGraph": "Plot Graph",
        "secChartData": "Chart Data",
        "lblLabels": "Labels (comma-separated):",
        "lblValues": "Values (comma-separated):",
        "btnPlotChart": "Plot Chart",
        "secShapeParams": "Shape Parameters",
        "btnRenderShape": "Render Shape",
        "lblRotationX": "Rotation X:",
        "lblRotationY": "Rotation Y:",
        "lblRotationZ": "Rotation Z:",
        "lblZoom": "Zoom:",
        "btnResetView": "Reset View",
        
        // Transformations
        "sec2DShape": "2D Shape",
        "btnTriangle": "Triangle",
        "btnSquare": "Square",
        "btnRectangle": "Rectangle",
        "btnCircle": "Circle",
        "btnPolygon": "Polygon",
        "btnCustomPoints": "Custom Points",
        "secTransformations": "Transformations",
        "lblTransX": "Translation X:",
        "lblTransY": "Translation Y:",
        "lblRotation": "Rotation:",
        "lblScale": "Scale:",
        "lblRotCenter": "Rotation Center",
        "lblCenterX": "Center X:",
        "lblCenterY": "Center Y:",
        "btnCenterAtShape": "Center at Shape",
        "secReflections": "Reflections",
        "btnReflectX": "Reflect in X-axis",
        "btnReflectY": "Reflect in Y-axis",
        "btnReflectOrigin": "Reflect in Origin",
        "btnReflectYeqX": "Reflect in y=x",
        "secSpecialTrans": "Special Transformations",
        "btnShearX": "Shear X",
        "btnShearY": "Shear Y",
        "btnRotate90": "Rotate 90°",
        "btnRotate180": "Rotate 180°",
        "secActions": "Actions",
        "btnToggleOriginal": "Toggle Original",
        "btnToggleGrid": "Toggle Grid",
        "btnResetAll": "Reset All",
        "secCustomPoints": "Custom Points",
        "lblPoints": "Points (x,y pairs):",
        "btnApplyPoints": "Apply Points",
        
        // Drawing
        "secDrawingTools": "Drawing Tools",
        "secTool": "Tool",
        "btnPen": "✏️ Pen",
        "btnEraser": "🧹 Eraser",
        "btnLine": "📏 Line",
        "btnRect": "▭ Rectangle",
        "btnCircleTool": "⭕ Circle",
        "btnText": "📝 Text",
        "secColor": "Color",
        "secBrushSize": "Brush Size:",
        "secBackground": "Background",
        "btnWhite": "⬜ White",
        "btnBlack": "⬛ Black",
        "btnTransparent": "🔲 Transparent",
        "secGrid": "Grid",
        "btnToggleGridDraw": "📐 Toggle Grid",
        "lblGridSize": "Grid Size:",
        "btnClearCanvas": "🗑️ Clear Canvas",
        "btnUndoDraw": "↩️ Undo",
        "btnSavePng": "💾 Save PNG",
        
        // JS Strings
        "msgEnterText": "Enter text:",
        "msgClearCanvas": "Clear the entire canvas?",
        "msgInvalidFunction": "Error: Invalid function",
        "lblSize": "Size",
        "lblWidth": "Width",
        "lblHeight": "Height",
        "lblDepth": "Depth",
        "lblBaseSize": "Base Size",
        "lblRadius": "Radius",
        "msgLatexCopied": "LaTeX copied to clipboard:\n\n",
        "msgExprEmpty": "Expression is empty",
        "msgDisplayNotFound": "Display element not found",
        "msgExprEmptyCreate": "Expression is empty. Please create an expression first.",
        "msgExportFailed": "Failed to export image. Please try again.",
        "msgNoLatexMeta": "No LaTeX metadata found in this image. Please select a JPEG exported from this application.",
        "msgImportFailed": "Failed to import from JPEG: ",
        "lblLatex": "LaTeX",
        "lblData": "Data"
    },
    hy: {
        // Header & Tabs
        "appTitle": "Մաթեմատիկական Խմբագրիչ",
        "tabEditor": "Խմբագրիչ",
        "tabGraphing": "Գրաֆիկներ և 3D",
        "tabTransformations": "2D Ձևափոխություններ",
        "tabDrawing": "Ազատ Նկարչություն",
        
        // Controls
        "clear": "Մաքրել",
        "undo": "Հետարկել",
        "exportLatex": "Արտահանել LaTeX",
        "exportJpeg": "Արտահանել JPEG",
        "importJpeg": "Ներմուծել JPEG-ից",
        "evaluate": "Հաշվել",
        "result": "Արդյունք՝ ",
        "msgEvalError": "Հաշվարկի Սխալ՝ ",
        
        // Editor
        "secNumbers": "Թվեր",
        "secSpecialFunctions": "Հատուկ Ֆունկցիաներ",
        "secLatinLetters": "Լատինական Տառեր",
        "secGreekSymbols": "Հունական և Սիմվոլներ",
        "secNavigation": "Նավարկություն",
        "btnShowAll": "Ցուցադրել Բոլորը",
        "btnShowLess": "Թաքցնել",
        "navHelp1": "Օգտագործեք սլաքները տարրերի միջև նավարկելու համար",
        "navHelp2": "Tab / Shift+Tab ենթատարրերի միջև անցնելու համար",
        "navHelp3": "Backspace՝ ջնջելու համար • Esc՝ ենթատարրից դուրս գալու համար",
        "navHelp4": "Enter՝ բազմատող արտահայտությունների համար",
        
        // Graphing
        "secChartType": "Դիագրամի Տեսակ",
        "btnFunctionGraph": "Ֆունկցիայի Գրաֆիկ",
        "btnBarChart": "Սյունակային",
        "btnLineChart": "Գծային",
        "btnPieChart": "Շրջանաձև",
        "sec3DShapes": "3D Պատկերներ",
        "sec3DControls": "3D Կառավարում",
        "btnPyramid": "Բուրգ",
        "btnCube": "Խորանարդ",
        "btnCylinder": "Գլան",
        "btnCuboid": "Ուղղանկյունանիստ",
        "btnSphere": "Գունդ",
        "btnCone": "Կոն",
        "secFunctionInput": "Ֆունկցիայի Մուտքագրում",
        "lblXMin": "X Մին:",
        "lblXMax": "X Մաքս:",
        "lblYMin": "Y Մին:",
        "lblYMax": "Y Մաքս:",
        "btnPlotGraph": "Կառուցել Գրաֆիկը",
        "secChartData": "Դիագրամի Տվյալներ",
        "lblLabels": "Պիտակներ (ստորակետով):",
        "lblValues": "Արժեքներ (ստորակետով):",
        "btnPlotChart": "Կառուցել Դիագրամը",
        "secShapeParams": "Պատկերի Պարամետրեր",
        "btnRenderShape": "Պատկերել",
        "lblRotationX": "Պտույտ X:",
        "lblRotationY": "Պտույտ Y:",
        "lblRotationZ": "Պտույտ Z:",
        "lblZoom": "Մասշտաբ:",
        "btnResetView": "Վերականգնել Տեսքը",
        
        // Transformations
        "sec2DShape": "2D Պատկեր",
        "btnTriangle": "Եռանկյուն",
        "btnSquare": "Քառակուսի",
        "btnRectangle": "Ուղղանկյուն",
        "btnCircle": "Շրջան",
        "btnPolygon": "Բազմանկյուն",
        "btnCustomPoints": "Այլ Կետեր",
        "secTransformations": "Ձևափոխություններ",
        "lblTransX": "Տեղափոխություն X:",
        "lblTransY": "Տեղափոխություն Y:",
        "lblRotation": "Պտույտ:",
        "lblScale": "Մասշտաբ:",
        "lblRotCenter": "Պտտման Կենտրոն",
        "lblCenterX": "Կենտրոն X:",
        "lblCenterY": "Կենտրոն Y:",
        "btnCenterAtShape": "Կենտրոնը Պատկերի Վրա",
        "secReflections": "Համաչափություններ",
        "btnReflectX": "Համաչափ X-ի նկատմամբ",
        "btnReflectY": "Համաչափ Y-ի նկատմամբ",
        "btnReflectOrigin": "Համաչափ O-ի նկատմամբ",
        "btnReflectYeqX": "Համաչափ y=x-ի նկատմամբ",
        "secSpecialTrans": "Հատուկ Ձևափոխություններ",
        "btnShearX": "Սահք X",
        "btnShearY": "Սահք Y",
        "btnRotate90": "Պտտել 90°",
        "btnRotate180": "Պտտել 180°",
        "secActions": "Գործողություններ",
        "btnToggleOriginal": "Ցուցադրել Բնօրինակը",
        "btnToggleGrid": "Ցուցադրել Ցանցը",
        "btnResetAll": "Վերականգնել Բոլորը",
        "secCustomPoints": "Այլ Կետեր",
        "lblPoints": "Կետեր (x,y):",
        "btnApplyPoints": "Կիրառել",
        
        // Drawing
        "secDrawingTools": "Նկարչական Գործիքներ",
        "secTool": "Գործիք",
        "btnPen": "✏️ Գրիչ",
        "btnEraser": "🧹 Ռետին",
        "btnLine": "📏 Գիծ",
        "btnRect": "▭ Ուղղանկյուն",
        "btnCircleTool": "⭕ Շրջան",
        "btnText": "📝 Տեքստ",
        "secColor": "Գույն",
        "secBrushSize": "Վրձնի Չափ:",
        "secBackground": "Ֆոն",
        "btnWhite": "⬜ Սպիտակ",
        "btnBlack": "⬛ Սև",
        "btnTransparent": "🔲 Թափանցիկ",
        "secGrid": "Ցանց",
        "btnToggleGridDraw": "📐 Ցուցադրել Ցանցը",
        "lblGridSize": "Ցանցի Չափ:",
        "btnClearCanvas": "🗑️ Մաքրել Կտավը",
        "btnUndoDraw": "↩️ Հետարկել",
        "btnSavePng": "💾 Պահպանել PNG",
        
        // JS Strings
        "msgEnterText": "Մուտքագրեք տեքստը:",
        "msgClearCanvas": "Մաքրե՞լ ամբողջ կտավը:",
        "msgInvalidFunction": "Սխալ՝ Անվավեր ֆունկցիա",
        "lblSize": "Չափ",
        "lblWidth": "Լայնություն",
        "lblHeight": "Բարձրություն",
        "lblDepth": "Խորություն",
        "lblBaseSize": "Հիմքի Չափ",
        "lblRadius": "Շառավիղ",
        "msgLatexCopied": "LaTeX-ը պատճենված է:\n\n",
        "msgExprEmpty": "Արտահայտությունը դատարկ է",
        "msgDisplayNotFound": "Ցուցադրման տարրը չի գտնվել",
        "msgExprEmptyCreate": "Արտահայտությունը դատարկ է: Խնդրում ենք ստեղծել արտահայտություն:",
        "msgExportFailed": "Չհաջողվեց արտահանել պատկերը:",
        "msgNoLatexMeta": "Այս պատկերում LaTeX մետատվյալներ չեն գտնվել:",
        "msgImportFailed": "Չհաջողվեց ներմուծել JPEG-ից: ",
        "lblLatex": "LaTeX",
        "lblData": "Տվյալներ"
    }
};

// Math Expression Tree Structure
class MathExpression {
    constructor() {
        this.elements = [];
        this.cursorPosition = 0;
        this.history = [];
        this.maxHistory = 50;
    }

    // Add element at cursor position
    addElement(element) {
        this.saveState();
        this.elements.splice(this.cursorPosition, 0, element);
        this.cursorPosition++;
    }

    // Remove element at position
    removeElement(position) {
        if (position >= 0 && position < this.elements.length) {
            this.saveState();
            this.elements.splice(position, 1);
            if (this.cursorPosition > position) {
                this.cursorPosition--;
            }
        }
    }

    // Remove element before cursor (backspace)
    backspace() {
        if (this.cursorPosition > 0) {
            this.removeElement(this.cursorPosition - 1);
        }
    }

    // Move cursor
    moveCursor(direction) {
        if (direction === 'left' && this.cursorPosition > 0) {
            this.cursorPosition--;
            return true;
        } else if (direction === 'right' && this.cursorPosition < this.elements.length) {
            this.cursorPosition++;
            return true;
        }
        return false;
    }

    // Save state for undo
    saveState() {
        const state = {
            elements: JSON.parse(JSON.stringify(this.elements)),
            cursorPosition: this.cursorPosition
        };
        this.history.push(state);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }

    // Undo last action
    undo() {
        if (this.history.length > 0) {
            const state = this.history.pop();
            this.elements = state.elements;
            this.cursorPosition = state.cursorPosition;
            return true;
        }
        return false;
    }

    // Clear all
    clear() {
        this.saveState();
        this.elements = [];
        this.cursorPosition = 0;
    }

    // Export to LaTeX
    toLatex() {
        return this.elements.map(el => this.elementToLatex(el)).join(' ');
    }

    // Export to Math String for evaluation
    toMathString() {
        return this.elements.map(el => this.elementToMathString(el)).join(' ');
    }

    elementToMathString(element) {
        switch (element.type) {
            case 'number':
                return element.value;
            
            case 'symbol':
                const symbolMap = {
                    'π': 'Math.PI',
                    'e': 'Math.E',
                    'θ': 'theta',
                    'α': 'alpha',
                    'β': 'beta',
                    'γ': 'gamma',
                    '±': '' // Cannot evaluate plus-minus
                };
                return symbolMap[element.value] || element.value;
            
            case 'operator':
                const opMap = {
                    '×': '*',
                    '÷': '/',
                    '−': '-',
                    '=': '='
                };
                return opMap[element.value] || element.value;
            
            case 'fraction':
                const num = element.numerator.map(el => this.elementToMathString(el)).join('');
                const den = element.denominator.map(el => this.elementToMathString(el)).join('');
                return `(${num || 0})/(${den || 1})`;
            
            case 'power':
                const base = element.base.map(el => this.elementToMathString(el)).join('');
                const exp = element.exponent.map(el => this.elementToMathString(el)).join('');
                return `(${base || 0})**(${exp || 1})`;
            
            case 'subscript':
                // JS evaluation doesn't support subscripts
                return element.base.map(el => this.elementToMathString(el)).join('');
            
            case 'sqrt':
                const content = element.content.map(el => this.elementToMathString(el)).join('');
                return `Math.sqrt(${content || 0})`;
            
            case 'function':
                const funcMap = {
                    'sin': 'Math.sin',
                    'cos': 'Math.cos',
                    'tan': 'Math.tan',
                    'log': 'Math.log10',
                    'ln': 'Math.log',
                    'abs': 'Math.abs',
                    'sum': 'sum', // Not supported in pure JS without implementation
                    'product': 'product',
                    'limit': 'limit',
                    'integral': 'integral'
                };
                return funcMap[element.value] || element.value;
            
            case 'parens':
                const parenContent = element.content.map(el => this.elementToMathString(el)).join('');
                return `(${parenContent})`;
            
            case 'linebreak':
                return ' ';
            
            default:
                return element.value || '';
        }
    }

    elementToLatex(element) {
        switch (element.type) {
            case 'number':
                return element.value;
            
            case 'symbol':
                // Convert special symbols to LaTeX commands
                if (element.value === '±') {
                    return '\\pm';
                }
                return element.value;
            
            case 'operator':
                const opMap = {
                    '*': '\\times',
                    '/': '\\div',
                    '=': '=',
                    '+': '+',
                    '-': '-'
                };
                return opMap[element.value] || element.value;
            
            case 'fraction':
                const num = element.numerator.map(el => this.elementToLatex(el)).join(' ');
                const den = element.denominator.map(el => this.elementToLatex(el)).join(' ');
                return `\\frac{${num}}{${den}}`;
            
            case 'power':
                const base = element.base.map(el => this.elementToLatex(el)).join(' ');
                const exp = element.exponent.map(el => this.elementToLatex(el)).join(' ');
                return `{${base}}^{${exp}}`;
            
            case 'subscript':
                const sub_base = element.base.map(el => this.elementToLatex(el)).join(' ');
                const index = element.index.map(el => this.elementToLatex(el)).join(' ');
                return `{${sub_base}}_{${index}}`;
            
            case 'sqrt':
                const content = element.content.map(el => this.elementToLatex(el)).join(' ');
                return `\\sqrt{${content}}`;
            
            case 'function':
                const funcMap = {
                    'sin': '\\sin',
                    'cos': '\\cos',
                    'tan': '\\tan',
                    'log': '\\log',
                    'ln': '\\ln',
                    'sum': '\\sum',
                    'product': '\\prod',
                    'integral': '\\int',
                    'limit': '\\lim'
                };
                return funcMap[element.value] || element.value;
            
            case 'parens':
                const parenContent = element.content.map(el => this.elementToLatex(el)).join(' ');
                return `\\left(${parenContent}\\right)`;
            
            case 'linebreak':
                return '\\\\';
            
            default:
                return element.value || '';
        }
    }
}

// Element factory functions
class ElementFactory {
    static createNumber(value) {
        return { type: 'number', value: value };
    }

    static createOperator(value) {
        return { type: 'operator', value: value };
    }

    static createSymbol(value) {
        const symbolMap = {
            'pi': 'π',
            'theta': 'θ',
            'alpha': 'α',
            'beta': 'β',
            'gamma': 'γ',
            'delta': 'δ',
            'epsilon': 'ε',
            'lambda': 'λ',
            'mu': 'μ',
            'sigma': 'σ'
        };
        return { type: 'symbol', value: symbolMap[value] || value };
    }

    static createFraction() {
        return {
            type: 'fraction',
            numerator: [],
            denominator: [],
            activeSection: 'numerator'  // 'numerator' or 'denominator'
        };
    }

    static createPower() {
        return {
            type: 'power',
            base: [],
            exponent: [],
            activeSection: 'base'  // 'base' or 'exponent'
        };
    }

    static createSubscript() {
        return {
            type: 'subscript',
            base: [],
            index: [],
            activeSection: 'base'  // 'base' or 'index'
        };
    }

    static createSqrt() {
        return {
            type: 'sqrt',
            content: []
        };
    }

    static createFunction(name) {
        return {
            type: 'function',
            value: name,
            argument: []
        };
    }

    static createParens() {
        return {
            type: 'parens',
            content: []
        };
    }

    static createLineBreak() {
        return {
            type: 'linebreak'
        };
    }
}

// Navigation context for complex elements
class NavigationContext {
    constructor() {
        this.stack = [];  // Stack of {element, section, position}
        this.currentElement = null;
        this.currentSection = null;
        this.currentPosition = 0;
    }

    // Enter a complex element (fraction, power, etc.)
    enter(element, section = null) {
        this.stack.push({
            element: this.currentElement,
            section: this.currentSection,
            position: this.currentPosition
        });
        
        this.currentElement = element;
        this.currentSection = section || this.getFirstSection(element);
        this.currentPosition = 0;
    }

    // Exit current complex element
    exit() {
        if (this.stack.length > 0) {
            const prev = this.stack.pop();
            this.currentElement = prev.element;
            this.currentSection = prev.section;
            this.currentPosition = prev.position;
            return true;
        }
        this.currentElement = null;
        this.currentSection = null;
        this.currentPosition = 0;
        return false;
    }

    // Navigate to next section in current element
    nextSection() {
        if (!this.currentElement) return false;
        
        const sections = this.getSections(this.currentElement);
        const currentIndex = sections.indexOf(this.currentSection);
        
        if (currentIndex < sections.length - 1) {
            this.currentSection = sections[currentIndex + 1];
            this.currentPosition = 0;
            return true;
        }
        return false;
    }

    // Navigate to previous section in current element
    previousSection() {
        if (!this.currentElement) return false;
        
        const sections = this.getSections(this.currentElement);
        const currentIndex = sections.indexOf(this.currentSection);
        
        if (currentIndex > 0) {
            this.currentSection = sections[currentIndex - 1];
            this.currentPosition = 0;
            return true;
        }
        return false;
    }

    // Get all sections for an element type
    getSections(element) {
        switch (element.type) {
            case 'fraction':
                return ['numerator', 'denominator'];
            case 'power':
                return ['base', 'exponent'];
            case 'subscript':
                return ['base', 'index'];
            case 'sqrt':
            case 'parens':
            case 'function':
                return ['content'];
            default:
                return [];
        }
    }

    // Get first section for an element
    getFirstSection(element) {
        const sections = this.getSections(element);
        return sections.length > 0 ? sections[0] : null;
    }

    // Get current section array
    getCurrentSectionArray() {
        if (!this.currentElement || !this.currentSection) return null;
        
        switch (this.currentElement.type) {
            case 'fraction':
                return this.currentElement[this.currentSection];  // numerator or denominator
            case 'power':
                return this.currentElement[this.currentSection];  // base or exponent
            case 'subscript':
                return this.currentElement[this.currentSection];  // base or index
            case 'sqrt':
                return this.currentElement.content;
            case 'parens':
                return this.currentElement.content;
            case 'function':
                return this.currentElement.argument;
            default:
                return null;
        }
    }

    // Check if we're inside a complex element
    isInsideElement() {
        return this.currentElement !== null;
    }

    // Get depth of nesting
    getDepth() {
        return this.stack.length;
    }

    // Clear context
    clear() {
        this.stack = [];
        this.currentElement = null;
        this.currentSection = null;
        this.currentPosition = 0;
    }
}

// Navigation System for Math Expressions
class NavigationSystem {
    constructor(expression, navContext) {
        this.expression = expression;
        this.navContext = navContext;
    }

    // Get the current active position information
    getActivePosition() {
        if (this.navContext.isInsideElement()) {
            return {
                type: 'section',
                element: this.navContext.currentElement,
                section: this.navContext.currentSection,
                position: this.navContext.currentPosition,
                depth: this.navContext.getDepth()
            };
        } else {
            return {
                type: 'main',
                position: this.expression.cursorPosition,
                depth: 0
            };
        }
    }

    // Navigate to specific element in main expression
    navigateToElement(index) {
        if (index >= 0 && index <= this.expression.elements.length) {
            this.navContext.clear();
            this.expression.cursorPosition = index;
            return true;
        }
        return false;
    }

    // Navigate into a complex element
    navigateInto(elementIndex, section = null) {
        if (elementIndex >= 0 && elementIndex < this.expression.elements.length) {
            const element = this.expression.elements[elementIndex];
            
            if (this.isNavigableElement(element)) {
                this.expression.cursorPosition = elementIndex;
                this.navContext.clear();
                this.navContext.enter(element, section);
                return true;
            }
        }
        return false;
    }

    // Navigate out of current complex element
    navigateOut() {
        if (this.navContext.isInsideElement()) {
            this.navContext.exit();
            return true;
        }
        return false;
    }

    // Check if element can be navigated into
    isNavigableElement(element) {
        return element && (
            element.type === 'fraction' ||
            element.type === 'power' ||
            element.type === 'subscript' ||
            element.type === 'sqrt' ||
            element.type === 'parens' ||
            element.type === 'function'
        );
    }

    // Get all navigable sections of current element
    getNavigableSections() {
        if (!this.navContext.isInsideElement()) {
            return [];
        }
        return this.navContext.getSections(this.navContext.currentElement);
    }

    // Get element at current cursor position
    getCurrentElement() {
        const pos = this.expression.cursorPosition;
        if (pos > 0 && pos <= this.expression.elements.length) {
            return this.expression.elements[pos - 1];
        }
        return null;
    }

    // Get element after cursor
    getNextElement() {
        const pos = this.expression.cursorPosition;
        if (pos < this.expression.elements.length) {
            return this.expression.elements[pos];
        }
        return null;
    }

    // Smart navigation - find next/previous editable position
    findNextPosition() {
        if (this.navContext.isInsideElement()) {
            const sectionArray = this.navContext.getCurrentSectionArray();
            
            // Try to move within current section
            if (sectionArray && this.navContext.currentPosition < sectionArray.length) {
                // Check if next element in section is complex
                const nextEl = sectionArray[this.navContext.currentPosition];
                if (this.isNavigableElement(nextEl)) {
                    return { type: 'enter-nested', element: nextEl };
                } else {
                    this.navContext.currentPosition++;
                    return { type: 'same-section' };
                }
            }
            
            // Try to move to next section
            if (this.navContext.nextSection()) {
                return { type: 'next-section' };
            }
            
            // Exit to parent
            this.navContext.exit();
            return { type: 'exit-parent' };
        } else {
            // Main expression navigation
            if (this.expression.cursorPosition < this.expression.elements.length) {
                const nextEl = this.expression.elements[this.expression.cursorPosition];
                if (this.isNavigableElement(nextEl)) {
                    return { type: 'enter', element: nextEl };
                } else {
                    this.expression.moveCursor('right');
                    return { type: 'move-right' };
                }
            }
            return { type: 'end' };
        }
    }

    findPreviousPosition() {
        if (this.navContext.isInsideElement()) {
            // Try to move within current section
            if (this.navContext.currentPosition > 0) {
                this.navContext.currentPosition--;
                
                const sectionArray = this.navContext.getCurrentSectionArray();
                const prevEl = sectionArray[this.navContext.currentPosition];
                
                if (this.isNavigableElement(prevEl)) {
                    return { type: 'enter-nested-end', element: prevEl };
                }
                return { type: 'same-section' };
            }
            
            // Try to move to previous section
            if (this.navContext.previousSection()) {
                // Move to end of previous section
                const sectionArray = this.navContext.getCurrentSectionArray();
                if (sectionArray) {
                    this.navContext.currentPosition = sectionArray.length;
                }
                return { type: 'previous-section' };
            }
            
            // Exit to parent
            this.navContext.exit();
            return { type: 'exit-parent' };
        } else {
            // Main expression navigation
            if (this.expression.cursorPosition > 0) {
                const prevEl = this.expression.elements[this.expression.cursorPosition - 1];
                if (this.isNavigableElement(prevEl)) {
                    return { type: 'enter-end', element: prevEl };
                } else {
                    this.expression.moveCursor('left');
                    return { type: 'move-left' };
                }
            }
            return { type: 'start' };
        }
    }

    // Get breadcrumb path for current position
    getBreadcrumbs() {
        const breadcrumbs = ['Expression'];
        
        if (this.navContext.isInsideElement()) {
            // Build path from stack
            for (let i = 0; i < this.navContext.stack.length; i++) {
                const item = this.navContext.stack[i];
                if (item.element) {
                    breadcrumbs.push(this.getElementLabel(item.element, item.section));
                }
            }
            
            // Add current element
            if (this.navContext.currentElement) {
                breadcrumbs.push(
                    this.getElementLabel(
                        this.navContext.currentElement,
                        this.navContext.currentSection
                    )
                );
            }
        }
        
        return breadcrumbs;
    }

    // Get human-readable label for element and section
    getElementLabel(element, section) {
        if (!element) return 'Unknown';
        
        const labels = {
            'fraction': {
                'numerator': 'Fraction (Numerator)',
                'denominator': 'Fraction (Denominator)'
            },
            'power': {
                'base': 'Power (Base)',
                'exponent': 'Power (Exponent)'
            },
            'subscript': {
                'base': 'Subscript (Base)',
                'index': 'Subscript (Index)'
            },
            'sqrt': {
                'content': 'Square Root'
            },
            'parens': {
                'content': 'Parentheses'
            },
            'function': {
                'argument': `Function ${element.value || ''}`
            }
        };
        
        if (labels[element.type] && section) {
            return labels[element.type][section] || element.type;
        }
        
        return element.type;
    }

    // Validate navigation state
    isValidState() {
        // Check if navigation context is consistent
        if (this.navContext.isInsideElement()) {
            const sectionArray = this.navContext.getCurrentSectionArray();
            if (!sectionArray) return false;
            
            if (this.navContext.currentPosition < 0 || 
                this.navContext.currentPosition > sectionArray.length) {
                return false;
            }
        }
        
        if (this.expression.cursorPosition < 0 || 
            this.expression.cursorPosition > this.expression.elements.length) {
            return false;
        }
        
        return true;
    }

    // Reset navigation to safe state
    reset() {
        this.navContext.clear();
        this.expression.cursorPosition = this.expression.elements.length;
    }

    // Get statistics about current expression
    getStats() {
        return {
            totalElements: this.expression.elements.length,
            cursorPosition: this.expression.cursorPosition,
            nestingDepth: this.navContext.getDepth(),
            isInsideElement: this.navContext.isInsideElement(),
            currentSection: this.navContext.currentSection,
            historySize: this.expression.history.length
        };
    }
}

// Helper class for visual navigation feedback
class NavigationRenderer {
    constructor(displayElement) {
        this.displayElement = displayElement;
    }

    // Highlight the active section
    highlightActiveSection(section) {
        // Remove all existing highlights
        const highlighted = this.displayElement.querySelectorAll('.active');
        highlighted.forEach(el => el.classList.remove('active'));
        
        // Add highlight to active section
        if (section) {
            const sectionEl = this.displayElement.querySelector(`[data-section="${section}"]`);
            if (sectionEl) {
                sectionEl.classList.add('active');
            }
        }
    }

    // Show cursor at position
    showCursor(position, isInsideElement = false) {
        // Remove all existing cursors
        const cursors = this.displayElement.querySelectorAll('.cursor');
        cursors.forEach(cursor => cursor.classList.remove('active'));
        
        // Find and activate the correct cursor
        if (isInsideElement) {
            // Cursor is inside a complex element section
            const activeSections = this.displayElement.querySelectorAll('.active');
            if (activeSections.length > 0) {
                const sectionEl = activeSections[activeSections.length - 1];
                const cursors = sectionEl.querySelectorAll('.cursor');
                if (cursors[position]) {
                    cursors[position].classList.add('active');
                }
            }
        } else {
            // Cursor is in main expression
            const mainCursors = this.displayElement.querySelectorAll('.expression-display > .cursor');
            if (mainCursors[position]) {
                mainCursors[position].classList.add('active');
            }
        }
    }

    // Update breadcrumb display
    updateBreadcrumbs(breadcrumbs) {
        // This would update a breadcrumb UI element if we had one
        // console.log('Navigation path:', breadcrumbs.join(' > '));
    }
}

// Keyboard Controller
class KeyboardController {
    constructor(expression, navigationContext, renderCallback) {
        this.expression = expression;
        this.navContext = navigationContext;
        this.renderCallback = renderCallback;
        this.keyboardButtons = [];
        this.enabled = true;
    }

    // Enable/disable keyboard event handling
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    // Initialize keyboard event listeners
    init() {
        // Physical keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Virtual keyboard buttons
        this.keyboardButtons = document.querySelectorAll('.key-btn');
        this.keyboardButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handleButtonClick(btn));
        });
    }

    // Handle physical keyboard input
    handleKeyDown(e) {
        // Don't capture keyboard events if disabled or if typing in an input field
        if (!this.enabled || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Arrow key navigation
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.handleArrowLeft();
            return;
        }
        
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.handleArrowRight();
            return;
        }
        
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.handleArrowUp();
            return;
        }
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.handleArrowDown();
            return;
        }
        
        // Tab navigation between sections
        if (e.key === 'Tab') {
            e.preventDefault();
            if (e.shiftKey) {
                this.navContext.previousSection();
            } else {
                this.navContext.nextSection();
            }
            this.renderCallback();
            return;
        }
        
        // Escape to exit complex element
        if (e.key === 'Escape') {
            e.preventDefault();
            this.navContext.exit();
            this.renderCallback();
            return;
        }
        
        // Backspace
        if (e.key === 'Backspace') {
            e.preventDefault();
            this.handleBackspace();
            return;
        }
        
        // Numbers
        if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
            this.insertElement(ElementFactory.createNumber(e.key));
            return;
        }
        
        // Decimal point
        if (e.key === '.') {
            e.preventDefault();
            this.insertElement(ElementFactory.createNumber('.'));
            return;
        }
        
        // Operators
        const operatorMap = {
            '+': '+',
            '-': '-',
            '*': '*',
            '/': '/',
            '=': '='
        };
        
        if (operatorMap[e.key]) {
            e.preventDefault();
            this.insertElement(ElementFactory.createOperator(operatorMap[e.key]));
            return;
        }
        
        // Parentheses
        if (e.key === '(') {
            e.preventDefault();
            this.insertElement(ElementFactory.createSymbol('('));
            return;
        }
        
        if (e.key === ')') {
            e.preventDefault();
            this.insertElement(ElementFactory.createSymbol(')'));
            return;
        }
        
        // Enter for line break
        if (e.key === 'Enter') {
            e.preventDefault();
            this.insertElement(ElementFactory.createLineBreak());
            return;
        }
        
        // Letters (for variables)
        if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
            e.preventDefault();
            this.insertElement(ElementFactory.createSymbol(e.key));
            return;
        }
    }

    // Handle virtual keyboard button click
    handleButtonClick(button) {
        const value = button.dataset.value;
        const type = this.getButtonType(button);
        
        switch (type) {
            case 'number':
                this.insertElement(ElementFactory.createNumber(value));
                break;
            
            case 'operator':
                this.insertElement(ElementFactory.createOperator(value));
                break;
            
            case 'symbol':
                this.insertElement(ElementFactory.createSymbol(value));
                break;
            
            case 'function':
                this.handleFunction(value);
                break;
            
            case 'trig':
                this.insertElement(ElementFactory.createFunction(value));
                break;
        }
        
        this.renderCallback();
    }

    // Get button type from classes
    getButtonType(button) {
        if (button.classList.contains('number')) return 'number';
        if (button.classList.contains('operator')) return 'operator';
        if (button.classList.contains('symbol')) return 'symbol';
        if (button.classList.contains('function')) return 'function';
        if (button.classList.contains('trig')) return 'trig';
        return 'unknown';
    }

    // Handle special functions
    handleFunction(funcName) {
        let element;
        
        switch (funcName) {
            case 'fraction':
                element = ElementFactory.createFraction();
                this.insertElement(element);
                
                // Get the position where we just inserted
                if (this.navContext.isInsideElement()) {
                    const sectionArray = this.navContext.getCurrentSectionArray();
                    const insertedPos = this.navContext.currentPosition - 1;
                    if (sectionArray && sectionArray[insertedPos] === element) {
                        this.navContext.enter(element, 'numerator');
                    }
                } else {
                    const insertedPos = this.expression.cursorPosition - 1;
                    if (this.expression.elements[insertedPos] === element) {
                        this.navContext.enter(element, 'numerator');
                    }
                }
                this.renderCallback();
                break;
            
            case 'power':
            case 'superscript':
                // If there is an element immediately before the cursor (or in the current section),
                // reuse it as the base for the power if it's a simple element (number/symbol).
                if (this.navContext.isInsideElement()) {
                    const sectionArray = this.navContext.getCurrentSectionArray();
                    const pos = this.navContext.currentPosition;
                    if (sectionArray && pos > 0) {
                        const baseEl = sectionArray[pos - 1];
                        // Only reuse if it's a number or symbol
                        if (baseEl.type === 'number' || baseEl.type === 'symbol') {
                            // Remove the previous element and wrap it as the base of a new power
                            sectionArray.splice(pos - 1, 1);
                            const powEl = ElementFactory.createPower();
                            powEl.base.push(baseEl);
                            // Insert the new power where the base was
                            sectionArray.splice(pos - 1, 0, powEl);
                            // Enter the power exponent for editing
                            this.navContext.enter(powEl, 'exponent');
                            this.renderCallback();
                            break;
                        }
                    }
                } else {
                    // Not inside a complex element: check expression main array
                    if (this.expression.cursorPosition > 0) {
                        const prevIndex = this.expression.cursorPosition - 1;
                        const baseEl = this.expression.elements[prevIndex];
                        // Only reuse if it's a number or symbol
                        if (baseEl.type === 'number' || baseEl.type === 'symbol') {
                            // Remove previous element and use it as base
                            this.expression.removeElement(prevIndex);
                            const powEl = ElementFactory.createPower();
                            powEl.base.push(baseEl);
                            // Insert power at the cursor (which was adjusted by removeElement)
                            this.insertElement(powEl);
                            // Enter exponent for editing
                            this.navContext.enter(powEl, 'exponent');
                            this.renderCallback();
                            break;
                        }
                    }
                }

                // Fallback: no previous element or not a simple type — create an empty power as before
                element = ElementFactory.createPower();
                this.insertElement(element);
                
                // Get the position where we just inserted
                if (this.navContext.isInsideElement()) {
                    const sectionArray = this.navContext.getCurrentSectionArray();
                    const insertedPos = this.navContext.currentPosition - 1;
                    if (sectionArray && sectionArray[insertedPos] === element) {
                        this.navContext.enter(element, 'base');
                    }
                } else {
                    const insertedPos = this.expression.cursorPosition - 1;
                    if (this.expression.elements[insertedPos] === element) {
                        this.navContext.enter(element, 'base');
                    }
                }
                this.renderCallback();
                break;
            
            case 'subscript':
                // If there is an element immediately before the cursor (or in the current section),
                // reuse it as the base for the subscript if it's a simple element (number/symbol).
                if (this.navContext.isInsideElement()) {
                    const sectionArray = this.navContext.getCurrentSectionArray();
                    const pos = this.navContext.currentPosition;
                    if (sectionArray && pos > 0) {
                        const baseEl = sectionArray[pos - 1];
                        // Only reuse if it's a number or symbol
                        if (baseEl.type === 'number' || baseEl.type === 'symbol') {
                            // Remove the previous element and wrap it as the base of a new subscript
                            sectionArray.splice(pos - 1, 1);
                            const subEl = ElementFactory.createSubscript();
                            subEl.base.push(baseEl);
                            // Insert the new subscript where the base was
                            sectionArray.splice(pos - 1, 0, subEl);
                            // Enter the subscript index for editing
                            this.navContext.enter(subEl, 'index');
                            this.renderCallback();
                            break;
                        }
                    }
                } else {
                    // Not inside a complex element: check expression main array
                    if (this.expression.cursorPosition > 0) {
                        const prevIndex = this.expression.cursorPosition - 1;
                        const baseEl = this.expression.elements[prevIndex];
                        // Only reuse if it's a number or symbol
                        if (baseEl.type === 'number' || baseEl.type === 'symbol') {
                            // Remove previous element and use it as base
                            this.expression.removeElement(prevIndex);
                            const subEl = ElementFactory.createSubscript();
                            subEl.base.push(baseEl);
                            // Insert subscript at the cursor (which was adjusted by removeElement)
                            this.insertElement(subEl);
                            // Enter index for editing
                            this.navContext.enter(subEl, 'index');
                            this.renderCallback();
                            break;
                        }
                    }
                }

                // Fallback: no previous element or not a simple type — create an empty subscript as before
                element = ElementFactory.createSubscript();
                this.insertElement(element);
                
                // Get the position where we just inserted
                if (this.navContext.isInsideElement()) {
                    const sectionArray = this.navContext.getCurrentSectionArray();
                    const insertedPos = this.navContext.currentPosition - 1;
                    if (sectionArray && sectionArray[insertedPos] === element) {
                        this.navContext.enter(element, 'base');
                    }
                } else {
                    const insertedPos = this.expression.cursorPosition - 1;
                    if (this.expression.elements[insertedPos] === element) {
                        this.navContext.enter(element, 'base');
                    }
                }
                this.renderCallback();
                break;
            
            case 'sqrt':
                element = ElementFactory.createSqrt();
                this.insertElement(element);
                
                // Get the position where we just inserted
                if (this.navContext.isInsideElement()) {
                    const sectionArray = this.navContext.getCurrentSectionArray();
                    const insertedPos = this.navContext.currentPosition - 1;
                    if (sectionArray && sectionArray[insertedPos] === element) {
                        this.navContext.enter(element, 'content');
                    }
                } else {
                    const insertedPos = this.expression.cursorPosition - 1;
                    if (this.expression.elements[insertedPos] === element) {
                        this.navContext.enter(element, 'content');
                    }
                }
                this.renderCallback();
                break;
            
            case 'sin':
            case 'cos':
            case 'tan':
            case 'log':
            case 'ln':
                element = ElementFactory.createFunction(funcName);
                this.insertElement(element);
                break;
            
            case 'integral':
                this.insertElement(ElementFactory.createSymbol('∫'));
                break;
            
            case 'sum':
                this.insertElement(ElementFactory.createSymbol('Σ'));
                break;
            
            case 'product':
                this.insertElement(ElementFactory.createSymbol('Π'));
                break;
            
            case 'limit':
                element = ElementFactory.createFunction('lim');
                this.insertElement(element);
                break;
            
            case 'derivative':
                this.insertElement(ElementFactory.createSymbol('d'));
                this.insertElement(ElementFactory.createOperator('/'));
                this.insertElement(ElementFactory.createSymbol('dx'));
                break;
            
            case 'abs':
                this.insertElement(ElementFactory.createSymbol('|'));
                break;
            
            default:
                console.warn('Unknown function:', funcName);
        }
    }

    // Insert element at current position
    insertElement(element) {
        if (this.navContext.isInsideElement()) {
            // Insert into current section of complex element
            const sectionArray = this.navContext.getCurrentSectionArray();
            if (sectionArray) {
                sectionArray.splice(this.navContext.currentPosition, 0, element);
                this.navContext.currentPosition++;
            }
        } else {
            // Insert into main expression
            this.expression.addElement(element);
        }
        // Render after simple insertions
        if (!this.isComplexElement(element)) {
            this.renderCallback();
        }
    }

    // Handle backspace
    handleBackspace() {
        if (this.navContext.isInsideElement()) {
            const sectionArray = this.navContext.getCurrentSectionArray();
            if (sectionArray && this.navContext.currentPosition > 0) {
                sectionArray.splice(this.navContext.currentPosition - 1, 1);
                this.navContext.currentPosition--;
            } else if (this.navContext.currentPosition === 0) {
                // Try to move to previous section
                if (!this.navContext.previousSection()) {
                    // Exit the complex element
                    this.navContext.exit();
                }
            }
        } else {
            this.expression.backspace();
        }
        this.renderCallback();
    }

    // Arrow key handlers
    handleArrowLeft() {
        if (this.navContext.isInsideElement()) {
            const sectionArray = this.navContext.getCurrentSectionArray();
            
            if (this.navContext.currentPosition > 0) {
                // Check if we're at a complex element within the section
                const prevElement = sectionArray[this.navContext.currentPosition - 1];
                if (this.isComplexElement(prevElement)) {
                    this.navContext.currentPosition--;
                    this.enterElementAtEnd(prevElement);
                } else {
                    this.navContext.currentPosition--;
                }
            } else {
                // At the start of current section, try moving to previous section
                if (!this.navContext.previousSection()) {
                    // Exit element and move cursor left
                    this.navContext.exit();
                    if (!this.navContext.isInsideElement()) {
                        this.expression.moveCursor('left');
                    }
                } else {
                    // Moved to previous section, go to its end
                    const prevSectionArray = this.navContext.getCurrentSectionArray();
                    if (prevSectionArray) {
                        this.navContext.currentPosition = prevSectionArray.length;
                    }
                }
            }
        } else {
            // Check if cursor is on a complex element
            const pos = this.expression.cursorPosition;
            if (pos > 0) {
                const prevElement = this.expression.elements[pos - 1];
                if (this.isComplexElement(prevElement)) {
                    // Enter the element at its last section
                    this.expression.cursorPosition--;
                    this.enterElementAtEnd(prevElement);
                } else {
                    this.expression.moveCursor('left');
                }
            }
        }
        this.renderCallback();
    }

    handleArrowRight() {
        if (this.navContext.isInsideElement()) {
            const sectionArray = this.navContext.getCurrentSectionArray();
            
            if (sectionArray && this.navContext.currentPosition < sectionArray.length) {
                // Check if we're before a complex element within the section
                const nextElement = sectionArray[this.navContext.currentPosition];
                if (this.isComplexElement(nextElement)) {
                    this.navContext.currentPosition++;
                    this.enterElementAtStart(nextElement);
                } else {
                    this.navContext.currentPosition++;
                }
            } else {
                // At the end of current section, try moving to next section
                if (!this.navContext.nextSection()) {
                    // Exit element and move cursor right
                    this.navContext.exit();
                    if (!this.navContext.isInsideElement()) {
                        this.expression.moveCursor('right');
                    }
                } else {
                    // Moved to next section, go to its start
                    this.navContext.currentPosition = 0;
                }
            }
        } else {
            // Check if cursor is before a complex element
            const pos = this.expression.cursorPosition;
            if (pos < this.expression.elements.length) {
                const nextElement = this.expression.elements[pos];
                if (this.isComplexElement(nextElement)) {
                    // Enter the element at its first section
                    this.expression.cursorPosition++;
                    this.enterElementAtStart(nextElement);
                } else {
                    this.expression.moveCursor('right');
                }
            }
        }
        this.renderCallback();
    }

    handleArrowUp() {
        // Move to previous section (up in fraction, etc.)
        if (this.navContext.isInsideElement()) {
            this.navContext.previousSection();
            this.renderCallback();
        }
    }

    handleArrowDown() {
        // Move to next section (down in fraction, etc.)
        if (this.navContext.isInsideElement()) {
            this.navContext.nextSection();
            this.renderCallback();
        }
    }

    // Check if element is complex (has sub-sections)
    isComplexElement(element) {
        return element && (
            element.type === 'fraction' ||
            element.type === 'power' ||
            element.type === 'subscript' ||
            element.type === 'sqrt' ||
            element.type === 'parens'
        );
    }

    // Enter complex element at first section
    enterElementAtStart(element) {
        const firstSection = this.navContext.getFirstSection(element);
        this.navContext.enter(element, firstSection);
        this.navContext.currentPosition = 0;
        this.renderCallback();
    }

    // Enter complex element at last section
    enterElementAtEnd(element) {
        const sections = this.navContext.getSections(element);
        const lastSection = sections[sections.length - 1];
        this.navContext.enter(element, lastSection);
        
        // Set position to end of section
        const sectionArray = this.navContext.getCurrentSectionArray();
        if (sectionArray) {
            this.navContext.currentPosition = sectionArray.length;
        }
        this.renderCallback();
    }
}

/**
 * MathEditorControl - A reusable math expression editor component
 * 
 * Usage:
 * const editor = new MathEditorControl(containerElement, options);
 * editor.init();
 * 
 * Options:
 * - showKeyboard: boolean (default: true) - Show virtual keyboard
 * - showEvaluation: boolean (default: true) - Show evaluation button and result
 * - language: string (default: 'en') - Language code ('en' or 'hy')
 * - onChange: function(latex, elements) - Callback when expression changes
 * - onEvaluate: function(result) - Callback when expression is evaluated
 * - theme: string (default: 'default') - Theme name
 */
class MathEditorControl {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
        
        this.options = {
            showKeyboard: true,
            showEvaluation: true,
            language: 'en',
            onChange: null,
            onEvaluate: null,
            theme: 'default',
            compact: false,
            ...options
        };
        
        this.expression = new MathExpression();
        this.navContext = new NavigationContext();
        this.keyboardController = null;
        this.displayElement = null;
        this.navRenderer = null;
        this.instanceId = 'math-editor-' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Initialize the editor control
     */
    init() {
        if (!this.container) {
            console.error('MathEditorControl: Container element not found');
            return this;
        }

        // Create the control structure
        this.render();
        
        // Initialize keyboard controller
        this.keyboardController = new KeyboardController(
            this.expression,
            this.navContext,
            () => this.onExpressionChange()
        );
        this.keyboardController.init();
        
        // Initialize navigation renderer
        this.navRenderer = new NavigationRenderer(this.displayElement);
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Initial render
        this.renderExpression();
        
        return this;
    }

    /**
     * Render the control HTML structure
     */
    render() {
        const compactClass = this.options.compact ? 'math-editor-compact' : '';
        
        this.container.innerHTML = `
            <div class="math-editor-control ${compactClass}" id="${this.instanceId}" data-theme="${this.options.theme}">
                <div class="math-editor-whiteboard">
                    <div class="math-editor-display expression-display" id="${this.instanceId}-display">
                        <span class="cursor active" data-position="0"></span>
                    </div>
                    ${this.options.showEvaluation ? `
                    <div class="math-editor-evaluation" id="${this.instanceId}-result" style="display: none;">
                        <span class="result-label">${this.t('result')}</span>
                        <span class="result-value" id="${this.instanceId}-result-value"></span>
                    </div>
                    ` : ''}
                </div>
                
                ${this.options.showKeyboard ? this.renderKeyboard() : ''}
                
                <div class="math-editor-toolbar">
                    <button class="math-editor-btn" data-action="clear">${this.t('clear')}</button>
                    <button class="math-editor-btn" data-action="undo">${this.t('undo')}</button>
                    <button class="math-editor-btn" data-action="export-latex">${this.t('exportLatex')}</button>
                    ${this.options.showEvaluation ? `
                    <button class="math-editor-btn math-editor-btn-primary" data-action="evaluate">${this.t('evaluate')}</button>
                    ` : ''}
                </div>
            </div>
        `;
        
        this.displayElement = document.getElementById(`${this.instanceId}-display`);
    }

    /**
     * Render virtual keyboard
     */
    renderKeyboard() {
        return `
            <div class="math-editor-keyboard">
                <div class="math-editor-keyboard-section">
                    <div class="math-editor-keyboard-row">
                        <button class="key-btn number" data-value="7">7</button>
                        <button class="key-btn number" data-value="8">8</button>
                        <button class="key-btn number" data-value="9">9</button>
                        <button class="key-btn operator" data-value="/">÷</button>
                        <button class="key-btn function" data-value="sqrt">√</button>
                    </div>
                    <div class="math-editor-keyboard-row">
                        <button class="key-btn number" data-value="4">4</button>
                        <button class="key-btn number" data-value="5">5</button>
                        <button class="key-btn number" data-value="6">6</button>
                        <button class="key-btn operator" data-value="*">×</button>
                        <button class="key-btn function" data-value="power">x^y</button>
                    </div>
                    <div class="math-editor-keyboard-row">
                        <button class="key-btn number" data-value="1">1</button>
                        <button class="key-btn number" data-value="2">2</button>
                        <button class="key-btn number" data-value="3">3</button>
                        <button class="key-btn operator" data-value="-">−</button>
                        <button class="key-btn function" data-value="fraction">a/b</button>
                    </div>
                    <div class="math-editor-keyboard-row">
                        <button class="key-btn number" data-value="0">0</button>
                        <button class="key-btn number" data-value=".">.</button>
                        <button class="key-btn operator" data-value="=">=</button>
                        <button class="key-btn operator" data-value="+">+</button>
                        <button class="key-btn function" data-value="subscript">x_i</button>
                    </div>
                </div>
                
                <div class="math-editor-keyboard-section">
                    <div class="math-editor-keyboard-row">
                        <button class="key-btn trig" data-value="sin">sin</button>
                        <button class="key-btn trig" data-value="cos">cos</button>
                        <button class="key-btn trig" data-value="tan">tan</button>
                        <button class="key-btn function" data-value="log">log</button>
                        <button class="key-btn function" data-value="ln">ln</button>
                    </div>
                    <div class="math-editor-keyboard-row">
                        <button class="key-btn symbol" data-value="pi">π</button>
                        <button class="key-btn symbol" data-value="(">(</button>
                        <button class="key-btn symbol" data-value=")">)</button>
                        <button class="key-btn symbol" data-value="x">x</button>
                        <button class="key-btn symbol" data-value="y">y</button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Initialize event listeners
     */
    initEventListeners() {
        const controlEl = document.getElementById(this.instanceId);
        
        // Toolbar buttons
        controlEl.querySelectorAll('.math-editor-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleAction(action);
            });
        });
        
        // Mouse click handling
        this.displayElement.addEventListener('click', (e) => {
            this.handleDisplayClick(e);
        });
    }

    /**
     * Handle toolbar actions
     */
    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'undo':
                this.undo();
                break;
            case 'export-latex':
                this.exportLatex();
                break;
            case 'evaluate':
                this.evaluate();
                break;
        }
    }

    /**
     * Clear the expression
     */
    clear() {
        this.expression.clear();
        this.navContext.clear();
        this.renderExpression();
        this.hideEvaluation();
    }

    /**
     * Undo last action
     */
    undo() {
        if (this.expression.undo()) {
            this.navContext.clear();
            this.renderExpression();
        }
    }

    /**
     * Get LaTeX representation
     */
    getLatex() {
        return this.expression.toLatex();
    }

    /**
     * Export LaTeX to clipboard
     */
    exportLatex() {
        const latex = this.getLatex();
        const message = latex || this.t('msgExprEmpty');
        
        navigator.clipboard.writeText(message).then(() => {
            alert(this.t('msgLatexCopied') + message);
        }).catch(() => {
            alert(this.t('lblLatex') + ':\n\n' + message);
        });
    }

    /**
     * Evaluate the expression
     */
    evaluate() {
        const resultContainer = document.getElementById(`${this.instanceId}-result`);
        const resultValue = document.getElementById(`${this.instanceId}-result-value`);
        
        if (!resultContainer || !resultValue) return null;
        
        try {
            let mathString = this.expression.toMathString();
            
            if (!mathString || mathString.trim() === '') {
                resultContainer.style.display = 'none';
                return null;
            }

            // Remove trailing equals sign if present
            mathString = mathString.trim();
            if (mathString.endsWith('=')) {
                mathString = mathString.slice(0, -1);
            }
            
            // Use pure JS to evaluate
            const result = new Function('return ' + mathString)();
            
            // Format result
            let formattedResult = result;
            if (typeof result === 'number') {
                formattedResult = parseFloat(result.toPrecision(14));
                if (Math.abs(formattedResult - Math.round(formattedResult)) < 1e-10) {
                    formattedResult = Math.round(formattedResult);
                }
            }
            
            resultValue.textContent = formattedResult;
            resultContainer.classList.remove('error');
            resultContainer.style.display = 'flex';
            
            if (this.options.onEvaluate) {
                this.options.onEvaluate(formattedResult);
            }
            
            return formattedResult;
            
        } catch (error) {
            resultValue.textContent = error.message;
            resultContainer.classList.add('error');
            resultContainer.style.display = 'flex';
            return null;
        }
    }

    /**
     * Hide evaluation result
     */
    hideEvaluation() {
        const resultContainer = document.getElementById(`${this.instanceId}-result`);
        if (resultContainer) {
            resultContainer.style.display = 'none';
        }
    }

    /**
     * Set expression from LaTeX
     */
    setLatex(latex) {
        this.expression.clear();
        this.navContext.clear();
        this.parseLatex(latex);
        this.renderExpression();
    }

    /**
     * Get expression elements (internal representation)
     */
    getElements() {
        return JSON.parse(JSON.stringify(this.expression.elements));
    }

    /**
     * Get math string for evaluation
     */
    getMathString() {
        return this.expression.toMathString();
    }

    /**
     * Called when expression changes
     */
    onExpressionChange() {
        this.renderExpression();
        
        if (this.options.onChange) {
            this.options.onChange(this.getLatex(), this.getElements());
        }
    }

    /**
     * Handle clicks on the expression display
     */
    handleDisplayClick(event) {
        const target = event.target;
        
        if (target.classList.contains('cursor')) {
            const position = parseInt(target.dataset.position);
            if (!isNaN(position)) {
                this.navContext.clear();
                this.expression.cursorPosition = position;
                this.renderExpression();
            }
            return;
        }

        // Check for section clicks
        let sectionElement = target;
        while (sectionElement && sectionElement !== this.displayElement) {
            const section = sectionElement.dataset.section;
            if (section) {
                const complexElement = this.findComplexElementForSection(sectionElement);
                if (complexElement) {
                    this.navContext.clear();
                    this.navContext.enter(complexElement.element, section);
                    this.renderExpression();
                    return;
                }
            }
            sectionElement = sectionElement.parentElement;
        }
    }

    /**
     * Find complex element for a section
     */
    findComplexElementForSection(sectionElement) {
        for (let i = 0; i < this.expression.elements.length; i++) {
            const element = this.expression.elements[i];
            if (this.isComplexElementType(element)) {
                const elementNode = this.displayElement.querySelector(`[data-element-index="${i}"]`);
                if (elementNode && elementNode.contains(sectionElement)) {
                    return { element, index: i };
                }
            }
        }
        return null;
    }

    /**
     * Check if element is complex
     */
    isComplexElementType(element) {
        return element && (
            element.type === 'fraction' ||
            element.type === 'power' ||
            element.type === 'subscript' ||
            element.type === 'sqrt' ||
            element.type === 'parens'
        );
    }

    /**
     * Render the expression
     */
    renderExpression() {
        if (!this.displayElement) return;

        this.displayElement.innerHTML = '';

        if (this.navContext.isInsideElement()) {
            this.renderWithContext();
        } else {
            this.renderMainExpression();
        }
    }

    /**
     * Render main expression
     */
    renderMainExpression() {
        const fragment = document.createDocumentFragment();

        if (this.expression.cursorPosition === 0) {
            fragment.appendChild(this.createCursor(true, 0));
        } else {
            fragment.appendChild(this.createCursor(false, 0));
        }

        this.expression.elements.forEach((element, index) => {
            const elementNode = this.renderElement(element);
            fragment.appendChild(elementNode);

            const position = index + 1;
            if (this.expression.cursorPosition === position) {
                fragment.appendChild(this.createCursor(true, position));
            } else {
                fragment.appendChild(this.createCursor(false, position));
            }
        });

        this.displayElement.appendChild(fragment);
    }

    /**
     * Render with navigation context
     */
    renderWithContext() {
        const fragment = document.createDocumentFragment();

        if (this.expression.cursorPosition === 0) {
            fragment.appendChild(this.createCursor(true, 0));
        } else {
            fragment.appendChild(this.createCursor(false, 0));
        }

        this.expression.elements.forEach((element, index) => {
            const isActive = this.navContext.currentElement === element;
            const elementNode = this.renderElement(element, isActive);
            fragment.appendChild(elementNode);

            const position = index + 1;
            const cursorActive = !this.navContext.isInsideElement() && 
                                 this.expression.cursorPosition === position;
            fragment.appendChild(this.createCursor(cursorActive, position));
        });

        this.displayElement.appendChild(fragment);
    }

    /**
     * Render a single element
     */
    renderElement(element, isActive = false) {
        const container = document.createElement('span');
        container.classList.add('expr-element');
        
        if (isActive) {
            container.classList.add('focused');
        }

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

    /**
     * Render fraction
     */
    renderFraction(container, element) {
        container.classList.add('expr-fraction');
        const isCurrentElement = this.navContext.currentElement === element;

        const numerator = document.createElement('div');
        numerator.classList.add('fraction-numerator');
        numerator.setAttribute('data-section', 'numerator');
        
        const isNumeratorActive = this.navContext.currentSection === 'numerator' && isCurrentElement;
        if (isNumeratorActive) numerator.classList.add('active');
        if (!element.numerator || element.numerator.length === 0) numerator.classList.add('empty');

        this.renderSection(numerator, element.numerator, isNumeratorActive);
        container.appendChild(numerator);

        const denominator = document.createElement('div');
        denominator.classList.add('fraction-denominator');
        denominator.setAttribute('data-section', 'denominator');
        
        const isDenominatorActive = this.navContext.currentSection === 'denominator' && isCurrentElement;
        if (isDenominatorActive) denominator.classList.add('active');
        if (!element.denominator || element.denominator.length === 0) denominator.classList.add('empty');

        this.renderSection(denominator, element.denominator, isDenominatorActive);
        container.appendChild(denominator);
    }

    /**
     * Render power
     */
    renderPower(container, element) {
        container.classList.add('expr-power');
        const isCurrentElement = this.navContext.currentElement === element;

        const base = document.createElement('span');
        base.classList.add('power-base');
        base.setAttribute('data-section', 'base');
        
        const isBaseActive = this.navContext.currentSection === 'base' && isCurrentElement;
        if (isBaseActive) base.classList.add('active');
        if (!element.base || element.base.length === 0) base.classList.add('empty');

        this.renderSection(base, element.base, isBaseActive);
        container.appendChild(base);

        const exponent = document.createElement('span');
        exponent.classList.add('power-exponent');
        exponent.setAttribute('data-section', 'exponent');
        
        const isExponentActive = this.navContext.currentSection === 'exponent' && isCurrentElement;
        if (isExponentActive) exponent.classList.add('active');
        if (!element.exponent || element.exponent.length === 0) exponent.classList.add('empty');

        this.renderSection(exponent, element.exponent, isExponentActive);
        container.appendChild(exponent);
    }

    /**
     * Render subscript
     */
    renderSubscript(container, element) {
        container.classList.add('expr-subscript');
        const isCurrentElement = this.navContext.currentElement === element;

        const base = document.createElement('span');
        base.classList.add('subscript-base');
        base.setAttribute('data-section', 'base');
        
        const isBaseActive = this.navContext.currentSection === 'base' && isCurrentElement;
        if (isBaseActive) base.classList.add('active');
        if (!element.base || element.base.length === 0) base.classList.add('empty');

        this.renderSection(base, element.base, isBaseActive);
        container.appendChild(base);

        const index = document.createElement('span');
        index.classList.add('subscript-index');
        index.setAttribute('data-section', 'index');
        
        const isIndexActive = this.navContext.currentSection === 'index' && isCurrentElement;
        if (isIndexActive) index.classList.add('active');
        if (!element.index || element.index.length === 0) index.classList.add('empty');

        this.renderSection(index, element.index, isIndexActive);
        container.appendChild(index);
    }

    /**
     * Render square root
     */
    renderSqrt(container, element) {
        container.classList.add('expr-sqrt');

        const radicalWrapper = document.createElement('span');
        radicalWrapper.classList.add('sqrt-radical-wrapper');
        
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.classList.add('sqrt-symbol');
        svg.setAttribute('viewBox', '0 0 30 50');
        svg.setAttribute('preserveAspectRatio', 'none');
        
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute('d', 'M 0 32 L 10 50 L 22 1 L 33 1');
        path.setAttribute('stroke', '#333');
        path.setAttribute('stroke-width', '3');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'butt');
        path.setAttribute('stroke-linejoin', 'miter');
        
        svg.appendChild(path);
        radicalWrapper.appendChild(svg);
        container.appendChild(radicalWrapper);

        const isCurrentElement = this.navContext.currentElement === element;

        const content = document.createElement('span');
        content.classList.add('sqrt-content');
        content.setAttribute('data-section', 'content');
        
        const isContentActive = this.navContext.currentSection === 'content' && isCurrentElement;
        if (isContentActive) content.classList.add('active');
        if (!element.content || element.content.length === 0) content.classList.add('empty');

        this.renderSection(content, element.content, isContentActive);
        container.appendChild(content);
    }

    /**
     * Render parentheses
     */
    renderParens(container, element) {
        container.classList.add('expr-parens');

        const open = document.createElement('span');
        open.textContent = '(';
        container.appendChild(open);

        const isCurrentElement = this.navContext.currentElement === element;

        const content = document.createElement('span');
        content.classList.add('parens-content');
        content.setAttribute('data-section', 'content');
        
        const isContentActive = this.navContext.currentSection === 'content' && isCurrentElement;
        if (isContentActive) content.classList.add('active');
        if (!element.content || element.content.length === 0) content.classList.add('empty');

        this.renderSection(content, element.content, isContentActive);
        container.appendChild(content);

        const close = document.createElement('span');
        close.textContent = ')';
        container.appendChild(close);
    }

    /**
     * Render a section
     */
    renderSection(container, elements, isActiveSection = false) {
        if (!elements || elements.length === 0) {
            const cursor = this.createCursor(
                isActiveSection && this.navContext.currentPosition === 0,
                0
            );
            container.appendChild(cursor);
            return;
        }

        if (isActiveSection && this.navContext.currentPosition === 0) {
            container.appendChild(this.createCursor(true, 0));
        } else {
            container.appendChild(this.createCursor(false, 0));
        }

        elements.forEach((element, index) => {
            const elementNode = this.renderElement(element);
            container.appendChild(elementNode);

            const position = index + 1;
            const cursorActive = isActiveSection && 
                                 this.navContext.currentPosition === position;
            container.appendChild(this.createCursor(cursorActive, position));
        });
    }

    /**
     * Create cursor element
     */
    createCursor(isActive, position = 0) {
        const cursor = document.createElement('span');
        cursor.classList.add('cursor');
        cursor.dataset.position = position;
        if (isActive) {
            cursor.classList.add('active');
        }
        return cursor;
    }

    /**
     * Parse LaTeX into expression elements
     */
    parseLatex(latex) {
        // Remove outer $ signs if present
        latex = latex.trim().replace(/^\$+|\$+$/g, '');
        
        let pos = 0;
        
        const parseToken = () => {
            if (pos >= latex.length) return null;
            
            while (pos < latex.length && latex[pos] === ' ') pos++;
            
            if (pos >= latex.length) return null;
            
            const char = latex[pos];
            
            if (char === '{') {
                pos++;
                let depth = 1;
                while (pos < latex.length && depth > 0) {
                    if (latex[pos] === '{') depth++;
                    if (latex[pos] === '}') {
                        depth--;
                        if (depth === 0) break;
                    }
                    parseToken();
                }
                pos++;
                return 'group';
            }
            
            if (char >= '0' && char <= '9') {
                pos++;
                this.keyboardController.insertElement(ElementFactory.createNumber(char));
                this.renderExpression();
                return 'number';
            }
            
            if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
                if (latex[pos] === '\\') {
                    return parseCommand();
                }
                pos++;
                this.keyboardController.insertElement(ElementFactory.createSymbol(char));
                this.renderExpression();
                return 'variable';
            }
            
            if (char === '+' || char === '-' || char === '*' || char === '=') {
                pos++;
                this.keyboardController.insertElement(ElementFactory.createOperator(char));
                this.renderExpression();
                return 'operator';
            }
            
            if (latex.substr(pos, 5) === '\\frac') {
                pos += 5;
                return parseFraction.call(this);
            }
            
            if (char === '^') {
                pos++;
                return parsePower.call(this);
            }
            
            if (char === '_') {
                pos++;
                return parseSubscript.call(this);
            }
            
            if (latex.substr(pos, 5) === '\\sqrt') {
                pos += 5;
                return parseSqrt.call(this);
            }
            
            pos++;
            return parseToken();
        };
        
        const parseFraction = function() {
            if (latex[pos] !== '{') return null;
            pos++;
            
            this.keyboardController.handleFunction('fraction');
            
            let depth = 1;
            while (pos < latex.length && depth > 0) {
                if (latex[pos] === '{') depth++;
                if (latex[pos] === '}') {
                    depth--;
                    if (depth === 0) break;
                }
                parseToken();
            }
            pos++;
            
            if (latex[pos] !== '{') return null;
            pos++;
            
            this.keyboardController.handleArrowDown();
            
            depth = 1;
            while (pos < latex.length && depth > 0) {
                if (latex[pos] === '{') depth++;
                if (latex[pos] === '}') {
                    depth--;
                    if (depth === 0) break;
                }
                parseToken();
            }
            pos++;
            
            this.navContext.exit();
            this.renderExpression();
            return 'fraction';
        };
        
        const parsePower = function() {
            if (this.navContext.isInsideElement()) {
                while (this.navContext.isInsideElement()) {
                    this.navContext.exit();
                }
                this.renderExpression();
            }
            
            this.keyboardController.handleFunction('power');
            
            if (latex[pos] === '{') {
                pos++;
                let depth = 1;
                while (pos < latex.length && depth > 0) {
                    if (latex[pos] === '{') depth++;
                    if (latex[pos] === '}') {
                        depth--;
                        if (depth === 0) break;
                    }
                    parseToken();
                }
                pos++;
            } else {
                parseToken();
            }
            
            this.navContext.exit();
            this.renderExpression();
            return 'power';
        };
        
        const parseSubscript = function() {
            if (this.navContext.isInsideElement()) {
                while (this.navContext.isInsideElement()) {
                    this.navContext.exit();
                }
                this.renderExpression();
            }
            
            this.keyboardController.handleFunction('subscript');
            
            if (latex[pos] === '{') {
                pos++;
                let depth = 1;
                while (pos < latex.length && depth > 0) {
                    if (latex[pos] === '{') depth++;
                    if (latex[pos] === '}') {
                        depth--;
                        if (depth === 0) break;
                    }
                    parseToken();
                }
                pos++;
            } else {
                parseToken();
            }
            
            this.navContext.exit();
            this.renderExpression();
            return 'subscript';
        };
        
        const parseSqrt = function() {
            if (latex[pos] !== '{') return null;
            pos++;
            
            this.keyboardController.handleFunction('sqrt');
            
            let depth = 1;
            while (pos < latex.length && depth > 0) {
                if (latex[pos] === '{') depth++;
                if (latex[pos] === '}') {
                    depth--;
                    if (depth === 0) break;
                }
                parseToken();
            }
            pos++;
            
            this.navContext.exit();
            this.renderExpression();
            return 'sqrt';
        };
        
        while (pos < latex.length) {
            parseToken();
        }
    }

    /**
     * Translation helper
     */
    t(key) {
        if (typeof translations !== 'undefined' && 
            translations[this.options.language] && 
            translations[this.options.language][key]) {
            return translations[this.options.language][key];
        }
        // Fallback translations for standalone use
        const fallback = {
            'clear': 'Clear',
            'undo': 'Undo',
            'exportLatex': 'Export LaTeX',
            'evaluate': 'Evaluate',
            'result': 'Result: ',
            'msgExprEmpty': 'Expression is empty',
            'msgLatexCopied': 'LaTeX copied to clipboard:\n\n',
            'lblLatex': 'LaTeX'
        };
        return fallback[key] || key;
    }

    /**
     * Set language
     */
    setLanguage(lang) {
        this.options.language = lang;
        this.render();
        this.initEventListeners();
        this.renderExpression();
    }

    /**
     * Enable/disable the editor
     */
    setEnabled(enabled) {
        if (this.keyboardController) {
            this.keyboardController.setEnabled(enabled);
        }
        
        const controlEl = document.getElementById(this.instanceId);
        if (controlEl) {
            if (enabled) {
                controlEl.classList.remove('disabled');
            } else {
                controlEl.classList.add('disabled');
            }
        }
    }

    /**
     * Destroy the control
     */
    destroy() {
        this.container.innerHTML = '';
        this.expression = null;
        this.navContext = null;
        this.keyboardController = null;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MathEditorControl };
}

/**
 * LatexRenderer - Renders LaTeX expressions using MathJax or KaTeX
 * 
 * Usage:
 * const renderer = new LatexRenderer(containerElement, options);
 * renderer.render('\\frac{1}{2} + \\sqrt{x}');
 * 
 * Options:
 * - engine: 'mathjax' | 'katex' | 'auto' (default: 'auto')
 * - displayMode: boolean (default: true) - Display mode (centered) vs inline
 * - fontSize: string (default: '1.5em')
 * - throwOnError: boolean (default: false)
 * - macros: object - Custom LaTeX macros
 */
class LatexRenderer {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
        
        this.options = {
            engine: 'auto',
            displayMode: true,
            fontSize: '1.5em',
            throwOnError: false,
            macros: {},
            ...options
        };
        
        this.engine = null;
        this.instanceId = 'latex-renderer-' + Math.random().toString(36).substr(2, 9);
        this.currentLatex = '';
    }

    /**
     * Initialize the renderer
     */
    async init() {
        if (!this.container) {
            console.error('LatexRenderer: Container element not found');
            return this;
        }

        // Create the renderer structure
        this.container.innerHTML = `
            <div class="latex-renderer" id="${this.instanceId}">
                <div class="latex-renderer-content"></div>
                <div class="latex-renderer-error" style="display: none;"></div>
            </div>
        `;

        // Detect available engine
        this.engine = this.detectEngine();
        
        // Load engine if needed
        if (this.engine === 'none') {
            await this.loadDefaultEngine();
        }

        return this;
    }

    /**
     * Detect which rendering engine is available
     */
    detectEngine() {
        if (this.options.engine !== 'auto') {
            if (this.options.engine === 'katex' && typeof katex !== 'undefined') {
                return 'katex';
            }
            if (this.options.engine === 'mathjax' && typeof MathJax !== 'undefined') {
                return 'mathjax';
            }
        }

        // Auto-detect
        if (typeof katex !== 'undefined') {
            return 'katex';
        }
        if (typeof MathJax !== 'undefined') {
            return 'mathjax';
        }
        
        return 'none';
    }

    /**
     * Load default rendering engine (KaTeX by default as it's lighter)
     */
    async loadDefaultEngine() {
        try {
            // Try to load KaTeX from CDN
            await this.loadKaTeX();
            this.engine = 'katex';
        } catch (error) {
            console.warn('Failed to load KaTeX, trying MathJax...', error);
            try {
                await this.loadMathJax();
                this.engine = 'mathjax';
            } catch (error2) {
                console.error('Failed to load any LaTeX rendering engine', error2);
                this.engine = 'fallback';
            }
        }
    }

    /**
     * Load KaTeX from CDN
     */
    loadKaTeX() {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (typeof katex !== 'undefined') {
                resolve();
                return;
            }

            // Load CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
            document.head.appendChild(link);

            // Load JS
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Load MathJax from CDN
     */
    loadMathJax() {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (typeof MathJax !== 'undefined') {
                resolve();
                return;
            }

            // Configure MathJax before loading
            window.MathJax = {
                tex: {
                    inlineMath: [['$', '$'], ['\\(', '\\)']],
                    displayMath: [['$$', '$$'], ['\\[', '\\]']]
                },
                svg: {
                    fontCache: 'global'
                },
                startup: {
                    ready: () => {
                        MathJax.startup.defaultReady();
                        resolve();
                    }
                }
            };

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
            script.async = true;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Render LaTeX expression
     */
    render(latex) {
        if (!latex) {
            this.clear();
            return;
        }

        this.currentLatex = latex;
        const contentEl = this.container.querySelector('.latex-renderer-content');
        const errorEl = this.container.querySelector('.latex-renderer-error');

        try {
            if (this.engine === 'katex') {
                this.renderWithKaTeX(latex, contentEl);
            } else if (this.engine === 'mathjax') {
                this.renderWithMathJax(latex, contentEl);
            } else {
                this.renderFallback(latex, contentEl);
            }
            
            errorEl.style.display = 'none';
            contentEl.style.display = 'block';
            contentEl.style.fontSize = this.options.fontSize;
            
        } catch (error) {
            if (this.options.throwOnError) {
                throw error;
            }
            errorEl.textContent = `Error: ${error.message}`;
            errorEl.style.display = 'block';
            contentEl.style.display = 'none';
        }
    }

    /**
     * Render with KaTeX
     */
    renderWithKaTeX(latex, container) {
        katex.render(latex, container, {
            displayMode: this.options.displayMode,
            throwOnError: this.options.throwOnError,
            macros: this.options.macros,
            trust: true
        });
    }

    /**
     * Render with MathJax
     */
    renderWithMathJax(latex, container) {
        // Clear previous content
        container.innerHTML = '';
        
        // Create a wrapper for MathJax
        const wrapper = document.createElement('span');
        wrapper.textContent = this.options.displayMode ? `$$${latex}$$` : `$${latex}$`;
        container.appendChild(wrapper);
        
        // Typeset the content
        if (MathJax.typesetPromise) {
            MathJax.typesetPromise([container]);
        } else if (MathJax.typeset) {
            MathJax.typeset([container]);
        }
    }

    /**
     * Fallback rendering (basic text representation)
     */
    renderFallback(latex, container) {
        // Basic fallback that shows the LaTeX source with some styling
        container.innerHTML = `<pre class="latex-fallback">${this.escapeHtml(latex)}</pre>`;
    }

    /**
     * Clear the rendered content
     */
    clear() {
        this.currentLatex = '';
        const contentEl = this.container.querySelector('.latex-renderer-content');
        const errorEl = this.container.querySelector('.latex-renderer-error');
        
        if (contentEl) contentEl.innerHTML = '';
        if (errorEl) {
            errorEl.style.display = 'none';
            errorEl.textContent = '';
        }
    }

    /**
     * Get current LaTeX
     */
    getLatex() {
        return this.currentLatex;
    }

    /**
     * Set display mode
     */
    setDisplayMode(displayMode) {
        this.options.displayMode = displayMode;
        if (this.currentLatex) {
            this.render(this.currentLatex);
        }
    }

    /**
     * Set font size
     */
    setFontSize(fontSize) {
        this.options.fontSize = fontSize;
        if (this.currentLatex) {
            this.render(this.currentLatex);
        }
    }

    /**
     * Escape HTML special characters
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Destroy the renderer
     */
    destroy() {
        this.container.innerHTML = '';
        this.currentLatex = '';
    }
}

/**
 * LatexViewer - Combined editor and renderer component
 * 
 * Usage:
 * const viewer = new LatexViewer(containerElement, options);
 * viewer.init();
 */
class LatexViewer {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
        
        this.options = {
            showEditor: true,
            showRenderer: true,
            editorOptions: {},
            rendererOptions: {},
            layout: 'horizontal', // 'horizontal' | 'vertical' | 'tabs'
            livePreview: true,
            ...options
        };
        
        this.editor = null;
        this.renderer = null;
        this.instanceId = 'latex-viewer-' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Initialize the viewer
     */
    async init() {
        if (!this.container) {
            console.error('LatexViewer: Container element not found');
            return this;
        }

        // Create structure based on layout
        this.createStructure();
        
        // Initialize editor if shown
        if (this.options.showEditor) {
            const editorContainer = this.container.querySelector('.latex-viewer-editor');
            this.editor = new MathEditorControl(editorContainer, {
                ...this.options.editorOptions,
                onChange: (latex, elements) => this.onEditorChange(latex, elements)
            });
            this.editor.init();
        }
        
        // Initialize renderer if shown
        if (this.options.showRenderer) {
            const rendererContainer = this.container.querySelector('.latex-viewer-preview');
            this.renderer = new LatexRenderer(rendererContainer, this.options.rendererOptions);
            await this.renderer.init();
        }

        // Initialize tabs if using tab layout
        if (this.options.layout === 'tabs') {
            this.initTabs();
        }

        // Initialize LaTeX input if in viewer-only mode
        this.initLatexInput();

        return this;
    }

    /**
     * Create the component structure
     */
    createStructure() {
        let layoutClass = `latex-viewer-${this.options.layout}`;
        
        if (this.options.layout === 'tabs') {
            this.container.innerHTML = `
                <div class="latex-viewer ${layoutClass}" id="${this.instanceId}">
                    <div class="latex-viewer-tabs">
                        <button class="latex-viewer-tab active" data-tab="editor">Editor</button>
                        <button class="latex-viewer-tab" data-tab="preview">Preview</button>
                        <button class="latex-viewer-tab" data-tab="latex">LaTeX Input</button>
                    </div>
                    <div class="latex-viewer-content">
                        <div class="latex-viewer-panel active" data-panel="editor">
                            <div class="latex-viewer-editor"></div>
                        </div>
                        <div class="latex-viewer-panel" data-panel="preview">
                            <div class="latex-viewer-preview-wrapper">
                                <div class="latex-viewer-preview"></div>
                            </div>
                        </div>
                        <div class="latex-viewer-panel" data-panel="latex">
                            <div class="latex-viewer-latex-input">
                                <textarea class="latex-input-textarea" placeholder="Enter LaTeX expression..."></textarea>
                                <button class="latex-input-render-btn">Render LaTeX</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            this.container.innerHTML = `
                <div class="latex-viewer ${layoutClass}" id="${this.instanceId}">
                    ${this.options.showEditor ? `
                    <div class="latex-viewer-section">
                        <h3 class="latex-viewer-section-title">Math Editor</h3>
                        <div class="latex-viewer-editor"></div>
                    </div>
                    ` : ''}
                    ${this.options.showRenderer ? `
                    <div class="latex-viewer-section">
                        <h3 class="latex-viewer-section-title">LaTeX Preview</h3>
                        <div class="latex-viewer-preview-wrapper">
                            <div class="latex-viewer-preview"></div>
                        </div>
                        <div class="latex-viewer-latex-display">
                            <label>LaTeX Code:</label>
                            <code class="latex-code-display"></code>
                        </div>
                    </div>
                    ` : ''}
                    <div class="latex-viewer-section latex-input-section">
                        <h3 class="latex-viewer-section-title">LaTeX Input</h3>
                        <div class="latex-viewer-latex-input">
                            <textarea class="latex-input-textarea" placeholder="Enter LaTeX expression to visualize..."></textarea>
                            <button class="latex-input-render-btn">Render LaTeX</button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Initialize tab navigation
     */
    initTabs() {
        const tabs = this.container.querySelectorAll('.latex-viewer-tab');
        const panels = this.container.querySelectorAll('.latex-viewer-panel');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                panels.forEach(panel => {
                    if (panel.dataset.panel === tabName) {
                        panel.classList.add('active');
                    } else {
                        panel.classList.remove('active');
                    }
                });

                // Update preview when switching to preview tab
                if (tabName === 'preview' && this.editor) {
                    const latex = this.editor.getLatex();
                    if (this.renderer && latex) {
                        this.renderer.render(latex);
                    }
                }
            });
        });
    }

    /**
     * Initialize LaTeX input functionality
     */
    initLatexInput() {
        const textarea = this.container.querySelector('.latex-input-textarea');
        const renderBtn = this.container.querySelector('.latex-input-render-btn');
        
        if (renderBtn && textarea) {
            renderBtn.addEventListener('click', () => {
                const latex = textarea.value.trim();
                if (latex && this.renderer) {
                    this.renderer.render(latex);
                }
                
                // Also update the LaTeX code display if it exists
                const codeDisplay = this.container.querySelector('.latex-code-display');
                if (codeDisplay) {
                    codeDisplay.textContent = latex;
                }
            });
        }
    }

    /**
     * Handle editor changes
     */
    onEditorChange(latex, elements) {
        if (this.options.livePreview && this.renderer) {
            this.renderer.render(latex);
        }
        
        // Update LaTeX code display
        const codeDisplay = this.container.querySelector('.latex-code-display');
        if (codeDisplay) {
            codeDisplay.textContent = latex;
        }

        // Update textarea
        const textarea = this.container.querySelector('.latex-input-textarea');
        if (textarea) {
            textarea.value = latex;
        }
    }

    /**
     * Get the editor instance
     */
    getEditor() {
        return this.editor;
    }

    /**
     * Get the renderer instance
     */
    getRenderer() {
        return this.renderer;
    }

    /**
     * Render LaTeX directly
     */
    renderLatex(latex) {
        if (this.renderer) {
            this.renderer.render(latex);
        }
        
        const codeDisplay = this.container.querySelector('.latex-code-display');
        if (codeDisplay) {
            codeDisplay.textContent = latex;
        }
    }

    /**
     * Set LaTeX in editor
     */
    setLatex(latex) {
        if (this.editor) {
            this.editor.setLatex(latex);
        }
    }

    /**
     * Get current LaTeX
     */
    getLatex() {
        if (this.editor) {
            return this.editor.getLatex();
        }
        if (this.renderer) {
            return this.renderer.getLatex();
        }
        return '';
    }

    /**
     * Destroy the viewer
     */
    destroy() {
        if (this.editor) {
            this.editor.destroy();
        }
        if (this.renderer) {
            this.renderer.destroy();
        }
        this.container.innerHTML = '';
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LatexRenderer, LatexViewer };
}
