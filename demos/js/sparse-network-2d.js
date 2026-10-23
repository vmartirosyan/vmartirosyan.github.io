/**
 * JavaScript implementation of SparseNetwork2D
 * Loads and runs sparse polynomial neural networks in the browser
 */

class SparseNetwork2D {
    constructor() {
        this.metadata = {};
        this.architecture = {};
        this.customFields = {};
        
        // Weight arrays
        this.weightsFirstOrder = [];
        this.weightsSecondOrder = [];
        
        // 2D-specific weights
        this.weightsNeighborhood3x3 = [];
        this.weightsNeighborhood5x5 = [];
        this.weightsCross3Length = [];
        this.weightsCross5Length = [];
        
        // Active indices (sparse network)
        this.activeFirstOrder = new Set();
        this.activeSecondOrder = new Set(); // Store as "i,j" strings
        this.activeNeighborhood3x3 = new Set();
        this.activeNeighborhood5x5 = new Set();
        this.activeCross3Length = new Set();
        this.activeCross5Length = new Set();
        
        this.inputWidth = 0;
        this.inputHeight = 0;
        this.inputSize = 0;
        
        this.preprocessedInput = [];
    }
    
    /**
     * Load network from binary file
     */
    async loadFromFile(filepath) {
        const response = await fetch(filepath);
        if (!response.ok) {
            throw new Error(`Failed to load network: ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        this.parseNetworkFile(arrayBuffer);
    }
    
    /**
     * Parse the network file format (text header + binary weights)
     */
    parseNetworkFile(arrayBuffer) {
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Find end of text section
        const endMarker = "# END_OF_TEXT_SECTION\n";
        let textEndIndex = 0;
        const decoder = new TextDecoder();
        const text = decoder.decode(uint8Array);
        const markerIndex = text.indexOf(endMarker);
        
        if (markerIndex === -1) {
            throw new Error("Invalid network file format: missing END_OF_TEXT_SECTION marker");
        }
        
        textEndIndex = markerIndex + endMarker.length;
        
        // Parse text section
        const textSection = text.substring(0, textEndIndex);
        this.parseTextSection(textSection);
        
        // Parse binary section. Compute header byte-length and slice the buffer so
        // the binary part starts at offset 0 of the new ArrayBuffer. This avoids
        // alignment errors when creating Float32Array views on the buffer.
        const encoder = new TextEncoder();
        const headerBytes = encoder.encode(textSection).length;
        const binaryBuffer = arrayBuffer.slice(headerBytes);
        this.parseBinarySection(binaryBuffer);
    }
    
    /**
     * Parse text metadata section
     */
    parseTextSection(text) {
        const lines = text.split('\n');
        let currentSection = '';
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            
            // Section header
            if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                currentSection = trimmed.slice(1, -1);
                continue;
            }
            
            // Key=value pairs
            const eqIndex = trimmed.indexOf('=');
            if (eqIndex === -1) continue;
            
            const key = trimmed.substring(0, eqIndex);
            const value = trimmed.substring(eqIndex + 1);
            
            if (currentSection === 'ARCHITECTURE') {
                this.architecture[key] = value;
                if (key === 'input_size') this.inputSize = parseInt(value);
            } else if (currentSection === 'CUSTOM_FIELDS') {
                this.customFields[key] = value;
                
                // Parse image dimensions
                if (key === 'image_width') this.inputWidth = parseInt(value);
                if (key === 'image_height') this.inputHeight = parseInt(value);
                
                // Parse active indices counts
                if (key === 'active_first_order') this.customFields.activeFirstOrderCount = parseInt(value);
                if (key === 'active_second_order') this.customFields.activeSecondOrderCount = parseInt(value);
                if (key === 'active_neighborhood_3x3') this.customFields.activeNeighborhood3x3Count = parseInt(value);
                if (key === 'active_neighborhood_5x5') this.customFields.activeNeighborhood5x5Count = parseInt(value);
                if (key === 'active_cross_3length') this.customFields.activeCross3LengthCount = parseInt(value);
                if (key === 'active_cross_5length') this.customFields.activeCross5LengthCount = parseInt(value);
                
                // Parse target values - store directly, not nested
                if (key === 'target_positive') {
                    this.customFields.targetPositive = parseFloat(value);
                }
                if (key === 'target_negative') {
                    this.customFields.targetNegative = parseFloat(value);
                }
            }
        }
    }
    
    /**
     * Parse binary weights section
     * The binary section contains DENSE weight arrays (all weights, not just active ones)
     * We read all weights and then filter to only use the active indices
     */
    parseBinarySection(arrayBuffer) {
        // arrayBuffer here should already be the binary part (no text header)
        const float32Array = new Float32Array(arrayBuffer);
        let position = 0;
        
        // Read ALL first order weights (dense array)
        const firstOrderCount = this.inputSize;
        for (let i = 0; i < firstOrderCount && position < float32Array.length; i++) {
            this.weightsFirstOrder[i] = float32Array[position++];
        }
        
        // Read ALL second order weights (dense array)
        // Second order: i <= j pairs, so count = inputSize * (inputSize + 1) / 2
        const secondOrderCount = (this.inputSize * (this.inputSize + 1)) / 2;
        let idx = 0;
        for (let i = 0; i < this.inputSize && position < float32Array.length; i++) {
            if (!this.weightsSecondOrder[i]) this.weightsSecondOrder[i] = [];
            for (let j = i; j < this.inputSize && position < float32Array.length; j++) {
                this.weightsSecondOrder[i][j] = float32Array[position++];
                idx++;
            }
        }
        
        // Read third order if enabled (we'll skip for now since enable_third_order=false)
        const thirdOrderEnabled = this.architecture.enable_third_order === 'true';
        if (thirdOrderEnabled) {
            // Skip third order weights
            const thirdOrderCount = (this.inputSize * (this.inputSize + 1) * (this.inputSize + 2)) / 6;
            position += thirdOrderCount;
        }
        
        // Read neighborhood 3x3 weights
        const neighborhood3x3Count = this.inputWidth > 0 ? (this.inputWidth - 2) * (this.inputHeight - 2) : 0;
        for (let i = 0; i < neighborhood3x3Count && position < float32Array.length; i++) {
            this.weightsNeighborhood3x3[i] = float32Array[position++];
        }
        
        // Read neighborhood 5x5 weights
        const neighborhood5x5Count = this.inputWidth > 0 ? (this.inputWidth - 4) * (this.inputHeight - 4) : 0;
        for (let i = 0; i < neighborhood5x5Count && position < float32Array.length; i++) {
            this.weightsNeighborhood5x5[i] = float32Array[position++];
        }
        
        // Read cross 3-length weights
        const cross3LengthCount = this.inputWidth > 0 ? (this.inputWidth - 2) * (this.inputHeight - 2) : 0;
        for (let i = 0; i < cross3LengthCount && position < float32Array.length; i++) {
            this.weightsCross3Length[i] = float32Array[position++];
        }
        
        // Read cross 5-length weights
        const cross5LengthCount = this.inputWidth > 0 ? (this.inputWidth - 4) * (this.inputHeight - 4) : 0;
        for (let i = 0; i < cross5LengthCount && position < float32Array.length; i++) {
            this.weightsCross5Length[i] = float32Array[position++];
        }
        
        // Now build the active index sets by finding non-zero weights
        const epsilon = 1e-10;
        
        for (let i = 0; i < this.weightsFirstOrder.length; i++) {
            if (Math.abs(this.weightsFirstOrder[i]) > epsilon) {
                this.activeFirstOrder.add(i);
            }
        }
        
        for (let i = 0; i < this.inputSize; i++) {
            if (this.weightsSecondOrder[i]) {
                for (let j = i; j < this.inputSize; j++) {
                    if (this.weightsSecondOrder[i][j] !== undefined && 
                        Math.abs(this.weightsSecondOrder[i][j]) > epsilon) {
                        this.activeSecondOrder.add(`${i},${j}`);
                    }
                }
            }
        }
        
        for (let i = 0; i < neighborhood3x3Count; i++) {
            if (Math.abs(this.weightsNeighborhood3x3[i]) > epsilon) {
                this.activeNeighborhood3x3.add(i);
            }
        }
        
        for (let i = 0; i < neighborhood5x5Count; i++) {
            if (Math.abs(this.weightsNeighborhood5x5[i]) > epsilon) {
                this.activeNeighborhood5x5.add(i);
            }
        }
        
        for (let i = 0; i < cross3LengthCount; i++) {
            if (Math.abs(this.weightsCross3Length[i]) > epsilon) {
                this.activeCross3Length.add(i);
            }
        }
        
        for (let i = 0; i < cross5LengthCount; i++) {
            if (Math.abs(this.weightsCross5Length[i]) > epsilon) {
                this.activeCross5Length.add(i);
            }
        }
    }
    
    /**
     * Set input and preprocess (normalize to [0,2] range)
     */
    setInput(inputData) {
        // Find min/max
        let inputMin = Infinity;
        let inputMax = -Infinity;
        for (const val of inputData) {
            if (val < inputMin) inputMin = val;
            if (val > inputMax) inputMax = val;
        }
        
        // Normalize to [0,2] range
        this.preprocessedInput = new Array(inputData.length);
        if (inputMax !== inputMin) {
            const inputRange = inputMax - inputMin;
            for (let i = 0; i < inputData.length; i++) {
                const normalized = (inputData[i] - inputMin) / inputRange;
                this.preprocessedInput[i] = 2.0 * normalized;
            }
        } else {
            // All values same - set to middle of range
            for (let i = 0; i < inputData.length; i++) {
                this.preprocessedInput[i] = 1.0;
            }
        }
    }
    
    /**
     * Compute network output (polynomial evaluation)
     */
    compute() {
        let output = 0.0;
        const input = this.preprocessedInput;
        
        // First order terms
        for (const i of this.activeFirstOrder) {
            output += this.weightsFirstOrder[i] * input[i];
        }
        
        // Second order terms
        for (const key of this.activeSecondOrder) {
            const [i, j] = key.split(',').map(x => parseInt(x));
            if (this.weightsSecondOrder[i] && this.weightsSecondOrder[i][j] !== undefined) {
                output += this.weightsSecondOrder[i][j] * input[i] * input[j];
            }
        }
        
        // 3x3 Neighborhood terms (9th-order with normalization)
        for (const idx of this.activeNeighborhood3x3) {
            const y = Math.floor(idx / (this.inputWidth - 2));
            const x = idx % (this.inputWidth - 2);
            
            let product = 1.0;
            for (let dy = 0; dy < 3; dy++) {
                for (let dx = 0; dx < 3; dx++) {
                    const pixelIdx = (y + dy) * this.inputWidth + (x + dx);
                    product *= input[pixelIdx];
                }
            }
            // Normalize: take 9th root and scale by 10
            const normalizedTerm = Math.pow(product, 1.0 / 9.0) * 10.0;
            output += this.weightsNeighborhood3x3[idx] * normalizedTerm;
        }
        
        // 5x5 Neighborhood terms (25th-order with normalization)
        for (const idx of this.activeNeighborhood5x5) {
            const y = Math.floor(idx / (this.inputWidth - 4));
            const x = idx % (this.inputWidth - 4);
            
            let product = 1.0;
            for (let dy = 0; dy < 5; dy++) {
                for (let dx = 0; dx < 5; dx++) {
                    const pixelIdx = (y + dy) * this.inputWidth + (x + dx);
                    product *= input[pixelIdx];
                }
            }
            // Normalize: take 25th root and scale by 10
            const normalizedTerm = Math.pow(product, 1.0 / 25.0) * 10.0;
            output += this.weightsNeighborhood5x5[idx] * normalizedTerm;
        }
        
        // 3-length Cross terms (5th-order with normalization)
        for (const idx of this.activeCross3Length) {
            const y = Math.floor(idx / (this.inputWidth - 2)) + 1;
            const x = (idx % (this.inputWidth - 2)) + 1;
            
            // 5th-order: center * up * down * left * right
            const centerIdx = y * this.inputWidth + x;
            const upIdx = (y - 1) * this.inputWidth + x;
            const downIdx = (y + 1) * this.inputWidth + x;
            const leftIdx = y * this.inputWidth + (x - 1);
            const rightIdx = y * this.inputWidth + (x + 1);
            
            const product = input[centerIdx] * input[upIdx] * input[downIdx] * 
                          input[leftIdx] * input[rightIdx];
            
            // Normalize: take 5th root and scale by 4
            const normalizedTerm = Math.pow(product, 1.0 / 5.0) * 4.0;
            output += this.weightsCross3Length[idx] * normalizedTerm;
        }
        
        // 5-length Cross terms (5th-order with normalization)
        for (const idx of this.activeCross5Length) {
            const y = Math.floor(idx / (this.inputWidth - 4)) + 2;
            const x = (idx % (this.inputWidth - 4)) + 2;
            
            // 5th-order: center + 4 extended neighbors (2 pixels away)
            const centerIdx = y * this.inputWidth + x;
            const upIdx = (y - 2) * this.inputWidth + x;
            const downIdx = (y + 2) * this.inputWidth + x;
            const leftIdx = y * this.inputWidth + (x - 2);
            const rightIdx = y * this.inputWidth + (x + 2);
            
            const product = input[centerIdx] * input[upIdx] * input[downIdx] * 
                          input[leftIdx] * input[rightIdx];
            
            // Normalize: take 5th root and scale by 4
            const normalizedTerm = Math.pow(product, 1.0 / 5.0) * 4.0;
            output += this.weightsCross5Length[idx] * normalizedTerm;
        }
        
        return output;
    }
    
    /**
     * Get threshold for classification
     */
    getThreshold() {
        if (this.customFields.targetPositive !== undefined && 
            this.customFields.targetNegative !== undefined) {
            return (this.customFields.targetPositive + this.customFields.targetNegative) / 2.0;
        }
        return 0.0;
    }
}

/**
 * Digit Classifier using ensemble of 10 binary classifiers
 */
class DigitClassifier {
    constructor() {
        this.classifiers = [];
        this.loaded = false;
    }
    
    /**
     * Load all 10 digit classifiers
     */
    async loadModels(modelsPath = '/models') {
        const loadPromises = [];
        
        for (let digit = 0; digit < 10; digit++) {
            const network = new SparseNetwork2D();
            loadPromises.push(
                network.loadFromFile(`${modelsPath}/digit_${digit}_sparse.bin`)
                    .then(() => {
                        this.classifiers[digit] = network;
                    })
            );
        }
        
        await Promise.all(loadPromises);
        this.loaded = true;
    }
    
    /**
     * Predict digit from input pixels
     */
    predict(pixels) {
        if (!this.loaded) {
            throw new Error('Models not loaded yet');
        }
        
        const results = {
            predicted_digit: -1,
            confidence: 0,
            all_outputs: [],
            distances_from_target: [],
            confidence_scores: []
        };
        
        // Run all 10 classifiers
        for (let digit = 0; digit < 10; digit++) {
            this.classifiers[digit].setInput(pixels);
            const output = this.classifiers[digit].compute();
            results.all_outputs[digit] = output;
            
            // Calculate distance from target positive
            const targetPos = this.classifiers[digit].customFields.targetPositive;
            
            if (targetPos === undefined || isNaN(targetPos)) {
                console.error(`Digit ${digit}: targetPositive is ${targetPos}`);
                results.distances_from_target[digit] = Infinity;
                results.confidence_scores[digit] = 0;
                continue;
            }
            
            const distance = Math.abs(output - targetPos);
            results.distances_from_target[digit] = distance;
            
            // Calculate confidence (inverse of distance, scaled)
            const scaleFactor = 0.0001;
            results.confidence_scores[digit] = 1.0 / (1.0 + distance * scaleFactor);
        }
        
        // Find digit with highest confidence (minimum distance)
        let minDistance = Infinity;
        let bestDigit = 0;
        
        for (let digit = 0; digit < 10; digit++) {
            if (results.distances_from_target[digit] < minDistance) {
                minDistance = results.distances_from_target[digit];
                bestDigit = digit;
            }
        }
        
        results.predicted_digit = bestDigit;
        results.confidence = results.confidence_scores[bestDigit];
        
        // Log for debugging differences
        console.log('Client-side results:', {
            predicted: results.predicted_digit,
            outputs: results.all_outputs.map(v => v.toFixed(2)),
            distances: results.distances_from_target.map(v => v.toFixed(2)),
            confidences: results.confidence_scores.map(v => (v * 100).toFixed(1) + '%')
        });
        
        return results;
    }
}

// Export for use in HTML
if (typeof window !== 'undefined') {
    window.SparseNetwork2D = SparseNetwork2D;
    window.DigitClassifier = DigitClassifier;
}
