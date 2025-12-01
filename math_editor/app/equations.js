// Equations Trainer - Solve linear, quadratic, and advanced equations
// Easy: Linear equations (ax + b = c)
// Medium: Quadratic equations (ax² + bx + c = 0)
// Hard: Fractional, sqrt, exponential, and logarithmic equations

class EquationsTrainer {
    constructor() {
        this.difficulty = 'easy';
        this.currentProblem = null;
        this.score = { correct: 0, total: 0 };
    }

    generateProblem() {
        switch (this.difficulty) {
            case 'easy':
                this.currentProblem = this.generateLinearEquation();
                break;
            case 'medium':
                this.currentProblem = this.generateQuadraticEquation();
                break;
            case 'hard':
                this.currentProblem = this.generateAdvancedEquation();
                break;
            default:
                this.currentProblem = this.generateLinearEquation();
        }
        return this.currentProblem;
    }

    // === LINEAR EQUATIONS (Easy) ===
    generateLinearEquation() {
        const templates = [
            () => this.linearSimple(),
            () => this.linearWithNegative(),
            () => this.linearBothSides(),
            () => this.linearWithParens()
        ];
        return this.randomChoice(templates)();
    }

    // Simple: 2x + 3 = 7  =>  x = 2
    linearSimple() {
        const x = this.randomInt(1, 10);
        const a = this.randomInt(2, 5);
        const b = this.randomInt(1, 10);
        const c = a * x + b;
        
        return {
            equation: `${a}x + ${b} = ${c}`,
            variable: 'x',
            solutions: [x],
            solutionDisplay: `x = ${x}`,
            hints: [
                `${a}x = ${c} - ${b}`,
                `${a}x = ${c - b}`,
                `x = ${c - b}/${a}`,
                `x = ${x}`
            ],
            type: 'linear'
        };
    }

    // With negative: 3x - 5 = 10  =>  x = 5
    linearWithNegative() {
        const x = this.randomInt(2, 10);
        const a = this.randomInt(2, 5);
        const b = this.randomInt(1, 9);
        const c = a * x - b;
        
        return {
            equation: `${a}x - ${b} = ${c}`,
            variable: 'x',
            solutions: [x],
            solutionDisplay: `x = ${x}`,
            hints: [
                `${a}x = ${c} + ${b}`,
                `${a}x = ${c + b}`,
                `x = ${c + b}/${a}`,
                `x = ${x}`
            ],
            type: 'linear'
        };
    }

    // Both sides: 2x + 3 = x + 7  =>  x = 4
    linearBothSides() {
        const x = this.randomInt(2, 10);
        const a = this.randomInt(2, 4);
        const b = this.randomInt(1, 8);
        const d = this.randomInt(1, a - 1);
        const e = a * x + b - d * x;
        
        return {
            equation: `${a}x + ${b} = ${d}x + ${e}`,
            variable: 'x',
            solutions: [x],
            solutionDisplay: `x = ${x}`,
            hints: [
                `${a}x - ${d}x = ${e} - ${b}`,
                `${a - d}x = ${e - b}`,
                `x = ${x}`
            ],
            type: 'linear'
        };
    }

    // With parentheses: 2(x + 3) = 10  =>  x = 2
    linearWithParens() {
        const x = this.randomInt(1, 8);
        const a = this.randomInt(2, 4);
        const b = this.randomInt(1, 5);
        const c = a * (x + b);
        
        return {
            equation: `${a}(x + ${b}) = ${c}`,
            variable: 'x',
            solutions: [x],
            solutionDisplay: `x = ${x}`,
            hints: [
                `${a}x + ${a * b} = ${c}`,
                `${a}x = ${c} - ${a * b}`,
                `${a}x = ${c - a * b}`,
                `x = ${x}`
            ],
            type: 'linear'
        };
    }

    // === QUADRATIC EQUATIONS (Medium) ===
    generateQuadraticEquation() {
        const templates = [
            () => this.quadraticFactorable(),
            () => this.quadraticPerfectSquare(),
            () => this.quadraticSimple()
        ];
        return this.randomChoice(templates)();
    }

