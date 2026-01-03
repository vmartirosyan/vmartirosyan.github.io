// Fraction rendering utilities for Math Trainer
// Converts expressions like (x+1)/(3x+5) to visual fractions

class FractionRenderer {
    // Convert expression with divisions to HTML with visual fractions
    static renderExpression(expr) {
        if (!expr) return expr;
        
        // Match patterns like (numerator)/(denominator) or simple a/b
        // More complex: match nested parentheses
        let html = expr;
        
        // Pattern 0: Mixed numbers (e.g., "4 1/6" or "7 2/3")
        html = html.replace(/(\d+)\s+(\d+)\/(\d+)/g, (match, whole, num, den) => {
            return `<span class="math-mixed-number">${whole}${this.createFractionHTML(num, den)}</span>`;
        });
        
        // Pattern 1: (complex)/(complex) - with parentheses
        html = html.replace(/\(([^()]+)\)\/\(([^()]+)\)/g, (match, num, den) => {
            return this.createFractionHTML(num, den);
        });
        
        // Pattern 2: (expression)/number or number/(expression)
        html = html.replace(/\(([^()]+)\)\/(\d+)/g, (match, num, den) => {
            return this.createFractionHTML(num, den);
        });
        
        html = html.replace(/(\d+)\/\(([^()]+)\)/g, (match, num, den) => {
            return this.createFractionHTML(num, den);
        });
        
        // Pattern 3: simple fractions a/b (only if not already converted)
        html = html.replace(/(\d+)\/(\d+)/g, (match, num, den) => {
            return this.createFractionHTML(num, den);
        });
        
        // Pattern 4: variable fractions like x/y, 2x/3, etc.
        html = html.replace(/([a-z0-9]+)\/([a-z0-9]+)/gi, (match, num, den) => {
            return this.createFractionHTML(num, den);
        });
        
        return html;
    }
    
    // Create HTML for a visual fraction
    static createFractionHTML(numerator, denominator) {
        return `<span class="math-fraction">
            <span class="fraction-numerator">${numerator}</span>
            <span class="fraction-line"></span>
            <span class="fraction-denominator">${denominator}</span>
        </span>`;
    }
    
    // Render expression in steps (for step-by-step display)
    static renderStepExpression(expr) {
        return this.renderExpression(expr);
    }
    
    // Check if expression contains fractions
    static hasFractions(expr) {
        return /\//.test(expr);
    }
}

// Make it available globally
window.FractionRenderer = FractionRenderer;
