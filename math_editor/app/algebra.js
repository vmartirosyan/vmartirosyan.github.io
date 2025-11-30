// Algebra Trainer - Expression simplification with step-by-step validation
class AlgebraTrainer {
    constructor() {
        this.currentProblem = null;
        this.difficulty = 'easy';
        this.problemType = 'simplify';
        this.score = { correct: 0, total: 0 };
    }

    generateProblem() {
        const problem = this.createProblem();
        this.currentProblem = problem;
        return problem;
    }

    createProblem() {
        switch (this.problemType) {
            case 'simplify':
                return this.createSimplifyProblem();
            case 'expand':
                return this.createExpandProblem();
            case 'factor':
                return this.createFactorProblem();
            default:
                return this.createSimplifyProblem();
        }
    }

    // === SIMPLIFICATION PROBLEMS ===
    createSimplifyProblem() {
        switch (this.difficulty) {
            case 'easy': return this.createEasySimplify();
            case 'medium': return this.createMediumSimplify();
            case 'hard': return this.createHardSimplify();
            default: return this.createEasySimplify();
        }
    }

    createEasySimplify() {
        const templates = [
            () => this.combineSimpleLikeTerms(),
            () => this.combineCoefficients(),
            () => this.simplePowerAddition(),
        ];
        return this.randomChoice(templates)();
    }

    createMediumSimplify() {
        const templates = [
            () => this.combineTwoVariables(),
            () => this.multiplyPowers(),
            () => this.combineWithSubtraction(),
            () => this.simplifyWithCoefficients(),
        ];
        return this.randomChoice(templates)();
    }

    createHardSimplify() {
        const templates = [
            () => this.combineMultiplePowers(),
            () => this.multiplyPolynomialTerms(),
            () => this.divideWithPowers(),
            () => this.complexCombination(),
        ];
        return this.randomChoice(templates)();
    }

    // Easy: 3x + 5x = 8x
    combineSimpleLikeTerms() {
        const a = this.randomInt(2, 9);
        const b = this.randomInt(2, 9);
        const variable = this.randomChoice(['x', 'y', 'a', 'n']);
        
        return {
            expression: `${a}${variable} + ${b}${variable}`,
            type: 'simplify',
            expectedSteps: [
                { expression: `${a + b}${variable}` }
            ],
            finalAnswer: `${a + b}${variable}`,
            numSteps: 1
        };
    }

    // Easy: 2x + 3 + 4x = 6x + 3
    combineCoefficients() {
        const a = this.randomInt(2, 6);
        const b = this.randomInt(2, 9);
        const c = this.randomInt(2, 6);
        const variable = this.randomChoice(['x', 'y', 'a']);
        
        return {
            expression: `${a}${variable} + ${b} + ${c}${variable}`,
            type: 'simplify',
            expectedSteps: [
                { expression: `${a + c}${variable} + ${b}` }
            ],
            finalAnswer: `${a + c}${variable} + ${b}`,
            numSteps: 1
        };
    }

    // Easy: x² + 3x² = 4x²
    simplePowerAddition() {
        const a = this.randomInt(1, 5);
        const b = this.randomInt(2, 6);
        const variable = this.randomChoice(['x', 'y', 'a']);
        const aDisplay = a === 1 ? '' : a;
        
        return {
            expression: `${aDisplay}${variable}² + ${b}${variable}²`,
            type: 'simplify',
            expectedSteps: [
                { expression: `${a + b}${variable}²` }
            ],
            finalAnswer: `${a + b}${variable}²`,
            numSteps: 1
        };
    }

    // Medium: 2x + 3y + 4x + y = 6x + 4y
    combineTwoVariables() {
        const a = this.randomInt(2, 5);
        const b = this.randomInt(2, 5);
        const c = this.randomInt(2, 5);
        const d = this.randomInt(1, 4);
        const dDisplay = d === 1 ? '' : d;
        
        return {
            expression: `${a}x + ${b}y + ${c}x + ${dDisplay}y`,
            type: 'simplify',
            expectedSteps: [
                { expression: `${a + c}x + ${b + d}y` }
            ],
            finalAnswer: `${a + c}x + ${b + d}y`,
            numSteps: 1
        };
    }

    // Medium: x² * x³ = x⁵
    multiplyPowers() {
        const exp1 = this.randomInt(2, 4);
        const exp2 = this.randomInt(2, 4);
        const variable = this.randomChoice(['x', 'y', 'a']);
        const sum = exp1 + exp2;
        
        return {
            expression: `${variable}${this.toSuperscript(exp1)} * ${variable}${this.toSuperscript(exp2)}`,
            type: 'simplify',
            expectedSteps: [
                { expression: `${variable}${this.toSuperscript(sum)}` }
            ],
            finalAnswer: `${variable}${this.toSuperscript(sum)}`,
            numSteps: 1
        };
    }