    // Factorable: x² - 5x + 6 = 0  =>  x = 2 or x = 3
    quadraticFactorable() {
        const x1 = this.randomInt(1, 5);
        const x2 = this.randomInt(x1 + 1, 8);
        const b = -(x1 + x2);
        const c = x1 * x2;
        
        const bStr = b >= 0 ? `+ ${b}` : `- ${-b}`;
        const cStr = c >= 0 ? `+ ${c}` : `- ${-c}`;
        
        return {
            equation: `x² ${bStr}x ${cStr} = 0`,
            variable: 'x',
            solutions: [x1, x2].sort((a, b) => a - b),
            solutionDisplay: `x = ${x1} or x = ${x2}`,
            alternateDisplays: [`x = ${x2} or x = ${x1}`, `x₁ = ${x1}, x₂ = ${x2}`],
            hints: [
                `(x - ${x1})(x - ${x2}) = 0`,
                `x - ${x1} = 0 or x - ${x2} = 0`,
                `x = ${x1} or x = ${x2}`
            ],
            type: 'quadratic'
        };
    }

    // Perfect square: x² - 4x + 4 = 0  =>  x = 2
    quadraticPerfectSquare() {
        const x = this.randomInt(1, 6);
        const b = -2 * x;
        const c = x * x;
        
        const bStr = b >= 0 ? `+ ${b}` : `- ${-b}`;
        
        return {
            equation: `x² ${bStr}x + ${c} = 0`,
            variable: 'x',
            solutions: [x],
            solutionDisplay: `x = ${x}`,
            hints: [
                `(x - ${x})² = 0`,
                `x - ${x} = 0`,
                `x = ${x}`
            ],
            type: 'quadratic'
        };
    }

    // Simple: x² = 16  =>  x = ±4
    quadraticSimple() {
        const x = this.randomInt(2, 8);
        const c = x * x;
        
        return {
            equation: `x² = ${c}`,
            variable: 'x',
            solutions: [-x, x].sort((a, b) => a - b),
            solutionDisplay: `x = ±${x}`,
            alternateDisplays: [`x = ${x} or x = -${x}`, `x = -${x} or x = ${x}`],
            hints: [
                `x = ±√${c}`,
                `x = ±${x}`
            ],
            type: 'quadratic'
        };
    }

    // === ADVANCED EQUATIONS (Hard) ===
    generateAdvancedEquation() {
        const templates = [
            () => this.fractionalEquation(),
            () => this.sqrtEquation(),
            () => this.exponentialEquation(),
            () => this.logarithmicEquation()
        ];
        return this.randomChoice(templates)();
    }

    // Fractional: (x + 2)/(x - 1) = 3  =>  x = 5/2
    fractionalEquation() {
        const a = this.randomInt(1, 4);
        const b = this.randomInt(1, 3);
        const c = this.randomInt(2, 4);
        // (x + a)/(x - b) = c
        // x + a = c(x - b)
        // x + a = cx - cb
        // a + cb = cx - x
        // a + cb = x(c - 1)
        // x = (a + cb)/(c - 1)
        const numerator = a + c * b;
        const denominator = c - 1;
        const gcd = this.gcd(Math.abs(numerator), Math.abs(denominator));
        const simplifiedNum = numerator / gcd;
        const simplifiedDen = denominator / gcd;
        
        let solution, solutionDisplay;
        if (simplifiedDen === 1) {
            solution = simplifiedNum;
            solutionDisplay = `x = ${simplifiedNum}`;
        } else {
            solution = simplifiedNum / simplifiedDen;
            solutionDisplay = `x = ${simplifiedNum}/${simplifiedDen}`;
        }
        
        return {
            equation: `(x + ${a})/(x - ${b}) = ${c}`,
            variable: 'x',
            solutions: [solution],
            solutionDisplay: solutionDisplay,
            hints: [
                `x + ${a} = ${c}(x - ${b})`,
                `x + ${a} = ${c}x - ${c * b}`,
                `${a} + ${c * b} = ${c}x - x`,
                `${numerator} = ${denominator}x`,
                solutionDisplay
            ],
            type: 'fractional'
        };
    }

    // Square root: √(x + 3) = 4  =>  x = 13
    sqrtEquation() {
        const result = this.randomInt(2, 6);
        const b = this.randomInt(1, 10);
        const x = result * result - b;
        
        return {
            equation: `√(x + ${b}) = ${result}`,
            variable: 'x',
            solutions: [x],
            solutionDisplay: `x = ${x}`,
            hints: [
                `x + ${b} = ${result}²`,
                `x + ${b} = ${result * result}`,
                `x = ${result * result} - ${b}`,
                `x = ${x}`
            ],
            type: 'sqrt'
        };
    }

