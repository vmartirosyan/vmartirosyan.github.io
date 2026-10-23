// Math Trainer - Multi-operation expression solving with step-by-step validation
class MathTrainer {
    constructor() {
        this.currentProblem = null;
        this.difficulty = 'easy';
        this.problemType = 'wholeNumbers'; // 'wholeNumbers', 'fractions', 'decimals', 'conversions', 'percents'
        this.score = { correct: 0, total: 0 };
    }

    generateProblem() {
        const problem = this.createProblem();
        this.currentProblem = problem;
        return problem;
    }

    createProblem() {
        switch (this.problemType) {
            case 'wholeNumbers':
                return this.createWholeNumbersProblem();
            case 'fractions':
                return this.createFractionsProblem();
            case 'decimals':
                return this.createDecimalsProblem();
            case 'conversions':
                return this.createConversionsProblem();
            case 'percents':
                return this.createPercentsProblem();
            default:
                return this.createWholeNumbersProblem();
        }
    }

    // === WHOLE NUMBERS PROBLEMS ===
    createWholeNumbersProblem() {
        switch (this.difficulty) {
            case 'easy': return this.createEasyWholeNumbers();
            case 'medium': return this.createMediumWholeNumbers();
            case 'hard': return this.createHardWholeNumbers();
            default: return this.createEasyWholeNumbers();
        }
    }

    createEasyWholeNumbers() {
        const templates = [
            () => this.buildSimpleExpression(2, { min: 2, max: 12 }, ['+', '+']),
            () => this.buildSimpleExpression(2, { min: 2, max: 10 }, ['+', '*']),
            () => this.buildSimpleExpression(2, { min: 2, max: 8 }, ['*', '+']),
            () => this.buildSubtractionExpression({ min: 5, max: 20 }, 'easy'),
        ];
        return this.randomChoice(templates)();
    }

    createMediumWholeNumbers() {
        const templates = [
            () => this.buildSimpleExpression(2, { min: 5, max: 20 }, ['+', '*']),
            () => this.buildSimpleExpression(3, { min: 3, max: 15 }, ['+', '+', '*']),
            () => this.buildExpressionWithParens({ min: 5, max: 25 }),
            () => this.buildDivisionExpression({ min: 2, max: 10 }),
            () => this.buildSubtractionExpression({ min: 10, max: 30 }, 'medium'),
            () => this.buildMixedExpression({ min: 5, max: 20 }, 'medium'),
        ];
        return this.randomChoice(templates)();
    }

    createHardWholeNumbers() {
        const templates = [
            () => this.buildSimpleExpression(3, { min: 5, max: 30 }, ['+', '*', '+']),
            () => this.buildSimpleExpression(3, { min: 10, max: 40 }, ['*', '+', '*']),
            () => this.buildExpressionWithParens({ min: 10, max: 40 }),
            () => this.buildDivisionExpression({ min: 5, max: 15 }),
            () => this.buildSubtractionExpression({ min: 15, max: 50 }, 'hard'),
            () => this.buildMixedExpression({ min: 10, max: 30 }, 'hard'),
            () => this.buildNegativeNumberExpression({ min: 5, max: 20 }),
        ];
        return this.randomChoice(templates)();
    }

    // === FRACTIONS PROBLEMS (Pure Fractions) ===
    createFractionsProblem() {
        switch (this.difficulty) {
            case 'easy': return this.createEasyFractions();
            case 'medium': return this.createMediumFractions();
            case 'hard': return this.createHardFractions();
            default: return this.createEasyFractions();
        }
    }

    createEasyFractions() {
        const templates = [
            () => this.buildSimpleFraction({ min: 2, max: 6 }),
            () => this.buildFractionSimplification('easy'),
            () => this.buildFractionAdditionSameDenominator({ min: 2, max: 6 }),
        ];
        return this.randomChoice(templates)();
    }

    createMediumFractions() {
        const templates = [
            () => this.buildFractionAddition({ min: 2, max: 8 }),
            () => this.buildFractionMultiplication({ min: 2, max: 6 }),
            () => this.buildMixedNumberOperation('medium'),
            () => this.buildFractionSubtraction({ min: 2, max: 8 }),
        ];
        return this.randomChoice(templates)();
    }

    createHardFractions() {
        const templates = [
            () => this.buildFractionDivision({ min: 2, max: 8 }),
            () => this.buildMixedFractionExpression({ min: 2, max: 10 }),
            () => this.buildComplexFractionExpression({ min: 2, max: 6 }),
        ];
        return this.randomChoice(templates)();
    }

    // === DECIMALS PROBLEMS (Pure Decimals) ===
    createDecimalsProblem() {
        switch (this.difficulty) {
            case 'easy': return this.createEasyDecimals();
            case 'medium': return this.createMediumDecimals();
            case 'hard': return this.createHardDecimals();
            default: return this.createEasyDecimals();
        }
    }

    createEasyDecimals() {
        const templates = [
            () => this.buildDecimalAddition('easy'),
            () => this.buildDecimalSubtraction('easy'),
            () => this.buildDecimalByWholeNumber('easy'),
        ];
        return this.randomChoice(templates)();
    }

    createMediumDecimals() {
        const templates = [
            () => this.buildDecimalMultiplication('medium'),
            () => this.buildDecimalDivision('medium'),
            () => this.buildComplexDecimal('medium'),
        ];
        return this.randomChoice(templates)();
    }

    createHardDecimals() {
        const templates = [
            () => this.buildComplexDecimal('hard'),
            () => this.buildDecimalExpression('hard'),
            () => this.buildDecimalDivision('hard'),
        ];
        return this.randomChoice(templates)();
    }

    // === CONVERSIONS PROBLEMS (Fractions <-> Decimals) ===
    createConversionsProblem() {
        switch (this.difficulty) {
            case 'easy': return this.createEasyConversions();
            case 'medium': return this.createMediumConversions();
            case 'hard': return this.createHardConversions();
            default: return this.createEasyConversions();
        }
    }

    createEasyConversions() {
        const templates = [
            () => this.buildFractionToDecimal('easy'),
            () => this.buildDecimalToFraction('easy'),
        ];
        return this.randomChoice(templates)();
    }

    createMediumConversions() {
        const templates = [
            () => this.buildFractionToDecimal('medium'),
            () => this.buildDecimalToFraction('medium'),
            () => this.buildMixedToDecimal('medium'),
        ];
        return this.randomChoice(templates)();
    }

    createHardConversions() {
        const templates = [
            () => this.buildFractionToDecimal('hard'),
            () => this.buildDecimalToFraction('hard'),
            () => this.buildRepeatingDecimal('hard'),
        ];
        return this.randomChoice(templates)();
    }

    // === PERCENTS PROBLEMS ===
    createPercentsProblem() {
        switch (this.difficulty) {
            case 'easy': return this.createEasyPercents();
            case 'medium': return this.createMediumPercents();
            case 'hard': return this.createHardPercents();
            default: return this.createEasyPercents();
        }
    }

    createEasyPercents() {
        const templates = [
            () => this.buildPercentOf('easy'),
            () => this.buildPercentToFraction('easy'),
            () => this.buildFractionToPercent('easy'),
        ];
        return this.randomChoice(templates)();
    }

    createMediumPercents() {
        const templates = [
            () => this.buildPercentOf('medium'),
            () => this.buildPercentIncrease('medium'),
            () => this.buildFindPercent('medium'),
        ];
        return this.randomChoice(templates)();
    }

    createHardPercents() {
        const templates = [
            () => this.buildPercentOf('hard'),
            () => this.buildPercentChange('hard'),
            () => this.buildReversePercent('hard'),
        ];
        return this.randomChoice(templates)();
    }

    // === PERCENT BUILDERS ===
    
    // Easy: What is X% of Y?
    buildPercentOf(difficulty) {
        let percent, number, result;
        
        if (difficulty === 'easy') {
            // Use simple percents: 10%, 20%, 25%, 50%
            const easyPercents = [10, 20, 25, 50];
            percent = this.randomChoice(easyPercents);
            number = this.randomInt(2, 10) * 10; // 20, 30, ..., 100
            result = (percent / 100) * number;
        } else if (difficulty === 'medium') {
            percent = this.randomInt(1, 9) * 10; // 10, 20, ..., 90
            number = this.randomInt(5, 20) * 10;
            result = (percent / 100) * number;
        } else {
            percent = this.randomInt(5, 95);
            number = this.randomInt(50, 500);
            result = (percent / 100) * number;
        }
        
        return {
            expression: `${percent}% of ${number}`,
            displayExpression: `${percent}% of ${number} = ?`,
            result: result,
            expectedSteps: [
                { expression: `${percent}/100 × ${number}`, result: result },
            ],
            numSteps: 1
        };
    }

    // Easy: Convert percent to fraction
    buildPercentToFraction(difficulty) {
        const easyPercents = [25, 50, 75, 20, 10];
        const percent = this.randomChoice(easyPercents);
        const gcd = this.gcd(percent, 100);
        const numerator = percent / gcd;
        const denominator = 100 / gcd;
        
        return {
            expression: `${percent}% as a fraction`,
            displayExpression: `${percent}% = ?`,
            result: `${numerator}/${denominator}`,
            expectedSteps: [
                { 
                    expression: `${percent}/100`, 
                    result: `${numerator}/${denominator}`,
                    altExpressions: [
                        `${percent}%`,
                        `${percent} / 100`,
                        `${percent}`,
                        `(${percent})/(100)`,
                        `(${percent}/100)`
                    ]
                },
            ],
            numSteps: 1,
            isTextAnswer: true
        };
    }