    // Medium: 5x - 2x + 3 = 3x + 3
    combineWithSubtraction() {
        const a = this.randomInt(5, 10);
        const b = this.randomInt(2, a - 1);
        const c = this.randomInt(2, 9);
        const variable = this.randomChoice(['x', 'y', 'a']);
        
        return {
            expression: `${a}${variable} - ${b}${variable} + ${c}`,
            type: 'simplify',
            expectedSteps: [
                { expression: `${a - b}${variable} + ${c}` }
            ],
            finalAnswer: `${a - b}${variable} + ${c}`,
            numSteps: 1
        };
    }

    // Medium: 3x² + 2x + 5x² = 8x² + 2x
    simplifyWithCoefficients() {
        const a = this.randomInt(2, 5);
        const b = this.randomInt(2, 5);
        const c = this.randomInt(2, 5);
        const variable = this.randomChoice(['x', 'y']);
        
        return {
            expression: `${a}${variable}² + ${b}${variable} + ${c}${variable}²`,
            type: 'simplify',
            expectedSteps: [
                { expression: `${a + c}${variable}² + ${b}${variable}` }
            ],
            finalAnswer: `${a + c}${variable}² + ${b}${variable}`,
            numSteps: 1
        };
    }

    // Hard: 2x³ + 3x² + x³ - x² = 3x³ + 2x²
    combineMultiplePowers() {
        const a = this.randomInt(2, 4);
        const b = this.randomInt(2, 4);
        const c = this.randomInt(1, 3);
        const d = this.randomInt(1, b - 1);
        const variable = this.randomChoice(['x', 'y']);
        const cDisplay = c === 1 ? '' : c;
        const dDisplay = d === 1 ? '' : d;
        
        return {
            expression: `${a}${variable}³ + ${b}${variable}² + ${cDisplay}${variable}³ - ${dDisplay}${variable}²`,
            type: 'simplify',
            expectedSteps: [
                { expression: `${a + c}${variable}³ + ${b - d}${variable}²` }
            ],
            finalAnswer: `${a + c}${variable}³ + ${b - d}${variable}²`,
            numSteps: 1
        };
    }

    // Hard: 2x² * 3x³ = 6x⁵
    multiplyPolynomialTerms() {
        const a = this.randomInt(2, 4);
        const b = this.randomInt(2, 4);
        const exp1 = this.randomInt(2, 3);
        const exp2 = this.randomInt(2, 3);
        const variable = this.randomChoice(['x', 'y']);
        
        return {
            expression: `${a}${variable}${this.toSuperscript(exp1)} * ${b}${variable}${this.toSuperscript(exp2)}`,
            type: 'simplify',
            expectedSteps: [
                { expression: `${a * b}${variable}${this.toSuperscript(exp1 + exp2)}` }
            ],
            finalAnswer: `${a * b}${variable}${this.toSuperscript(exp1 + exp2)}`,
            numSteps: 1
        };
    }

    // Hard: x⁵ ÷ x² = x³
    divideWithPowers() {
        const exp2 = this.randomInt(2, 3);
        const exp1 = exp2 + this.randomInt(2, 4);
        const variable = this.randomChoice(['x', 'y', 'a']);
        
        return {
            expression: `${variable}${this.toSuperscript(exp1)} : ${variable}${this.toSuperscript(exp2)}`,
            type: 'simplify',
            expectedSteps: [
                { expression: `${variable}${this.toSuperscript(exp1 - exp2)}` }
            ],
            finalAnswer: `${variable}${this.toSuperscript(exp1 - exp2)}`,
            numSteps: 1
        };
    }

    // Hard: 2x²y + 3xy² + x²y = 3x²y + 3xy²
    complexCombination() {
        const a = this.randomInt(2, 4);
        const b = this.randomInt(2, 4);
        const c = this.randomInt(1, 3);
        const cDisplay = c === 1 ? '' : c;
        
        return {
            expression: `${a}x²y + ${b}xy² + ${cDisplay}x²y`,
            type: 'simplify',
            expectedSteps: [
                { expression: `${a + c}x²y + ${b}xy²` }
            ],
            finalAnswer: `${a + c}x²y + ${b}xy²`,
            numSteps: 1
        };
    }