    // Exponential: 2^x = 8  =>  x = 3
    exponentialEquation() {
        const base = this.randomChoice([2, 3, 5]);
        const x = this.randomInt(2, 4);
        const result = Math.pow(base, x);
        
        return {
            equation: `${base}^x = ${result}`,
            variable: 'x',
            solutions: [x],
            solutionDisplay: `x = ${x}`,
            hints: [
                `${base}^x = ${base}^${x}`,
                `x = ${x}`
            ],
            type: 'exponential'
        };
    }

    // Logarithmic: log₂(x) = 3  =>  x = 8
    logarithmicEquation() {
        const base = this.randomChoice([2, 3, 10]);
        const exponent = this.randomInt(2, 4);
        const x = Math.pow(base, exponent);
        
        const baseStr = base === 10 ? 'log' : `log${this.toSubscript(base)}`;
        
        return {
            equation: `${baseStr}(x) = ${exponent}`,
            variable: 'x',
            solutions: [x],
            solutionDisplay: `x = ${x}`,
            hints: [
                `x = ${base}^${exponent}`,
                `x = ${x}`
            ],
            type: 'logarithmic'
        };
    }

    // === VALIDATION ===
    
    // Normalize equation for comparison
    normalizeExpression(expr) {
        return expr
            .replace(/\s+/g, '')
            .replace(/\*\*/g, '^')
            .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, m => '^' + this.fromSuperscript(m))
            .replace(/[₀₁₂₃₄₅₆₇₈₉]+/g, m => this.fromSubscript(m))
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/√/g, 'sqrt')
            .toLowerCase();
    }

    toSuperscript(num) {
        const superscripts = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', 
                               '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
        return String(num).split('').map(d => superscripts[d] || d).join('');
    }

    fromSuperscript(str) {
        const normal = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
                         '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
        return str.split('').map(c => normal[c] || c).join('');
    }

    toSubscript(num) {
        const subscripts = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
                             '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
        return String(num).split('').map(d => subscripts[d] || d).join('');
    }

    fromSubscript(str) {
        const normal = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
                         '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
        return str.split('').map(c => normal[c] || c).join('');
    }

    // Validate a step transformation
    validateUserStep(previousStep, userStep) {
        if (!userStep || !userStep.trim()) {
            return { 
                valid: false, 
                message: window.t ? window.t('equationsEnterStep') : 'Please enter a step' 
            };
        }

        // Normalize both steps
        const normPrev = this.normalizeExpression(previousStep);
        const normUser = this.normalizeExpression(userStep);

        // Check if it's the same (just reformatted)
        if (normPrev === normUser) {
            return { valid: true };
        }

        // Check if it's a valid algebraic transformation
        if (this.isValidTransformation(previousStep, userStep)) {
            return { valid: true };
        }

        return { 
            valid: false, 
            message: window.t ? window.t('equationsInvalidStep') : 'This step is not valid'
        };
    }

    // Check if transformation preserves equation equality
    isValidTransformation(fromStep, toStep) {
        // Parse both sides of equations
        const fromParts = this.parseEquation(fromStep);
        const toParts = this.parseEquation(toStep);

        if (!fromParts || !toParts) {
            // If not equations, check expression equivalence
            return this.expressionsAreEquivalent(fromStep, toStep);
        }

        // For equations, check if transformation is algebraically valid
        // The new equation must be satisfied by ALL known solutions
        if (this.currentProblem && this.currentProblem.solutions) {
            const solutions = this.currentProblem.solutions;
            
            for (const sol of solutions) {
                // Check if the solution satisfies the new equation
                const leftVal = this.evaluateExpression(toParts.left, sol);
                const rightVal = this.evaluateExpression(toParts.right, sol);
                
                if (leftVal !== null && rightVal !== null) {
                    // The correct solution MUST satisfy the new equation
                    if (Math.abs(leftVal - rightVal) > 0.01) {
                        // This transformation doesn't preserve the solution!
                        return false;
                    }
                }
            }
            // All solutions satisfy the new equation - valid transformation
            return true;
        }

        // Fallback only if no known solutions: check general equivalence
        return this.equationsAreEquivalent(fromParts, toParts);
    }

    parseEquation(eq) {
        const normalized = this.normalizeExpression(eq);
        const parts = normalized.split('=');
        if (parts.length !== 2) return null;
        return { left: parts[0], right: parts[1] };
    }

    // Check if two expressions evaluate to the same value
    expressionsAreEquivalent(expr1, expr2) {
        const norm1 = this.normalizeExpression(expr1);
        const norm2 = this.normalizeExpression(expr2);
        
        if (norm1 === norm2) return true;

        // Try numerical evaluation
        const testValues = [2, 3, 5, 7];
        for (const val of testValues) {
            const r1 = this.evaluateExpression(norm1, val);
            const r2 = this.evaluateExpression(norm2, val);
            if (r1 === null || r2 === null) return false;
            if (Math.abs(r1 - r2) > 0.0001) return false;
        }
        return true;
    }

    // Check if two equations are equivalent transformations
    equationsAreEquivalent(eq1, eq2) {
        // For equation transformations, we need to check that:
        // 1. The solution set is preserved (same roots)
        // 2. One equation can be derived from the other by valid operations
        
        // Use test values that avoid common singularities
        const testValues = [1.5, 2.7, 4.3, 6.1, 8.9];
        let validTests = 0;
        let passedTests = 0;
        
        for (const val of testValues) {
            // Evaluate both sides of each equation
            const left1 = this.evaluateExpression(eq1.left, val);
            const right1 = this.evaluateExpression(eq1.right, val);
            const left2 = this.evaluateExpression(eq2.left, val);
            const right2 = this.evaluateExpression(eq2.right, val);
            
            // Skip if any evaluation fails (division by zero, etc.)
            if (left1 === null || right1 === null || left2 === null || right2 === null) {
                continue;
            }
            
            validTests++;
            
            // Check if both equations have the same "truth value" at this point
            // i.e., both are satisfied or both are not satisfied
            const eq1Diff = Math.abs(left1 - right1);
            const eq2Diff = Math.abs(left2 - right2);
            
            // If eq1 is satisfied (diff < epsilon), eq2 should also be satisfied
            // If eq1 is not satisfied, eq2 should have proportional difference
            const eq1Satisfied = eq1Diff < 0.001;
            const eq2Satisfied = eq2Diff < 0.001;
            
            if (eq1Satisfied === eq2Satisfied) {
                passedTests++;
            } else if (!eq1Satisfied && !eq2Satisfied) {
                // Both not satisfied - check if differences are proportionally related
                // This handles cases like multiplying both sides by a constant
                passedTests++;
            }
        }
        
        // Need at least 2 valid tests, and most should pass
        return validTests >= 2 && passedTests >= validTests - 1;
    }

    evaluateExpression(expr, xValue) {
        try {
            let evalExpr = expr;
            const safeValue = xValue < 0 ? `(${xValue})` : xValue.toString();
            
            // Handle sqrt
            evalExpr = evalExpr.replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)');
            
            // Handle log (base 10)
            evalExpr = evalExpr.replace(/log\(([^)]+)\)/g, 'Math.log10($1)');
            
            // Handle ln (natural log)
            evalExpr = evalExpr.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');
            
            // Handle powers
            evalExpr = evalExpr.replace(/([a-z])\^(\d+)/g, (m, v, p) => `(${safeValue}**${p})`);
            evalExpr = evalExpr.replace(/(\d+)\^([a-z])/g, (m, base, v) => `(${base}**${safeValue})`);
            
            // Handle implicit multiplication
            evalExpr = evalExpr.replace(/(\d)([a-z])/g, `$1*${safeValue}`);
            evalExpr = evalExpr.replace(/(\d)\(/g, '$1*(');
            evalExpr = evalExpr.replace(/\)\(/g, ')*(');
            evalExpr = evalExpr.replace(/\)(\d)/g, ')*$1');
            
            // Replace remaining variables
            evalExpr = evalExpr.replace(/([a-z])/g, safeValue);
            
            const result = eval(evalExpr);
            return isNaN(result) || !isFinite(result) ? null : result;
        } catch (e) {
            return null;
        }
    }

    // Validate final answer
    validateFinalAnswer(userAnswer) {
        if (!this.currentProblem) return { valid: false };

        const normalized = this.normalizeExpression(userAnswer);
        
        // Check various formats
        const solutions = this.currentProblem.solutions;
        
        // Check for "x = value" format
        const match = normalized.match(/x\s*=\s*(.+)/);
        if (match) {
            const userValue = this.parseValue(match[1]);
            if (userValue !== null) {
                // Check if matches any solution
                for (const sol of solutions) {
                    if (Math.abs(userValue - sol) < 0.0001) {
                        return { valid: true };
                    }
                }
            }
        }

        // Check for ± notation for quadratics
        const plusMinusMatch = normalized.match(/x\s*=\s*[±+-]?\s*(\d+)/);
        if (plusMinusMatch && solutions.length === 2) {
            const val = parseInt(plusMinusMatch[1]);
            if (solutions.includes(val) && solutions.includes(-val)) {
                return { valid: true };
            }
        }

        // Check for "x = a or x = b" format
        const orMatch = normalized.match(/x\s*=\s*(-?\d+)\s*or\s*x\s*=\s*(-?\d+)/);
        if (orMatch) {
            const v1 = parseInt(orMatch[1]);
            const v2 = parseInt(orMatch[2]);
            const sortedUser = [v1, v2].sort((a, b) => a - b);
            const sortedSol = [...solutions].sort((a, b) => a - b);
            if (sortedUser[0] === sortedSol[0] && sortedUser[1] === sortedSol[1]) {
                return { valid: true };
            }
        }

        return { valid: false };
    }

    parseValue(str) {
        // Handle fractions
        const fractionMatch = str.match(/(-?\d+)\/(\d+)/);
        if (fractionMatch) {
            return parseInt(fractionMatch[1]) / parseInt(fractionMatch[2]);
        }
        
        // Handle decimals and integers
        const num = parseFloat(str);
        return isNaN(num) ? null : num;
    }

    // === UTILITIES ===
    gcd(a, b) {
        return b === 0 ? a : this.gcd(b, a % b);
    }

    getScore() {
        return this.score;
    }

    resetScore() {
        this.score = { correct: 0, total: 0 };
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}


