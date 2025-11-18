/**
 * Digit Recognition Demo - Client-Side JavaScript
 */

const drawCanvas = document.getElementById('drawCanvas');
const previewCanvas = document.getElementById('previewCanvas');
const drawCtx = drawCanvas.getContext('2d');
const previewCtx = previewCanvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// AI Classifier
let classifier = null;
let modelsLoaded = false;

// Initialize canvas with black background and white drawing
drawCtx.fillStyle = 'black';
drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
drawCtx.strokeStyle = 'white';
drawCtx.lineWidth = 20;
drawCtx.lineCap = 'round';
drawCtx.lineJoin = 'round';

// Mouse events
drawCanvas.addEventListener('mousedown', startDrawing);
drawCanvas.addEventListener('mousemove', draw);
drawCanvas.addEventListener('mouseup', stopDrawing);
drawCanvas.addEventListener('mouseout', stopDrawing);

// Touch events
drawCanvas.addEventListener('touchstart', handleTouch);
drawCanvas.addEventListener('touchmove', handleTouch);
drawCanvas.addEventListener('touchend', stopDrawing);

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;
    
    drawCtx.beginPath();
    drawCtx.moveTo(lastX, lastY);
    drawCtx.lineTo(e.offsetX, e.offsetY);
    drawCtx.stroke();
    
    [lastX, lastY] = [e.offsetX, e.offsetY];
    updatePreview();
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = drawCanvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (e.type === 'touchstart') {
        isDrawing = true;
        [lastX, lastY] = [x, y];
    } else if (e.type === 'touchmove' && isDrawing) {
        drawCtx.beginPath();
        drawCtx.moveTo(lastX, lastY);
        drawCtx.lineTo(x, y);
        drawCtx.stroke();
        [lastX, lastY] = [x, y];
        updatePreview();
    }
}

function updatePreview() {
    // Create temp 28x28 canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 28;
    tempCanvas.height = 28;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.fillStyle = 'black';
    tempCtx.fillRect(0, 0, 28, 28);
    tempCtx.drawImage(drawCanvas, 0, 0, 28, 28);
    
    // Scale up for preview display
    previewCtx.fillStyle = 'black';
    previewCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
    previewCtx.imageSmoothingEnabled = false;
    previewCtx.drawImage(tempCanvas, 0, 0, 140, 140);
}

function clearCanvas() {
    drawCtx.fillStyle = 'black';
    drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
    previewCtx.fillStyle = 'black';
    previewCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
    document.getElementById('result').classList.remove('show');
}

async function predictDigit() {
    if (!modelsLoaded) {
        alert('Models are still loading, please wait...');
        return;
    }

    // Get 28x28 image data
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 28;
    tempCanvas.height = 28;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(drawCanvas, 0, 0, 28, 28);
    
    const imageData = tempCtx.getImageData(0, 0, 28, 28);
    const pixels = [];
    
    // Convert to normalized grayscale (0-1 range)
    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const gray = (r + g + b) / 3;
        pixels.push(gray / 255.0);
    }

    // Show loading
    document.getElementById('loading').classList.add('show');
    document.getElementById('result').classList.remove('show');

    try {
        const startTime = performance.now();
        const result = classifier.predict(pixels);
        const endTime = performance.now();
        
        // Hide loading
        document.getElementById('loading').classList.remove('show');
        
        // Display results
        document.getElementById('predictedDigit').textContent = result.predicted_digit;
        document.getElementById('confidenceText').textContent = 
            `Confidence: ${(result.confidence * 100).toFixed(2)}%`;
        document.getElementById('processingTime').textContent = 
            `Processing time: ${(endTime - startTime).toFixed(2)} ms`;
        
        // Show confidence bars
        const barsHTML = result.confidence_scores.map((conf, digit) => `
            <div class="confidence-bar">
                <div class="confidence-label">${digit}:</div>
                <div class="confidence-track">
                    <div class="confidence-fill" style="width: ${conf * 100}%"></div>
                </div>
                <div class="confidence-value">${(conf * 100).toFixed(1)}%</div>
            </div>
        `).join('');
        
        document.getElementById('confidenceBars').innerHTML = barsHTML;
        document.getElementById('result').classList.add('show');

    } catch (error) {
        console.error('Error:', error);
        alert('Error making prediction: ' + error.message);
    } finally {
        document.getElementById('loading').classList.remove('show');
    }
}

// Load models on page load
async function loadModels() {
    const loadingDiv = document.getElementById('loadingModels');
    loadingDiv.classList.add('show');
    
    try {
        classifier = new DigitClassifier();
        await classifier.loadModels('models');
        modelsLoaded = true;
        
        loadingDiv.textContent = '✅ AI models loaded! Ready to recognize digits.';
        loadingDiv.style.background = '#d4edda';
        loadingDiv.style.borderColor = '#28a745';
        loadingDiv.style.color = '#155724';
        
        // Enable predict button
        document.getElementById('predictBtn').disabled = false;
        
        setTimeout(() => {
            loadingDiv.classList.remove('show');
        }, 3000);
    } catch (error) {
        loadingDiv.textContent = '❌ Failed to load models: ' + error.message;
        loadingDiv.style.background = '#f8d7da';
        loadingDiv.style.borderColor = '#dc3545';
        loadingDiv.style.color = '#721c24';
        console.error('Error loading models:', error);
    }
}

// Initialize preview and load models
updatePreview();
loadModels();
