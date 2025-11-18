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
        this.activeSecondOrder = new Set();
        this.activeNeighborhood3x3 = new Set();
        this.activeNeighborhood5x5 = new Set();
        this.activeCross3Length = new Set();
        this.activeCross5Length = new Set();
        
        this.inputWidth = 0;
        this.inputHeight = 0;
        this.inputSize = 0;
        
        this.preprocessedInput = [];
    }
    
    async loadFromFile(filepath) {
        const response = await fetch(filepath);
        if (!response.ok) {
            throw new Error(`Failed to load network: ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        this.parseNetworkFile(arrayBuffer);
    }
    
    parseNetworkFile(arrayBuffer) {
        const uint8Array = new Uint8Array(arrayBuffer);
        const endMarker = "# END_OF_TEXT_SECTION\n";
        const decoder = new TextDecoder();
        const text = decoder.decode(uint8Array);
        const markerIndex = text.indexOf(endMarker);
        
        if (markerIndex === -1) {
            throw new Error("Invalid network file format: missing END_OF_TEXT_SECTION marker");
        }
        
        const textEndIndex = markerIndex + endMarker.length;
        const textSection = text.substring(0, textEndIndex);
        this.parseTextSection(textSection);
        
        const encoder = new TextEncoder();
        const headerBytes = encoder.encode(textSection).length;
        const binaryBuffer = arrayBuffer.slice(headerBytes);
        this.parseBinarySection(binaryBuffer);
    }
    
    parseTextSection(text) {
        const lines = text.split('\n');
        let currentSection = '';
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            
            if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                currentSection = trimmed.slice(1, -1);
                continue;
            }
            
            const eqIndex = trimmed.indexOf('=');
            if (eqIndex === -1) continue;
            
            const key = trimmed.substring(0, eqIndex);
            const value = trimmed.substring(eqIndex + 1);
            
            if (currentSection === 'ARCHITECTURE') {
                this.architecture[key] = value;
                if (key === 'input_size') this.inputSize = parseInt(value);
            } else if (currentSection === 'CUSTOM_FIELDS') {
                this.customFields[key] = value;
                
                if (key === 'image_width') this.inputWidth = parseInt(value);
                if (key === 'image_height') this.inputHeight = parseInt(value);
                if (key === 'target_positive') this.customFields.targetPositive = parseFloat(value);
                if (key === 'target_negative') this.customFields.targetNegative = parseFloat(value);
            }
        }
    }
    
    parseBinarySection(arrayBuffer) {
        const float32Array = new Float32Array(arrayBuffer);
        let position = 0;
        
        // First order weights
        for (let i = 0; i < this.inputSize && position < float32Array.length; i++) {
            this.weightsFirstOrder[i] = float32Array[position++];
        }
        
        // Second order weights
        for (let i = 0; i < this.inputSize && position < float32Array.length; i++) {
            if (!this.weightsSecondOrder[i]) this.weightsSecondOrder[i] = [];
            for (let j = i; j < this.inputSize && position < float32Array.length; j++) {
                this.weightsSecondOrder[i][j] = float32Array[position++];
            }
        }
        
        // Skip third order if enabled
        const thirdOrderEnabled = this.architecture.enable_third_order === 'true';
        if (thirdOrderEnabled) {
            const thirdOrderCount = (this.inputSize * (this.inputSize + 1) * (this.inputSize + 2)) / 6;
            position += thirdOrderCount;
        }
        
        // 2D feature weights
        const neighborhood3x3Count = this.inputWidth > 0 ? (this.inputWidth - 2) * (this.inputHeight - 2) : 0;
        for (let i = 0; i < neighborhood3x3Count && position < float32Array.length; i++) {
            this.weightsNeighborhood3x3[i] = float32Array[position++];
        }
        
        const neighborhood5x5Count = this.inputWidth > 0 ? (this.inputWidth - 4) * (this.inputHeight - 4) : 0;
        for (let i = 0; i < neighborhood5x5Count && position < float32Array.length; i++) {
            this.weightsNeighborhood5x5[i] = float32Array[position++];
        }
        
        const cross3LengthCount = this.inputWidth > 0 ? (this.inputWidth - 2) * (this.inputHeight - 2) : 0;
        for (let i = 0; i < cross3LengthCount && position < float32Array.length; i++) {
            this.weightsCross3Length[i] = float32Array[position++];
        }
        
        const cross5LengthCount = this.inputWidth > 0 ? (this.inputWidth - 4) * (this.inputHeight - 4) : 0;
        for (let i = 0; i < cross5LengthCount && position < float32Array.length; i++) {
            this.weightsCross5Length[i] = float32Array[position++];
        }
        
        // Build active index sets
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
    
    setInput(inputData) {
        // Normalize to [0,2] range
        let inputMin = Infinity;
        let inputMax = -Infinity;
        for (const val of inputData) {
            if (val < inputMin) inputMin = val;
            if (val > inputMax) inputMax = val;
        }
        
        this.preprocessedInput = new Array(inputData.length);
        if (inputMax !== inputMin) {
            const inputRange = inputMax - inputMin;
            for (let i = 0; i < inputData.length; i++) {
                const normalized = (inputData[i] - inputMin) / inputRange;
                this.preprocessedInput[i] = 2.0 * normalized;
            }
        } else {
            for (let i = 0; i < inputData.length; i++) {
                this.preprocessedInput[i] = 1.0;
            }
        }
    }
    
    compute() {
        let output = 0.0;
        const input = this.preprocessedInput;
        
        // First order
        for (const i of this.activeFirstOrder) {
            output += this.weightsFirstOrder[i] * input[i];
        }
        
        // Second order
        for (const key of this.activeSecondOrder) {
            const [i, j] = key.split(',').map(x => parseInt(x));
            if (this.weightsSecondOrder[i] && this.weightsSecondOrder[i][j] !== undefined) {
                output += this.weightsSecondOrder[i][j] * input[i] * input[j];
            }
        }
        
        // 3x3 Neighborhood (9th-order normalized)
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
            const normalizedTerm = Math.pow(product, 1.0 / 9.0) * 10.0;
            output += this.weightsNeighborhood3x3[idx] * normalizedTerm;
        }
        
        // 5x5 Neighborhood (25th-order normalized)
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
            const normalizedTerm = Math.pow(product, 1.0 / 25.0) * 10.0;
            output += this.weightsNeighborhood5x5[idx] * normalizedTerm;
        }
        
        // 3-length Cross (5th-order normalized)
        for (const idx of this.activeCross3Length) {
            const y = Math.floor(idx / (this.inputWidth - 2)) + 1;
            const x = (idx % (this.inputWidth - 2)) + 1;
            
            const centerIdx = y * this.inputWidth + x;
            const upIdx = (y - 1) * this.inputWidth + x;
            const downIdx = (y + 1) * this.inputWidth + x;
            const leftIdx = y * this.inputWidth + (x - 1);
            const rightIdx = y * this.inputWidth + (x + 1);
            
            const product = input[centerIdx] * input[upIdx] * input[downIdx] * 
                          input[leftIdx] * input[rightIdx];
            const normalizedTerm = Math.pow(product, 1.0 / 5.0) * 4.0;
            output += this.weightsCross3Length[idx] * normalizedTerm;
        }
        
        // 5-length Cross (5th-order normalized)
        for (const idx of this.activeCross5Length) {
            const y = Math.floor(idx / (this.inputWidth - 4)) + 2;
            const x = (idx % (this.inputWidth - 4)) + 2;
            
            const centerIdx = y * this.inputWidth + x;
            const upIdx = (y - 2) * this.inputWidth + x;
            const downIdx = (y + 2) * this.inputWidth + x;
            const leftIdx = y * this.inputWidth + (x - 2);
            const rightIdx = y * this.inputWidth + (x + 2);
            
            const product = input[centerIdx] * input[upIdx] * input[downIdx] * 
                          input[leftIdx] * input[rightIdx];
            const normalizedTerm = Math.pow(product, 1.0 / 5.0) * 4.0;
            output += this.weightsCross5Length[idx] * normalizedTerm;
        }
        
        return output;
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
    
    async loadModels(modelsPath = 'models') {
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
            
            const targetPos = this.classifiers[digit].customFields.targetPositive;
            const distance = Math.abs(output - targetPos);
            results.distances_from_target[digit] = distance;
            
            // Confidence: inverse of distance
            const scaleFactor = 0.0001;
            results.confidence_scores[digit] = 1.0 / (1.0 + distance * scaleFactor);
        }
        
        // Find digit with minimum distance (highest confidence)
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
        
        return results;
    }
}

// Export for browser
if (typeof window !== 'undefined') {
    window.SparseNetwork2D = SparseNetwork2D;
    window.DigitClassifier = DigitClassifier;
}
