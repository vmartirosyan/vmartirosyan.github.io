// Math Trainer - Multi-operation expression solving with step-by-step validation
class MathTrainer {
    constructor() {
        this.currentProblem = null;
        this.difficulty = 'easy';
        this.score = { correct: 0, total: 0 };
    }

    generateProblem() {
        const problem = this.createProblem();
        this.currentProblem = problem;
        return problem;
    }

    createProblem() {
        switch (this.difficulty) {
            case 'easy': return this.createEasyProblem();
            case 'medium': return this.createMediumProblem();
            case 'hard': return this.createHardProblem();
            default: return this.createEasyProblem();
        }
    }

    createEasyProblem() {
        const templates = [
            () => this.buildSimpleExpression(2, { min: 2, max: 12 }, ['+', '+']),
            () => this.buildSimpleExpression(2, { min: 2, max: 10 }, ['+', '*']),
            () => this.buildSimpleExpression(2, { min: 2, max: 8 }, ['*', '+']),
            () => this.buildSubtractionExpression({ min: 5, max: 20 }, 'easy'),
        ];
        return this.randomChoice(templates)();
    }

    createMediumProblem() {
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

    createHardProblem() {
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
        return expr
            .replace(/\s+/g, '') // remove spaces
            .replace(/−/g, '-')  // normalize minus sign
            .replace(/[x×*]/gi, '*')  // normalize x, × and * to *
            .replace(/[÷:]/g, '/')  // normalize ÷ and : to /
            .replace(/\((\-?\d+)\)/g, '$1')  // remove unnecessary parentheses around numbers
            .toLowerCase();
    }

    // Check if two expressions are equivalent (considering commutative property for + and *)
    expressionsAreEquivalent(userExpr, expectedExpr) {
        const normalizedUser = this.normalizeExpression(userExpr);
        const normalizedExpected = this.normalizeExpression(expectedExpr);
        
        // Direct match
        if (normalizedUser === normalizedExpected) {
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
        
        // Check if expressions are equivalent (including commutative property)
        const expressionCorrect = this.expressionsAreEquivalent(userExpression, expected.expression);
        
        // Compare results
        const userValue = parseFloat(userResult.trim());
        const resultCorrect = !isNaN(userValue) && Math.abs(userValue - expected.result) < 0.0001;
        
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
            finalAnswer: this.currentProblem.result
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
        
        this.problemDisplay.innerHTML = `
            <div class="problem-expression-large">${problem.displayExpression} = ?</div>
        `;
        
        if (this.workspaceArea) {
            this.workspaceArea.style.display = 'block';
        }
    }

    createStepInputs(numSteps) {
        if (!this.stepsContainer) return;
        
        this.stepRows = [];
        
        const instructionText = window.t ? window.t('trainerStepsInstruction') : 
            'Solve step by step. For each step, enter the sub-expression you are calculating and its result:';
        
        let html = `<div class="steps-instruction">${instructionText}</div>`;
        
        for (let i = 0; i < numSteps; i++) {
            const stepLabel = window.t ? window.t('trainerStep') : 'Step';
            const exprPlaceholder = window.t ? window.t('trainerExprPlaceholder') : 'e.g. 5 * 3';
            const resultPlaceholder = window.t ? window.t('trainerResultPlaceholder') : '= ?';
            
            // Only first step is enabled initially
            const disabled = i > 0 ? 'disabled' : '';
            const lockedClass = i > 0 ? 'step-locked' : '';
            
            html += `
                <div class="step-row ${lockedClass}" data-step="${i}">
                    <span class="step-label">${stepLabel} ${i + 1}:</span>
                    <div class="step-inputs">
                        <input type="text" class="step-expression-input" data-step="${i}" 
                               placeholder="${exprPlaceholder}" autocomplete="off" ${disabled}>
                        <span class="step-equals">=</span>
                        <input type="text" class="step-result-input" data-step="${i}" 
                               placeholder="${resultPlaceholder}" autocomplete="off" ${disabled}>
                    </div>
                    <span class="step-status"></span>
                </div>
            `;
        }
        
        this.stepsContainer.innerHTML = html;
        
        // Collect all step rows and setup validation triggers
        const rows = this.stepsContainer.querySelectorAll('.step-row');
        rows.forEach((row, index) => {
            const exprInput = row.querySelector('.step-expression-input');
            const resultInput = row.querySelector('.step-result-input');
            
            this.stepRows.push({
                row: row,
                expressionInput: exprInput,
                resultInput: resultInput,
                validated: false
            });
            
            // Tab from expression to result
            exprInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    resultInput.focus();
                }
            });
            
            // Validate when user presses Enter in result field or leaves result field
            resultInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.validateCurrentStep(index);
                }
            });
            
            // Also validate on blur (when leaving the result field)
            resultInput.addEventListener('blur', () => {
                // Only validate if both fields have values
                if (exprInput.value.trim() && resultInput.value.trim()) {
                    this.validateCurrentStep(index);
                }
            });
        });
    }

    validateCurrentStep(stepIndex) {
        const stepData = this.stepRows[stepIndex];
        if (!stepData || stepData.validated) return;
        
        const userExpression = stepData.expressionInput.value;
        const userResult = stepData.resultInput.value;
        
        // Don't validate if fields are empty
        if (!userExpression.trim() || !userResult.trim()) {
            return;
        }
        
        const validation = this.trainer.validateStep(stepIndex, userExpression, userResult);
        const { row, expressionInput, resultInput } = stepData;
        const status = row.querySelector('.step-status');
        
        // Clear any previous error state
        row.classList.remove('incorrect');
        expressionInput.classList.remove('input-error');
        resultInput.classList.remove('input-error');
        
        if (validation.valid) {
            // Mark step as correct
            stepData.validated = true;
            row.classList.add('correct');
            row.classList.remove('step-locked');
            status.innerHTML = '✓';
            status.className = 'step-status correct';
            
            // Disable inputs for this step
            expressionInput.disabled = true;
            resultInput.disabled = true;
            
            this.completedSteps++;
            
            // Unlock and focus next step
            if (stepIndex < this.stepRows.length - 1) {
                const nextStep = this.stepRows[stepIndex + 1];
                nextStep.row.classList.remove('step-locked');
                nextStep.expressionInput.disabled = false;
                nextStep.resultInput.disabled = false;
                
                setTimeout(() => {
                    nextStep.expressionInput.focus();
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
                expressionInput.classList.add('input-error');
                resultInput.value = ''; // Clear result since expression is wrong
                
                // Show feedback for wrong step
                const msg = window.t ? window.t('trainerWrongStep') : 'Wrong step!';
                const tryAgain = window.t ? window.t('trainerTryAgain') : 'Try again!';
                this.showFeedback(`${msg} ${tryAgain}`, 'error');
                
                // Focus expression input
                expressionInput.focus();
                expressionInput.select();
            } else if (validation.error === 'result-wrong') {
                // Expression is correct but result is wrong
                resultInput.classList.add('input-error');
                
                // Show feedback for wrong result
                const msg = window.t ? window.t('trainerWrongAnswer') : 'Wrong answer!';
                const tryAgain = window.t ? window.t('trainerTryAgain') : 'Try again!';
                this.showFeedback(`${msg} ${tryAgain}`, 'error');
                
                // Focus result input
                resultInput.focus();
                resultInput.select();
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
        
        const finalAnswer = this.trainer.currentProblem.result;
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