    // === EXPANSION PROBLEMS ===
    createExpandProblem() {
        switch (this.difficulty) {
            case 'easy': return this.createEasyExpand();
            case 'medium': return this.createMediumExpand();
            case 'hard': return this.createHardExpand();
            default: return this.createEasyExpand();
        }
    }

    createEasyExpand() {
        const templates = [
            () => this.simpleDistribution(),
            () => this.distributionWithConstant(),
        ];
        return this.randomChoice(templates)();
    }

    createMediumExpand() {
        const templates = [
            () => this.distributionTwoTerms(),
            () => this.binomialSquareSimple(),
        ];
        return this.randomChoice(templates)();
    }

    createHardExpand() {
        const templates = [
            () => this.binomialProduct(),
            () => this.trinomialDistribution(),
        ];
        return this.randomChoice(templates)();
    }

    // Easy: 2(x + 3) = 2x + 6
    simpleDistribution() {
        const a = this.randomInt(2, 5);
        const b = this.randomInt(2, 9);
        const variable = this.randomChoice(['x', 'y', 'a']);
        
        return {
            expression: `${a}(${variable} + ${b})`,
            type: 'expand',
            expectedSteps: [
                { expression: `${a}${variable} + ${a * b}` }
            ],
            finalAnswer: `${a}${variable} + ${a * b}`,
            numSteps: 1
        };
    }

    // Easy: 3(2x - 1) = 6x - 3
    distributionWithConstant() {
        const a = this.randomInt(2, 4);
        const b = this.randomInt(2, 4);
        const c = this.randomInt(1, 5);
        const variable = this.randomChoice(['x', 'y']);
        
        return {
            expression: `${a}(${b}${variable} - ${c})`,
            type: 'expand',
            expectedSteps: [
                { expression: `${a * b}${variable} - ${a * c}` }
            ],
            finalAnswer: `${a * b}${variable} - ${a * c}`,
            numSteps: 1
        };
    }

    // Medium: x(x + 3) = x² + 3x
    distributionTwoTerms() {
        const a = this.randomInt(2, 5);
        const variable = this.randomChoice(['x', 'y']);
        
        return {
            expression: `${variable}(${variable} + ${a})`,
            type: 'expand',
            expectedSteps: [
                { expression: `${variable}² + ${a}${variable}` }
            ],
            finalAnswer: `${variable}² + ${a}${variable}`,
            numSteps: 1
        };
    }

    // Medium: (x + 2)² = x² + 4x + 4
    binomialSquareSimple() {
        const a = this.randomInt(2, 4);
        const variable = 'x';
        
        return {
            expression: `(${variable} + ${a})²`,
            type: 'expand',
            expectedSteps: [
                { expression: `${variable}² + ${2 * a}${variable} + ${a * a}` }
            ],
            finalAnswer: `${variable}² + ${2 * a}${variable} + ${a * a}`,
            numSteps: 1
        };
    }

    // Hard: (x + 2)(x + 3) = x² + 5x + 6
    binomialProduct() {
        const a = this.randomInt(2, 5);
        const b = this.randomInt(2, 5);
        const variable = 'x';
        
        return {
            expression: `(${variable} + ${a})(${variable} + ${b})`,
            type: 'expand',
            expectedSteps: [
                { expression: `${variable}² + ${a + b}${variable} + ${a * b}` }
            ],
            finalAnswer: `${variable}² + ${a + b}${variable} + ${a * b}`,
            numSteps: 1
        };
    }

    // Hard: 2x(x² + 3x - 1) = 2x³ + 6x² - 2x
    trinomialDistribution() {
        const a = this.randomInt(2, 3);
        const b = this.randomInt(2, 4);
        const c = this.randomInt(1, 3);
        const variable = 'x';
        
        return {
            expression: `${a}${variable}(${variable}² + ${b}${variable} - ${c})`,
            type: 'expand',
            expectedSteps: [
                { expression: `${a}${variable}³ + ${a * b}${variable}² - ${a * c}${variable}` }
            ],
            finalAnswer: `${a}${variable}³ + ${a * b}${variable}² - ${a * c}${variable}`,
            numSteps: 1
        };
    }

    // === FACTORING PROBLEMS ===
    createFactorProblem() {
        switch (this.difficulty) {
            case 'easy': return this.createEasyFactor();
            case 'medium': return this.createMediumFactor();
            case 'hard': return this.createHardFactor();
            default: return this.createEasyFactor();
        }
    }

    createEasyFactor() {
        const templates = [
            () => this.factorCommonFactor(),
            () => this.factorSimpleGCF(),
        ];
        return this.randomChoice(templates)();
    }