    // Easy: Convert fraction to percent
    buildFractionToPercent(difficulty) {
        const fractions = [
            { num: 1, den: 2, percent: 50 },
            { num: 1, den: 4, percent: 25 },
            { num: 3, den: 4, percent: 75 },
            { num: 1, den: 5, percent: 20 },
            { num: 1, den: 10, percent: 10 },
        ];
        const frac = this.randomChoice(fractions);
        
        return {
            expression: `${frac.num}/${frac.den} as a percent`,
            displayExpression: `${frac.num}/${frac.den} = ?%`,
            result: frac.percent,
            expectedSteps: [
                { 
                    expression: `(${frac.num} ÷ ${frac.den}) × 100`, 
                    result: frac.percent,
                    altExpressions: [
                        // Just the fraction (user shows starting point)
                        `${frac.num}/${frac.den}`,
                        `(${frac.num})/(${frac.den})`,
                        `(${frac.num}/${frac.den})`,
                        // Fraction × 100
                        `${frac.num}/${frac.den}*100`,
                        `${frac.num}/${frac.den} * 100`,
                        `${frac.num}/${frac.den}×100`,
                        `(${frac.num}/${frac.den})*100`,
                        `(${frac.num}/${frac.den}) * 100`,
                        `(${frac.num}/${frac.den})×100`,
                        `(${frac.num})/(${frac.den})*100`,
                        `(${frac.num})/(${frac.den})×100`,
                        `(${frac.num})/(${frac.den}) * 100`,
                        `(${frac.num})/(${frac.den}) × 100`,
                        `${frac.num} / ${frac.den} * 100`,
                        `${frac.num} ÷ ${frac.den} × 100`
                    ]
                },
            ],
            numSteps: 1
        };
    }

    // Medium: Percent increase
    buildPercentIncrease(difficulty) {
        const original = this.randomInt(5, 20) * 10;
        const percentIncrease = this.randomChoice([10, 20, 25, 50]);
        const increase = (percentIncrease / 100) * original;
        const result = original + increase;
        
        return {
            expression: `Increase ${original} by ${percentIncrease}%`,
            displayExpression: `${original} + ${percentIncrease}% = ?`,
            result: result,
            expectedSteps: [
                { 
                    expression: `${percentIncrease}% of ${original}`, 
                    result: increase,
                    altExpressions: [
                        `${percentIncrease}%*${original}`,
                        `${percentIncrease}% * ${original}`,
                        `${percentIncrease}/100*${original}`,
                        `(${percentIncrease}/100)*${original}`,
                        `${original}*${percentIncrease}/100`,
                        `${original}*${percentIncrease}%`,
                        `${original} * ${percentIncrease}%`,
                        `${original} × ${percentIncrease}%`
                    ]
                },
                { 
                    expression: `${original} + ${increase}`, 
                    result: result,
                    altExpressions: [
                        `${increase} + ${original}`
                    ]
                },
            ],
            numSteps: 2
        };
    }

    // Medium: Find what percent
    buildFindPercent(difficulty) {
        const total = this.randomInt(5, 20) * 10;
        const part = this.randomInt(1, 9) * (total / 10);
        const percent = (part / total) * 100;
        
        return {
            expression: `${part} is what % of ${total}?`,
            displayExpression: `${part} / ${total} = ?%`,
            result: percent,
            expectedSteps: [
                { 
                    expression: `(${part} ÷ ${total}) × 100`, 
                    result: percent,
                    altExpressions: [
                        `${part}/${total}`,
                        `${part} / ${total}`,
                        `(${part})/(${total})`,
                        `(${part}/${total})`,
                        `${part}/${total}*100`,
                        `${part}/${total} * 100`,
                        `${part}/${total}×100`,
                        `(${part}/${total})*100`,
                        `(${part})/(${total})*100`,
                        `(${part})/(${total})×100`,
                        `(${part})/(${total}) * 100`,
                        `${part} / ${total} * 100`,
                        `${part} ÷ ${total} × 100`
                    ]
                },
            ],
            numSteps: 1
        };
    }

    // Hard: Percent change
    buildPercentChange(difficulty) {
        const original = this.randomInt(5, 15) * 10;
        const newValue = this.randomInt(5, 15) * 10;
        const change = newValue - original;
        const percentChange = Math.round((change / original) * 100);
        
        const sign = change >= 0 ? '+' : '';
        
        return {
            expression: `% change from ${original} to ${newValue}`,
            displayExpression: `${original} → ${newValue}: ?% change`,
            result: percentChange,
            expectedSteps: [
                { 
                    expression: `Change: ${newValue} - ${original}`, 
                    result: change,
                    altExpressions: [
                        `${newValue} - ${original}`,
                        `(${newValue} - ${original})`,
                        `(${newValue}-${original})/${original}`,
                        `(${newValue} - ${original}) / ${original}`,
                        `(${newValue}-${original})/(${original})`
                    ]
                },
                { 
                    expression: `(${change} ÷ ${original}) × 100`, 
                    result: percentChange,
                    altExpressions: [
                        `${change} / ${original} * 100`,
                        `${change}/${original}*100`,
                        `(${change}/${original})*100`,
                        `${change} ÷ ${original} × 100`
                    ]
                },
            ],
            numSteps: 2
        };
    }

    // Hard: Reverse percent (find original)
    buildReversePercent(difficulty) {
        const original = this.randomInt(5, 15) * 10;
        const percent = this.randomChoice([10, 20, 25]);
        const result = original + (original * percent / 100);
        
        return {
            expression: `A number increased by ${percent}% is ${result}. Find the original.`,
            displayExpression: `? + ${percent}% = ${result}`,
            result: original,
            expectedSteps: [
                { expression: `${result} ÷ ${1 + percent/100}`, result: original },
            ],
            numSteps: 1
        };
    }

    // === DECIMAL BUILDERS ===
    
    buildDecimalAddition(difficulty) {
        const a = (this.randomInt(1, 9) + this.randomInt(1, 9) / 10).toFixed(1);
        const b = (this.randomInt(1, 9) + this.randomInt(1, 9) / 10).toFixed(1);
        const result = (parseFloat(a) + parseFloat(b)).toFixed(1);
        
        return {
            expression: `${a} + ${b}`,
            displayExpression: `${a} + ${b}`,
            result: parseFloat(result),
            expectedSteps: [
                { expression: `${a} + ${b}`, result: parseFloat(result) },
            ],
            numSteps: 1
        };
    }

    buildDecimalMultiplication(difficulty) {
        const a = (this.randomInt(1, 5) + this.randomInt(1, 9) / 10).toFixed(1);
        const b = this.randomInt(2, 9);
        const result = (parseFloat(a) * b).toFixed(1);
        
        return {
            expression: `${a} × ${b}`,
            displayExpression: `${a} × ${b}`,
            result: parseFloat(result),
            expectedSteps: [
                { expression: `${a} × ${b}`, result: parseFloat(result) },
            ],
            numSteps: 1
        };
    }

    buildComplexDecimal(difficulty) {
        const a = (this.randomInt(1, 9) + this.randomInt(1, 99) / 100).toFixed(2);
        const b = (this.randomInt(1, 9) + this.randomInt(1, 99) / 100).toFixed(2);
        const op = this.randomChoice(['+', '-', '×']);
        let result;
        
        if (op === '+') {
            result = parseFloat(a) + parseFloat(b);
        } else if (op === '-') {
            result = parseFloat(a) - parseFloat(b);
        } else {
            result = parseFloat(a) * parseFloat(b);
        }
        result = parseFloat(result.toFixed(2));
        
        return {
            expression: `${a} ${op} ${b}`,
            displayExpression: `${a} ${op} ${b}`,
            result: result,
            expectedSteps: [
                { expression: `${a} ${op} ${b}`, result: result },
            ],
            numSteps: 1
        };
    }

    buildFractionToDecimal(difficulty) {
        const fractions = [
            { num: 1, den: 4, decimal: 0.25 },
            { num: 3, den: 4, decimal: 0.75 },
            { num: 1, den: 8, decimal: 0.125 },
            { num: 3, den: 8, decimal: 0.375 },
            { num: 5, den: 8, decimal: 0.625 },
        ];
        const frac = this.randomChoice(fractions);
        
        return {
            expression: `${frac.num}/${frac.den} as decimal`,
            displayExpression: `${frac.num}/${frac.den} = ?`,
            result: frac.decimal,
            expectedSteps: [
                { expression: `${frac.num} ÷ ${frac.den}`, result: frac.decimal },
            ],
            numSteps: 1
        };
    }

