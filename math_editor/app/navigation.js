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