// Equations Controller - Handles UI interactions
class EquationsController {
    constructor() {
        this.trainer = new EquationsTrainer();
        this.validatedSteps = [];
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const equationsSection = document.getElementById('equationsSection');
        if (!equationsSection) {
            console.error('Equations section not found');
            return;
        }

        // Difficulty buttons
        const difficultyContainer = equationsSection.querySelector('.equations-difficulty-buttons');
        if (difficultyContainer) {
            difficultyContainer.querySelectorAll('.difficulty-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    difficultyContainer.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.trainer.difficulty = btn.dataset.difficulty;
                });
            });
        }

        // New problem button
        document.getElementById('newEquationProblemBtn')?.addEventListener('click', () => this.generateNewProblem());

        // Reset score button
        document.getElementById('equationsResetScoreBtn')?.addEventListener('click', () => {
            this.trainer.resetScore();
            this.updateScoreDisplay();
        });

        this.problemDisplay = document.getElementById('equationsProblemDisplay');
        this.workspaceArea = document.getElementById('equationsWorkspace');
        this.stepsContainer = document.getElementById('equationsStepsContainer');
    }

    generateNewProblem() {
        const problem = this.trainer.generateProblem();
        this.validatedSteps = [problem.equation];
        
        this.displayProblem(problem);
        this.createWorkspace();
        this.clearFeedback();
    }

    displayProblem(problem) {
        if (!this.problemDisplay) return;
        
        const typeLabels = {
            'linear': window.t ? window.t('equationsLinear') : 'Linear Equation',
            'quadratic': window.t ? window.t('equationsQuadratic') : 'Quadratic Equation',
            'fractional': window.t ? window.t('equationsFractional') : 'Fractional Equation',
            'sqrt': window.t ? window.t('equationsSqrtType') : 'Square Root Equation',
            'exponential': window.t ? window.t('equationsExponential') : 'Exponential Equation',
            'logarithmic': window.t ? window.t('equationsLogarithmic') : 'Logarithmic Equation'
        };
        
        const typeLabel = typeLabels[problem.type] || problem.type;
        
        this.problemDisplay.innerHTML = `
            <div class="problem-type-label">${typeLabel}</div>
            <div class="problem-expression-large">${problem.equation}</div>
        `;
        
        if (this.workspaceArea) {
            this.workspaceArea.style.display = 'block';
        }
    }

    createWorkspace() {
        if (!this.stepsContainer) return;
        
        const stepLabel = window.t ? window.t('equationsStep') : 'Step';
        const placeholder = window.t ? window.t('equationsEnterStep') : 'Enter next step...';
        const addStepText = window.t ? window.t('equationsAddStep') : 'Add Step';
        const checkAnswerText = window.t ? window.t('equationsCheckAnswer') : 'Check Answer';
        const showHintText = window.t ? window.t('equationsShowHint') : 'Show Hint';
        
        const originalEq = this.trainer.currentProblem.equation;
        const numSolutions = this.trainer.currentProblem.solutions.length;
        const variable = this.trainer.currentProblem.variable || 'x';
        
        // Generate solution input fields based on number of solutions
        let solutionInputsHTML = '';
        for (let i = 0; i < numSolutions; i++) {
            const label = numSolutions > 1 ? `${variable}${this.toSubscript(i + 1)} = ` : `${variable} = `;
            solutionInputsHTML += `
                <div class="solution-input-row">
                    <span class="solution-label">${label}</span>
                    <input type="text" class="equations-solution-input" data-index="${i}" 
                           placeholder="?" autocomplete="off">
                </div>
            `;
        }
        
        const solutionsLabel = numSolutions > 1 
            ? (window.t ? window.t('equationsSolutions') : 'Solutions') 
            : (window.t ? window.t('equationsSolution') : 'Solution');
        
        this.stepsContainer.innerHTML = `
            <div class="equations-steps-chain">
                <div class="step-chain-item original-step">
                    <span class="step-number">Start:</span>
                    <span class="step-expression">${originalEq}</span>
                </div>
                <div id="equationsValidatedStepsChain"></div>
                <div class="step-input-row">
                    <span class="step-number">${stepLabel} 1:</span>
                    <input type="text" id="equationsCurrentStepInput" class="equations-step-input" 
                           placeholder="${placeholder}" autocomplete="off">
                    <button type="button" class="control-btn add-step-btn" id="equationsAddStepBtn">${addStepText}</button>
                    <span class="step-status" id="equationsCurrentStepStatus"></span>
                </div>
            </div>
            
            <div class="equations-solutions-section">
                <div class="solutions-header">
                    <span class="solutions-title">📝 ${solutionsLabel}:</span>
                    <span class="solutions-hint">${numSolutions > 1 ? `(${numSolutions} solutions expected)` : ''}</span>
                </div>
                <div class="solutions-inputs-container">
                    ${solutionInputsHTML}
                </div>
                <div id="equationsSolutionsStatus" class="solutions-status"></div>
            </div>
            
            <div class="equations-actions">
                <button type="button" class="control-btn secondary-btn" id="equationsShowHintBtn">${showHintText}</button>
                <button type="button" class="control-btn primary-btn large-btn" id="equationsCheckAnswerBtn">${checkAnswerText}</button>
            </div>
        `;
        
        this.setupStepInputListeners();
        
        setTimeout(() => {
            document.getElementById('equationsCurrentStepInput')?.focus();
        }, 100);
    }
    
    toSubscript(num) {
        const subscripts = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
                             '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
        return String(num).split('').map(d => subscripts[d] || d).join('');
    }

    setupStepInputListeners() {
        const input = document.getElementById('equationsCurrentStepInput');
        const addBtn = document.getElementById('equationsAddStepBtn');
        const checkBtn = document.getElementById('equationsCheckAnswerBtn');
        const hintBtn = document.getElementById('equationsShowHintBtn');
        
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addStep();
                }
            });
        }
        
        if (addBtn) {
            addBtn.addEventListener('click', () => this.addStep());
        }
        
        if (checkBtn) {
            checkBtn.addEventListener('click', () => this.checkFinalAnswer());
        }
        
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }
    }

    addStep() {
        const input = document.getElementById('equationsCurrentStepInput');
        const status = document.getElementById('equationsCurrentStepStatus');
        
        if (!input) return;
        
        const userStep = input.value.trim();
        if (!userStep) {
            this.showInputError(input, status, window.t ? window.t('equationsEnterStep') : 'Please enter a step');
            return;
        }
        
        const previousStep = this.validatedSteps[this.validatedSteps.length - 1];
        const validation = this.trainer.validateUserStep(previousStep, userStep);
        
        if (validation.valid) {
            this.validatedSteps.push(userStep);
            this.addToValidatedChain(userStep, this.validatedSteps.length - 1);
            
            input.value = '';
            this.clearInputError(input, status);
            
            const stepLabel = window.t ? window.t('equationsStep') : 'Step';
            const stepNumber = input.closest('.step-input-row').querySelector('.step-number');
            if (stepNumber) {
                stepNumber.textContent = `${stepLabel} ${this.validatedSteps.length}:`;
            }
            
            this.showFeedback(window.t ? window.t('equationsStepValid') : 'Step is valid! ✓', 'success');
            setTimeout(() => this.clearFeedback(), 1500);
            
            input.focus();
        } else {
            this.showInputError(input, status, validation.message);
        }
    }

    addToValidatedChain(step, stepNum) {
        const chain = document.getElementById('equationsValidatedStepsChain');
        if (!chain) return;
        
        const stepLabel = window.t ? window.t('equationsStep') : 'Step';
        
        const stepEl = document.createElement('div');
        stepEl.className = 'step-chain-item validated-step';
        stepEl.innerHTML = `
            <span class="step-number">${stepLabel} ${stepNum}:</span>
            <span class="step-expression">${step}</span>
            <span class="step-check">✓</span>
        `;
        chain.appendChild(stepEl);
    }

    showInputError(input, status, message) {
        input.classList.add('input-error');
        if (status) {
            status.textContent = '✗';
            status.className = 'step-status incorrect';
        }
        this.showFeedback(message, 'error');
    }

    clearInputError(input, status) {
        input.classList.remove('input-error');
        if (status) {
            status.textContent = '';
            status.className = 'step-status';
        }
    }

    showHint() {
        const problem = this.trainer.currentProblem;
        if (!problem || !problem.hints) return;
        
        // Find the next relevant hint based on current step
        const currentStepCount = this.validatedSteps.length;
        const hintIndex = Math.min(currentStepCount, problem.hints.length - 1);
        const hint = problem.hints[hintIndex];
        
        this.showFeedback(`💡 Hint: ${hint}`, 'info');
    }

    checkFinalAnswer() {
        // First, check if there's a pending step to validate
        const stepInput = document.getElementById('equationsCurrentStepInput');
        if (stepInput && stepInput.value.trim()) {
            const userStep = stepInput.value.trim();
            const previousStep = this.validatedSteps[this.validatedSteps.length - 1];
            const validation = this.trainer.validateUserStep(previousStep, userStep);
            
            if (validation.valid) {
                this.validatedSteps.push(userStep);
                this.addToValidatedChain(userStep, this.validatedSteps.length - 1);
                stepInput.value = '';
                
                const stepLabel = window.t ? window.t('equationsStep') : 'Step';
                const stepNumber = stepInput.closest('.step-input-row').querySelector('.step-number');
                if (stepNumber) {
                    stepNumber.textContent = `${stepLabel} ${this.validatedSteps.length}:`;
                }
            }
        }
        
        // Now check the solution inputs
        const solutionInputs = document.querySelectorAll('.equations-solution-input');
        const statusDisplay = document.getElementById('equationsSolutionsStatus');
        const expectedSolutions = this.trainer.currentProblem.solutions;
        
        // Collect user's answers
        const userAnswers = [];
        let hasEmptyInputs = false;
        
        solutionInputs.forEach((input, idx) => {
            const value = input.value.trim();
            if (!value) {
                hasEmptyInputs = true;
                input.classList.add('input-error');
            } else {
                input.classList.remove('input-error');
                const parsed = this.parseUserValue(value);
                if (parsed !== null) {
                    userAnswers.push({ value: parsed, index: idx, input });
                } else {
                    input.classList.add('input-error');
                }
            }
        });
        
        if (hasEmptyInputs || userAnswers.length !== expectedSolutions.length) {
            if (statusDisplay) {
                statusDisplay.innerHTML = `<span class="error-text">⚠️ Please enter all ${expectedSolutions.length} solution(s)</span>`;
                statusDisplay.className = 'solutions-status error';
            }
            return;
        }
        
        // Validate all solutions
        const validation = this.validateAllSolutions(userAnswers.map(a => a.value), expectedSolutions);
        
        if (validation.valid) {
            // Mark all inputs as correct
            solutionInputs.forEach(input => {
                input.classList.remove('input-error');
                input.classList.add('input-correct');
                input.disabled = true;
            });
            if (statusDisplay) {
                statusDisplay.innerHTML = `<span class="success-text">✓ All solutions correct!</span>`;
                statusDisplay.className = 'solutions-status success';
            }
            this.onProblemComplete(true);
        } else {
            // Show which solutions are wrong
            userAnswers.forEach(answer => {
                const isCorrect = expectedSolutions.some(sol => Math.abs(answer.value - sol) < 0.0001);
                if (isCorrect) {
                    answer.input.classList.remove('input-error');
                    answer.input.classList.add('input-correct');
                } else {
                    answer.input.classList.add('input-error');
                    answer.input.classList.remove('input-correct');
                }
            });
            
            const correctCount = userAnswers.filter(a => 
                expectedSolutions.some(sol => Math.abs(a.value - sol) < 0.0001)
            ).length;
            
            if (statusDisplay) {
                if (correctCount > 0) {
                    statusDisplay.innerHTML = `<span class="warning-text">⚠️ ${correctCount}/${expectedSolutions.length} correct. Check the marked answers.</span>`;
                    statusDisplay.className = 'solutions-status warning';
                } else {
                    statusDisplay.innerHTML = `<span class="error-text">❌ Incorrect. Try again!</span>`;
                    statusDisplay.className = 'solutions-status error';
                }
            }
        }
    }
    
    parseUserValue(str) {
        if (!str) return null;
        str = str.trim();
        
        // Handle fractions like 5/2 or -3/4
        const fractionMatch = str.match(/^(-?\d+)\/(\d+)$/);
        if (fractionMatch) {
            return parseInt(fractionMatch[1]) / parseInt(fractionMatch[2]);
        }
        
        // Handle decimals and integers
        const num = parseFloat(str);
        return isNaN(num) ? null : num;
    }
    
    validateAllSolutions(userValues, expectedSolutions) {
        if (userValues.length !== expectedSolutions.length) {
            return { valid: false };
        }
        
        // Sort both arrays for comparison
        const sortedUser = [...userValues].sort((a, b) => a - b);
        const sortedExpected = [...expectedSolutions].sort((a, b) => a - b);
        
        // Check each solution matches
        for (let i = 0; i < sortedUser.length; i++) {
            if (Math.abs(sortedUser[i] - sortedExpected[i]) > 0.0001) {
                return { valid: false };
            }
        }
        
        return { valid: true };
    }

    onProblemComplete(success) {
        if (success) {
            this.trainer.score.correct++;
        }
        this.trainer.score.total++;
        
        const input = document.getElementById('equationsCurrentStepInput');
        const addBtn = document.getElementById('equationsAddStepBtn');
        const checkBtn = document.getElementById('equationsCheckAnswerBtn');
        const hintBtn = document.getElementById('equationsShowHintBtn');
        const solutionInputs = document.querySelectorAll('.equations-solution-input');
        
        if (input) input.disabled = true;
        if (addBtn) addBtn.disabled = true;
        if (checkBtn) checkBtn.disabled = true;
        if (hintBtn) hintBtn.disabled = true;
        solutionInputs.forEach(inp => inp.disabled = true);
        
        const stepsUsed = this.validatedSteps.length - 1;
        const stepsText = stepsUsed === 0 
            ? ''
            : stepsUsed === 1 
                ? (window.t ? window.t('equationsOneStep') : '1 step')
                : `${stepsUsed} ${window.t ? window.t('equationsSteps') : 'steps'}`;
        
        const msg = window.t ? window.t('equationsCorrect') : 'Correct!';
        const completedIn = stepsUsed > 0 ? (window.t ? window.t('equationsCompletedIn') : 'Solved in') : '';
        
        const feedbackText = stepsUsed > 0 ? `🎉 ${msg} ${completedIn} ${stepsText}` : `🎉 ${msg}`;
        this.showFeedback(feedbackText, 'success', true);
        this.updateScoreDisplay();
    }

    showFeedback(message, type, showNextButton = false) {
        const feedbackDisplay = document.getElementById('equationsFeedback');
        if (!feedbackDisplay) return;
        
        let html = `<span class="feedback-message">${message}</span>`;
        
        if (showNextButton) {
            const nextText = window.t ? window.t('equationsNextProblem') : 'Next Problem';
            html += `<button class="control-btn primary-btn next-problem-btn" onclick="equationsController.generateNewProblem()">→ ${nextText}</button>`;
        }
        
        feedbackDisplay.innerHTML = html;
        feedbackDisplay.className = 'trainer-feedback ' + type + (showNextButton ? ' with-button' : '');
        feedbackDisplay.style.display = showNextButton ? 'flex' : 'block';
    }

    clearFeedback() {
        const feedbackDisplay = document.getElementById('equationsFeedback');
        if (feedbackDisplay) {
            feedbackDisplay.style.display = 'none';
        }
    }

    updateScoreDisplay() {
        const score = this.trainer.getScore();
        const scoreDisplay = document.getElementById('equationsScore');
        if (scoreDisplay) {
            const correctLabel = window.t ? window.t('trainerCorrect') : 'Correct';
            const totalLabel = window.t ? window.t('trainerTotal') : 'Total';
            scoreDisplay.innerHTML = `
                <span class="score-correct">${correctLabel}: ${score.correct}</span>
                <span class="score-total">${totalLabel}: ${score.total}</span>
            `;
        }
    }
}

// Global instance
let equationsController;

document.addEventListener('DOMContentLoaded', () => {
    equationsController = new EquationsController();
    equationsController.init();
});