    buildFractionSimplification(difficulty) {
        // Ensure we generate a fraction that needs simplification
        const multiplier = this.randomInt(2, 5);
        let num, den;
        
        // Keep generating until we get coprime num and den (so the simplified form is different)
        do {
            num = this.randomInt(1, 5);
            den = this.randomInt(num + 1, 8);
        } while (this.gcd(num, den) !== 1); // Ensure num/den is already in simplest form
        
        const originalNum = num * multiplier;
        const originalDen = den * multiplier;
        
        return {
            expression: `Simplify ${originalNum}/${originalDen}`,
            displayExpression: `${originalNum}/${originalDen} = ?`,
            result: `${num}/${den}`,
            displayResult: `${num}/${den}`, // For showing the answer
            expectedSteps: [
                { 
                    expression: `${originalNum}/${originalDen}`, 
                    result: `${num}/${den}`,
                    requireExactFraction: true, // Must match exactly, not just numerically
                    // Allow alternative expressions
                    altExpressions: [
                        `${originalNum}/${originalDen}`,
                        `GCD = ${multiplier}`,
                        `${originalNum}÷${multiplier}/${originalDen}÷${multiplier}`,
                        `(${originalNum}÷${multiplier})/(${originalDen}÷${multiplier})`
                    ]
                },
            ],
            numSteps: 1,
            isTextAnswer: true,
            requireExactFraction: true
        };
    }

    buildMixedNumberOperation(difficulty) {
        const whole1 = this.randomInt(1, 5);
        const num1 = this.randomInt(1, 3);
        const den = this.randomInt(4, 8);
        const whole2 = this.randomInt(1, 3);
        
        const decimalResult = whole1 + num1 / den + whole2;
        const totalWhole = whole1 + whole2;
        const resultStr = `${totalWhole} ${num1}/${den}`;
        const originalExpr = `${whole1} ${num1}/${den} + ${whole2}`;
        
        return {
            expression: originalExpr,
            displayExpression: originalExpr,
            result: decimalResult,
            displayResult: resultStr,
            expectedSteps: [
                { 
                    expression: resultStr,  // The simplified answer
                    result: resultStr,
                    decimalResult: decimalResult,
                    // Accept original expression or simplified answer
                    altExpressions: [
                        originalExpr,
                        `${whole1}+${whole2} ${num1}/${den}`,
                        `(${whole1}+${whole2}) ${num1}/${den}`,
                        `${totalWhole}+${num1}/${den}`,
                    ]
                },
            ],
            numSteps: 1,
            isFractionAnswer: true
        };
    }

    // GCD helper
    gcd(a, b) {
        return b === 0 ? a : this.gcd(b, a % b);
    }

    // Format fraction result as string (whole number, fraction, or mixed number)
    formatFractionResult(num, den) {
        if (den === 1) {
            return `${num}`;
        }
        if (num > den) {
            const wholePart = Math.floor(num / den);
            const remainder = num % den;
            if (remainder === 0) {
                return `${wholePart}`;
            }
            return `${wholePart} ${remainder}/${den}`;
        }
        return `${num}/${den}`;
    }

    buildSimpleExpression(numOperations, range, operators) {
        let numbers = [];
        
        for (let i = 0; i <= numOperations; i++) {
            numbers.push(this.randomInt(range.min, range.max));
        }
        
        let expression = String(numbers[0]);
        for (let i = 0; i < operators.length; i++) {
            expression += ` ${this.getOperatorSymbol(operators[i])} ${numbers[i + 1]}`;
        }
        
        const expectedSteps = this.generateExpectedSteps(numbers, operators);
        const result = expectedSteps.length > 0 ? expectedSteps[expectedSteps.length - 1].result : numbers[0];
        
        return {
            expression,
            displayExpression: expression,
            result,
            expectedSteps,
            numSteps: expectedSteps.length
        };
    }

    buildExpressionWithParens(range) {
        const a = this.randomInt(range.min, range.max);
        const b = this.randomInt(range.min, range.max);
        const c = this.randomInt(2, 10);
        
        const templates = [
            { 
                expr: `(${a} + ${b}) * ${c}`, 
                result: (a + b) * c, 
                expectedSteps: [
                    { expression: `${a} + ${b}`, result: a + b },
                    { expression: `${a + b} * ${c}`, result: (a + b) * c }
                ]
            },
            { 
                expr: `${a} + ${b} * ${c}`, 
                result: a + b * c, 
                expectedSteps: [
                    { expression: `${b} * ${c}`, result: b * c },
                    { expression: `${a} + ${b * c}`, result: a + b * c }
                ]
            },
        ];
        
        const template = this.randomChoice(templates);
        return {
            expression: template.expr,
            displayExpression: template.expr,
            result: template.result,
            expectedSteps: template.expectedSteps,
            numSteps: template.expectedSteps.length
        };
    }

    buildDivisionExpression(range) {
        const divisor = this.randomInt(range.min, range.max);
        const quotient = this.randomInt(range.min, range.max);
        const dividend = divisor * quotient;
        const addend = this.randomInt(5, 25);
        
        const templates = [
            { 
                expr: `${dividend} ÷ ${divisor} + ${addend}`, 
                result: quotient + addend, 
                expectedSteps: [
                    { expression: `${dividend} ÷ ${divisor}`, result: quotient },
                    { expression: `${quotient} + ${addend}`, result: quotient + addend }
                ]
            },
            { 
                expr: `${addend} + ${dividend} ÷ ${divisor}`, 
                result: addend + quotient, 
                expectedSteps: [
                    { expression: `${dividend} ÷ ${divisor}`, result: quotient },
                    { expression: `${addend} + ${quotient}`, result: addend + quotient }
                ]
            },
        ];
        
        const template = this.randomChoice(templates);
        return {
            expression: template.expr,
            displayExpression: template.expr,
            result: template.result,
            expectedSteps: template.expectedSteps,
            numSteps: template.expectedSteps.length
        };
    }

    // Build subtraction expressions (ensuring no negative intermediate results for easy/medium)
    buildSubtractionExpression(range, difficulty) {
        if (difficulty === 'easy') {
            // Simple: a - b where a > b
            const b = this.randomInt(range.min, range.max);
            const a = b + this.randomInt(range.min, range.max);
            const c = this.randomInt(2, 10);
            
            return {
                expression: `${a} - ${b} + ${c}`,
                displayExpression: `${a} - ${b} + ${c}`,
                result: a - b + c,
                expectedSteps: [
                    { expression: `${a} - ${b}`, result: a - b },
                    { expression: `${a - b} + ${c}`, result: a - b + c }
                ],
                numSteps: 2
            };
        } else if (difficulty === 'medium') {
            // a - b * c (order of operations)
            const b = this.randomInt(2, 5);
            const c = this.randomInt(2, 5);
            const product = b * c;
            const a = product + this.randomInt(range.min, range.max);
            
            return {
                expression: `${a} - ${b} * ${c}`,
                displayExpression: `${a} - ${b} * ${c}`,
                result: a - product,
                expectedSteps: [
                    { expression: `${b} * ${c}`, result: product },
                    { expression: `${a} - ${product}`, result: a - product }
                ],
                numSteps: 2
            };
        } else {
            // Hard: can have negative results
            const a = this.randomInt(range.min, range.max);
            const b = this.randomInt(range.min, range.max);
            const c = this.randomInt(2, 10);
            
            return {
                expression: `${a} - ${b} - ${c}`,
                displayExpression: `${a} - ${b} - ${c}`,
                result: a - b - c,
                expectedSteps: [
                    { expression: `${a} - ${b}`, result: a - b },
                    { expression: `${a - b} - ${c}`, result: a - b - c }
                ],
                numSteps: 2
            };
        }
    }

    // Build expressions with mixed operations including subtraction
    buildMixedExpression(range, difficulty) {
        const a = this.randomInt(range.min, range.max);
        const b = this.randomInt(2, 8);
        const c = this.randomInt(2, 8);
        const product = b * c;
        
        if (difficulty === 'medium') {
            // a + b * c - d
            const d = this.randomInt(2, Math.min(15, a + product - 1));
            const result = a + product - d;
            
            return {
                expression: `${a} + ${b} * ${c} - ${d}`,
                displayExpression: `${a} + ${b} * ${c} - ${d}`,
                result: result,
                expectedSteps: [
                    { expression: `${b} * ${c}`, result: product },
                    { expression: `${a} + ${product}`, result: a + product },
                    { expression: `${a + product} - ${d}`, result: result }
                ],
                numSteps: 3
            };
        } else {
            // Hard: (a - b) * c or a * b - c * d
            const d = this.randomInt(2, 5);
            const e = this.randomInt(2, 5);
            const product1 = a * b;
            const product2 = d * e;
            const result = product1 - product2;
            
            return {
                expression: `${a} * ${b} - ${d} * ${e}`,
                displayExpression: `${a} * ${b} - ${d} * ${e}`,
                result: result,
                expectedSteps: [
                    { expression: `${a} * ${b}`, result: product1 },
                    { expression: `${d} * ${e}`, result: product2 },
                    { expression: `${product1} - ${product2}`, result: result }
                ],
                numSteps: 3
            };
        }
    }