    createMediumFactor() {
        const templates = [
            () => this.factorWithVariable(),
            () => this.factorTwoTermsGCF(),
        ];
        return this.randomChoice(templates)();
    }

    createHardFactor() {
        const templates = [
            () => this.factorTrinomial(),
            () => this.factorDifferenceOfSquares(),
        ];
        return this.randomChoice(templates)();
    }

    // Easy: 6x + 9 = 3(2x + 3)
    factorCommonFactor() {
        const gcf = this.randomInt(2, 5);
        const a = this.randomInt(2, 4);
        const b = this.randomInt(2, 4);
        const variable = this.randomChoice(['x', 'y']);
        
        return {
            expression: `${gcf * a}${variable} + ${gcf * b}`,
            type: 'factor',
            expectedSteps: [
                { expression: `${gcf}(${a}${variable} + ${b})` }
            ],
            finalAnswer: `${gcf}(${a}${variable} + ${b})`,
            numSteps: 1
        };
    }

    // Easy: 4x - 8 = 4(x - 2)
    factorSimpleGCF() {
        const gcf = this.randomInt(2, 5);
        const b = this.randomInt(2, 5);
        const variable = this.randomChoice(['x', 'y']);
        
        return {
            expression: `${gcf}${variable} - ${gcf * b}`,
            type: 'factor',
            expectedSteps: [
                { expression: `${gcf}(${variable} - ${b})` }
            ],
            finalAnswer: `${gcf}(${variable} - ${b})`,
            numSteps: 1
        };
    }

    // Medium: x² + 3x = x(x + 3)
    factorWithVariable() {
        const a = this.randomInt(2, 6);
        const variable = this.randomChoice(['x', 'y']);
        
        return {
            expression: `${variable}² + ${a}${variable}`,
            type: 'factor',
            expectedSteps: [
                { expression: `${variable}(${variable} + ${a})` }
            ],
            finalAnswer: `${variable}(${variable} + ${a})`,
            numSteps: 1
        };
    }

    // Medium: 6x² + 9x = 3x(2x + 3)
    factorTwoTermsGCF() {
        const gcf = this.randomInt(2, 4);
        const a = this.randomInt(2, 3);
        const b = this.randomInt(2, 4);
        const variable = 'x';
        
        return {
            expression: `${gcf * a}${variable}² + ${gcf * b}${variable}`,
            type: 'factor',
            expectedSteps: [
                { expression: `${gcf}${variable}(${a}${variable} + ${b})` }
            ],
            finalAnswer: `${gcf}${variable}(${a}${variable} + ${b})`,
            numSteps: 1
        };
    }

    // Hard: x² + 5x + 6 = (x + 2)(x + 3)
    factorTrinomial() {
        const a = this.randomInt(2, 4);
        const b = this.randomInt(2, 4);
        const variable = 'x';
        
        return {
            expression: `${variable}² + ${a + b}${variable} + ${a * b}`,
            type: 'factor',
            expectedSteps: [
                { expression: `(${variable} + ${a})(${variable} + ${b})` }
            ],
            finalAnswer: `(${variable} + ${a})(${variable} + ${b})`,
            // Also accept (x + b)(x + a)
            alternateAnswers: [`(${variable} + ${b})(${variable} + ${a})`],
            numSteps: 1
        };
    }

    // Hard: x² - 9 = (x + 3)(x - 3)
    factorDifferenceOfSquares() {
        const a = this.randomInt(2, 5);
        const variable = 'x';
        
        return {
            expression: `${variable}² - ${a * a}`,
            type: 'factor',
            expectedSteps: [
                { expression: `(${variable} + ${a})(${variable} - ${a})` }
            ],
            finalAnswer: `(${variable} + ${a})(${variable} - ${a})`,
            alternateAnswers: [`(${variable} - ${a})(${variable} + ${a})`],
            numSteps: 1
        };
    }

    // === UTILITIES ===
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

