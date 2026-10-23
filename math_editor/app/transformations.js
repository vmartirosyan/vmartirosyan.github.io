// 2D Transformations Controller

class TransformationsController {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.currentShape = 'triangle';
        this.originalPoints = [];
        this.transformedPoints = [];
        
        // Transformation parameters
        this.translation = { x: 0, y: 0 };
        this.rotation = 0; // degrees
        this.scale = 1;
        this.rotationCenter = { x: 0, y: 0 }; // center of rotation
        
        // Display options
        this.showOriginalShape = true;
        this.showGrid = true;
        this.showRotationCenter = true;
        
        // Grid settings
        this.gridSize = 1;
        this.gridOriginX = 0;
        this.gridOriginY = 0;
    }

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Transform canvas not found');
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Initialize with triangle
        this.setShape('triangle');
        
        // Add resize listener
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        this.canvas.width = rect.width - 40;
        this.canvas.height = rect.height - 40;
        this.render();
    }

    setRotationCenter(x, y) {
        this.rotationCenter.x = x;
        this.rotationCenter.y = y;
        this.render();
    }
    
    calculateShapeCentroid() {
        if (this.points.length === 0) return { x: 0, y: 0 };
        
        let sumX = 0;
        let sumY = 0;
        for (let point of this.points) {
            sumX += point.x;
            sumY += point.y;
        }
        return {
            x: sumX / this.points.length,
            y: sumY / this.points.length
        };
    }
    
    setRotationCenterToShape() {
        const centroid = this.calculateShapeCentroid();
        this.rotationCenter.x = centroid.x;
        this.rotationCenter.y = centroid.y;
        this.render();
        return centroid;
    }

    setShape(shapeName) {
        this.currentShape = shapeName;
        
        // Define original points for each shape (in grid coordinates)
        switch (shapeName) {
            case 'triangle':
                this.originalPoints = [
                    [0, 0],
                    [3, 0],
                    [1.5, 3]
                ];
                break;
            case 'square':
                this.originalPoints = [
                    [0, 0],
                    [2, 0],
                    [2, 2],
                    [0, 2]
                ];
                break;
            case 'rectangle':
                this.originalPoints = [
                    [0, 0],
                    [4, 0],
                    [4, 2],
                    [0, 2]
                ];
                break;
            case 'circle':
                // Approximate circle with many points
                this.originalPoints = [];
                const radius = 2;
                const segments = 32;
                for (let i = 0; i <= segments; i++) {
                    const angle = (i / segments) * Math.PI * 2;
                    this.originalPoints.push([
                        radius * Math.cos(angle),
                        radius * Math.sin(angle)
                    ]);
                }
                break;
            case 'polygon':
                // Pentagon
                this.originalPoints = [];
                const sides = 5;
                const r = 2;
                for (let i = 0; i < sides; i++) {
                    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
                    this.originalPoints.push([
                        r * Math.cos(angle),
                        r * Math.sin(angle)
                    ]);
                }
                break;
        }
        
        this.applyTransformations();
        this.render();
    }

    setCustomPoints(pointsText) {
        const lines = pointsText.trim().split('\n');
        this.originalPoints = [];
        
        for (let line of lines) {
            const coords = line.split(',').map(s => parseFloat(s.trim()));
            if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                this.originalPoints.push(coords);
            }
        }
        
        if (this.originalPoints.length > 0) {
            this.currentShape = 'custom';
            this.applyTransformations();
            this.render();
        }
    }

    setTranslation(x, y) {
        this.translation = { x, y };
        this.applyTransformations();
        this.render();
    }

    setRotation(degrees) {
        this.rotation = degrees;
        this.applyTransformations();
        this.render();
    }

    setScale(scale) {
        this.scale = scale;
        this.applyTransformations();
        this.render();
    }

    // Apply all transformations to create transformed points
    applyTransformations() {
        const cx = this.rotationCenter.x;
        const cy = this.rotationCenter.y;
        
        this.transformedPoints = this.originalPoints.map(point => {
            let [x, y] = point;
            
            // Apply scale
            x *= this.scale;
            y *= this.scale;
            
            // Apply rotation around custom center
            // Translate to rotation center, rotate, translate back
            const rad = this.rotation * Math.PI / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            const dx = x - cx;
            const dy = y - cy;
            const rx = cx + (dx * cos - dy * sin);
            const ry = cy + (dx * sin + dy * cos);
            
            // Apply translation
            return [rx + this.translation.x, ry + this.translation.y];
        });
    }

    // Special transformations
    reflectX() {
        this.originalPoints = this.transformedPoints.map(([x, y]) => [x, -y]);
        this.resetTransformParams();
        this.render();
    }

    reflectY() {
        this.originalPoints = this.transformedPoints.map(([x, y]) => [-x, y]);
        this.resetTransformParams();
        this.render();
    }

    reflectOrigin() {
        this.originalPoints = this.transformedPoints.map(([x, y]) => [-x, -y]);
        this.resetTransformParams();
        this.render();
    }

    reflectYeqX() {
        this.originalPoints = this.transformedPoints.map(([x, y]) => [y, x]);
        this.resetTransformParams();
        this.render();
    }

    shearX() {
        const factor = 0.5;
        this.originalPoints = this.transformedPoints.map(([x, y]) => [x + factor * y, y]);
        this.resetTransformParams();
        this.render();
    }

    shearY() {
        const factor = 0.5;
        this.originalPoints = this.transformedPoints.map(([x, y]) => [x, y + factor * x]);
        this.resetTransformParams();
        this.render();
    }

    rotate90() {
        this.originalPoints = this.transformedPoints.map(([x, y]) => [-y, x]);
        this.resetTransformParams();
        this.render();
    }

    rotate180() {
        this.originalPoints = this.transformedPoints.map(([x, y]) => [-x, -y]);
        this.resetTransformParams();
        this.render();
    }

    resetTransformParams() {
        this.translation = { x: 0, y: 0 };
        this.rotation = 0;
        this.scale = 1;
        this.rotationCenter = { x: 0, y: 0 };
        this.applyTransformations();
    }

    resetAll() {
        this.setShape(this.currentShape);
        this.resetTransformParams();
    }

    toggleOriginal() {
        this.showOriginalShape = !this.showOriginalShape;
        this.render();
    }

    toggleGrid() {
        this.showGrid = !this.showGrid;
        this.render();
    }

    // Convert grid coordinates to canvas coordinates
    gridToCanvas(x, y) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const scale = 30; // pixels per grid unit
        
        return [
            centerX + x * scale,
            centerY - y * scale // Invert Y for standard coordinate system
        ];
    }

    render() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear canvas
        this.ctx.fillStyle = '#fafafa';
        this.ctx.fillRect(0, 0, width, height);
        
        // Draw grid
        if (this.showGrid) {
            this.drawGrid();
        }
        
        // Draw axes
        this.drawAxes();
        
        // Draw original shape
        if (this.showOriginalShape && this.originalPoints.length > 0) {
            this.drawShape(this.originalPoints, '#cccccc', '#999999', 2, true);
        }
        
        // Draw transformed shape
        if (this.transformedPoints.length > 0) {
            this.drawShape(this.transformedPoints, '#667eea', '#4a5fd7', 3, false);
        }
        
        // Draw rotation center
        if (this.showRotationCenter) {
            this.drawRotationCenter();
        }
    }

    drawGrid() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const scale = 30;
        
        this.ctx.strokeStyle = '#e8e8e8';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x < this.canvas.width; x += scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y < this.canvas.height; y += scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawAxes() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // X axis
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, centerY);
        this.ctx.lineTo(this.canvas.width, centerY);
        this.ctx.stroke();
        
        // Y axis
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, 0);
        this.ctx.lineTo(centerX, this.canvas.height);
        this.ctx.stroke();
        
        // Labels
        this.ctx.fillStyle = '#333';
        this.ctx.font = '14px Arial';
        this.ctx.fillText('x', this.canvas.width - 20, centerY - 10);
        this.ctx.fillText('y', centerX + 10, 20);
        this.ctx.fillText('O', centerX + 5, centerY + 20);
        
        // Draw grid numbers
        const scale = 30;
        this.ctx.font = '11px Arial';
        this.ctx.fillStyle = '#666';
        
        // X axis numbers
        for (let i = -10; i <= 10; i++) {
            if (i !== 0) {
                const x = centerX + i * scale;
                if (x >= 0 && x <= this.canvas.width) {
                    this.ctx.fillText(i.toString(), x - 5, centerY + 20);
                }
            }
        }
        
        // Y axis numbers
        for (let i = -10; i <= 10; i++) {
            if (i !== 0) {
                const y = centerY - i * scale;
                if (y >= 0 && y <= this.canvas.height) {
                    this.ctx.fillText(i.toString(), centerX + 10, y + 5);
                }
            }
        }
    }

    drawShape(points, fillColor, strokeColor, lineWidth, dashed) {
        if (points.length === 0) return;
        
        // Convert points to canvas coordinates
        const canvasPoints = points.map(([x, y]) => this.gridToCanvas(x, y));
        
        // Draw shape
        this.ctx.fillStyle = fillColor + '40';
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = lineWidth;
        
        if (dashed) {
            this.ctx.setLineDash([5, 5]);
        } else {
            this.ctx.setLineDash([]);
        }
        
        this.ctx.beginPath();
        this.ctx.moveTo(...canvasPoints[0]);
        for (let i = 1; i < canvasPoints.length; i++) {
            this.ctx.lineTo(...canvasPoints[i]);
        }
        
        // Close path for filled shapes (not for circles)
        if (this.currentShape !== 'circle') {
            this.ctx.closePath();
        }
        
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw vertices
        this.ctx.fillStyle = strokeColor;
        canvasPoints.forEach(([x, y]) => {
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.ctx.setLineDash([]);
    }
    
    drawRotationCenter() {
        const [x, y] = this.gridToCanvas(this.rotationCenter.x, this.rotationCenter.y);
        
        // Draw crosshair
        this.ctx.strokeStyle = '#e74c3c'; // Red color
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([]);
        
        const size = 8;
        
        // Horizontal line
        this.ctx.beginPath();
        this.ctx.moveTo(x - size, y);
        this.ctx.lineTo(x + size, y);
        this.ctx.stroke();
        
        // Vertical line
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size);
        this.ctx.lineTo(x, y + size);
        this.ctx.stroke();
        
        // Circle
        this.ctx.beginPath();
        this.ctx.arc(x, y, 5, 0, Math.PI * 2);
        this.ctx.stroke();
    }
}