    // Build expressions with negative numbers (hard difficulty only)
    buildNegativeNumberExpression(range) {
        const templates = [
            () => {
                // (-a) + b
                const a = this.randomInt(range.min, range.max);
                const b = this.randomInt(range.min, range.max);
                const result = -a + b;
                return {
                    expression: `(-${a}) + ${b}`,
                    displayExpression: `(-${a}) + ${b}`,
                    result: result,
                    expectedSteps: [
                        { expression: `(-${a}) + ${b}`, result: result }
                    ],
                    numSteps: 1
                };
            },
            () => {
                // a + (-b) * c
                const a = this.randomInt(range.min, range.max);
                const b = this.randomInt(2, 8);
                const c = this.randomInt(2, 5);
                const product = -b * c;
                const result = a + product;
                return {
                    expression: `${a} + (-${b}) * ${c}`,
                    displayExpression: `${a} + (-${b}) * ${c}`,
                    result: result,
                    expectedSteps: [
                        { expression: `(-${b}) * ${c}`, result: product },
                        { expression: `${a} + (${product})`, result: result }
                    ],
                    numSteps: 2
                };
            },
            () => {
                // a - (-b)
                const a = this.randomInt(range.min, range.max);
                const b = this.randomInt(range.min, range.max);
                const result = a - (-b);
                return {
                    expression: `${a} - (-${b})`,
                    displayExpression: `${a} - (-${b})`,
                    result: result,
                    expectedSteps: [
                        { expression: `${a} - (-${b})`, result: result }
                    ],
                    numSteps: 1
                };
            },
            () => {
                // (-a) * b + c
                const a = this.randomInt(2, 8);
                const b = this.randomInt(2, 5);
                const c = this.randomInt(range.min, range.max);
                const product = -a * b;
                const result = product + c;
                return {
                    expression: `(-${a}) * ${b} + ${c}`,
                    displayExpression: `(-${a}) * ${b} + ${c}`,
                    result: result,
                    expectedSteps: [
                        { expression: `(-${a}) * ${b}`, result: product },
                        { expression: `(${product}) + ${c}`, result: result }
                    ],
                    numSteps: 2
                };
            }
        ];
        
        return this.randomChoice(templates)();
    }

    // === FRACTION PROBLEMS ===
    
    // Easy: Simple fraction that needs simplification
    buildSimpleFraction(range) {
        // Generate a fraction that NEEDS simplification (unlike buildFractionSimplification which is more complex)
        const multiplier = this.randomInt(2, 4);
        let num, den;
        
        // Generate coprime num and den first
        do {
            num = this.randomInt(1, 4);
            den = this.randomInt(num + 1, 6);
        } while (this.gcd(num, den) !== 1);
        
        // Multiply to create a fraction that needs simplifying
        const originalNum = num * multiplier;
        const originalDen = den * multiplier;
        
        const resultStr = `${num}/${den}`;
        const decimalResult = num / den;
        
        return {
            expression: `Simplify: ${originalNum}/${originalDen}`,
            displayExpression: `${originalNum}/${originalDen} = ?`,
            result: decimalResult,
            displayResult: resultStr,
            expectedSteps: [{ 
                expression: `${originalNum}/${originalDen}`, 
                result: resultStr,
                decimalResult: decimalResult
            }],
            numSteps: 1,
            isFractionAnswer: true,
            isTextAnswer: true
        };
    }
    
    // Medium: Fraction addition with common denominators
    buildFractionAddition(range) {
        const denominator = this.randomInt(range.min, range.max);
        const num1 = this.randomInt(1, denominator - 1);
        const num2 = this.randomInt(1, denominator - 1);
        const resultNum = num1 + num2;
        const gcd = this.gcd(resultNum, denominator);
        const simplifiedNum = resultNum / gcd;
        const simplifiedDen = denominator / gcd;
        
        const resultStr = this.formatFractionResult(simplifiedNum, simplifiedDen);
        const decimalResult = resultNum / denominator;
        
        // Build steps - for fractions that simplify to whole numbers or simpler fractions
        const steps = [];
        steps.push({ 
            expression: `(${num1} + ${num2})/${denominator}`, 
            result: `${resultNum}/${denominator}`,
            decimalResult: decimalResult  // Accept numeric equivalent
        });
        
        // Add simplification step if needed
        if (simplifiedDen !== denominator) {
            steps.push({ 
                expression: resultStr, 
                result: resultStr,
                decimalResult: decimalResult
            });
        }
        
        return {
            expression: `${num1}/${denominator} + ${num2}/${denominator}`,
            displayExpression: `${num1}/${denominator} + ${num2}/${denominator}`,
            result: decimalResult,
            displayResult: resultStr,
            expectedSteps: steps,
            numSteps: steps.length,
            isFractionAnswer: true
        };
    }

    // Easy: Fraction addition with same denominators (alias for buildFractionAddition)
    buildFractionAdditionSameDenominator(range) {
        return this.buildFractionAddition(range);
    }
    
    // Medium: Fraction multiplication
    buildFractionMultiplication(range) {
        const num1 = this.randomInt(range.min, range.max);
        const den1 = this.randomInt(range.min, range.max);
        const num2 = this.randomInt(range.min, range.max);
        const den2 = this.randomInt(range.min, range.max);
        
        const resultNum = num1 * num2;
        const resultDen = den1 * den2;
        const gcd = this.gcd(resultNum, resultDen);
        const simplifiedNum = resultNum / gcd;
        const simplifiedDen = resultDen / gcd;
        
        const resultStr = this.formatFractionResult(simplifiedNum, simplifiedDen);
        const decimalResult = resultNum / resultDen;
        
        return {
            expression: `(${num1}/${den1}) * (${num2}/${den2})`,
            displayExpression: `(${num1}/${den1}) * (${num2}/${den2})`,
            result: decimalResult,
            displayResult: resultStr,
            expectedSteps: [
                { expression: `(${num1} * ${num2})/(${den1} * ${den2})`, result: `${resultNum}/${resultDen}` },
                { expression: `${resultNum}/${resultDen}`, result: `${resultNum}/${resultDen}` },
                simplifiedNum !== resultNum || simplifiedDen !== resultDen
                    ? { expression: resultStr, result: resultStr }
                    : null
            ].filter(s => s !== null),
            numSteps: simplifiedNum !== resultNum || simplifiedDen !== resultDen ? 3 : 2,
            isFractionAnswer: true
        };
    }
    
    // Hard: Fraction division
    buildFractionDivision(range) {
        const num1 = this.randomInt(range.min, range.max);
        const den1 = this.randomInt(range.min, range.max);
        const num2 = this.randomInt(range.min, range.max);
        const den2 = this.randomInt(range.min, range.max);
        
        const resultNum = num1 * den2;
        const resultDen = den1 * num2;
        const gcd = this.gcd(resultNum, resultDen);
        const simplifiedNum = resultNum / gcd;
        const simplifiedDen = resultDen / gcd;
        
        const resultStr = this.formatFractionResult(simplifiedNum, simplifiedDen);
        const decimalResult = resultNum / resultDen;
        
        return {
            expression: `(${num1}/${den1}) / (${num2}/${den2})`,
            displayExpression: `(${num1}/${den1}) / (${num2}/${den2})`,
            result: decimalResult,
            displayResult: resultStr,
            expectedSteps: [
                { expression: `(${num1}/${den1}) * (${den2}/${num2})`, result: `${resultNum}/${resultDen}` },
                { expression: `(${num1} * ${den2})/(${den1} * ${num2})`, result: `${resultNum}/${resultDen}` },
                { expression: `${resultNum}/${resultDen}`, result: `${resultNum}/${resultDen}` },
                simplifiedNum !== resultNum || simplifiedDen !== resultDen
                    ? { expression: resultStr, result: resultStr }
                    : null
            ].filter(s => s !== null),
            numSteps: simplifiedNum !== resultNum || simplifiedDen !== resultDen ? 4 : 3,
            isFractionAnswer: true
        };
    }
    
    // Hard: Mixed expression with fractions
    buildMixedFractionExpression(range) {
        const whole = this.randomInt(range.min, range.max);
        const num = this.randomInt(1, 5);
        const den = this.randomInt(2, 6);
        
        const decimalResult = whole + num / den;
        
        // Check if fraction simplifies
        const gcd = this.gcd(num, den);
        const simplifiedNum = num / gcd;
        const simplifiedDen = den / gcd;
        
        // Calculate final result as mixed number
        const totalNum = whole * simplifiedDen + simplifiedNum;
        const resultStr = this.formatFractionResult(totalNum, simplifiedDen);
        
        const steps = [];
        
        // Step 1: Simplify the fraction if needed
        if (simplifiedDen === 1) {
            // Fraction simplifies to a whole number
            steps.push({ expression: `${num}/${den}`, result: `${simplifiedNum}` });
            steps.push({ expression: `${whole} + ${simplifiedNum}`, result: `${whole + simplifiedNum}` });
        } else if (simplifiedNum !== num || simplifiedDen !== den) {
            // Fraction can be simplified but not to a whole number
            steps.push({ expression: `${num}/${den}`, result: `${simplifiedNum}/${simplifiedDen}` });
            steps.push({ expression: `${whole} + ${simplifiedNum}/${simplifiedDen}`, result: resultStr });
        } else {
            // Fraction is already in simplest form, just add
            steps.push({ expression: `${whole} + ${num}/${den}`, result: resultStr });
        }
        
        return {
            expression: `${whole} + ${num}/${den}`,
            displayExpression: `${whole} + ${num}/${den}`,
            result: decimalResult,
            displayResult: resultStr,
            expectedSteps: steps,
            numSteps: steps.length,
            isFractionAnswer: true
        };
    }