    // Normalize algebraic expression for comparison
    normalizeExpression(expr) {
        return expr
            .replace(/\s+/g, '')           // remove spaces
            .replace(/\*\*/g, '^')          // ** to ^
            .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, m => '^' + this.fromSuperscript(m))  // superscript to ^n
            .replace(/×/g, '*')             // × to *
            .replace(/÷/g, '/')             // ÷ to /
            .replace(/:/g, '/')             // : to /
            .replace(/−/g, '-')             // − to -
            .toLowerCase();
    }

    // Parse expression into terms with coefficients and variables
    parseTerms(expr) {
        const normalized = this.normalizeExpression(expr);
        const terms = [];
        let current = '';
        let sign = 1;
        let depth = 0;
        
        for (let i = 0; i <= normalized.length; i++) {
            const c = normalized[i] || '';
            
            if (c === '(') depth++;
            if (c === ')') depth--;
            
            if (depth === 0 && (c === '+' || c === '-' || c === '')) {
                if (current) {
                    terms.push({ sign, term: current });
                }
                sign = (c === '-') ? -1 : 1;
                current = '';
            } else {
                current += c;
            }
        }
        
        return terms;
    }

    // Get the variables used in an expression
    getVariables(expr) {
        const normalized = this.normalizeExpression(expr);
        const vars = new Set();
        const matches = normalized.match(/[a-z]/g);
        if (matches) {
            matches.forEach(v => vars.add(v));
        }
        return Array.from(vars).sort();
    }

    // Evaluate expression with a test value for variables
    evaluateWithTestValue(expr, testValue = 2) {
        let evalExpr = expr;
        // Wrap negative values in parentheses to avoid precedence issues with **
        const safeValue = testValue < 0 ? `(${testValue})` : testValue.toString();
        
        try {
            // Expression should already be normalized when passed here
            
            // First handle implicit multiplication between parentheses: )( -> )*(
            evalExpr = evalExpr.replace(/\)\(/g, ')*(');
            
            // Replace power notation: x^2 -> (testValue**2)
            // Using ** operator instead of Math.pow to avoid regex issues with "Math"
            evalExpr = evalExpr.replace(/([a-z])\^(\d+)/g, (m, v, p) => `(${safeValue}**${p})`);
            
            // Handle division for expressions like x^6/x^2
            // After power replacement, we might have (2**6)/(2**2)
            
            // Replace coefficient*variable: 5x -> 5*testValue (but not inside **)
            evalExpr = evalExpr.replace(/(\d)([a-z])/g, `$1*${safeValue}`);
            
            // Replace variable*variable: xy -> testValue*testValue
            evalExpr = evalExpr.replace(/([a-z])([a-z])/g, `${safeValue}*${safeValue}`);
            
            // Handle implicit multiplication: 2(x) -> 2*(x) and (x)2 -> (x)*2
            evalExpr = evalExpr.replace(/(\d)\(/g, '$1*(');
            evalExpr = evalExpr.replace(/\)(\d)/g, ')*$1');
            evalExpr = evalExpr.replace(/\)\(/g, ')*(');
            
            // Now replace remaining variables with the test value
            evalExpr = evalExpr.replace(/([a-z])/g, safeValue);
            
            const result = eval(evalExpr);
            return isNaN(result) ? null : result;
        } catch (e) {
            console.error('Eval error:', e, 'for expression:', expr, 'evalExpr:', evalExpr);
            return null;
        }
    }

    // Check if two expressions are algebraically equivalent
    expressionsAreEquivalent(expr1, expr2) {
        // Normalize both expressions first
        const norm1 = this.normalizeExpression(expr1);
        const norm2 = this.normalizeExpression(expr2);
        
        console.log('Comparing:', expr1, 'vs', expr2);
        console.log('Normalized:', norm1, 'vs', norm2);
        
        if (norm1 === norm2) {
            console.log('String match!');
            return true;
        }
        
        // Check that both expressions use the same variables
        const vars1 = this.getVariables(expr1);
        const vars2 = this.getVariables(expr2);
        if (vars1.join(',') !== vars2.join(',')) {
            console.log('Variable mismatch:', vars1, 'vs', vars2);
            return false;
        }
        
        // Check with term reordering
        if (this.areTermsEquivalent(norm1, norm2)) {
            console.log('Term equivalent match!');
            return true;
        }
        
        // Numerical evaluation with multiple test values - use NORMALIZED expressions
        const testValues = [2, 3, 5, -1, 7];
        let allMatch = true;
        
        for (const val of testValues) {
            const result1 = this.evaluateWithTestValue(norm1, val);
            const result2 = this.evaluateWithTestValue(norm2, val);
            
            console.log(`Test value ${val}: ${result1} vs ${result2}`);
            
            if (result1 === null || result2 === null) {
                // Can't evaluate, fall back to string comparison
                console.log('Eval returned null');
                return false;
            }
            
            if (Math.abs(result1 - result2) > 0.0001) {
                allMatch = false;
                break;
            }
        }
        
        console.log('Numerical match:', allMatch);
        return allMatch;
    }

    // Check if terms are equivalent when reordered (for addition only)
    areTermsEquivalent(expr1, expr2) {
        const getTerms = (expr) => {
            const terms = [];
            let current = '';
            let sign = '+';
            let depth = 0;
            
            for (let i = 0; i < expr.length; i++) {
                const c = expr[i];
                if (c === '(') depth++;
                if (c === ')') depth--;
                
                if (depth === 0 && (c === '+' || c === '-') && i > 0 && expr[i-1] !== '^' && expr[i-1] !== '(') {
                    if (current) {
                        terms.push(sign + current);
                    }
                    sign = c;
                    current = '';
                } else {
                    current += c;
                }
            }
            if (current) {
                terms.push(sign + current);
            }
            return terms.map(t => t.replace(/^\+/, '')).sort();
        };
        
        const terms1 = getTerms(expr1);
        const terms2 = getTerms(expr2);
        
        if (terms1.length !== terms2.length) return false;
        
        return terms1.every((t, i) => t === terms2[i]);
    }

    // Validate a transformation step
    validateTransformation(fromExpr, toExpr) {
        // Check if the expressions are algebraically equivalent
        if (!this.expressionsAreEquivalent(fromExpr, toExpr)) {
            return { valid: false, error: 'not-equivalent' };
        }
        
        return { valid: true };
    }

    // Validate a user's step (wrapper for controller)
    validateUserStep(previousExpr, userExpr) {
        if (!userExpr || !userExpr.trim()) {
            return { 
                valid: false, 
                message: window.t ? window.t('algebraEnterExpression') : 'Please enter an expression' 
            };
        }
        
        const validation = this.validateTransformation(previousExpr, userExpr);
        
        if (!validation.valid) {
            return { 
                valid: false, 
                message: window.t ? window.t('algebraNotEquivalent') : 'The expression is not equivalent to the previous step'
            };
        }
        
        return { valid: true };
    }

    // Validate if user reached the final answer
    validateFinalAnswer(expr) {
        if (this.isFinalAnswer(expr)) {
            return { valid: true };
        }
        return { valid: false };
    }

    // Check if expression matches the final answer
    isFinalAnswer(expr) {
        if (!this.currentProblem) {
            console.log('No current problem');
            return false;
        }
        
        const alternates = this.currentProblem.alternateAnswers || [];
        const allAnswers = [this.currentProblem.finalAnswer, ...alternates];
        
        console.log('Checking if final answer:', expr);
        console.log('Expected answers:', allAnswers);
        console.log('Normalized user:', this.normalizeExpression(expr));
        console.log('Normalized expected:', this.normalizeExpression(this.currentProblem.finalAnswer));
        
        for (const answer of allAnswers) {
            if (this.expressionsAreEquivalent(expr, answer)) {
                console.log('Match found with:', answer);
                return true;
            }
        }
        
        console.log('No match found');
        return false;
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


// Algebra Controller - Handles UI interactions with dynamic multi-step validation
class AlgebraController {
    constructor() {
        this.trainer = new AlgebraTrainer();
        this.stepRows = [];
        this.validatedSteps = []; // Stores the expression at each validated step
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Get the algebra section container
        const algebraSection = document.getElementById('algebraSection');
        if (!algebraSection) {
            console.error('Algebra section not found');
            return;
        }

        // Difficulty buttons (scoped to algebra section)
        const difficultyContainer = algebraSection.querySelector('.algebra-difficulty-buttons');
        if (difficultyContainer) {
            difficultyContainer.querySelectorAll('.difficulty-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    difficultyContainer.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.trainer.difficulty = btn.dataset.difficulty;
                });
            });
        }

        // Problem type buttons
        algebraSection.querySelectorAll('.algebra-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                algebraSection.querySelectorAll('.algebra-type-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.trainer.problemType = btn.dataset.type;
            });
        });

        // New problem button
        document.getElementById('newAlgebraProblemBtn')?.addEventListener('click', () => this.generateNewProblem());

        // Reset score button
        document.getElementById('algebraResetScoreBtn')?.addEventListener('click', () => {
            this.trainer.resetScore();
            this.updateScoreDisplay();
        });

        this.problemDisplay = document.getElementById('algebraProblemDisplay');
        this.workspaceArea = document.getElementById('algebraWorkspace');
        this.stepsContainer = document.getElementById('algebraStepsContainer');
        this.feedbackDisplay = document.getElementById('algebraFeedback');
    }

    generateNewProblem() {
        const problem = this.trainer.generateProblem();
        this.stepRows = [];
        this.validatedSteps = [problem.expression]; // Start with original expression
        
        this.displayProblem(problem);
        this.createWorkspace();
        this.clearFeedback();
    }

    displayProblem(problem) {
        if (!this.problemDisplay) return;
        
        const typeLabel = this.getTypeLabel(problem.type);
        
        this.problemDisplay.innerHTML = `
            <div class="problem-type-label">${typeLabel}</div>
            <div class="problem-expression-large">${problem.expression}</div>
        `;
        
        if (this.workspaceArea) {
            this.workspaceArea.style.display = 'block';
        }
    }

    getTypeLabel(type) {
        const labels = {
            'simplify': window.t ? window.t('algebraSimplify') : 'Simplify',
            'expand': window.t ? window.t('algebraExpand') : 'Expand',
            'factor': window.t ? window.t('algebraFactor') : 'Factor'
        };
        return labels[type] || type;
    }

    createWorkspace() {
        if (!this.stepsContainer) return;
        
        const stepLabel = window.t ? window.t('algebraStep') : 'Step';
        const placeholder = window.t ? window.t('algebraEnterStep') : 'Enter next step...';
        const addStepText = window.t ? window.t('algebraAddStep') : 'Add Step';
        const checkAnswerText = window.t ? window.t('algebraCheckAnswer') : 'Check Answer';
        
        // Show the original expression as starting point
        const originalExpr = this.trainer.currentProblem.expression;
        
        this.stepsContainer.innerHTML = `
            <div class="algebra-steps-chain">
                <div class="step-chain-item original-step">
                    <span class="step-number">Start:</span>
                    <span class="step-expression">${originalExpr}</span>
                </div>
                <div id="validatedStepsChain"></div>
                <div class="step-input-row">
                    <span class="step-number">${stepLabel} 1:</span>
                    <input type="text" id="currentStepInput" class="algebra-step-input" 
                           placeholder="${placeholder}" autocomplete="off">
                    <button type="button" class="control-btn add-step-btn" id="addStepBtn">${addStepText}</button>
                    <span class="step-status" id="currentStepStatus"></span>
                </div>
            </div>
            <div class="algebra-actions">
                <button type="button" class="control-btn primary-btn large-btn" id="algebraCheckAnswerBtn">${checkAnswerText}</button>
            </div>
        `;
        
        this.setupStepInputListeners();
        
        // Focus the input
        setTimeout(() => {
            document.getElementById('currentStepInput')?.focus();
        }, 100);
    }

    setupStepInputListeners() {
        const input = document.getElementById('currentStepInput');
        const addBtn = document.getElementById('addStepBtn');
        const checkBtn = document.getElementById('algebraCheckAnswerBtn');
        
        console.log('Setting up listeners. checkBtn:', checkBtn);
        
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
            checkBtn.addEventListener('click', () => {
                console.log('Check button clicked!');
                this.checkFinalAnswer();
            });
        }
    }

    addStep() {
        const input = document.getElementById('currentStepInput');
        const status = document.getElementById('currentStepStatus');
        
        if (!input) return;
        
        const userExpr = input.value.trim();
        if (!userExpr) {
            this.showInputError(input, status, window.t ? window.t('algebraEnterExpression') : 'Please enter an expression');
            return;
        }
        
        // Get the previous expression (last validated step)
        const previousExpr = this.validatedSteps[this.validatedSteps.length - 1];
        
        // Validate this step
        const validation = this.trainer.validateUserStep(previousExpr, userExpr);
        
        if (validation.valid) {
            // Add to validated chain
            this.validatedSteps.push(userExpr);
            this.addToValidatedChain(userExpr, this.validatedSteps.length - 1);
            
            // Clear input for next step
            input.value = '';
            this.clearInputError(input, status);
            
            // Update step number
            const stepLabel = window.t ? window.t('algebraStep') : 'Step';
            const stepNumber = input.closest('.step-input-row').querySelector('.step-number');
            if (stepNumber) {
                stepNumber.textContent = `${stepLabel} ${this.validatedSteps.length}:`;
            }
            
            // Show brief success feedback
            this.showFeedback(window.t ? window.t('algebraStepValid') : 'Step is valid! ✓', 'success');
            setTimeout(() => this.clearFeedback(), 1500);
            
            input.focus();
        } else {
            this.showInputError(input, status, validation.message || (window.t ? window.t('algebraInvalidStep') : 'Invalid transformation'));
        }
    }

    addToValidatedChain(expr, stepNum) {
        const chain = document.getElementById('validatedStepsChain');
        if (!chain) return;
        
        const stepLabel = window.t ? window.t('algebraStep') : 'Step';
        
        const stepEl = document.createElement('div');
        stepEl.className = 'step-chain-item validated-step';
        stepEl.innerHTML = `
            <span class="step-number">${stepLabel} ${stepNum}:</span>
            <span class="step-expression">${expr}</span>
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

    checkFinalAnswer() {
        // Get current input value (if any) and last validated step
        const input = document.getElementById('currentStepInput');
        let finalExpr = this.validatedSteps[this.validatedSteps.length - 1];
        
        console.log('checkFinalAnswer called');
        console.log('Current input value:', input?.value);
        console.log('Last validated step:', finalExpr);
        console.log('All validated steps:', this.validatedSteps);
        
        // If there's a pending step, validate and include it
        if (input && input.value.trim()) {
            const userExpr = input.value.trim();
            const previousExpr = finalExpr;
            console.log('Validating pending step:', userExpr, 'against', previousExpr);
            const validation = this.trainer.validateUserStep(previousExpr, userExpr);
            console.log('Step validation result:', validation);
            
            if (validation.valid) {
                finalExpr = userExpr;
                this.validatedSteps.push(userExpr);
                this.addToValidatedChain(userExpr, this.validatedSteps.length - 1);
                input.value = '';
            } else {
                const status = document.getElementById('currentStepStatus');
                this.showInputError(input, status, validation.message || (window.t ? window.t('algebraInvalidStep') : 'Invalid step'));
                return;
            }
        }
        
        // Check if final answer matches expected
        console.log('Checking if final expression is the answer:', finalExpr);
        const validation = this.trainer.validateFinalAnswer(finalExpr);
        console.log('Final answer validation:', validation);
        
        if (validation.valid) {
            this.onProblemComplete(true);
        } else {
            // Check if user made progress but not complete
            if (this.validatedSteps.length > 1) {
                // User has made some valid steps but not reached the final answer
                const notComplete = window.t ? window.t('algebraNotComplete') : 'Good progress, but not fully simplified yet. Keep going!';
                this.showFeedback(notComplete, 'warning');
            } else {
                const startSimplifying = window.t ? window.t('algebraStartSimplifying') : 'Start simplifying the expression step by step.';
                this.showFeedback(startSimplifying, 'info');
            }
        }
    }

    onProblemComplete(success) {
        if (success) {
            this.trainer.score.correct++;
        }
        this.trainer.score.total++;
        
        // Disable input
        const input = document.getElementById('currentStepInput');
        const addBtn = document.getElementById('addStepBtn');
        const checkBtn = document.getElementById('algebraCheckAnswerBtn');
        
        if (input) input.disabled = true;
        if (addBtn) addBtn.disabled = true;
        if (checkBtn) checkBtn.disabled = true;
        
        const stepsUsed = this.validatedSteps.length - 1; // Minus the original
        const stepsText = stepsUsed === 1 
            ? (window.t ? window.t('algebraOneStep') : '1 step')
            : `${stepsUsed} ${window.t ? window.t('algebraSteps') : 'steps'}`;
        
        const msg = window.t ? window.t('algebraCorrect') : 'Correct!';
        const completedIn = window.t ? window.t('algebraCompletedIn') : 'Completed in';
        
        this.showFeedback(`🎉 ${msg} ${completedIn} ${stepsText}`, 'success', true);
        this.updateScoreDisplay();
    }

    showFeedback(message, type, showNextButton = false) {
        // Always get fresh reference in case DOM was not ready at init
        const feedbackDisplay = document.getElementById('algebraFeedback');
        if (!feedbackDisplay) {
            console.error('Feedback display not found');
            return;
        }
        
        let html = `<span class="feedback-message">${message}</span>`;
        
        if (showNextButton) {
            const nextText = window.t ? window.t('algebraNextProblem') : 'Next Problem';
            html += `<button class="control-btn primary-btn next-problem-btn" onclick="algebraController.generateNewProblem()">→ ${nextText}</button>`;
        }
        
        feedbackDisplay.innerHTML = html;
        feedbackDisplay.className = 'trainer-feedback ' + type + (showNextButton ? ' with-button' : '');
        feedbackDisplay.style.display = showNextButton ? 'flex' : 'block';
    }

    clearFeedback() {
        const feedbackDisplay = document.getElementById('algebraFeedback');
        if (feedbackDisplay) {
            feedbackDisplay.style.display = 'none';
        }
    }

    updateScoreDisplay() {
        const score = this.trainer.getScore();
        const scoreDisplay = document.getElementById('algebraScore');
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
let algebraController;

document.addEventListener('DOMContentLoaded', () => {
    algebraController = new AlgebraController();
    algebraController.init();
});
