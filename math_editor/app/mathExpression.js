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