    // Medium: Fraction subtraction
    buildFractionSubtraction(range) {
        // Generate a common denominator
        const den = this.randomInt(range.min, range.max);
        const num1 = this.randomInt(2, den - 1);
        const num2 = this.randomInt(1, num1 - 1); // Ensure num2 < num1 for positive result
        
        const resultNum = num1 - num2;
        const gcd = this.gcd(resultNum, den);
        const simplifiedNum = resultNum / gcd;
        const simplifiedDen = den / gcd;
        
        const resultStr = this.formatFractionResult(simplifiedNum, simplifiedDen);
        const decimalResult = resultNum / den;
        
        return {
            expression: `${num1}/${den} - ${num2}/${den}`,
            displayExpression: `${num1}/${den} - ${num2}/${den}`,
            result: decimalResult,
            displayResult: resultStr,
            expectedSteps: [
                { expression: `(${num1} - ${num2})/${den}`, result: `${resultNum}/${den}` },
                { expression: `${resultNum}/${den}`, result: `${resultNum}/${den}` },
                simplifiedNum !== resultNum || simplifiedDen !== den
                    ? { expression: resultStr, result: resultStr }
                    : null
            ].filter(s => s !== null),
            numSteps: simplifiedNum !== resultNum || simplifiedDen !== den ? 3 : 2,
            isFractionAnswer: true
        };
    }

    // Hard: Complex fraction expression (operations with multiple fractions)
    buildComplexFractionExpression(range) {
        // Use a common denominator approach for proper fraction arithmetic
        const den1 = this.randomInt(2, range.max);
        const den2 = this.randomInt(2, range.max);
        const num1 = this.randomInt(1, den1 * 2);
        const num2 = this.randomInt(1, den2);
        const whole = this.randomInt(1, 5);
        
        // Find LCD (least common denominator)
        const lcd = (den1 * den2) / this.gcd(den1, den2);
        
        // Convert fractions to LCD
        const num1Lcd = num1 * (lcd / den1);
        const num2Lcd = num2 * (lcd / den2);
        const wholeLcd = whole * lcd;
        
        // Sum all numerators
        const totalNum = num1Lcd + num2Lcd + wholeLcd;
        
        // Simplify final result
        const finalGcd = this.gcd(totalNum, lcd);
        const simplifiedNum = totalNum / finalGcd;
        const simplifiedDen = lcd / finalGcd;
        
        // Calculate decimal for verification
        const decimalResult = totalNum / lcd;
        
        // Format result - could be whole number, improper fraction, or mixed number
        let resultStr;
        if (simplifiedDen === 1) {
            resultStr = `${simplifiedNum}`;
        } else if (simplifiedNum > simplifiedDen) {
            const wholepart = Math.floor(simplifiedNum / simplifiedDen);
            const remainder = simplifiedNum % simplifiedDen;
            if (remainder === 0) {
                resultStr = `${wholepart}`;
            } else {
                resultStr = `${wholepart} ${remainder}/${simplifiedDen}`;
            }
        } else {
            resultStr = `${simplifiedNum}/${simplifiedDen}`;
        }
        
        return {
            expression: `${num1}/${den1} + ${num2}/${den2} + ${whole}`,
            displayExpression: `${num1}/${den1} + ${num2}/${den2} + ${whole}`,
            result: decimalResult,
            displayResult: resultStr,
            expectedSteps: [
                { 
                    expression: `${num1Lcd}/${lcd} + ${num2Lcd}/${lcd} + ${wholeLcd}/${lcd}`, 
                    result: decimalResult,
                    altExpressions: [
                        `${num1}/${den1} = ${num1Lcd}/${lcd}`,
                        `${num2}/${den2} = ${num2Lcd}/${lcd}`,
                        `${whole} = ${wholeLcd}/${lcd}`
                    ]
                },
                { 
                    expression: `${totalNum}/${lcd}`, 
                    result: decimalResult,
                    altExpressions: [
                        `(${num1Lcd} + ${num2Lcd} + ${wholeLcd})/${lcd}`
                    ]
                },
                simplifiedNum !== totalNum || simplifiedDen !== lcd
                    ? { expression: resultStr, result: decimalResult }
                    : null
            ].filter(s => s !== null),
            numSteps: simplifiedNum !== totalNum || simplifiedDen !== lcd ? 3 : 2
        };
    }

    // === ADDITIONAL DECIMAL BUILDERS ===

    // Easy: Decimal subtraction
    buildDecimalSubtraction(difficulty) {
        const a = (this.randomInt(5, 9) + this.randomInt(1, 9) / 10).toFixed(1);
        const b = (this.randomInt(1, 4) + this.randomInt(1, 9) / 10).toFixed(1);
        const result = (parseFloat(a) - parseFloat(b)).toFixed(1);
        
        return {
            expression: `${a} - ${b}`,
            displayExpression: `${a} - ${b}`,
            result: parseFloat(result),
            expectedSteps: [
                { expression: `${a} - ${b}`, result: parseFloat(result) },
            ],
            numSteps: 1
        };
    }

    // Easy: Decimal multiplied/divided by whole number
    buildDecimalByWholeNumber(difficulty) {
        const decimal = (this.randomInt(1, 5) + this.randomInt(1, 9) / 10).toFixed(1);
        const whole = this.randomInt(2, 5);
        const op = this.randomChoice(['×', '÷']);
        
        let result;
        if (op === '×') {
            result = (parseFloat(decimal) * whole).toFixed(1);
        } else {
            result = (parseFloat(decimal) / whole).toFixed(2);
        }
        
        return {
            expression: `${decimal} ${op} ${whole}`,
            displayExpression: `${decimal} ${op} ${whole}`,
            result: parseFloat(result),
            expectedSteps: [
                { expression: `${decimal} ${op} ${whole}`, result: parseFloat(result) },
            ],
            numSteps: 1
        };
    }

    // Medium/Hard: Decimal division
    buildDecimalDivision(difficulty) {
        let a, b, result;
        
        if (difficulty === 'hard') {
            a = (this.randomInt(10, 50) + this.randomInt(1, 99) / 100).toFixed(2);
            b = (this.randomInt(1, 5) + this.randomInt(1, 9) / 10).toFixed(1);
        } else {
            a = (this.randomInt(5, 20) + this.randomInt(1, 9) / 10).toFixed(1);
            b = this.randomInt(2, 5);
        }
        
        result = parseFloat((parseFloat(a) / parseFloat(b)).toFixed(2));
        
        return {
            expression: `${a} ÷ ${b}`,
            displayExpression: `${a} ÷ ${b}`,
            result: result,
            expectedSteps: [
                { expression: `${a} ÷ ${b}`, result: result },
            ],
            numSteps: 1
        };
    }

    // Hard: Complex decimal expression
    buildDecimalExpression(difficulty) {
        const a = (this.randomInt(1, 9) + this.randomInt(1, 9) / 10).toFixed(1);
        const b = (this.randomInt(1, 9) + this.randomInt(1, 9) / 10).toFixed(1);
        const c = this.randomInt(2, 5);
        
        const product = parseFloat(b) * c;
        const result = parseFloat((parseFloat(a) + product).toFixed(2));
        
        return {
            expression: `${a} + ${b} × ${c}`,
            displayExpression: `${a} + ${b} × ${c}`,
            result: result,
            expectedSteps: [
                { expression: `${b} × ${c}`, result: parseFloat(product.toFixed(2)) },
                { expression: `${a} + ${product.toFixed(2)}`, result: result },
            ],
            numSteps: 2
        };
    }

    // === CONVERSION BUILDERS ===

    // Easy/Medium: Decimal to fraction
    buildDecimalToFraction(difficulty) {
        const conversions = [
            { decimal: 0.5, num: 1, den: 2 },
            { decimal: 0.25, num: 1, den: 4 },
            { decimal: 0.75, num: 3, den: 4 },
            { decimal: 0.2, num: 1, den: 5 },
            { decimal: 0.4, num: 2, den: 5 },
            { decimal: 0.125, num: 1, den: 8 },
            { decimal: 0.375, num: 3, den: 8 },
        ];
        
        const conv = this.randomChoice(conversions);
        
        return {
            expression: `${conv.decimal} as fraction`,
            displayExpression: `${conv.decimal} = ?/?`,
            result: `${conv.num}/${conv.den}`,
            displayResult: `${conv.num}/${conv.den}`,
            expectedSteps: [
                { expression: `${conv.decimal}`, result: `${conv.num}/${conv.den}` },
            ],
            numSteps: 1,
            isTextAnswer: true
        };
    }

    // Medium: Mixed number to decimal
    buildMixedToDecimal(difficulty) {
        const whole = this.randomInt(1, 5);
        const fractions = [
            { num: 1, den: 2, decimal: 0.5 },
            { num: 1, den: 4, decimal: 0.25 },
            { num: 3, den: 4, decimal: 0.75 },
            { num: 1, den: 5, decimal: 0.2 },
        ];
        const frac = this.randomChoice(fractions);
        const result = whole + frac.decimal;
        
        return {
            expression: `${whole} ${frac.num}/${frac.den} as decimal`,
            displayExpression: `${whole} ${frac.num}/${frac.den} = ?`,
            result: result,
            expectedSteps: [
                { expression: `${frac.num}/${frac.den}`, result: frac.decimal },
                { expression: `${whole} + ${frac.decimal}`, result: result },
            ],
            numSteps: 2
        };
    }

