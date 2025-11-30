// Freeform Drawing Controller
class DrawingController {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.currentTool = 'pen';
        this.currentColor = '#000000';
        this.brushSize = 3;
        this.backgroundColor = '#ffffff';
        this.showGrid = false;
        this.gridSize = 20;
        
        // For shapes
        this.startX = 0;
        this.startY = 0;
        this.tempCanvas = null;
        this.tempCtx = null;
        
        // Drawing layer (without grid)
        this.drawingCanvas = null;
        this.drawingCtx = null;
        
        // History for undo
        this.history = [];
        this.maxHistory = 20;
    }

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Drawing canvas not found');
            return;
        }

        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        
        // Create temporary canvas for shape preview
        this.tempCanvas = document.createElement('canvas');
        this.tempCtx = this.tempCanvas.getContext('2d', { willReadFrequently: true });
        
        // Create drawing layer canvas (holds actual drawing without grid)
        this.drawingCanvas = document.createElement('canvas');
        this.drawingCtx = this.drawingCanvas.getContext('2d', { willReadFrequently: true });
        this.tempCtx = this.tempCanvas.getContext('2d');
        
        this.resizeCanvas();
        
        // Add event listeners
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        
        // Touch support
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleMouseUp.bind(this));
        
        console.log('Drawing controller initialized');
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        this.tempCanvas.width = this.canvas.width;
        this.tempCanvas.height = this.canvas.height;
        
        this.drawingCanvas.width = this.canvas.width;
        this.drawingCanvas.height = this.canvas.height;
        
        // Initialize drawing layer - NO BACKGROUND, keep it transparent
        if (this.canvas.width > 0 && this.canvas.height > 0) {
            // Don't fill the drawing layer - it should be transparent
            // so the grid shows through
            
            this.render();
            
            // Save initial state to history if not already saved
            if (this.history.length === 0) {
                this.saveToHistory();
            }
        }
    }
    
    render() {
        // Clear display canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        if (this.backgroundColor !== 'transparent') {
            this.ctx.fillStyle = this.backgroundColor;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        //console.log('Rendering, showGrid:', this.showGrid);
        
        // Draw grid if enabled
        if (this.showGrid) {
            this.drawGrid();
        }
        
        // Draw the drawing layer on top
        this.ctx.drawImage(this.drawingCanvas, 0, 0);
    }
    
    redrawBackground() {
        // Clear the drawing layer - keep it transparent
        this.drawingCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.render();
    }
    
    drawGrid() {
        // Make grid more visible with darker color
        if (this.backgroundColor === '#000000') {
            this.ctx.strokeStyle = '#666666';
        } else if (this.backgroundColor === 'transparent') {
            this.ctx.strokeStyle = '#cccccc';
        } else {
            // White background - use a much darker gray
            this.ctx.strokeStyle = '#cccccc';
        }
        
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([]);
        
        //console.log('Drawing grid with color:', this.ctx.strokeStyle, 'size:', this.gridSize);
        
        // Vertical lines
        for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;
        this.isDrawing = true;
        
        if (this.currentTool === 'pen' || this.currentTool === 'eraser') {
            this.drawingCtx.beginPath();
            this.drawingCtx.moveTo(this.startX, this.startY);
        } else if (this.currentTool === 'text') {
            this.addText(this.startX, this.startY);
        } else {
            // For shapes, save current state
            this.saveTemp();
        }
    }

    handleMouseMove(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (this.currentTool === 'pen') {
            this.drawLine(this.startX, this.startY, x, y);
            this.startX = x;
            this.startY = y;
        } else if (this.currentTool === 'eraser') {
            this.erase(x, y);
        } else if (this.currentTool === 'line') {
            this.restoreTemp();
            this.drawStraightLinePreview(this.startX, this.startY, x, y);
        } else if (this.currentTool === 'rectangle') {
            this.restoreTemp();
            this.drawRectanglePreview(this.startX, this.startY, x, y);
        } else if (this.currentTool === 'circle') {
            this.restoreTemp();
            this.drawCirclePreview(this.startX, this.startY, x, y);
        }
    }

    handleMouseUp(e) {
        if (this.isDrawing && this.currentTool !== 'text') {
            // For shapes, finalize the drawing
            if (this.currentTool === 'line' || this.currentTool === 'rectangle' || this.currentTool === 'circle') {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Draw final shape on drawing layer
                if (this.currentTool === 'line') {
                    this.drawStraightLine(this.startX, this.startY, x, y);
                } else if (this.currentTool === 'rectangle') {
                    this.drawRectangle(this.startX, this.startY, x, y);
                } else if (this.currentTool === 'circle') {
                    this.drawCircle(this.startX, this.startY, x, y);
                }
            }
            
            this.saveToHistory();
            this.render();
        }
        this.isDrawing = false;
    }

    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }

    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }

    drawLine(x1, y1, x2, y2) {
        this.drawingCtx.strokeStyle = this.currentColor;
        this.drawingCtx.lineWidth = this.brushSize;
        this.drawingCtx.lineCap = 'round';
        this.drawingCtx.lineJoin = 'round';
        
        this.drawingCtx.lineTo(x2, y2);
        this.drawingCtx.stroke();
        this.render();
    }

    drawStraightLine(x1, y1, x2, y2) {
        this.drawingCtx.strokeStyle = this.currentColor;
        this.drawingCtx.lineWidth = this.brushSize;
        this.drawingCtx.lineCap = 'round';
        
        this.drawingCtx.beginPath();
        this.drawingCtx.moveTo(x1, y1);
        this.drawingCtx.lineTo(x2, y2);
        this.drawingCtx.stroke();
    }
    
    drawStraightLinePreview(x1, y1, x2, y2) {
        // Draw preview on display canvas, then render to show it
        this.render();
        
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    drawRectangle(x1, y1, x2, y2) {
        const width = x2 - x1;
        const height = y2 - y1;
        
        this.drawingCtx.strokeStyle = this.currentColor;
        this.drawingCtx.lineWidth = this.brushSize;
        this.drawingCtx.strokeRect(x1, y1, width, height);
    }
    
    drawRectanglePreview(x1, y1, x2, y2) {
        const width = x2 - x1;
        const height = y2 - y1;
        
        // Draw preview on display canvas
        this.render();
        
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.strokeRect(x1, y1, width, height);
    }

    drawCircle(x1, y1, x2, y2) {
        const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        
        this.drawingCtx.strokeStyle = this.currentColor;
        this.drawingCtx.lineWidth = this.brushSize;
        this.drawingCtx.beginPath();
        this.drawingCtx.arc(x1, y1, radius, 0, Math.PI * 2);
        this.drawingCtx.stroke();
    }
    
    drawCirclePreview(x1, y1, x2, y2) {
        const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        
        // Draw preview on display canvas
        this.render();
        
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.beginPath();
        this.ctx.arc(x1, y1, radius, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    erase(x, y) {
        // Erase by clearing to transparent on the drawing layer
        this.drawingCtx.clearRect(
            x - this.brushSize / 2,
            y - this.brushSize / 2,
            this.brushSize * 2,
            this.brushSize * 2
        );
        this.render();
    }

    addText(x, y) {
        const text = prompt(window.t('msgEnterText'));
        if (text) {
            this.drawingCtx.font = `${this.brushSize * 8}px Arial`;
            this.drawingCtx.fillStyle = this.currentColor;
            this.drawingCtx.fillText(text, x, y);
            this.saveToHistory();
            this.render();
        }
        this.isDrawing = false;
    }

    saveTemp() {
        this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
        this.tempCtx.drawImage(this.drawingCanvas, 0, 0);
    }

    restoreTemp() {
        this.drawingCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawingCtx.drawImage(this.tempCanvas, 0, 0);
        this.render();
    }

    saveToHistory() {
        // Only save if canvas has valid dimensions - save the drawing layer only
        if (this.canvas.width > 0 && this.canvas.height > 0) {
            const imageData = this.drawingCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.history.push(imageData);
            
            if (this.history.length > this.maxHistory) {
                this.history.shift();
            }
        }
    }

    undo() {
        if (this.history.length > 0) {
            this.history.pop(); // Remove current state
            
            if (this.history.length > 0) {
                const previousState = this.history[this.history.length - 1];
                this.drawingCtx.putImageData(previousState, 0, 0);
                this.render();
            } else {
                this.clearCanvas();
            }
        }
    }

    setTool(tool) {
        this.currentTool = tool;
    }

    setColor(color) {
        this.currentColor = color;
    }

    setBrushSize(size) {
        this.brushSize = size;
    }

    setBackgroundColor(color) {
        this.backgroundColor = color;
        this.clearCanvas();
    }

    clearCanvas() {
        if (this.canvas.width === 0 || this.canvas.height === 0) {
            return; // Canvas not properly sized yet
        }
        
        this.redrawBackground();
        this.history = [];
        this.saveToHistory();
    }
    
    toggleGrid() {
        this.showGrid = !this.showGrid;
        console.log('Grid toggled, showGrid:', this.showGrid);
        this.render();
    }
    
    setGridSize(size) {
        this.gridSize = size;
        if (this.showGrid) {
            this.render();
        }
    }

    saveImage() {
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }
}
