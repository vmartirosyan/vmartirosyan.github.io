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