    // Hard: Repeating decimals
    buildRepeatingDecimal(difficulty) {
        const repeating = [
            { num: 1, den: 3, decimal: '0.333...', value: 1/3 },
            { num: 2, den: 3, decimal: '0.666...', value: 2/3 },
            { num: 1, den: 6, decimal: '0.1666...', value: 1/6 },
            { num: 5, den: 6, decimal: '0.8333...', value: 5/6 },
            { num: 1, den: 9, decimal: '0.111...', value: 1/9 },
        ];
        
        const rep = this.randomChoice(repeating);
        
        return {
            expression: `${rep.num}/${rep.den} as decimal`,
            displayExpression: `${rep.num}/${rep.den} = ?`,
            result: rep.decimal,
            displayResult: rep.decimal,
            expectedSteps: [
                { expression: `${rep.num} ÷ ${rep.den}`, result: rep.decimal },
            ],
            numSteps: 1,
            isTextAnswer: true
        };
    }

    generateExpectedSteps(numbers, operators) {
        const steps = [];
        let values = [...numbers];
        let ops = [...operators];
        
        // First pass: handle * and /
        let i = 0;
        while (i < ops.length) {
            if (ops[i] === '*' || ops[i] === '/') {
                const left = values[i];
                const right = values[i + 1];
                const result = ops[i] === '*' ? left * right : Math.floor(left / right);
                
                steps.push({
                    expression: `${left} ${this.getOperatorSymbol(ops[i])} ${right}`,
                    result: result
                });
                
                values.splice(i, 2, result);
                ops.splice(i, 1);
            } else {
                i++;
            }
        }
        
        // Second pass: handle + and - (left to right)
        while (ops.length > 0) {
            const left = values[0];
            const right = values[1];
            const result = ops[0] === '+' ? left + right : left - right;
            
            steps.push({
                expression: `${left} ${this.getOperatorSymbol(ops[0])} ${right}`,
                result: result
            });
            
            values.splice(0, 2, result);
            ops.splice(0, 1);
        }
        
        return steps;
    }

    // Normalize expression for comparison (handle different minus signs, spaces, etc.)
    normalizeExpression(expr) {
        let normalized = expr
            .replace(/−/g, '-')  // normalize minus sign
            .replace(/[x×*]/gi, '*')  // normalize x, × and * to *
            .replace(/[÷:]/g, '/')  // normalize ÷ and : to /
            .replace(/\((\-?\d+)\)\/\((\d+)\)/g, '$1/$2')  // (4)/(6) → 4/6
            .replace(/\((\-?\d+)\)/g, '$1')  // remove unnecessary parentheses around numbers
            .toLowerCase()
            .trim();
        
        // Preserve single space for mixed numbers (e.g., "7 2/6")
        // Replace multiple spaces with single space
        normalized = normalized.replace(/\s+/g, ' ');
        
        // Remove spaces around operators except for mixed numbers
        // A mixed number is: digit(s) + space + digit(s)/digit(s)
        // First, protect mixed numbers by replacing their space with a placeholder
        normalized = normalized.replace(/(\d)\s+(\d+\/\d+)/g, '$1§$2');
        
        // Now remove all other spaces
        normalized = normalized.replace(/\s+/g, '');
        
        // Restore mixed number spaces
        normalized = normalized.replace(/§/g, ' ');
        
        return normalized;
    }

    // Check if two expressions are equivalent (considering commutative property for + and *)
    expressionsAreEquivalent(userExpr, expectedExpr) {
        const normalizedUser = this.normalizeExpression(userExpr);
        const normalizedExpected = this.normalizeExpression(expectedExpr);
        
        console.log('Expression comparison:', { normalizedUser, normalizedExpected });
        
        // Direct match
        if (normalizedUser === normalizedExpected) {
            return true;
        }
        
        // Check if both evaluate to the same value (for fractions, mixed numbers and decimals)
        const userValue = this.parseMixedOrExpression(userExpr);
        const expectedValue = this.parseMixedOrExpression(expectedExpr);
        console.log('Expression values:', { userValue, expectedValue });
        if (userValue !== null && expectedValue !== null && Math.abs(userValue - expectedValue) < 0.0001) {
            return true;
        }
        
        // Check commutative equivalence for + and *
        // Parse simple binary expressions like "a+b" or "a*b" (including negative numbers)
        const operatorMatch = normalizedExpected.match(/^(\(?-?\d+\)?)([\+\*])(\(?-?\d+\)?)$/);
        if (operatorMatch) {
            const [, left, op, right] = operatorMatch;
            // Check if user expression is the reversed version (commutative)
            const reversed = `${right}${op}${left}`;
            if (normalizedUser === reversed) {
                return true;
            }
            // Also try without parentheses
            const leftClean = left.replace(/[()]/g, '');
            const rightClean = right.replace(/[()]/g, '');
            const reversedClean = `${rightClean}${op}${leftClean}`;
            if (this.normalizeExpression(normalizedUser) === reversedClean) {
                return true;
            }
        }
        
        return false;
    }
    
    // Evaluate a simple arithmetic expression
    evaluateExpression(expr) {
        try {
            const normalized = this.normalizeExpression(expr);
            // Use eval for simple arithmetic (safe in this context as input is validated)
            const result = eval(normalized);
            return isNaN(result) || !isFinite(result) ? null : result;
        } catch (e) {
            return null;
        }
    }

    // Parse mixed number or simple expression to numeric value
    parseMixedOrExpression(expr) {
        if (!expr) return null;
        
        // First try as a mixed number (e.g., "2 1/6" or "7 2/6")
        const mixedValue = this.parseNumericValue(expr);
        if (mixedValue !== null) {
            return mixedValue;
        }
        
        // Try to evaluate as expression
        return this.evaluateExpression(expr);
    }

    // Validate a single step (both expression and result)
    validateStep(stepIndex, userExpression, userResult) {
        if (!this.currentProblem || stepIndex >= this.currentProblem.expectedSteps.length) {
            return { valid: false, error: 'invalid' };
        }
        
        const expected = this.currentProblem.expectedSteps[stepIndex];
        
        // Check if expression is provided
        if (!userExpression || userExpression.trim() === '') {
            return { valid: false, error: 'missing-expression' };
        }
        
        // Check if result is provided
        if (!userResult || userResult.trim() === '') {
            return { valid: false, error: 'missing-result' };
        }
        
        // Check if expressions are equivalent (including commutative property and alternatives)
        let expressionCorrect = this.expressionsAreEquivalent(userExpression, expected.expression);
        
        // Check alternative expressions if available
        if (!expressionCorrect && expected.altExpressions) {
            for (const altExpr of expected.altExpressions) {
                if (this.expressionsAreEquivalent(userExpression, altExpr)) {
                    expressionCorrect = true;
                    break;
                }
            }
        }
        
        // Compare results - handle both decimal and fraction format
        // For text answers (like fractions), compare as strings too
        let resultCorrect = false;
        const userResultTrimmed = userResult.trim();
        
        if (this.currentProblem.isTextAnswer) {
            const normalizedUserResult = this.normalizeExpression(userResultTrimmed);
            const normalizedExpected = this.normalizeExpression(String(expected.result));
            
            console.log('Text answer validation:', {
                userResultTrimmed,
                normalizedUserResult,
                normalizedExpected,
                expectedRequireExact: expected.requireExactFraction,
                problemRequireExact: this.currentProblem.requireExactFraction
            });
            
            // For problems requiring exact fraction (like simplification)
            if (expected.requireExactFraction || this.currentProblem.requireExactFraction) {
                // First check: user's answer must be in simplest form
                const isSimplestForm = this.isFractionInSimplestForm(userResultTrimmed);
                
                console.log('Simplification check:', {
                    userResult: userResultTrimmed,
                    normalized: normalizedUserResult,
                    expected: normalizedExpected,
                    isSimplestForm: isSimplestForm,
                    willReject: !isSimplestForm
                });
                
                if (!isSimplestForm) {
                    resultCorrect = false; // Not in simplest form - reject
                } else {
                    // In simplest form - now check if value matches
                    const userValue = this.parseNumericValue(userResultTrimmed);
                    const expectedValue = this.parseNumericValue(String(expected.result));
                    if (userValue !== null && expectedValue !== null) {
                        resultCorrect = Math.abs(userValue - expectedValue) < 0.0001;
                    } else {
                        // Fallback to string comparison
                        resultCorrect = normalizedUserResult === normalizedExpected;
                    }
                }
            } else {
                // Not a simplification problem - check exact match first
                resultCorrect = normalizedUserResult === normalizedExpected;
                
                if (!resultCorrect) {
                    // Check numeric equivalence (e.g., "1" == "2/2" == 1.0)
                    const userValue = this.parseNumericValue(userResultTrimmed);
                    const expectedValue = this.parseNumericValue(String(expected.result));
                    if (userValue !== null && expectedValue !== null) {
                        resultCorrect = Math.abs(userValue - expectedValue) < 0.0001;
                    }
                    
                    // Also check against decimalResult if available
                    if (!resultCorrect && expected.decimalResult !== undefined) {
                        if (userValue !== null) {
                            resultCorrect = Math.abs(userValue - expected.decimalResult) < 0.0001;
                        }
                    }
                }
            }
        } else {
            // Non-text answer - check numeric equivalence
            const userValue = this.parseNumericValue(userResultTrimmed);
            const expectedValue = typeof expected.result === 'number' ? expected.result : this.parseNumericValue(String(expected.result));
            
            if (userValue !== null && expectedValue !== null) {
                resultCorrect = Math.abs(userValue - expectedValue) < 0.0001;
            }
            
            // Also check against decimalResult if available
            if (!resultCorrect && expected.decimalResult !== undefined) {
                if (userValue !== null) {
                    resultCorrect = Math.abs(userValue - expected.decimalResult) < 0.0001;
                }
            }
        }
        
        // Debug logging for fractions
        if (!expressionCorrect || !resultCorrect) {
            console.log('Validation details:', {
                userExpr: userExpression,
                expectedExpr: expected.expression,
                altExpressions: expected.altExpressions,
                expressionCorrect,
                userResult: userResult,
                expectedResult: expected.result,
                resultCorrect,
                isTextAnswer: this.currentProblem.isTextAnswer
            });
        }
        
        if (expressionCorrect && resultCorrect) {
            return { valid: true };
        } else if (!expressionCorrect && !resultCorrect) {
            return { valid: false, error: 'both-wrong' };
        } else if (!expressionCorrect) {
            return { valid: false, error: 'expression-wrong' };
        } else {
            return { valid: false, error: 'result-wrong' };
        }
    }

