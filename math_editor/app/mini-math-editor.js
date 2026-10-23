// Mini Math Editor - Simplified inline math input for the trainer
// Supports fractions, powers, square roots, and basic math symbols

class MiniMathEditor {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' 
            ? document.getElementById(container) 
            : container;
        
        this.options = {
            placeholder: options.placeholder || 'Enter expression...',
            showToolbar: options.showToolbar !== false,
            compact: options.compact || false,
            onEnter: options.onEnter || null,
            onChange: options.onChange || null,
            ...options
        };
        
        this.elements = [];
        this.cursorPosition = 0;
        this.activeContext = null; // For nested elements like fractions
        this.contextStack = [];
        this.focused = false;
        
        this.init();
    }
    
    init() {
        this.container.innerHTML = '';
        this.container.classList.add('mini-math-editor');
        
        // Create the editor structure
        this.editorWrapper = document.createElement('div');
        this.editorWrapper.className = 'mini-editor-wrapper';
        
        // Main input area - contenteditable for mobile keyboard support
        this.inputArea = document.createElement('div');
        this.inputArea.className = 'mini-editor-input';
        this.inputArea.tabIndex = 0;
        this.inputArea.setAttribute('contenteditable', 'true');
        this.inputArea.setAttribute('inputmode', 'text');
        this.inputArea.setAttribute('enterkeyhint', 'done');
        this.inputArea.spellcheck = false;
        
        // Cursor element
        this.cursor = document.createElement('span');
        this.cursor.className = 'mini-cursor';
        
        // Toolbar (mini keyboard)
        if (this.options.showToolbar) {
            this.toolbar = this.createToolbar();
        }
        
        this.editorWrapper.appendChild(this.inputArea);
        if (this.toolbar) {
            this.editorWrapper.appendChild(this.toolbar);
        }
        this.container.appendChild(this.editorWrapper);
        
        this.bindEvents();
        this.render();
    }
    
    createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'mini-editor-toolbar';
        
        const buttons = [
            { icon: '⅟', action: 'fraction', title: 'Fraction (/)' },
            { icon: 'n⅟', action: 'mixednum', title: 'Mixed Number' },
            { icon: 'xⁿ', action: 'power', title: 'Power (^)' },
            { icon: '√', action: 'sqrt', title: 'Square root' },
            { icon: '()', action: 'parens', title: 'Parentheses' },
            { icon: '±', action: 'plusminus', title: 'Plus/minus' },
            { icon: '%', action: 'percent', title: 'Percent' },
            { icon: 'π', action: 'pi', title: 'Pi' },
        ];
        
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'mini-toolbar-btn';
            button.innerHTML = btn.icon;
            button.title = btn.title;
            button.type = 'button';
            button.dataset.action = btn.action;
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleToolbarAction(btn.action);
                this.inputArea.focus();
            });
            toolbar.appendChild(button);
        });
        
        return toolbar;
    }
    
    handleToolbarAction(action) {
        switch (action) {
            case 'fraction':
                this.insertFraction();
                break;
            case 'mixednum':
                this.insertMixedNumber();
                break;
            case 'power':
                this.insertPower();
                break;
            case 'sqrt':
                this.insertSqrt();
                break;
            case 'parens':
                this.insertParens();
                break;
            case 'plusminus':
                this.insertSymbol('±');
                break;
            case 'percent':
                this.insertSymbol('%');
                break;
            case 'pi':
                this.insertSymbol('π');
                break;
        }
    }
    
    bindEvents() {
        // Focus handling for the mobile input
        this.inputArea.addEventListener('focus', () => {
            this.focused = true;
            this.editorWrapper.classList.add('focused');
            this.render();
        });
        
        this.inputArea.addEventListener('blur', (e) => {
            // Don't blur if clicking toolbar
            if (this.toolbar && this.toolbar.contains(e.relatedTarget)) {
                setTimeout(() => this.inputArea.focus(), 10);
                return;
            }
            this.focused = false;
            this.editorWrapper.classList.remove('focused');
            this.render();
        });
        
        // Keyboard input from physical keyboard
        this.inputArea.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Click to position cursor
        this.inputArea.addEventListener('click', (e) => {
            this.handleClick(e);
        });
        
        // Handle text input from mobile keyboard via beforeinput event
        this.inputArea.addEventListener('beforeinput', (e) => {
            e.preventDefault(); // Prevent default contenteditable behavior
            
            const inputType = e.inputType;
            const data = e.data;
            
            if (inputType === 'insertText' && data) {
                // Process each character
                for (const char of data) {
                    this.processMobileChar(char);
                }
            } else if (inputType === 'deleteContentBackward') {
                this.handleBackspace();
            } else if (inputType === 'insertLineBreak' || inputType === 'insertParagraph') {
                if (this.options.onEnter) {
                    this.options.onEnter(this.getValue());
                }
            }
        });
        
        // Fallback - clear any text that got inserted by contenteditable
        this.inputArea.addEventListener('input', (e) => {
            this.render();
        });
        
        // Prevent paste from inserting formatted content
        this.inputArea.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text');
            if (text) {
                for (const char of text) {
                    this.processMobileChar(char);
                }
            }
        });
    }
    
    // Process a single character from mobile input
    processMobileChar(char) {
        // Numbers
        if (char >= '0' && char <= '9') {
            this.insertChar(char);
            return;
        }
        
        // Decimal point
        if (char === '.') {
            this.insertChar('.');
            return;
        }
        
        // Operators
        if (['+', '-', '='].includes(char)) {
            this.insertOperator(char);
            return;
        }
        if (char === '*') {
            this.insertOperator('×');
            return;
        }
        
        // Fraction shortcut
        if (char === '/') {
            this.insertFraction();
            return;
        }
        
        // Power shortcut
        if (char === '^') {
            this.insertPower();
            return;
        }
        
        // Letters (variables)
        if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
            this.insertChar(char.toLowerCase());
            return;
        }
        
        // Parentheses
        if (char === '(') {
            this.insertParens();
            return;
        }
        if (char === ')') {
            if (this.activeContext?.type === 'parens') {
                this.exitContext();
            }
            return;
        }
    }
    
    handleKeyDown(e) {
        // Navigation
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.moveCursor(-1);
            return;
        }
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.moveCursor(1);
            return;
        }
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateVertical(e.key === 'ArrowUp' ? 'up' : 'down');
            return;
        }
        
        // Tab to move between sections in complex elements
        if (e.key === 'Tab') {
            e.preventDefault();
            if (e.shiftKey) {
                this.navigatePrevSection();
            } else {
                this.navigateNextSection();
            }
            return;
        }
        
        // Escape to exit nested element
        if (e.key === 'Escape') {
            e.preventDefault();
            this.exitContext();
            return;
        }
        
        // Backspace
        if (e.key === 'Backspace') {
            e.preventDefault();
            this.handleBackspace();
            return;
        }
        
        // Delete
        if (e.key === 'Delete') {
            e.preventDefault();
            this.handleDelete();
            return;
        }
        
        // Enter - either submit or add line if multiline
        if (e.key === 'Enter') {
            e.preventDefault();
            if (this.options.onEnter) {
                this.options.onEnter(this.getValue());
            }
            return;
        }
        
        // Numbers
        if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
            this.insertChar(e.key);
            return;
        }
        
        // Decimal point
        if (e.key === '.') {
            e.preventDefault();
            this.insertChar('.');
            return;
        }
        
        // Operators
        if (['+', '-', '*', '×', '='].includes(e.key)) {
            e.preventDefault();
            this.insertOperator(e.key === '*' ? '×' : e.key);
            return;
        }
        
        // Fraction shortcut
        if (e.key === '/') {
            e.preventDefault();
            // If there's content before cursor, wrap it in fraction numerator
            this.insertFraction();
            return;
        }
        
        // Power shortcut
        if (e.key === '^') {
            e.preventDefault();
            this.insertPower();
            return;
        }
        
        // Parentheses
        if (e.key === '(') {
            e.preventDefault();
            this.insertParens();
            return;
        }
        if (e.key === ')') {
            e.preventDefault();
            // Exit parens context if in one
            if (this.activeContext?.type === 'parens') {
                this.exitContext();
            }
            return;
        }
        
        // Letters (variables)
        if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
            e.preventDefault();
            this.insertSymbol(e.key);
            return;
        }
        
        // Enter key to enter adjacent complex element (when not in context)
        if (e.key === 'Enter' && !e.shiftKey && !this.activeContext) {
            if (this.enterElementAtCursor()) {
                e.preventDefault();
                return;
            }
        }
    }
    
    handleClick(e) {
        // Check if clicked inside a nested element (fraction, power, etc.)
        // These have their own click handlers that call enterElement
        const nestedTarget = e.target.closest('.mini-numerator, .mini-denominator, .mini-power-base, .mini-power-exp, .mini-sqrt-content, .mini-parens-content, .mini-mixednum-whole');
        if (nestedTarget) {
            // Let the nested element's click handler handle it
            return;
        }
        
        // Find which element was clicked
        const target = e.target.closest('[data-pos]');
        if (target) {
            const pos = parseInt(target.dataset.pos);
            
            // If we're in a context and clicking outside, exit context first
            if (this.activeContext) {
                this.exitContext();
            }
            
            this.cursorPosition = pos + 1;
            this.render();
        }
    }
    
    // Enter the element at the current cursor position (for keyboard navigation)
    enterElementAtCursor() {
        const arr = this.getCurrentArray();
        
        // Check element before cursor
        if (this.cursorPosition > 0) {
            const el = arr[this.cursorPosition - 1];
            if (el && this.isComplexElement(el)) {
                this.enterElement(el, this.getDefaultSection(el));
                return true;
            }
        }
        
        // Check element after cursor
        if (this.cursorPosition < arr.length) {
            const el = arr[this.cursorPosition];
            if (el && this.isComplexElement(el)) {
                this.enterElement(el, this.getDefaultSection(el));
                return true;
            }
        }
        
        return false;
    }
    
    isComplexElement(el) {
        return ['fraction', 'mixednum', 'power', 'sqrt', 'parens'].includes(el.type);
    }
    
    getDefaultSection(el) {
        switch (el.type) {
            case 'fraction': return 'numerator';
            case 'mixednum': return 'whole';
            case 'power': return 'base';
            case 'sqrt': return 'content';
            case 'parens': return 'content';
            default: return null;
        }
    }
    
    // Get the current working array (elements or nested content)
    getCurrentArray() {
        if (this.activeContext) {
            return this.activeContext.array;
        }
        return this.elements;
    }
    
    // Insert character at cursor
    insertChar(char) {
        const arr = this.getCurrentArray();
        arr.splice(this.cursorPosition, 0, { type: 'char', value: char });
        this.cursorPosition++;
        this.render();
        this.notifyChange();
    }
    
    // Insert operator
    insertOperator(op) {
        const arr = this.getCurrentArray();
        arr.splice(this.cursorPosition, 0, { type: 'operator', value: op });
        this.cursorPosition++;
        this.render();
        this.notifyChange();
    }
    
    // Insert symbol
    insertSymbol(sym) {
        const arr = this.getCurrentArray();
        arr.splice(this.cursorPosition, 0, { type: 'symbol', value: sym });
        this.cursorPosition++;
        this.render();
        this.notifyChange();
    }
    
    // Insert fraction
    insertFraction() {
        const arr = this.getCurrentArray();
        const fraction = {
            type: 'fraction',
            numerator: [],
            denominator: [],
            activeSection: 'numerator'
        };
        
        // If there's a number/symbol right before cursor, move it to numerator
        if (this.cursorPosition > 0) {
            const prev = arr[this.cursorPosition - 1];
            if (prev && (prev.type === 'char' || prev.type === 'symbol')) {
                // Find all consecutive chars/symbols before cursor
                let start = this.cursorPosition - 1;
                while (start > 0 && ['char', 'symbol'].includes(arr[start - 1]?.type)) {
                    start--;
                }
                const moved = arr.splice(start, this.cursorPosition - start);
                fraction.numerator = moved;
                this.cursorPosition = start;
            }
        }
        
        arr.splice(this.cursorPosition, 0, fraction);
        
        // Enter the fraction context
        this.contextStack.push({
            parentArray: arr,
            parentPosition: this.cursorPosition,
            element: fraction
        });
        
        this.activeContext = {
            element: fraction,
            section: 'numerator',
            array: fraction.numerator
        };
        this.cursorPosition = fraction.numerator.length;
        
        this.render();
        this.notifyChange();
    }
    
    // Insert mixed number (whole + fraction)
    insertMixedNumber() {
        const arr = this.getCurrentArray();
        const mixedNum = {
            type: 'mixednum',
            whole: [],
            numerator: [],
            denominator: [],
            activeSection: 'whole'
        };
        
        // If there's a number right before cursor, move it to whole part
        if (this.cursorPosition > 0) {
            const prev = arr[this.cursorPosition - 1];
            if (prev && prev.type === 'char' && /[0-9]/.test(prev.value)) {
                // Find all consecutive digits before cursor
                let start = this.cursorPosition - 1;
                while (start > 0 && arr[start - 1]?.type === 'char' && /[0-9]/.test(arr[start - 1].value)) {
                    start--;
                }
                const moved = arr.splice(start, this.cursorPosition - start);
                mixedNum.whole = moved;
                this.cursorPosition = start;
            }
        }
        
        arr.splice(this.cursorPosition, 0, mixedNum);
        
        // Enter the mixed number context
        this.contextStack.push({
            parentArray: arr,
            parentPosition: this.cursorPosition,
            element: mixedNum
        });
        
        // If whole is empty, start there; otherwise start at numerator
        const startSection = mixedNum.whole.length === 0 ? 'whole' : 'numerator';
        this.activeContext = {
            element: mixedNum,
            section: startSection,
            array: mixedNum[startSection]
        };
        this.cursorPosition = mixedNum[startSection].length;
        
        this.render();
        this.notifyChange();
    }
    
    // Insert power
    insertPower() {
        const arr = this.getCurrentArray();
        const power = {
            type: 'power',
            base: [],
            exponent: [],
            activeSection: 'base'
        };
        
        // Move previous item to base
        if (this.cursorPosition > 0) {
            const prev = arr[this.cursorPosition - 1];
            if (prev && (prev.type === 'char' || prev.type === 'symbol' || prev.type === 'parens')) {
                const moved = arr.splice(this.cursorPosition - 1, 1);
                power.base = moved;
                this.cursorPosition--;
            }
        }
        
        arr.splice(this.cursorPosition, 0, power);
        
        this.contextStack.push({
            parentArray: arr,
            parentPosition: this.cursorPosition,
            element: power
        });
        
        this.activeContext = {
            element: power,
            section: 'exponent',
            array: power.exponent
        };
        this.cursorPosition = 0;
        
        this.render();
        this.notifyChange();
    }
    
    // Insert square root
    insertSqrt() {
        const arr = this.getCurrentArray();
        const sqrt = {
            type: 'sqrt',
            content: []
        };
        
        arr.splice(this.cursorPosition, 0, sqrt);
        
        this.contextStack.push({
            parentArray: arr,
            parentPosition: this.cursorPosition,
            element: sqrt
        });
        
        this.activeContext = {
            element: sqrt,
            section: 'content',
            array: sqrt.content
        };
        this.cursorPosition = 0;
        
        this.render();
        this.notifyChange();
    }
    
    // Insert parentheses
    insertParens() {
        const arr = this.getCurrentArray();
        const parens = {
            type: 'parens',
            content: []
        };
        
        arr.splice(this.cursorPosition, 0, parens);
        
        this.contextStack.push({
            parentArray: arr,
            parentPosition: this.cursorPosition,
            element: parens
        });
        
        this.activeContext = {
            element: parens,
            section: 'content',
            array: parens.content
        };
        this.cursorPosition = 0;
        
        this.render();
        this.notifyChange();
    }
    
    // Move cursor
    moveCursor(direction) {
        const arr = this.getCurrentArray();
        const newPos = this.cursorPosition + direction;
        
        if (newPos >= 0 && newPos <= arr.length) {
            this.cursorPosition = newPos;
            this.render();
        } else if (newPos < 0 && this.contextStack.length > 0) {
            // Try to exit to parent
            this.exitContext();
        } else if (newPos > arr.length && this.contextStack.length > 0) {
            // Try to exit to parent (at end)
            this.exitContext();
        }
    }
    
    // Navigate between sections (Tab)
    navigateNextSection() {
        if (!this.activeContext) {
            // Not in a context - try to enter an adjacent complex element
            if (this.enterElementAtCursor()) {
                return;
            }
            return;
        }
        
        const el = this.activeContext.element;
        
        if (el.type === 'fraction') {
            if (this.activeContext.section === 'numerator') {
                this.activeContext.section = 'denominator';
                this.activeContext.array = el.denominator;
                el.activeSection = 'denominator';
                this.cursorPosition = el.denominator.length;
                this.render();
            } else {
                this.exitContext();
            }
        } else if (el.type === 'mixednum') {
            if (this.activeContext.section === 'whole') {
                this.activeContext.section = 'numerator';
                this.activeContext.array = el.numerator;
                el.activeSection = 'numerator';
                this.cursorPosition = el.numerator.length;
                this.render();
            } else if (this.activeContext.section === 'numerator') {
                this.activeContext.section = 'denominator';
                this.activeContext.array = el.denominator;
                el.activeSection = 'denominator';
                this.cursorPosition = el.denominator.length;
                this.render();
            } else {
                this.exitContext();
            }
        } else if (el.type === 'power') {
            if (this.activeContext.section === 'base') {
                this.activeContext.section = 'exponent';
                this.activeContext.array = el.exponent;
                el.activeSection = 'exponent';
                this.cursorPosition = el.exponent.length;
                this.render();
            } else {
                this.exitContext();
            }
        } else {
            this.exitContext();
        }
    }
    
    navigatePrevSection() {
        if (!this.activeContext) return;
        
        const el = this.activeContext.element;
        
        if (el.type === 'fraction') {
            if (this.activeContext.section === 'denominator') {
                this.activeContext.section = 'numerator';
                this.activeContext.array = el.numerator;
                el.activeSection = 'numerator';
                this.cursorPosition = el.numerator.length;
                this.render();
            }
        } else if (el.type === 'mixednum') {
            if (this.activeContext.section === 'denominator') {
                this.activeContext.section = 'numerator';
                this.activeContext.array = el.numerator;
                el.activeSection = 'numerator';
                this.cursorPosition = el.numerator.length;
                this.render();
            } else if (this.activeContext.section === 'numerator') {
                this.activeContext.section = 'whole';
                this.activeContext.array = el.whole;
                el.activeSection = 'whole';
                this.cursorPosition = el.whole.length;
                this.render();
            }
        } else if (el.type === 'power') {
            if (this.activeContext.section === 'exponent') {
                this.activeContext.section = 'base';
                this.activeContext.array = el.base;
                el.activeSection = 'base';
                this.cursorPosition = el.base.length;
                this.render();
            }
        }
    }
    
    // Navigate vertical (for fractions and mixed numbers)
    navigateVertical(direction) {
        if (!this.activeContext) return;
        
        const el = this.activeContext.element;
        
        if (el.type === 'fraction') {
            if (direction === 'up' && this.activeContext.section === 'denominator') {
                this.activeContext.section = 'numerator';
                this.activeContext.array = el.numerator;
                el.activeSection = 'numerator';
                this.cursorPosition = Math.min(this.cursorPosition, el.numerator.length);
                this.render();
            } else if (direction === 'down' && this.activeContext.section === 'numerator') {
                this.activeContext.section = 'denominator';
                this.activeContext.array = el.denominator;
                el.activeSection = 'denominator';
                this.cursorPosition = Math.min(this.cursorPosition, el.denominator.length);
                this.render();
            }
        } else if (el.type === 'mixednum') {
            if (direction === 'up' && this.activeContext.section === 'denominator') {
                this.activeContext.section = 'numerator';
                this.activeContext.array = el.numerator;
                el.activeSection = 'numerator';
                this.cursorPosition = Math.min(this.cursorPosition, el.numerator.length);
                this.render();
            } else if (direction === 'down' && this.activeContext.section === 'numerator') {
                this.activeContext.section = 'denominator';
                this.activeContext.array = el.denominator;
                el.activeSection = 'denominator';
                this.cursorPosition = Math.min(this.cursorPosition, el.denominator.length);
                this.render();
            }
        }
    }
    
    // Exit current context
    exitContext() {
        if (this.contextStack.length === 0) return;
        
        const context = this.contextStack.pop();
        
        if (this.contextStack.length > 0) {
            const parentContext = this.contextStack[this.contextStack.length - 1];
            this.activeContext = {
                element: parentContext.element,
                section: parentContext.element.activeSection || 'content',
                array: parentContext.element[parentContext.element.activeSection || 'content']
            };
        } else {
            this.activeContext = null;
        }
        
        this.cursorPosition = context.parentPosition + 1;
        this.render();
    }
    
    // Handle backspace
    handleBackspace() {
        const arr = this.getCurrentArray();
        
        if (this.cursorPosition > 0) {
            arr.splice(this.cursorPosition - 1, 1);
            this.cursorPosition--;
            this.render();
            this.notifyChange();
        } else if (this.contextStack.length > 0) {
            // At start of nested element, exit to parent
            this.exitContext();
            // Then delete the empty element
            const arr2 = this.getCurrentArray();
            if (this.cursorPosition > 0) {
                const prev = arr2[this.cursorPosition - 1];
                if (prev && prev.type && this.isEmpty(prev)) {
                    arr2.splice(this.cursorPosition - 1, 1);
                    this.cursorPosition--;
                    this.render();
                    this.notifyChange();
                }
            }
        }
    }
    
    // Handle delete
    handleDelete() {
        const arr = this.getCurrentArray();
        
        if (this.cursorPosition < arr.length) {
            arr.splice(this.cursorPosition, 1);
            this.render();
            this.notifyChange();
        }
    }
    
    // Check if element is empty
    isEmpty(el) {
        if (el.type === 'fraction') {
            return el.numerator.length === 0 && el.denominator.length === 0;
        }
        if (el.type === 'power') {
            return el.base.length === 0 && el.exponent.length === 0;
        }
        if (el.type === 'sqrt' || el.type === 'parens') {
            return el.content.length === 0;
        }
        return false;
    }
    
    // Notify change callback
    notifyChange() {
        if (this.options.onChange) {
            this.options.onChange(this.getValue());
        }
    }
    
    // Render the editor
    render() {
        this.inputArea.innerHTML = '';
        
        if (this.elements.length === 0 && !this.focused) {
            const placeholder = document.createElement('span');
            placeholder.className = 'mini-placeholder';
            placeholder.textContent = this.options.placeholder;
            this.inputArea.appendChild(placeholder);
            return;
        }
        
        this.renderElements(this.elements, this.inputArea, !this.activeContext);
    }
    
    renderElements(elements, container, showCursor) {
        const isCurrentContext = showCursor && this.focused;
        
        for (let i = 0; i <= elements.length; i++) {
            // Cursor before element
            if (isCurrentContext && i === this.cursorPosition) {
                const cursor = document.createElement('span');
                cursor.className = 'mini-cursor active';
                container.appendChild(cursor);
            }
            
            if (i < elements.length) {
                const el = elements[i];
                const elSpan = this.renderElement(el, i);
                container.appendChild(elSpan);
            }
        }
    }
    
    renderElement(el, pos) {
        const span = document.createElement('span');
        span.dataset.pos = pos;
        
        switch (el.type) {
            case 'char':
            case 'symbol':
                span.className = 'mini-char';
                span.textContent = el.value;
                break;
                
            case 'operator':
                span.className = 'mini-operator';
                span.textContent = el.value;
                break;
                
            case 'fraction':
                span.className = 'mini-fraction';
                const numDiv = document.createElement('div');
                numDiv.className = 'mini-numerator' + 
                    (this.activeContext?.element === el && this.activeContext.section === 'numerator' ? ' active' : '');
                this.renderElements(el.numerator, numDiv, 
                    this.activeContext?.element === el && this.activeContext.section === 'numerator');
                
                const line = document.createElement('div');
                line.className = 'mini-fraction-line';
                
                const denDiv = document.createElement('div');
                denDiv.className = 'mini-denominator' + 
                    (this.activeContext?.element === el && this.activeContext.section === 'denominator' ? ' active' : '');
                this.renderElements(el.denominator, denDiv, 
                    this.activeContext?.element === el && this.activeContext.section === 'denominator');
                
                span.appendChild(numDiv);
                span.appendChild(line);
                span.appendChild(denDiv);
                
                // Click handlers for sections
                numDiv.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.enterElement(el, 'numerator');
                });
                denDiv.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.enterElement(el, 'denominator');
                });
                break;
            
            case 'mixednum':
                span.className = 'mini-mixednum';
                
                // Whole part
                const wholeSpan = document.createElement('span');
                wholeSpan.className = 'mini-mixednum-whole' + 
                    (this.activeContext?.element === el && this.activeContext.section === 'whole' ? ' active' : '');
                this.renderElements(el.whole, wholeSpan, 
                    this.activeContext?.element === el && this.activeContext.section === 'whole');
                
                // Fraction part
                const fracSpan = document.createElement('span');
                fracSpan.className = 'mini-mixednum-fraction';
                
                const mixedNumDiv = document.createElement('div');
                mixedNumDiv.className = 'mini-numerator' + 
                    (this.activeContext?.element === el && this.activeContext.section === 'numerator' ? ' active' : '');
                this.renderElements(el.numerator, mixedNumDiv, 
                    this.activeContext?.element === el && this.activeContext.section === 'numerator');
                
                const mixedLine = document.createElement('div');
                mixedLine.className = 'mini-fraction-line';
                
                const mixedDenDiv = document.createElement('div');
                mixedDenDiv.className = 'mini-denominator' + 
                    (this.activeContext?.element === el && this.activeContext.section === 'denominator' ? ' active' : '');
                this.renderElements(el.denominator, mixedDenDiv, 
                    this.activeContext?.element === el && this.activeContext.section === 'denominator');
                
                fracSpan.appendChild(mixedNumDiv);
                fracSpan.appendChild(mixedLine);
                fracSpan.appendChild(mixedDenDiv);
                
                span.appendChild(wholeSpan);
                span.appendChild(fracSpan);
                
                // Click handlers
                wholeSpan.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.enterElement(el, 'whole');
                });
                mixedNumDiv.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.enterElement(el, 'numerator');
                });
                mixedDenDiv.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.enterElement(el, 'denominator');
                });
                break;
                
            case 'power':
                span.className = 'mini-power';
                const baseSpan = document.createElement('span');
                baseSpan.className = 'mini-power-base' + 
                    (this.activeContext?.element === el && this.activeContext.section === 'base' ? ' active' : '');
                this.renderElements(el.base, baseSpan, 
                    this.activeContext?.element === el && this.activeContext.section === 'base');
                
                const expSpan = document.createElement('sup');
                expSpan.className = 'mini-power-exp' + 
                    (this.activeContext?.element === el && this.activeContext.section === 'exponent' ? ' active' : '');
                this.renderElements(el.exponent, expSpan, 
                    this.activeContext?.element === el && this.activeContext.section === 'exponent');
                
                span.appendChild(baseSpan);
                span.appendChild(expSpan);
                
                baseSpan.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.enterElement(el, 'base');
                });
                expSpan.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.enterElement(el, 'exponent');
                });
                break;
                
            case 'sqrt':
                span.className = 'mini-sqrt';
                const sqrtSymbol = document.createElement('span');
                sqrtSymbol.className = 'mini-sqrt-symbol';
                sqrtSymbol.innerHTML = '√';
                
                const sqrtContent = document.createElement('span');
                sqrtContent.className = 'mini-sqrt-content' + 
                    (this.activeContext?.element === el ? ' active' : '');
                this.renderElements(el.content, sqrtContent, 
                    this.activeContext?.element === el);
                
                span.appendChild(sqrtSymbol);
                span.appendChild(sqrtContent);
                
                sqrtContent.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.enterElement(el, 'content');
                });
                break;
                
            case 'parens':
                span.className = 'mini-parens';
                span.innerHTML = '<span class="mini-paren">(</span>';
                
                const parenContent = document.createElement('span');
                parenContent.className = 'mini-parens-content' + 
                    (this.activeContext?.element === el ? ' active' : '');
                this.renderElements(el.content, parenContent, 
                    this.activeContext?.element === el);
                
                span.appendChild(parenContent);
                span.innerHTML += '<span class="mini-paren">)</span>';
                
                parenContent.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.enterElement(el, 'content');
                });
                break;
        }
        
        return span;
    }
    
    // Enter a complex element
    enterElement(el, section) {
        // Find the element in current array
        const arr = this.activeContext ? this.activeContext.array : this.elements;
        const pos = arr.indexOf(el);
        
        if (pos !== -1) {
            this.contextStack.push({
                parentArray: arr,
                parentPosition: pos,
                element: el
            });
        }
        
        el.activeSection = section;
        const targetArray = el[section];
        
        this.activeContext = {
            element: el,
            section: section,
            array: targetArray
        };
        
        this.cursorPosition = targetArray.length;
        this.inputArea.focus();
        this.render();
    }
    
    // Get the value as a string
    getValue() {
        return this.elementsToString(this.elements);
    }
    
    elementsToString(elements) {
        return elements.map(el => {
            switch (el.type) {
                case 'char':
                case 'symbol':
                case 'operator':
                    return el.value;
                case 'fraction':
                    const num = this.elementsToString(el.numerator) || '0';
                    const den = this.elementsToString(el.denominator) || '1';
                    return `(${num})/(${den})`;
                case 'mixednum':
                    const mixedWhole = this.elementsToString(el.whole) || '0';
                    const mixedNum = this.elementsToString(el.numerator) || '0';
                    const mixedDen = this.elementsToString(el.denominator) || '1';
                    return `${mixedWhole} ${mixedNum}/${mixedDen}`;
                case 'power':
                    const base = this.elementsToString(el.base) || '1';
                    const exp = this.elementsToString(el.exponent) || '1';
                    return `(${base})^(${exp})`;
                case 'sqrt':
                    const sqrtContent = this.elementsToString(el.content) || '0';
                    return `sqrt(${sqrtContent})`;
                case 'parens':
                    const parenContent = this.elementsToString(el.content);
                    return `(${parenContent})`;
                default:
                    return el.value || '';
            }
        }).join('');
    }
    
    // Get display string (for showing to user)
    getDisplayValue() {
        return this.elementsToDisplayString(this.elements);
    }
    
    elementsToDisplayString(elements) {
        return elements.map(el => {
            switch (el.type) {
                case 'char':
                case 'symbol':
                case 'operator':
                    return el.value;
                case 'fraction':
                    const num = this.elementsToDisplayString(el.numerator) || '?';
                    const den = this.elementsToDisplayString(el.denominator) || '?';
                    return `${num}/${den}`;
                case 'mixednum':
                    const mixedWhole = this.elementsToDisplayString(el.whole) || '?';
                    const mixedNum = this.elementsToDisplayString(el.numerator) || '?';
                    const mixedDen = this.elementsToDisplayString(el.denominator) || '?';
                    return `${mixedWhole} ${mixedNum}/${mixedDen}`;
                case 'power':
                    const base = this.elementsToDisplayString(el.base) || '?';
                    const exp = this.elementsToDisplayString(el.exponent) || '?';
                    return `${base}^${exp}`;
                case 'sqrt':
                    const sqrtContent = this.elementsToDisplayString(el.content) || '?';
                    return `√(${sqrtContent})`;
                case 'parens':
                    const parenContent = this.elementsToDisplayString(el.content);
                    return `(${parenContent})`;
                default:
                    return el.value || '';
            }
        }).join('');
    }
    
    // Set value from string (basic parsing)
    setValue(str) {
        this.elements = [];
        this.cursorPosition = 0;
        this.activeContext = null;
        this.contextStack = [];
        
        if (!str) {
            this.render();
            return;
        }
        
        // Simple parsing - just convert characters
        for (const char of str) {
            if (/[0-9.]/.test(char)) {
                this.elements.push({ type: 'char', value: char });
            } else if (['+', '-', '×', '*', '÷', '/', '='].includes(char)) {
                const opMap = { '*': '×', '/': '÷' };
                this.elements.push({ type: 'operator', value: opMap[char] || char });
            } else if (/[a-zA-Z]/.test(char)) {
                this.elements.push({ type: 'symbol', value: char });
            } else if (char !== ' ') {
                this.elements.push({ type: 'symbol', value: char });
            }
        }
        
        this.cursorPosition = this.elements.length;
        this.render();
    }
    
    // Clear the editor
    clear() {
        this.elements = [];
        this.cursorPosition = 0;
        this.activeContext = null;
        this.contextStack = [];
        this.render();
        this.notifyChange();
    }
    
    // Focus the editor
    focus() {
        this.inputArea.focus();
    }
    
    // Disable/enable
    setDisabled(disabled) {
        this.inputArea.tabIndex = disabled ? -1 : 0;
        this.editorWrapper.classList.toggle('disabled', disabled);
        if (this.toolbar) {
            this.toolbar.querySelectorAll('button').forEach(btn => {
                btn.disabled = disabled;
            });
        }
    }
    
    // Check if empty
    isEmpty() {
        return this.elements.length === 0;
    }
}

// Make available globally
window.MiniMathEditor = MiniMathEditor;
