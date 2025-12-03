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
        this.showFineGrid = false;
        this.showAxis = false;
        this.showUnitCircle = false;
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
        
        // Geometry objects (points, segments, vectors)
        this.points = [];
        this.segments = [];
        this.vectors = [];
        this.selectedPoint = null;
        this.draggedPoint = null;
        this.segmentStartPoint = null;
        this.nextPointId = 1;
    }
    
    // Point radius scales with grid size
    get pointRadius() {
        return Math.max(3, this.gridSize / 6);
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
        
        // Set initial cursor
        this.updateCursor();
        
        console.log('Drawing controller initialized');
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        
        // Save current drawing content before resizing
        let savedDrawing = null;
        if (this.drawingCanvas.width > 0 && this.drawingCanvas.height > 0) {
            savedDrawing = this.drawingCtx.getImageData(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
        }
        
        this.canvas.width = newWidth;
        this.canvas.height = newHeight;
        
        this.tempCanvas.width = newWidth;
        this.tempCanvas.height = newHeight;
        
        this.drawingCanvas.width = newWidth;
        this.drawingCanvas.height = newHeight;
        
        // Restore drawing content after resizing
        if (savedDrawing) {
            this.drawingCtx.putImageData(savedDrawing, 0, 0);
        }
        
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
        
        // Draw fine grid first (below main grid)
        if (this.showGrid && this.showFineGrid) {
            this.drawFineGrid();
        }
        
        // Draw grid if enabled
        if (this.showGrid) {
            this.drawGrid();
        }
        
        // Draw axis if enabled
        if (this.showAxis) {
            this.drawAxis();
        }
        
        // Draw unit circle if enabled
        if (this.showUnitCircle) {
            this.drawUnitCircle();
        }
        
        // Draw the drawing layer on top
        this.ctx.drawImage(this.drawingCanvas, 0, 0);
        
        // Draw geometry objects (segments, vectors, points)
        this.drawGeometry();
    }
    
    // Draw geometry to a specific context (used for fill boundary detection)
    drawGeometryTo(ctx) {
        // Draw segments first (below points)
        this.segments.forEach(seg => {
            const p1 = this.points.find(p => p.id === seg.startId);
            const p2 = this.points.find(p => p.id === seg.endId);
            if (p1 && p2) {
                ctx.strokeStyle = seg.color;
                ctx.lineWidth = 2;
                ctx.setLineDash([]);
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });
        
        // Draw vectors (with arrowheads)
        this.vectors.forEach(vec => {
            const p1 = this.points.find(p => p.id === vec.startId);
            const p2 = this.points.find(p => p.id === vec.endId);
            if (p1 && p2) {
                ctx.strokeStyle = vec.color;
                ctx.fillStyle = vec.color;
                ctx.lineWidth = 2;
                ctx.setLineDash([]);
                
                // Draw line
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
                
                // Draw arrowhead
                const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
                const arrowLength = 12;
                const arrowAngle = Math.PI / 6;
                
                ctx.beginPath();
                ctx.moveTo(p2.x, p2.y);
                ctx.lineTo(
                    p2.x - arrowLength * Math.cos(angle - arrowAngle),
                    p2.y - arrowLength * Math.sin(angle - arrowAngle)
                );
                ctx.lineTo(
                    p2.x - arrowLength * Math.cos(angle + arrowAngle),
                    p2.y - arrowLength * Math.sin(angle + arrowAngle)
                );
                ctx.closePath();
                ctx.fill();
            }
        });
        
        // Draw points on top
        this.points.forEach(point => {
            ctx.fillStyle = point.color;
            ctx.strokeStyle = this.backgroundColor === '#000000' ? '#ffffff' : '#000000';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(point.x, point.y, this.pointRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
    }
    
    drawGeometry() {
        // Draw segments first (below points)
        this.segments.forEach(seg => {
            const p1 = this.points.find(p => p.id === seg.startId);
            const p2 = this.points.find(p => p.id === seg.endId);
            if (p1 && p2) {
                this.ctx.strokeStyle = seg.color;
                this.ctx.lineWidth = 2;
                this.ctx.setLineDash([]);
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.stroke();
            }
        });
        
        // Draw vectors (with arrowheads)
        this.vectors.forEach(vec => {
            const p1 = this.points.find(p => p.id === vec.startId);
            const p2 = this.points.find(p => p.id === vec.endId);
            if (p1 && p2) {
                this.ctx.strokeStyle = vec.color;
                this.ctx.fillStyle = vec.color;
                this.ctx.lineWidth = 2;
                this.ctx.setLineDash([]);
                
                // Draw line
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.stroke();
                
                // Draw arrowhead
                const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
                const arrowLength = 12;
                const arrowAngle = Math.PI / 6;
                
                this.ctx.beginPath();
                this.ctx.moveTo(p2.x, p2.y);
                this.ctx.lineTo(
                    p2.x - arrowLength * Math.cos(angle - arrowAngle),
                    p2.y - arrowLength * Math.sin(angle - arrowAngle)
                );
                this.ctx.lineTo(
                    p2.x - arrowLength * Math.cos(angle + arrowAngle),
                    p2.y - arrowLength * Math.sin(angle + arrowAngle)
                );
                this.ctx.closePath();
                this.ctx.fill();
            }
        });
        
        // Draw points on top
        this.points.forEach(point => {
            // Outer circle
            this.ctx.fillStyle = point.color;
            this.ctx.strokeStyle = this.backgroundColor === '#000000' ? '#ffffff' : '#000000';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, this.pointRadius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            
            // Highlight selected/hovered point
            if (point === this.selectedPoint || point === this.draggedPoint) {
                this.ctx.strokeStyle = '#ff6600';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, this.pointRadius + 3, 0, Math.PI * 2);
                this.ctx.stroke();
            }
            
            // Label
            if (point.label) {
                this.ctx.font = '12px Arial';
                this.ctx.fillStyle = this.backgroundColor === '#000000' ? '#ffffff' : '#000000';
                const labelOffset = this.pointRadius + 10; // Fixed offset from point edge
                this.ctx.fillText(point.label, point.x + labelOffset, point.y - 4);
            }
        });
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
            this.ctx.strokeStyle = '#aaaaaa';
        } else {
            // White background - use a medium gray
            this.ctx.strokeStyle = '#b0b0b0';
        }
        
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([]);
        
        const centerX = Math.floor(this.canvas.width / 2);
        const centerY = Math.floor(this.canvas.height / 2);
        
        // Vertical lines - aligned to center
        for (let x = centerX % this.gridSize; x <= this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines - aligned to center
        for (let y = centerY % this.gridSize; y <= this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawFineGrid() {
        // Fine grid: 5 lines per grid unit (creating subdivisions)
        const fineGridSize = this.gridSize / 5;
        
        // Make fine grid subtle but visible
        if (this.backgroundColor === '#000000') {
            this.ctx.strokeStyle = '#3a3a3a';
        } else if (this.backgroundColor === 'transparent') {
            this.ctx.strokeStyle = '#d0d0d0';
        } else {
            // White background - use light gray
            this.ctx.strokeStyle = '#d8d8d8';
        }
        
        this.ctx.lineWidth = 0.5;
        this.ctx.setLineDash([]);
        
        const centerX = Math.floor(this.canvas.width / 2);
        const centerY = Math.floor(this.canvas.height / 2);
        
        // Vertical fine lines - aligned to center
        for (let x = centerX % fineGridSize; x <= this.canvas.width; x += fineGridSize) {
            // Skip lines that coincide with main grid
            const distFromCenter = Math.abs(x - centerX);
            if (Math.abs(distFromCenter % this.gridSize) < 0.5) continue;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal fine lines - aligned to center
        for (let y = centerY % fineGridSize; y <= this.canvas.height; y += fineGridSize) {
            // Skip lines that coincide with main grid
            const distFromCenter = Math.abs(y - centerY);
            if (Math.abs(distFromCenter % this.gridSize) < 0.5) continue;
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawAxis() {
        const centerX = Math.floor(this.canvas.width / 2);
        const centerY = Math.floor(this.canvas.height / 2);
        
        // Axis color
        if (this.backgroundColor === '#000000') {
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.fillStyle = '#ffffff';
        } else {
            this.ctx.strokeStyle = '#333333';
            this.ctx.fillStyle = '#333333';
        }
        
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([]);
        
        // X axis
        this.ctx.beginPath();
        this.ctx.moveTo(0, centerY);
        this.ctx.lineTo(this.canvas.width, centerY);
        this.ctx.stroke();
        
        // Y axis
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, 0);
        this.ctx.lineTo(centerX, this.canvas.height);
        this.ctx.stroke();
        
        // Arrowheads
        const arrowSize = 10;
        
        // X axis arrow (right)
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width - arrowSize, centerY - arrowSize/2);
        this.ctx.lineTo(this.canvas.width, centerY);
        this.ctx.lineTo(this.canvas.width - arrowSize, centerY + arrowSize/2);
        this.ctx.stroke();
        
        // Y axis arrow (up)
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - arrowSize/2, arrowSize);
        this.ctx.lineTo(centerX, 0);
        this.ctx.lineTo(centerX + arrowSize/2, arrowSize);
        this.ctx.stroke();
        
        // Labels
        this.ctx.font = '14px Arial';
        this.ctx.fillText('x', this.canvas.width - 20, centerY - 10);
        this.ctx.fillText('y', centerX + 10, 20);
        this.ctx.fillText('0', centerX + 5, centerY + 15);
        
        // Tick marks (aligned with grid) - 1 unit = 2 grid steps
        if (this.showGrid) {
            this.ctx.lineWidth = 1;
            const tickSize = 5;
            const unitSize = this.gridSize * 2; // 1 unit = 2 grid squares
            this.ctx.font = '11px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'top';
            
            // X axis ticks and numbers
            let num = 0;
            for (let x = centerX; x <= this.canvas.width; x += unitSize) {
                if (num !== 0) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, centerY - tickSize);
                    this.ctx.lineTo(x, centerY + tickSize);
                    this.ctx.stroke();
                    this.ctx.fillText(num.toString(), x, centerY + tickSize + 2);
                }
                num++;
            }
            num = 0;
            for (let x = centerX; x >= 0; x -= unitSize) {
                if (num !== 0) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, centerY - tickSize);
                    this.ctx.lineTo(x, centerY + tickSize);
                    this.ctx.stroke();
                    this.ctx.fillText((-num).toString(), x, centerY + tickSize + 2);
                }
                num++;
            }
            
            // Y axis ticks and numbers
            this.ctx.textAlign = 'right';
            this.ctx.textBaseline = 'middle';
            num = 0;
            for (let y = centerY; y >= 0; y -= unitSize) {
                if (num !== 0) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(centerX - tickSize, y);
                    this.ctx.lineTo(centerX + tickSize, y);
                    this.ctx.stroke();
                    this.ctx.fillText(num.toString(), centerX - tickSize - 3, y);
                }
                num++;
            }
            num = 0;
            for (let y = centerY; y <= this.canvas.height; y += unitSize) {
                if (num !== 0) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(centerX - tickSize, y);
                    this.ctx.lineTo(centerX + tickSize, y);
                    this.ctx.stroke();
                    this.ctx.fillText((-num).toString(), centerX - tickSize - 3, y);
                }
                num++;
            }
        }
    }
    
    drawUnitCircle() {
        const centerX = Math.floor(this.canvas.width / 2);
        const centerY = Math.floor(this.canvas.height / 2);
        
        // Use gridSize as the unit (radius = gridSize * some multiplier for visibility)
        const radius = this.gridSize * 2; // 2 grid units = 1 unit on circle
        
        // Circle color
        if (this.backgroundColor === '#000000') {
            this.ctx.strokeStyle = '#00aaff';
        } else {
            this.ctx.strokeStyle = '#0066cc';
        }
        
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([]);
        
        // Draw the unit circle
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Draw key angle lines (dashed)
        this.ctx.setLineDash([5, 5]);
        this.ctx.lineWidth = 1;
        
        if (this.backgroundColor === '#000000') {
            this.ctx.strokeStyle = '#888888';
        } else {
            this.ctx.strokeStyle = '#999999';
        }
        
        // 30, 45, 60 degree lines in all quadrants
        const angles = [30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330];
        angles.forEach(deg => {
            const rad = deg * Math.PI / 180;
            const x = centerX + radius * Math.cos(rad);
            const y = centerY - radius * Math.sin(rad); // Flip Y for screen coords
            
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        });
        
        // Draw key points on circle
        this.ctx.setLineDash([]);
        const keyAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
        
        if (this.backgroundColor === '#000000') {
            this.ctx.fillStyle = '#ff6600';
        } else {
            this.ctx.fillStyle = '#cc3300';
        }
        
        keyAngles.forEach(deg => {
            const rad = deg * Math.PI / 180;
            const x = centerX + radius * Math.cos(rad);
            const y = centerY - radius * Math.sin(rad);
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
            this.ctx.fill();
        });
        
        // Label some key angles
        this.ctx.font = '11px Arial';
        if (this.backgroundColor === '#000000') {
            this.ctx.fillStyle = '#ffffff';
        } else {
            this.ctx.fillStyle = '#333333';
        }
        
        // 0°, 90°, 180°, 270° labels
        this.ctx.fillText('0°', centerX + radius + 8, centerY + 4);
        this.ctx.fillText('90°', centerX - 12, centerY - radius - 8);
        this.ctx.fillText('180°', centerX - radius - 30, centerY + 4);
        this.ctx.fillText('270°', centerX - 15, centerY + radius + 15);
    }
    
    toggleAxis() {
        this.showAxis = !this.showAxis;
        this.render();
        return this.showAxis;
    }
    
    toggleUnitCircle() {
        this.showUnitCircle = !this.showUnitCircle;
        this.render();
        return this.showUnitCircle;
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        this.startX = (e.clientX - rect.left) * scaleX;
        this.startY = (e.clientY - rect.top) * scaleY;
        this.isDrawing = true;
        
        if (this.currentTool === 'pen') {
            this.drawingCtx.beginPath();
            this.drawingCtx.moveTo(this.startX, this.startY);
        } else if (this.currentTool === 'eraser') {
            // Check if clicking on a point - delete it and connected segments/vectors
            const clickedPoint = this.findPointAt(this.startX, this.startY);
            if (clickedPoint) {
                this.deletePoint(clickedPoint.id);
                this.isDrawing = false;
                return;
            }
            // Check if clicking on a segment or vector
            const clickedSegment = this.findSegmentAt(this.startX, this.startY);
            if (clickedSegment) {
                this.segments = this.segments.filter(s => s !== clickedSegment);
                this.render();
                this.isDrawing = false;
                return;
            }
            const clickedVector = this.findVectorAt(this.startX, this.startY);
            if (clickedVector) {
                this.vectors = this.vectors.filter(v => v !== clickedVector);
                this.render();
                this.isDrawing = false;
                return;
            }
            // Regular eraser for drawing layer
            this.drawingCtx.beginPath();
            this.drawingCtx.moveTo(this.startX, this.startY);
        } else if (this.currentTool === 'text') {
            this.addText(this.startX, this.startY);
        } else if (this.currentTool === 'fill') {
            this.floodFill(Math.floor(this.startX), Math.floor(this.startY));
            this.isDrawing = false;
        } else if (this.currentTool === 'point') {
            this.addPoint(this.startX, this.startY);
            this.isDrawing = false;
        } else if (this.currentTool === 'segment' || this.currentTool === 'vector') {
            // Check if clicking on existing point
            const clickedPoint = this.findPointAt(this.startX, this.startY);
            if (clickedPoint) {
                if (!this.segmentStartPoint) {
                    // First point selected
                    this.segmentStartPoint = clickedPoint;
                    this.selectedPoint = clickedPoint;
                    this.render();
                } else {
                    // Second point - create segment/vector
                    if (clickedPoint !== this.segmentStartPoint) {
                        if (this.currentTool === 'segment') {
                            this.addSegment(this.segmentStartPoint.id, clickedPoint.id);
                        } else {
                            this.addVector(this.segmentStartPoint.id, clickedPoint.id);
                        }
                    }
                    this.segmentStartPoint = null;
                    this.selectedPoint = null;
                    this.render();
                }
            } else {
                // Create new point
                const newPoint = this.addPoint(this.startX, this.startY);
                if (!this.segmentStartPoint) {
                    this.segmentStartPoint = newPoint;
                    this.selectedPoint = newPoint;
                    this.render();
                } else {
                    if (this.currentTool === 'segment') {
                        this.addSegment(this.segmentStartPoint.id, newPoint.id);
                    } else {
                        this.addVector(this.segmentStartPoint.id, newPoint.id);
                    }
                    this.segmentStartPoint = null;
                    this.selectedPoint = null;
                    this.render();
                }
            }
            this.isDrawing = false;
        } else if (this.currentTool === 'move') {
            const clickedPoint = this.findPointAt(this.startX, this.startY);
            if (clickedPoint) {
                this.draggedPoint = clickedPoint;
                this.render();
            } else {
                this.isDrawing = false;
            }
        } else {
            // For shapes, save current state
            this.saveTemp();
        }
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        // Update cursor for move tool
        if (this.currentTool === 'move') {
            const hoverPoint = this.findPointAt(x, y);
            this.canvas.style.cursor = hoverPoint ? 'grab' : 'default';
        }
        
        if (!this.isDrawing) return;
        
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
        } else if (this.currentTool === 'move' && this.draggedPoint) {
            this.draggedPoint.x = x;
            this.draggedPoint.y = y;
            this.render();
        }
    }

    handleMouseUp(e) {
        if (this.currentTool === 'move' && this.draggedPoint) {
            this.draggedPoint = null;
            this.render();
        }
        
        if (this.isDrawing && this.currentTool !== 'text') {
            // For shapes, finalize the drawing
            if (this.currentTool === 'line' || this.currentTool === 'rectangle' || this.currentTool === 'circle') {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.canvas.width / rect.width;
                const scaleY = this.canvas.height / rect.height;
                const x = (e.clientX - rect.left) * scaleX;
                const y = (e.clientY - rect.top) * scaleY;
                
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
        // Extend line to canvas boundaries
        const extended = this.extendLineToCanvasBounds(x1, y1, x2, y2);
        
        this.drawingCtx.strokeStyle = this.currentColor;
        this.drawingCtx.lineWidth = this.brushSize;
        this.drawingCtx.lineCap = 'round';
        
        this.drawingCtx.beginPath();
        this.drawingCtx.moveTo(extended.x1, extended.y1);
        this.drawingCtx.lineTo(extended.x2, extended.y2);
        this.drawingCtx.stroke();
    }
    
    extendLineToCanvasBounds(x1, y1, x2, y2) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Handle vertical line
        if (Math.abs(x2 - x1) < 0.001) {
            return { x1: x1, y1: 0, x2: x2, y2: height };
        }
        
        // Handle horizontal line
        if (Math.abs(y2 - y1) < 0.001) {
            return { x1: 0, y1: y1, x2: width, y2: y2 };
        }
        
        // Calculate slope and intercept
        const slope = (y2 - y1) / (x2 - x1);
        const intercept = y1 - slope * x1;
        
        // Find intersections with all four edges
        const points = [];
        
        // Left edge (x = 0)
        const yAtLeft = intercept;
        if (yAtLeft >= 0 && yAtLeft <= height) {
            points.push({ x: 0, y: yAtLeft });
        }
        
        // Right edge (x = width)
        const yAtRight = slope * width + intercept;
        if (yAtRight >= 0 && yAtRight <= height) {
            points.push({ x: width, y: yAtRight });
        }
        
        // Top edge (y = 0)
        const xAtTop = -intercept / slope;
        if (xAtTop >= 0 && xAtTop <= width) {
            points.push({ x: xAtTop, y: 0 });
        }
        
        // Bottom edge (y = height)
        const xAtBottom = (height - intercept) / slope;
        if (xAtBottom >= 0 && xAtBottom <= width) {
            points.push({ x: xAtBottom, y: height });
        }
        
        // Should have exactly 2 intersection points
        if (points.length >= 2) {
            return { x1: points[0].x, y1: points[0].y, x2: points[1].x, y2: points[1].y };
        }
        
        // Fallback to original points
        return { x1, y1, x2, y2 };
    }
    
    drawStraightLinePreview(x1, y1, x2, y2) {
        // Extend line to canvas boundaries for preview
        const extended = this.extendLineToCanvasBounds(x1, y1, x2, y2);
        
        // Draw preview on display canvas, then render to show it
        this.render();
        
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(extended.x1, extended.y1);
        this.ctx.lineTo(extended.x2, extended.y2);
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
    
    floodFill(startX, startY) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        if (startX < 0 || startX >= width || startY < 0 || startY >= height) return;
        
        // Create a temporary canvas for boundary detection (without grid)
        const boundaryCanvas = document.createElement('canvas');
        boundaryCanvas.width = width;
        boundaryCanvas.height = height;
        const boundaryCtx = boundaryCanvas.getContext('2d');
        
        // Draw background
        if (this.backgroundColor !== 'transparent') {
            boundaryCtx.fillStyle = this.backgroundColor;
            boundaryCtx.fillRect(0, 0, width, height);
        }
        
        // Draw the drawing layer (user's drawings)
        boundaryCtx.drawImage(this.drawingCanvas, 0, 0);
        
        // Draw geometry objects (segments, vectors, points) - these should be boundaries
        this.drawGeometryTo(boundaryCtx);
        
        // Get image data from boundary canvas (excludes grid)
        const sourceData = boundaryCtx.getImageData(0, 0, width, height);
        const srcPixels = sourceData.data;
        
        // Get the target color at start position
        const startPos = (startY * width + startX) * 4;
        const targetR = srcPixels[startPos];
        const targetG = srcPixels[startPos + 1];
        const targetB = srcPixels[startPos + 2];
        const targetA = srcPixels[startPos + 3];
        
        // Parse fill color
        const fillColor = this.hexToRgb(this.currentColor);
        
        // Don't fill if clicking on the same color
        if (targetR === fillColor.r && targetG === fillColor.g && 
            targetB === fillColor.b && targetA === 255) {
            return;
        }
        
        // Tolerance for color matching
        const tolerance = 32;
        
        const matchesTarget = (pos) => {
            return Math.abs(srcPixels[pos] - targetR) <= tolerance &&
                   Math.abs(srcPixels[pos + 1] - targetG) <= tolerance &&
                   Math.abs(srcPixels[pos + 2] - targetB) <= tolerance &&
                   Math.abs(srcPixels[pos + 3] - targetA) <= tolerance;
        };
        
        // Get drawing layer data to modify
        const drawingData = this.drawingCtx.getImageData(0, 0, width, height);
        const drawPixels = drawingData.data;
        
        const setPixel = (pos) => {
            drawPixels[pos] = fillColor.r;
            drawPixels[pos + 1] = fillColor.g;
            drawPixels[pos + 2] = fillColor.b;
            drawPixels[pos + 3] = 255;
        };
        
        // Use a queue-based flood fill (scanline algorithm for efficiency)
        const stack = [[startX, startY]];
        const visited = new Set();
        
        while (stack.length > 0) {
            const [x, y] = stack.pop();
            const key = `${x},${y}`;
            
            if (visited.has(key)) continue;
            if (x < 0 || x >= width || y < 0 || y >= height) continue;
            
            const pos = (y * width + x) * 4;
            if (!matchesTarget(pos)) continue;
            
            visited.add(key);
            setPixel(pos);
            
            // Add neighbors
            stack.push([x + 1, y]);
            stack.push([x - 1, y]);
            stack.push([x, y + 1]);
            stack.push([x, y - 1]);
        }
        
        // Put the modified image data back to drawing layer
        this.drawingCtx.putImageData(drawingData, 0, 0);
        this.saveToHistory();
        this.render();
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }
    
    // Geometry methods
    addPoint(x, y, label = null) {
        const point = {
            id: this.nextPointId++,
            x: x,
            y: y,
            color: this.currentColor,
            label: label || String.fromCharCode(64 + this.points.length + 1) // A, B, C...
        };
        this.points.push(point);
        this.render();
        return point;
    }
    
    findPointAt(x, y) {
        const hitRadius = this.pointRadius + 5;
        return this.points.find(p => {
            const dx = p.x - x;
            const dy = p.y - y;
            return Math.sqrt(dx * dx + dy * dy) <= hitRadius;
        });
    }
    
    findSegmentAt(x, y) {
        const threshold = 8;
        return this.segments.find(seg => {
            const p1 = this.points.find(p => p.id === seg.startId);
            const p2 = this.points.find(p => p.id === seg.endId);
            if (!p1 || !p2) return false;
            return this.pointToLineDistance(x, y, p1.x, p1.y, p2.x, p2.y) < threshold;
        });
    }
    
    findVectorAt(x, y) {
        const threshold = 8;
        return this.vectors.find(vec => {
            const p1 = this.points.find(p => p.id === vec.startId);
            const p2 = this.points.find(p => p.id === vec.endId);
            if (!p1 || !p2) return false;
            return this.pointToLineDistance(x, y, p1.x, p1.y, p2.x, p2.y) < threshold;
        });
    }
    
    pointToLineDistance(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = lenSq !== 0 ? dot / lenSq : -1;
        
        let xx, yy;
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        
        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    addSegment(startId, endId) {
        // Check if segment already exists
        const exists = this.segments.some(s => 
            (s.startId === startId && s.endId === endId) ||
            (s.startId === endId && s.endId === startId)
        );
        if (!exists) {
            this.segments.push({
                startId: startId,
                endId: endId,
                color: this.currentColor
            });
            this.render();
        }
    }
    
    addVector(startId, endId) {
        // Check if vector already exists
        const exists = this.vectors.some(v => 
            v.startId === startId && v.endId === endId
        );
        if (!exists) {
            this.vectors.push({
                startId: startId,
                endId: endId,
                color: this.currentColor
            });
            this.render();
        }
    }
    
    deletePoint(pointId) {
        // Remove point
        this.points = this.points.filter(p => p.id !== pointId);
        // Remove segments connected to this point
        this.segments = this.segments.filter(s => 
            s.startId !== pointId && s.endId !== pointId
        );
        // Remove vectors connected to this point
        this.vectors = this.vectors.filter(v => 
            v.startId !== pointId && v.endId !== pointId
        );
        this.render();
    }
    
    clearGeometry() {
        this.points = [];
        this.segments = [];
        this.vectors = [];
        this.nextPointId = 1;
        this.segmentStartPoint = null;
        this.selectedPoint = null;
        this.draggedPoint = null;
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
        this.updateCursor();
    }

    setColor(color) {
        this.currentColor = color;
    }

    setBrushSize(size) {
        this.brushSize = size;
        this.updateCursor();
    }
    
    updateCursor() {
        if (!this.canvas) return;
        
        if (this.currentTool === 'eraser') {
            // Create a square cursor the size of the eraser
            const size = this.brushSize * 2;
            const cursorCanvas = document.createElement('canvas');
            cursorCanvas.width = size + 2;
            cursorCanvas.height = size + 2;
            const ctx = cursorCanvas.getContext('2d');
            
            // Draw square outline
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.strokeRect(1, 1, size, size);
            
            // Inner white outline for visibility on dark backgrounds
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.strokeRect(2, 2, size - 2, size - 2);
            
            const center = Math.floor((size + 2) / 2);
            this.canvas.style.cursor = `url(${cursorCanvas.toDataURL()}) ${center} ${center}, crosshair`;
        } else if (this.currentTool === 'move') {
            this.canvas.style.cursor = 'grab';
        } else if (this.currentTool === 'point' || this.currentTool === 'segment' || this.currentTool === 'vector') {
            this.canvas.style.cursor = 'cell';
        } else {
            this.canvas.style.cursor = 'crosshair';
        }
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
        this.clearGeometry();
        this.history = [];
        this.saveToHistory();
    }
    
    toggleGrid() {
        this.showGrid = !this.showGrid;
        // Disable fine grid if main grid is off
        if (!this.showGrid) {
            this.showFineGrid = false;
        }
        console.log('Grid toggled, showGrid:', this.showGrid);
        this.render();
    }
    
    toggleFineGrid() {
        // Can only enable fine grid if main grid is on
        if (!this.showGrid) {
            console.log('Cannot enable fine grid without main grid');
            return;
        }
        this.showFineGrid = !this.showFineGrid;
        console.log('Fine grid toggled, showFineGrid:', this.showFineGrid);
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