    // Parse numeric value from string (handles decimals, fractions, and mixed numbers)
    parseNumericValue(str) {
        if (!str) return null;
        
        // Trim but preserve internal spaces for mixed number detection
        str = str.trim();
        
        // Try parsing as mixed number first (e.g., "7 2/6" or "3 1/4")
        const mixedMatch = str.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
        if (mixedMatch) {
            const whole = parseInt(mixedMatch[1]);
            const numerator = parseInt(mixedMatch[2]);
            const denominator = parseInt(mixedMatch[3]);
            if (denominator !== 0) {
                const sign = whole < 0 ? -1 : 1;
                return whole + sign * (numerator / denominator);
            }
        }
        
        // Remove all spaces for other parsing
        str = str.replace(/\s+/g, '');
        
        // Try parsing as decimal first
        const decimal = parseFloat(str);
        if (!isNaN(decimal) && !str.includes('/')) return decimal;
        
        // Try parsing as fraction (e.g., "2/3")
        const fractionMatch = str.match(/^\(?(-?\d+)\)?\s*\/\s*\(?(\d+)\)?$/);
        if (fractionMatch) {
            const numerator = parseInt(fractionMatch[1]);
            const denominator = parseInt(fractionMatch[2]);
            if (denominator !== 0) {
                return numerator / denominator;
            }
        }
        
        // Try parsing fraction with parentheses around whole fraction (e.g., "(2/3)")
        const parenFractionMatch = str.match(/^\(\s*(-?\d+)\s*\/\s*(\d+)\s*\)$/);
        if (parenFractionMatch) {
            const numerator = parseInt(parenFractionMatch[1]);
            const denominator = parseInt(parenFractionMatch[2]);
            if (denominator !== 0) {
                return numerator / denominator;
            }
        }
        
        // Try parsing expression fraction like (3+3)/(6) or (3+3)/6
        const exprFractionMatch = str.match(/^\(([^)]+)\)\/\(?(\d+)\)?$/);
        if (exprFractionMatch) {
            try {
                const numerator = this.evaluateSimpleExpression(exprFractionMatch[1]);
                const denominator = parseInt(exprFractionMatch[2]);
                if (numerator !== null && denominator !== 0) {
                    return numerator / denominator;
                }
            } catch (e) { /* ignore */ }
        }
        
        // Try parsing expression fraction like 6/(2+1)
        const exprDenomMatch = str.match(/^(\d+)\/\(([^)]+)\)$/);
        if (exprDenomMatch) {
            try {
                const numerator = parseInt(exprDenomMatch[1]);
                const denominator = this.evaluateSimpleExpression(exprDenomMatch[2]);
                if (denominator !== null && denominator !== 0) {
                    return numerator / denominator;
                }
            } catch (e) { /* ignore */ }
        }
        
        return null;
    }

    // Evaluate a simple arithmetic expression (e.g., "3+3", "6-2", "4*2")
    evaluateSimpleExpression(expr) {
        if (!expr) return null;
        
        // Only allow digits and basic operators for safety
        const cleanExpr = expr.replace(/\s+/g, '').replace(/×/g, '*').replace(/÷/g, '/');
        if (!/^[\d+\-*/().]+$/.test(cleanExpr)) return null;
        
        try {
            // Use Function constructor as a safer alternative to eval
            const result = new Function('return ' + cleanExpr)();
            return typeof result === 'number' && isFinite(result) ? result : null;
        } catch (e) {
            return null;
        }
    }

    // Check if a fraction string is in its simplest form
    isFractionInSimplestForm(str) {
        console.log('isFractionInSimplestForm called with:', str);
        if (!str) return false;
        
        // Normalize and extract numerator/denominator
        const normalized = this.normalizeExpression(str);
        console.log('Normalized to:', normalized);
        const fractionMatch = normalized.match(/^(-?\d+)\/(\d+)$/);
        console.log('Fraction match:', fractionMatch);
        
        if (!fractionMatch) {
            // Not a fraction - check if it's a whole number (which is always in simplest form)
            const isWholeNumber = /^-?\d+$/.test(normalized);
            console.log('Not a fraction, is whole number:', isWholeNumber);
            return isWholeNumber;
        }
        
        const numerator = Math.abs(parseInt(fractionMatch[1]));
        const denominator = parseInt(fractionMatch[2]);
        
        console.log('Parsed num/den:', numerator, '/', denominator);
        
        if (denominator === 0) return false;
        if (denominator === 1) return true; // n/1 should be written as n, but accept it
        
        // Check if GCD is 1 (simplest form)
        const gcdValue = this.gcd(numerator, denominator);
        console.log('GCD:', gcdValue, '- in simplest form:', gcdValue === 1);
        return gcdValue === 1;
    }

    // Validate all steps
    validateAllSteps(userSteps) {
        if (!this.currentProblem) {
            return { valid: false, message: 'No active problem' };
        }
        
        const expected = this.currentProblem.expectedSteps;
        const results = [];
        let allCorrect = true;
        let firstErrorIndex = -1;
        let firstErrorType = null;
        
        for (let i = 0; i < expected.length; i++) {
            const userStep = userSteps[i] || { expression: '', result: '' };
            const validation = this.validateStep(i, userStep.expression, userStep.result);
            
            results.push({
                index: i,
                valid: validation.valid,
                error: validation.error
            });
            
            if (!validation.valid) {
                allCorrect = false;
                if (firstErrorIndex === -1) {
                    firstErrorIndex = i;
                    firstErrorType = validation.error;
                }
            }
        }
        
        // Update score only when checking
        if (allCorrect) {
            this.score.correct++;
        }
        this.score.total++;
        
        return {
            valid: allCorrect,
            results: results,
            firstErrorIndex: firstErrorIndex,
            firstErrorType: firstErrorType,
            finalAnswer: this.currentProblem.displayResult || this.currentProblem.result
        };
    }

    getOperatorSymbol(op) {
        const symbols = { '+': '+', '-': '-', '*': '*', '/': ':' };
        return symbols[op] || op;
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

    // Validate input: only allow numbers, basic operators, spaces, parentheses
    validateArithmeticInput(input) {
        // Allow: digits, +, -, *, ×, /, ÷, spaces, parentheses
        const validPattern = /^[0-9+\-*/×÷()\/\s]*$/;
        return validPattern.test(input);
    }
}


