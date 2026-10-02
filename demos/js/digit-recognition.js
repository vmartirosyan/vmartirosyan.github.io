/**
 * Digit Recognition Demo - Client-Side JavaScript
 */

const drawCanvas = document.getElementById('drawCanvas');
const drawCtx = drawCanvas.getContext('2d');

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
    }
}

function clearCanvas() {
    drawCtx.fillStyle = 'black';
    drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
    document.getElementById('result').classList.remove('show');
}

function preprocessCanvas(sourceCanvas) {
    const ctx = sourceCanvas.getContext('2d');
    const width = sourceCanvas.width;
    const height = sourceCanvas.height;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // 1. Find bounding box
    let minX = width, minY = height, maxX = 0, maxY = 0;
    let found = false;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const brightness = (data[idx] + data[idx+1] + data[idx+2]) / 3;
            if (brightness > 20) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
                found = true;
            }
        }
    }

    if (!found) {
        return new Array(784).fill(0);
    }

    // 2. Crop
    const cropWidth = maxX - minX + 1;
    const cropHeight = maxY - minY + 1;

    // 3. Scale to fit in 20x20 box (preserving aspect ratio)
    const targetSize = 20;
    const scale = targetSize / Math.max(cropWidth, cropHeight);
    
    const scaledWidth = cropWidth * scale;
    const scaledHeight = cropHeight * scale;

    // 4. Center in 28x28 image
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = 28;
    finalCanvas.height = 28;
    const finalCtx = finalCanvas.getContext('2d');
    
    // Fill with black
    finalCtx.fillStyle = 'black';
    finalCtx.fillRect(0, 0, 28, 28);

    // Draw scaled image centered
    const dx = (28 - scaledWidth) / 2;
    const dy = (28 - scaledHeight) / 2;

    finalCtx.imageSmoothingEnabled = true;
    finalCtx.imageSmoothingQuality = 'high';
    
    finalCtx.drawImage(sourceCanvas, 
        minX, minY, cropWidth, cropHeight, 
        dx, dy, scaledWidth, scaledHeight
    );
    
    // Get pixels
    const finalImageData = finalCtx.getImageData(0, 0, 28, 28);
    const pixels = [];
    for (let i = 0; i < finalImageData.data.length; i += 4) {
        const r = finalImageData.data[i];
        const g = finalImageData.data[i + 1];
        const b = finalImageData.data[i + 2];
        const gray = (r + g + b) / 3;
        pixels.push(gray / 255.0);
    }
    
    return pixels;
}

async function predictDigit() {
    if (!modelsLoaded) {
        alert('Models are still loading, please wait...');
        return;
    }

    // Preprocess the canvas (crop, scale, center)
    const pixels = preprocessCanvas(drawCanvas);

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

// Initialize and load models
loadModels();
