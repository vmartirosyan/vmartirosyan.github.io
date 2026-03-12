/**
 * MathTextPopup
 * A popup dialog that hosts a full math expression editor.
 * The user composes an expression with the two-panel keyboard then confirms;
 * the rendered expression is rasterised with html2canvas and stamped onto the
 * drawing canvas at the original click position.
 */
class MathTextPopup {
    constructor() {
        this.visible = false;
        this.pendingX = 0;
        this.pendingY = 0;
        this.drawingController = null;

        // Own expression state – completely independent of the main editor
        this.expression  = new MathExpression();
        this.navContext  = new NavigationContext();
        this.navSystem   = new NavigationSystem(this.expression, this.navContext);

        this.displayEl   = null;
        this._keydownHandler = (e) => this.handleKeyDown(e);
    }

    // ─── Initialisation ──────────────────────────────────────────────────────

    init() {
        this.displayEl = document.getElementById('popupExprDisplay');
        if (!this.displayEl) return;

        document.getElementById('mathTextPopupClose')
            .addEventListener('click', () => this.cancel());
        document.getElementById('mathTextPopupConfirm')
            .addEventListener('click', () => this.confirm());

        // Click-to-navigate on the expression display
        this.displayEl.addEventListener('click', (e) => this._handleDisplayClick(e));

        // Keyboard delegation on the popup's own container
        const kbdContainer = document.querySelector('.popup-keyboard-container');
        if (kbdContainer) {
            kbdContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.key-btn');
                if (!btn || btn.classList.contains('popup-mode-btn')) return;
                this.handleButtonClick(btn);
            });
        }

        // Mode switching (scoped to popup panels / buttons)
        document.querySelectorAll('.popup-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                document.querySelectorAll('.popup-mode-btn')
                    .forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.popup-key-mode-panel')
                    .forEach(p => p.classList.toggle('active', p.dataset.mode === mode));
            });
        });

        // Prevent canvas touch events being stolen while popup is open
        document.getElementById('mathTextPopup')
            .addEventListener('touchmove', e => e.stopPropagation(), { passive: true });

        // Close on backdrop click
        document.getElementById('mathTextPopup').addEventListener('click', (e) => {
            if (e.target === document.getElementById('mathTextPopup')) this.cancel();
        });
    }

    // ─── Show / Hide ─────────────────────────────────────────────────────────

    show(x, y, drawingController) {
        this.pendingX = x;
        this.pendingY = y;
        this.drawingController = drawingController;

        // Reset expression
        this.expression.elements = [];
        this.expression.cursorPosition = 0;
        this.navContext.stack = [];
        this.navContext.currentElement = null;
        this.navContext.currentSection = null;
        this.navContext.currentPosition = 0;

        // Reset popup keyboard mode to f(x)
        document.querySelectorAll('.popup-mode-btn').forEach(b => b.classList.remove('active'));
        const firstMode = document.querySelector('.popup-mode-btn[data-mode="functions"]');
        if (firstMode) firstMode.classList.add('active');
        document.querySelectorAll('.popup-key-mode-panel').forEach(p => {
            p.classList.toggle('active', p.dataset.mode === 'functions');
        });

        this.render();

        document.getElementById('mathTextPopup').style.display = 'flex';
        this.visible = true;

        // Disable main keyboard while popup is open
        if (window.mathApp && window.mathApp.keyboardController) {
            window.mathApp.keyboardController.setEnabled(false);
        }

        document.addEventListener('keydown', this._keydownHandler);
        setTimeout(() => this.displayEl.focus(), 50);
    }

    hide() {
        document.getElementById('mathTextPopup').style.display = 'none';
        this.visible = false;
        document.removeEventListener('keydown', this._keydownHandler);

        // Re-enable main keyboard only when on editor tab
        if (window.mathApp && window.mathApp.keyboardController) {
            window.mathApp.keyboardController.setEnabled(
                window.mathApp.currentTab === 'editor'
            );
        }
    }

    cancel() {
        this.hide();
    }

    async confirm() {
        if (this.expression.elements.length === 0) {
            this.hide();
            return;
        }

        // ── Prepare display for clean capture ──────────────────────────────
        // Hide cursors
        const cursors = this.displayEl.querySelectorAll('.cursor');
        cursors.forEach(c => (c.style.display = 'none'));

        // Remove active / focused highlights
        this.displayEl.querySelectorAll('.active, .focused')
            .forEach(el => el.classList.remove('active', 'focused'));

        // Remove dotted fraction / power / parens borders
        this.displayEl.querySelectorAll(
            '.fraction-numerator, .fraction-denominator, ' +
            '.power-base, .power-exponent, ' +
            '.subscript-base, .subscript-index, ' +
            '.parens-content'
        ).forEach(el => (el.style.border = 'none'));

        // Remove sqrt side/bottom borders (keep implied vinculum pseudo-element)
        this.displayEl.querySelectorAll('.sqrt-content').forEach(el => {
            el.style.borderLeft = 'none';
            el.style.borderRight = 'none';
            el.style.borderBottom = 'none';
        });

        // Strip the display box's own border and background so the
        // captured image contains only the math content (no surrounding rect).
        const prevBorder     = this.displayEl.style.border;
        const prevBackground = this.displayEl.style.background;
        const prevPadding    = this.displayEl.style.padding;
        this.displayEl.style.border     = 'none';
        this.displayEl.style.background = 'transparent';
        this.displayEl.style.padding    = '0';

        try {
            const captureCanvas = await html2canvas(this.displayEl, {
                backgroundColor: null,      // transparent background
                scale: 2,
                logging: false,
                width:  this.displayEl.scrollWidth,
                height: this.displayEl.scrollHeight
            });

            // Restore display styles
            this.displayEl.style.border     = prevBorder;
            this.displayEl.style.background = prevBackground;
            this.displayEl.style.padding    = prevPadding;

            const imageData = captureCanvas.toDataURL('image/png');
            // Halve dimensions back to CSS pixels (we captured at 2×)
            const w = Math.ceil(captureCanvas.width  / 2);
            const h = Math.ceil(captureCanvas.height / 2);

            this.hide();
            this.drawingController.addMathText(
                this.pendingX, this.pendingY, imageData, w, h
            );
        } catch (err) {
            console.error('MathTextPopup: capture failed', err);
            this.displayEl.style.border     = prevBorder;
            this.displayEl.style.background = prevBackground;
            this.displayEl.style.padding    = prevPadding;
            this.hide();
        }
    }

    // ─── Expression Rendering ────────────────────────────────────────────────

    render() {
        if (!this.displayEl) return;
        this.displayEl.innerHTML = '';
        const frag = document.createDocumentFragment();

        if (this.navContext.currentElement) {
            this._renderContextual(frag);
        } else {
            this._renderMain(frag);
        }

        this.displayEl.appendChild(frag);
    }

    _renderMain(frag) {
        frag.appendChild(this._cursor(this.expression.cursorPosition === 0, 0));
        this.expression.elements.forEach((el, i) => {
            frag.appendChild(this.renderElement(el, false, i));
            const pos = i + 1;
            frag.appendChild(this._cursor(this.expression.cursorPosition === pos, pos));
        });
    }

    _renderContextual(frag) {
        frag.appendChild(this._cursor(this.expression.cursorPosition === 0, 0));
        this.expression.elements.forEach((el, i) => {
            const isActive = this.navContext.currentElement === el;
            frag.appendChild(this.renderElement(el, isActive, i));
            const pos = i + 1;
            const cursorActive = !this.navContext.currentElement &&
                this.expression.cursorPosition === pos;
            frag.appendChild(this._cursor(cursorActive, pos));
        });
    }

    renderElement(element, isActive = false, idx = null) {
        const c = document.createElement('span');
        c.classList.add('expr-element');
        if (isActive) c.classList.add('focused');
        if (idx !== null) c.setAttribute('data-element-index', idx);

        switch (element.type) {
            case 'number':
            case 'symbol':
                c.classList.add(`expr-${element.type}`);
                c.textContent = element.value;
                break;

            case 'operator': {
                c.classList.add('expr-operator');
                const map = { '+': '+', '-': '−', '*': '×', '/': '÷', '=': '=' };
                c.textContent = map[element.value] || element.value;
                break;
            }

            case 'fraction':   this._renderFraction(c, element);   break;
            case 'power':      this._renderPower(c, element);       break;
            case 'subscript':  this._renderSubscript(c, element);   break;
            case 'sqrt':       this._renderSqrt(c, element);        break;
            case 'parens':     this._renderParens(c, element);      break;

            case 'function':
                c.classList.add('expr-function');
                c.textContent = element.value;
                break;

            case 'linebreak':
                c.classList.add('expr-linebreak');
                c.style.flexBasis = '100%';
                c.style.height    = '0';
                break;

            default:
                c.textContent = '?';
        }
        return c;
    }

    _renderFraction(c, el) {
        c.classList.add('expr-fraction');
        const isMe     = this.navContext.currentElement === el;
        const numActive = isMe && this.navContext.currentSection === 'numerator';
        const denActive = isMe && this.navContext.currentSection === 'denominator';

        const num = document.createElement('div');
        num.classList.add('fraction-numerator');
        num.setAttribute('data-section', 'numerator');
        if (numActive) num.classList.add('active');
        if (!el.numerator || !el.numerator.length) num.classList.add('empty');
        this._renderSection(num, el.numerator, numActive);
        c.appendChild(num);

        const den = document.createElement('div');
        den.classList.add('fraction-denominator');
        den.setAttribute('data-section', 'denominator');
        if (denActive) den.classList.add('active');
        if (!el.denominator || !el.denominator.length) den.classList.add('empty');
        this._renderSection(den, el.denominator, denActive);
        c.appendChild(den);
    }

    _renderPower(c, el) {
        c.classList.add('expr-power');
        const isMe      = this.navContext.currentElement === el;
        const baseActive = isMe && this.navContext.currentSection === 'base';
        const expActive  = isMe && this.navContext.currentSection === 'exponent';

        const base = document.createElement('span');
        base.classList.add('power-base');
        base.setAttribute('data-section', 'base');
        if (baseActive) base.classList.add('active');
        if (!el.base || !el.base.length) base.classList.add('empty');
        this._renderSection(base, el.base, baseActive);
        c.appendChild(base);

        const exp = document.createElement('span');
        exp.classList.add('power-exponent');
        exp.setAttribute('data-section', 'exponent');
        if (expActive) exp.classList.add('active');
        if (!el.exponent || !el.exponent.length) exp.classList.add('empty');
        this._renderSection(exp, el.exponent, expActive);
        c.appendChild(exp);
    }

    _renderSubscript(c, el) {
        c.classList.add('expr-subscript');
        const isMe      = this.navContext.currentElement === el;
        const baseActive = isMe && this.navContext.currentSection === 'base';
        const idxActive  = isMe && this.navContext.currentSection === 'index';

        const base = document.createElement('span');
        base.classList.add('subscript-base');
        base.setAttribute('data-section', 'base');
        if (baseActive) base.classList.add('active');
        if (!el.base || !el.base.length) base.classList.add('empty');
        this._renderSection(base, el.base, baseActive);
        c.appendChild(base);

        const idx = document.createElement('span');
        idx.classList.add('subscript-index');
        idx.setAttribute('data-section', 'index');
        if (idxActive) idx.classList.add('active');
        if (!el.index || !el.index.length) idx.classList.add('empty');
        this._renderSection(idx, el.index, idxActive);
        c.appendChild(idx);
    }

    _renderSqrt(c, el) {
        c.classList.add('expr-sqrt');
        const wrap = document.createElement('span');
        wrap.classList.add('sqrt-radical-wrapper');

        const svgNS = 'http://www.w3.org/2000/svg';
        const svg   = document.createElementNS(svgNS, 'svg');
        svg.classList.add('sqrt-symbol');
        svg.setAttribute('viewBox', '0 0 30 50');
        svg.setAttribute('preserveAspectRatio', 'none');
        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', 'M 0 32 L 10 50 L 22 1 L 33 1');
        path.setAttribute('stroke', '#333');
        path.setAttribute('stroke-width', '3');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'butt');
        path.setAttribute('stroke-linejoin', 'miter');
        svg.appendChild(path);
        wrap.appendChild(svg);
        c.appendChild(wrap);

        const isMe         = this.navContext.currentElement === el;
        const contentActive = isMe && this.navContext.currentSection === 'content';
        const content = document.createElement('span');
        content.classList.add('sqrt-content');
        content.setAttribute('data-section', 'content');
        if (contentActive) content.classList.add('active');
        if (!el.content || !el.content.length) content.classList.add('empty');
        this._renderSection(content, el.content, contentActive);
        c.appendChild(content);
    }

    _renderParens(c, el) {
        c.classList.add('expr-parens');
        c.appendChild(Object.assign(document.createElement('span'), { textContent: '(' }));

        const isMe          = this.navContext.currentElement === el;
        const contentActive  = isMe && this.navContext.currentSection === 'content';
        const content = document.createElement('span');
        content.classList.add('parens-content');
        content.setAttribute('data-section', 'content');
        if (contentActive) content.classList.add('active');
        if (!el.content || !el.content.length) content.classList.add('empty');
        this._renderSection(content, el.content, contentActive);
        c.appendChild(content);

        c.appendChild(Object.assign(document.createElement('span'), { textContent: ')' }));
    }

    _renderSection(container, elements, isActiveSection = false) {
        if (!elements || !elements.length) {
            container.appendChild(
                this._cursor(isActiveSection && this.navContext.currentPosition === 0, 0)
            );
            return;
        }
        container.appendChild(
            this._cursor(isActiveSection && this.navContext.currentPosition === 0, 0)
        );
        elements.forEach((el, i) => {
            container.appendChild(this.renderElement(el));
            const pos = i + 1;
            container.appendChild(
                this._cursor(isActiveSection && this.navContext.currentPosition === pos, pos)
            );
        });
    }

    _cursor(active, position) {
        const s = document.createElement('span');
        s.classList.add('cursor');
        s.dataset.position = position;
        if (active) s.classList.add('active');
        return s;
    }

    // ─── Keyboard Input ──────────────────────────────────────────────────────

    handleKeyDown(e) {
        if (!this.visible) return;

        // Allow confirm/close button native click
        const target = e.target;
        if (target.id === 'mathTextPopupConfirm' || target.id === 'mathTextPopupClose') return;

        if (e.key === 'Escape') { e.preventDefault(); this.cancel(); return; }
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.confirm(); return; }

        this._processPhysicalKey(e);
    }

    handleButtonClick(btn) {
        const value  = btn.dataset.value;
        const action = btn.dataset.action;

        if (action === 'backspace') { this._backspace(); this.render(); return; }
        if (action === 'left')      { this._arrowLeft();  return; }
        if (action === 'right')     { this._arrowRight(); return; }
        if (value === undefined)    return;

        if (btn.classList.contains('function')) {
            this._handleFunction(value);
        } else {
            const isNum = /^[0-9.]$/.test(value);
            const isOp  = ['+', '-', '*', '/', '=', '<', '>'].includes(value);
            if (isNum) {
                this._insert(ElementFactory.createNumber(value));
            } else if (isOp) {
                this._insert(ElementFactory.createOperator(value));
            } else {
                this._insert(ElementFactory.createSymbol(value));
            }
        }
    }

    _handleFunction(funcName) {
        let el;
        switch (funcName) {
            case 'fraction': {
                el = ElementFactory.createFraction();
                this._insert(el);
                this.navContext.enter(el, 'numerator');
                break;
            }
            case 'sqrt': {
                el = ElementFactory.createSqrt();
                this._insert(el);
                this.navContext.enter(el, 'content');
                break;
            }
            case 'power':
            case 'superscript': {
                el = ElementFactory.createPower();
                this._insert(el);
                this.navContext.enter(el, 'base');
                break;
            }
            case 'subscript': {
                el = ElementFactory.createSubscript();
                this._insert(el);
                this.navContext.enter(el, 'base');
                break;
            }
            case 'abs': {
                el = ElementFactory.createParens();
                this._insert(el);
                this.navContext.enter(el, 'content');
                break;
            }
            default:
                this._insert(ElementFactory.createSymbol(funcName));
        }
        this.render();
    }

    _processPhysicalKey(e) {
        if (e.key === 'ArrowLeft')  { e.preventDefault(); this._arrowLeft();  return; }
        if (e.key === 'ArrowRight') { e.preventDefault(); this._arrowRight(); return; }
        if (e.key === 'ArrowUp')    { e.preventDefault(); this.navContext.previousSection(); this.render(); return; }
        if (e.key === 'ArrowDown')  { e.preventDefault(); this.navContext.nextSection();     this.render(); return; }
        if (e.key === 'Tab') {
            e.preventDefault();
            if (e.shiftKey) this.navContext.previousSection();
            else            this.navContext.nextSection();
            this.render();
            return;
        }
        if (e.key === 'Backspace') { e.preventDefault(); this._backspace(); this.render(); return; }
        if (e.key >= '0' && e.key <= '9') {
            e.preventDefault(); this._insert(ElementFactory.createNumber(e.key)); return;
        }
        if (e.key === '.') { e.preventDefault(); this._insert(ElementFactory.createNumber('.')); return; }
        const ops = { '+': '+', '-': '-', '*': '*', '/': '/', '=': '=' };
        if (ops[e.key]) { e.preventDefault(); this._insert(ElementFactory.createOperator(ops[e.key])); return; }
        if (e.key === '(' || e.key === ')') { e.preventDefault(); this._insert(ElementFactory.createSymbol(e.key)); return; }
        if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
            e.preventDefault(); this._insert(ElementFactory.createSymbol(e.key.toLowerCase())); return;
        }
    }

    // ─── Expression Mutation Helpers ─────────────────────────────────────────

    _insert(element) {
        if (this.navContext.currentElement) {
            const arr = this.navContext.getCurrentSectionArray();
            if (arr !== null) {
                this.expression.saveState();
                arr.splice(this.navContext.currentPosition, 0, element);
                this.navContext.currentPosition++;
            }
        } else {
            this.expression.addElement(element);
        }
        this.render();
    }

    _backspace() {
        if (this.navContext.currentElement) {
            const arr = this.navContext.getCurrentSectionArray();
            if (arr !== null && this.navContext.currentPosition > 0) {
                this.expression.saveState();
                arr.splice(this.navContext.currentPosition - 1, 1);
                this.navContext.currentPosition--;
            } else if (this.navContext.currentPosition === 0) {
                this.navContext.exit();
            }
        } else {
            this.expression.backspace();
        }
    }

    _arrowLeft() {
        if (this.navContext.currentElement) {
            if (this.navContext.currentPosition > 0) {
                this.navContext.currentPosition--;
            } else {
                this.navContext.exit();
            }
        } else {
            const pos = this.expression.cursorPosition;
            if (pos > 0) {
                const prevEl = this.expression.elements[pos - 1];
                if (this._isNavigable(prevEl)) {
                    this.expression.moveCursor('left');
                    const sections = this.navContext.getSections(prevEl);
                    this.navContext.enter(prevEl, sections[sections.length - 1]);
                    const arr = this.navContext.getCurrentSectionArray();
                    this.navContext.currentPosition = arr ? arr.length : 0;
                } else {
                    this.expression.moveCursor('left');
                }
            }
        }
        this.render();
    }

    _arrowRight() {
        if (this.navContext.currentElement) {
            const arr = this.navContext.getCurrentSectionArray();
            const len = arr ? arr.length : 0;
            if (this.navContext.currentPosition < len) {
                this.navContext.currentPosition++;
            } else {
                this.navContext.exit();
                this.expression.moveCursor('right');
            }
        } else {
            const pos = this.expression.cursorPosition;
            if (pos < this.expression.elements.length) {
                const nextEl = this.expression.elements[pos];
                if (this._isNavigable(nextEl)) {
                    this.navContext.enter(nextEl, null);
                } else {
                    this.expression.moveCursor('right');
                }
            }
        }
        this.render();
    }

    _isNavigable(el) {
        return el && (
            el.type === 'fraction' || el.type === 'power' ||
            el.type === 'subscript' || el.type === 'sqrt' || el.type === 'parens'
        );
    }

    _handleDisplayClick(event) {
        const target = event.target;

        // Click on a cursor span → move main cursor
        if (target.classList.contains('cursor')) {
            const position = parseInt(target.dataset.position);
            if (!isNaN(position)) {
                this.navContext.clear();
                this.expression.cursorPosition = position;
                this.render();
            }
            return;
        }

        // Walk up from click target looking for a data-section attribute
        let node = target;
        while (node && node !== this.displayEl) {
            if (node.dataset && node.dataset.section) {
                const complexNode = node.closest('[data-element-index]');
                if (complexNode) {
                    const idx = parseInt(complexNode.getAttribute('data-element-index'));
                    const el  = this.expression.elements[idx];
                    if (el) {
                        this.navContext.clear();
                        this.expression.cursorPosition = idx + 1;
                        this.navContext.enter(el, node.dataset.section);
                        this.render();
                        return;
                    }
                }
            }
            node = node.parentElement;
        }
    }
}

// ─── Singleton bootstrap ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    window.mathTextPopup = new MathTextPopup();
    window.mathTextPopup.init();
});