// Trainer Controller - Handles UI interactions
class TrainerController {
    constructor() {
        this.trainer = new MathTrainer();
        this.stepRows = [];
        this.currentStep = 0;
        this.completedSteps = 0;
    }

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Trainer container not found');
            return;
        }
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.trainer.difficulty = btn.dataset.difficulty;
            });
        });

        // Arithmetic problem type buttons
        document.querySelectorAll('.arithmetic-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.arithmetic-type-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.trainer.problemType = btn.dataset.type;
            });
        });

        // New problem button
        document.getElementById('newProblemBtn')?.addEventListener('click', () => this.generateNewProblem());

        // Hide the check button - we'll validate after each step instead
        const checkBtn = document.getElementById('checkAnswerBtn');
        if (checkBtn) checkBtn.style.display = 'none';

        // Reset score button
        document.getElementById('resetScoreBtn')?.addEventListener('click', () => {
            this.trainer.resetScore();
            this.updateScoreDisplay();
        });

        this.problemDisplay = document.getElementById('trainerProblemDisplay');
        this.workspaceArea = document.getElementById('trainerWorkspace');
        this.stepsContainer = document.getElementById('trainerStepsContainer');
        this.feedbackDisplay = document.getElementById('trainerFeedback');
    }

    generateNewProblem() {
        const problem = this.trainer.generateProblem();
        this.currentStep = 0;
        this.completedSteps = 0;
        this.displayProblem(problem);
        this.createStepInputs(problem.numSteps);
        this.clearFeedback();
        
        // Focus first input
        setTimeout(() => {
            const firstInput = this.stepsContainer?.querySelector('.step-expression-input');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    displayProblem(problem) {
        if (!this.problemDisplay) return;
        
        // Render expression with fractions if it contains them
        const displayExpr = window.FractionRenderer 
            ? window.FractionRenderer.renderExpression(problem.displayExpression)
            : problem.displayExpression;
        
        // Don't add "= ?" if the expression already ends with "?" or "= ?"
        const suffix = problem.displayExpression.includes('?') ? '' : ' = ?';
        
        this.problemDisplay.innerHTML = `
            <div class="problem-expression-large">${displayExpr}${suffix}</div>
        `;
        
        if (this.workspaceArea) {
            this.workspaceArea.style.display = 'block';
        }
    }

    createStepInputs(numSteps) {
        if (!this.stepsContainer) return;
        
        this.stepRows = [];
        this.miniEditors = []; // Store mini editor instances
        
        const instructionText = window.t ? window.t('trainerStepsInstruction') : 
            'Solve step by step. For each step, enter the sub-expression you are calculating and its result:';
        
        let html = `<div class="steps-instruction">${instructionText}</div>`;
        
        for (let i = 0; i < numSteps; i++) {
            const stepLabel = window.t ? window.t('trainerStep') : 'Step';
            const lockedClass = i > 0 ? 'step-locked' : '';
            
            html += `
                <div class="step-row ${lockedClass}" data-step="${i}">
                    <span class="step-label">${stepLabel} ${i + 1}:</span>
                    <div class="step-inputs">
                        <div class="step-expression-editor" data-step="${i}"></div>
                        <span class="step-equals">=</span>
                        <div class="step-result-editor" data-step="${i}"></div>
                    </div>
                    <span class="step-status"></span>
                </div>
            `;
        }
        
        this.stepsContainer.innerHTML = html;
        
        // Create MiniMathEditor instances for each step
        const rows = this.stepsContainer.querySelectorAll('.step-row');
        rows.forEach((row, index) => {
            const exprContainer = row.querySelector('.step-expression-editor');
            const resultContainer = row.querySelector('.step-result-editor');
            const isLocked = index > 0;
            
            const exprPlaceholder = window.t ? window.t('trainerExprPlaceholder') : 'e.g. 5 × 3';
            const resultPlaceholder = window.t ? window.t('trainerResultPlaceholder') : '= ?';
            
            // Create expression editor
            const exprEditor = new MiniMathEditor(exprContainer, {
                placeholder: exprPlaceholder,
                showToolbar: true,
                compact: true,
                onEnter: () => {
                    // Move focus to result editor on Enter
                    resultEditor.focus();
                }
            });
            
            // Create result editor  
            const resultEditor = new MiniMathEditor(resultContainer, {
                placeholder: resultPlaceholder,
                showToolbar: true,
                compact: true,
                onEnter: () => {
                    // Validate step on Enter
                    this.validateCurrentStep(index);
                }
            });
            
            // Disable editors if step is locked
            if (isLocked) {
                exprEditor.setDisabled(true);
                resultEditor.setDisabled(true);
            }
            
            this.stepRows.push({
                row: row,
                exprEditor: exprEditor,
                resultEditor: resultEditor,
                validated: false
            });
            
            this.miniEditors.push({ expr: exprEditor, result: resultEditor });
        });
    }

    validateCurrentStep(stepIndex) {
        const stepData = this.stepRows[stepIndex];
        if (!stepData || stepData.validated) return;
        
        // Get values from MiniMathEditor instances
        const userExpression = stepData.exprEditor.getValue();
        const userResult = stepData.resultEditor.getValue();
        
        // Don't validate if fields are empty
        if (!userExpression.trim() || !userResult.trim()) {
            return;
        }
        
        const validation = this.trainer.validateStep(stepIndex, userExpression, userResult);
        const { row, exprEditor, resultEditor } = stepData;
        const status = row.querySelector('.step-status');
        
        // Clear any previous error state
        row.classList.remove('incorrect');
        const exprWrapper = row.querySelector('.step-expression-editor .mini-editor-wrapper');
        const resultWrapper = row.querySelector('.step-result-editor .mini-editor-wrapper');
        if (exprWrapper) exprWrapper.classList.remove('error');
        if (resultWrapper) resultWrapper.classList.remove('error');
        
        if (validation.valid) {
            // Mark step as correct
            stepData.validated = true;
            row.classList.add('correct');
            row.classList.remove('step-locked');
            status.innerHTML = '✓';
            status.className = 'step-status correct';
            
            // Disable editors for this step
            exprEditor.setDisabled(true);
            resultEditor.setDisabled(true);
            if (exprWrapper) exprWrapper.classList.add('success');
            if (resultWrapper) resultWrapper.classList.add('success');
            
            this.completedSteps++;
            
            // Unlock and focus next step
            if (stepIndex < this.stepRows.length - 1) {
                const nextStep = this.stepRows[stepIndex + 1];
                nextStep.row.classList.remove('step-locked');
                nextStep.exprEditor.setDisabled(false);
                nextStep.resultEditor.setDisabled(false);
                
                setTimeout(() => {
                    nextStep.exprEditor.focus();
                }, 100);
                
                this.clearFeedback();
            } else {
                // All steps completed!
                this.onProblemComplete(true);
            }
        } else {
            // Mark step as incorrect
            row.classList.add('incorrect');
            status.innerHTML = '✗';
            status.className = 'step-status incorrect';
            
            // Handle different error types
            if (validation.error === 'expression-wrong' || validation.error === 'both-wrong') {
                // Expression is wrong - clear result and highlight expression
                if (exprWrapper) exprWrapper.classList.add('error');
                resultEditor.clear(); // Clear result since expression is wrong
                
                // Show feedback for wrong step
                const msg = window.t ? window.t('trainerWrongStep') : 'Wrong step!';
                const tryAgain = window.t ? window.t('trainerTryAgain') : 'Try again!';
                this.showFeedback(`${msg} ${tryAgain}`, 'error');
                
                // Focus expression editor
                exprEditor.focus();
            } else if (validation.error === 'result-wrong') {
                // Expression is correct but result is wrong
                if (resultWrapper) resultWrapper.classList.add('error');
                
                // Show feedback for wrong result
                const msg = window.t ? window.t('trainerWrongAnswer') : 'Wrong answer!';
                const tryAgain = window.t ? window.t('trainerTryAgain') : 'Try again!';
                this.showFeedback(`${msg} ${tryAgain}`, 'error');
                
                // Focus result editor
                resultEditor.focus();
            }
        }
    }

    showStepError(stepNum, errorType) {
        let errorMsg = '';
        
        switch (errorType) {
            case 'expression-wrong':
                errorMsg = window.t ? window.t('trainerWrongExpression') : 'Check the expression';
                break;
            case 'result-wrong':
                errorMsg = window.t ? window.t('trainerWrongResult') : 'Check the calculation result';
                break;
            case 'both-wrong':
                errorMsg = window.t ? window.t('trainerWrongBoth') : 'Check both expression and result';
                break;
            default:
                errorMsg = window.t ? window.t('trainerCheckStep') : 'Check step';
        }
        
        const tryAgain = window.t ? window.t('trainerTryAgain') : 'Try again!';
        this.showFeedback(`${errorMsg}. ${tryAgain}`, 'error');
    }

    onProblemComplete(success) {
        if (success) {
            this.trainer.score.correct++;
        }
        this.trainer.score.total++;
        
        // Use displayResult if available (for fractions), otherwise use result
        const problem = this.trainer.currentProblem;
        let finalAnswer = problem.displayResult || problem.result;
        
        // Render fraction nicely if it's a text answer with fraction
        if (problem.isTextAnswer && typeof finalAnswer === 'string' && finalAnswer.includes('/')) {
            if (window.FractionRenderer) {
                finalAnswer = window.FractionRenderer.renderExpression(finalAnswer);
            }
        }
        
        const msg = window.t ? window.t('trainerAllCorrect') : 'Excellent! All steps are correct!';
        const answerText = window.t ? window.t('trainerFinalAnswer') : 'The answer is';
        const nextBtnText = window.t ? window.t('trainerNextProblem') : 'Next Problem';
        
        this.showFeedbackWithButton(`🎉 ${msg} ${answerText}: ${finalAnswer}`, 'success', nextBtnText);
        this.updateScoreDisplay();
    }

    showFeedback(message, type) {
        if (!this.feedbackDisplay) return;
        this.feedbackDisplay.innerHTML = message;
        this.feedbackDisplay.className = 'trainer-feedback ' + type;
        this.feedbackDisplay.style.display = 'block';
    }

    showFeedbackWithButton(message, type, buttonText) {
        if (!this.feedbackDisplay) return;
        this.feedbackDisplay.innerHTML = `
            <span class="feedback-message">${message}</span>
            <button class="control-btn primary-btn next-problem-btn" id="nextProblemBtn">${buttonText} →</button>
        `;
        this.feedbackDisplay.className = 'trainer-feedback ' + type + ' with-button';
        this.feedbackDisplay.style.display = 'block';
        
        // Add click handler for the next problem button
        document.getElementById('nextProblemBtn')?.addEventListener('click', () => {
            this.generateNewProblem();
        });
    }

    clearFeedback() {
        if (this.feedbackDisplay) {
            this.feedbackDisplay.style.display = 'none';
        }
    }

    updateScoreDisplay() {
        const score = this.trainer.getScore();
        const scoreDisplay = document.getElementById('trainerScore');
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
