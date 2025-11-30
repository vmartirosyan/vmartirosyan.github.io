// Graphing and 3D Shape Rendering Module

class GraphingController {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.chart = null;
        this.currentMode = 'function'; // function, bar, line, pie, shape
        this.currentShape = null;
        
        // 3D transformation properties
        this.rotation = { x: 30, y: 45, z: 0 }; // degrees
        this.zoom = 1.0;
        this.shapeParams = {};
    }

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas not found');
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Add resize listener
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        this.canvas.width = rect.width - 40;
        this.canvas.height = rect.height - 40;
    }

    clear() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Plot mathematical function
    plotFunction(funcStr, xMin, xMax, yMin, yMax) {
        this.clear();
        this.currentMode = 'function';

        try {
            // Parse function string (simple parser)
            const func = this.parseFunction(funcStr);
            
            const width = this.canvas.width;
            const height = this.canvas.height;
            const padding = 40;
            
            // Calculate scales
            const xRange = xMax - xMin;
            const yRange = yMax - yMin;
            const xScale = (width - 2 * padding) / xRange;
            const yScale = (height - 2 * padding) / yRange;
            
            // Draw axes
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            
            // X-axis
            const yZero = height - padding - (0 - yMin) * yScale;
            this.ctx.beginPath();
            this.ctx.moveTo(padding, yZero);
            this.ctx.lineTo(width - padding, yZero);
            this.ctx.stroke();
            
            // Y-axis
            const xZero = padding + (0 - xMin) * xScale;
            this.ctx.beginPath();
            this.ctx.moveTo(xZero, padding);
            this.ctx.lineTo(xZero, height - padding);
            this.ctx.stroke();
            
            // Draw grid
            this.ctx.strokeStyle = '#e0e0e0';
            this.ctx.lineWidth = 1;
            
            // Vertical grid lines
            for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
                const canvasX = padding + (x - xMin) * xScale;
                this.ctx.beginPath();
                this.ctx.moveTo(canvasX, padding);
                this.ctx.lineTo(canvasX, height - padding);
                this.ctx.stroke();
                
                // Label
                this.ctx.fillStyle = '#666';
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(x.toString(), canvasX, yZero + 20);
            }
            
            // Horizontal grid lines
            for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
                const canvasY = height - padding - (y - yMin) * yScale;
                this.ctx.beginPath();
                this.ctx.moveTo(padding, canvasY);
                this.ctx.lineTo(width - padding, canvasY);
                this.ctx.stroke();
                
                // Label
                if (y !== 0) {
                    this.ctx.fillStyle = '#666';
                    this.ctx.font = '12px Arial';
                    this.ctx.textAlign = 'right';
                    this.ctx.fillText(y.toString(), xZero - 10, canvasY + 4);
                }
            }
            
            // Plot function
            this.ctx.strokeStyle = '#667eea';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            
            let firstPoint = true;
            const step = xRange / (width - 2 * padding);
            
            for (let x = xMin; x <= xMax; x += step) {
                try {
                    const y = func(x);
                    
                    if (isNaN(y) || !isFinite(y)) continue;
                    if (y < yMin || y > yMax) continue;
                    
                    const canvasX = padding + (x - xMin) * xScale;
                    const canvasY = height - padding - (y - yMin) * yScale;
                    
                    if (firstPoint) {
                        this.ctx.moveTo(canvasX, canvasY);
                        firstPoint = false;
                    } else {
                        this.ctx.lineTo(canvasX, canvasY);
                    }
                } catch (e) {
                    // Skip invalid points
                }
            }
            
            this.ctx.stroke();
            
            // Draw axis labels
            this.ctx.fillStyle = '#333';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('x', width - padding + 20, yZero);
            this.ctx.fillText('y', xZero, padding - 20);
            
        } catch (error) {
            console.error('Error plotting function:', error);
            this.ctx.fillStyle = '#d32f2f';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(window.t('msgInvalidFunction'), this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    // Simple function parser
    parseFunction(funcStr) {
        // Replace common mathematical notation
        let code = funcStr
            .replace(/\^/g, '**')
            .replace(/π/g, 'Math.PI')
            .replace(/pi/g, 'Math.PI')
            .replace(/e(?!\w)/g, 'Math.E')
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/tan/g, 'Math.tan')
            .replace(/sqrt/g, 'Math.sqrt')
            .replace(/abs/g, 'Math.abs')
            .replace(/log/g, 'Math.log10')
            .replace(/ln/g, 'Math.log');
        
        // Create function
        return new Function('x', `return ${code};`);
    }

    // Plot chart using Chart.js
    plotChart(type, labels, values) {
        this.clear();
        this.currentMode = type;

        const colors = [
            '#667eea', '#764ba2', '#f093fb', '#4facfe',
            '#43e97b', '#fa709a', '#feca57', '#48dbfb'
        ];
        
        // Register datalabels plugin only for pie charts
        const plugins = type === 'pie' ? [ChartDataLabels] : [];

        const config = {
            type: type === 'bar' ? 'bar' : type === 'line' ? 'line' : 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: window.t('lblData'),
                    data: values,
                    backgroundColor: type === 'pie' ? colors : colors[0] + '80',
                    borderColor: type === 'pie' ? colors : colors[0],
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: type === 'pie',
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                if (type === 'pie') {
                                    const label = context.label || '';
                                    const value = context.parsed;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                                return context.formattedValue;
                            }
                        }
                    },
                    datalabels: type === 'pie' ? {
                        color: '#fff',
                        font: {
                            weight: 'bold',
                            size: 14
                        },
                        formatter: (value, ctx) => {
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return percentage + '%';
                        }
                    } : false
                },
                scales: type === 'pie' ? {} : {
                    y: {
                        beginAtZero: true
                    }
                }
            },
            plugins: plugins
        };

        this.chart = new Chart(this.ctx, config);
    }

    // Render 3D shape
    render3DShape(shape, params = {}) {
        this.clear();
        this.currentMode = 'shape';
        this.currentShape = shape;
        this.shapeParams = params;

        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;

        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = '#667eea40';

        // Apply zoom to all parameters
        const zoomedParams = {};
        for (let key in params) {
            zoomedParams[key] = params[key] * this.zoom;
        }

        switch (shape) {
            case 'cube':
                this.drawCube(centerX, centerY, zoomedParams.size || 150 * this.zoom);
                break;
            case 'cuboid':
                this.drawCuboid(centerX, centerY, 
                    zoomedParams.width || 180 * this.zoom, 
                    zoomedParams.height || 120 * this.zoom, 
                    zoomedParams.depth || 100 * this.zoom);
                break;
            case 'pyramid':
                this.drawPyramid(centerX, centerY, 
                    zoomedParams.baseSize || 150 * this.zoom, 
                    zoomedParams.height || 180 * this.zoom);
                break;
            case 'cylinder':
                this.drawCylinder(centerX, centerY, 
                    zoomedParams.radius || 80 * this.zoom, 
                    zoomedParams.height || 200 * this.zoom);
                break;
            case 'sphere':
                this.drawSphere(centerX, centerY, zoomedParams.radius || 100 * this.zoom);
                break;
            case 'cone':
                this.drawCone(centerX, centerY, 
                    zoomedParams.radius || 80 * this.zoom, 
                    zoomedParams.height || 180 * this.zoom);
                break;
        }
    }
    
    // Update rotation
    setRotation(x, y, z) {
        this.rotation = { x, y, z };
        this.updateShape();
    }
    
    // Update zoom
    setZoom(zoom) {
        this.zoom = zoom;
        this.updateShape();
    }
    
    // Re-render current shape with updated transformations
    updateShape() {
        if (this.currentMode === 'shape' && this.currentShape) {
            this.render3DShape(this.currentShape, this.shapeParams);
        }
    }
    
    // Reset view to defaults
    resetView() {
        this.rotation = { x: 30, y: 45, z: 0 };
        this.zoom = 1.0;
        this.updateShape();
    }
    
    // Apply 3D rotation to a point [x, y, z]
    rotate3D(point) {
        const [x, y, z] = point;
        
        // Convert rotation angles to radians
        const rx = this.rotation.x * Math.PI / 180;
        const ry = this.rotation.y * Math.PI / 180;
        const rz = this.rotation.z * Math.PI / 180;
        
        // Apply rotations in order: Y, X, Z (for better visual control)
        // Rotation around Y axis (pitch - left/right turn)
        let x1 = x * Math.cos(ry) + z * Math.sin(ry);
        let y1 = y;
        let z1 = -x * Math.sin(ry) + z * Math.cos(ry);
        
        // Rotation around X axis (roll - tilt forward/back)
        let x2 = x1;
        let y2 = y1 * Math.cos(rx) - z1 * Math.sin(rx);
        let z2 = y1 * Math.sin(rx) + z1 * Math.cos(rx);
        
        // Rotation around Z axis (yaw - screen rotation)
        let x3 = x2 * Math.cos(rz) - y2 * Math.sin(rz);
        let y3 = x2 * Math.sin(rz) + y2 * Math.cos(rz);
        let z3 = z2;
        
        return [x3, y3, z3];
    }
    
    // Project 3D point to 2D canvas (isometric-like projection)
    project3D(point, cx, cy) {
        const [x, y, z] = this.rotate3D(point);
        
        // Orthographic projection with isometric-style scaling
        const scale = 1;
        const canvasX = cx + x * scale;
        const canvasY = cy - y * scale - z * 0.5 * scale; // Y is up, Z adds depth
        
        return [canvasX, canvasY];
    }

    // 3D shape drawing methods with proper rotation
    drawCube(cx, cy, size) {
        const s = size / 2;
        
        // Define 8 vertices of the cube in 3D space
        const vertices = [
            [-s, -s, -s], // 0: back-bottom-left
            [s, -s, -s],  // 1: back-bottom-right
            [s, s, -s],   // 2: back-top-right
            [-s, s, -s],  // 3: back-top-left
            [-s, -s, s],  // 4: front-bottom-left
            [s, -s, s],   // 5: front-bottom-right
            [s, s, s],    // 6: front-top-right
            [-s, s, s]    // 7: front-top-left
        ];
        
        // Project vertices to 2D
        const projected = vertices.map(v => this.project3D(v, cx, cy));
        
        // Define faces (indices into vertices array)
        const faces = [
            [0, 1, 2, 3], // back
            [4, 5, 6, 7], // front
            [0, 1, 5, 4], // bottom
            [2, 3, 7, 6], // top
            [0, 3, 7, 4], // left
            [1, 2, 6, 5]  // right
        ];
        
        // Calculate face centers for depth sorting
        const facesWithDepth = faces.map((face, idx) => {
            const center = face.reduce((acc, vi) => {
                const v = vertices[vi];
                return [acc[0] + v[0], acc[1] + v[1], acc[2] + v[2]];
            }, [0, 0, 0]).map(c => c / face.length);
            
            const rotated = this.rotate3D(center);
            return { face, depth: rotated[2], idx };
        });
        
        // Sort faces by depth (back to front)
        facesWithDepth.sort((a, b) => a.depth - b.depth);
        
        // Draw faces
        facesWithDepth.forEach(({ face }) => {
            this.ctx.beginPath();
            this.ctx.moveTo(...projected[face[0]]);
            for (let i = 1; i < face.length; i++) {
                this.ctx.lineTo(...projected[face[i]]);
            }
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        });
    }

    drawCuboid(cx, cy, w, h, d) {
        const hw = w / 2;
        const hh = h / 2;
        const hd = d / 2;
        
        // Define 8 vertices in 3D space
        const vertices = [
            [-hw, -hh, -hd], // 0
            [hw, -hh, -hd],  // 1
            [hw, hh, -hd],   // 2
            [-hw, hh, -hd],  // 3
            [-hw, -hh, hd],  // 4
            [hw, -hh, hd],   // 5
            [hw, hh, hd],    // 6
            [-hw, hh, hd]    // 7
        ];
        
        const projected = vertices.map(v => this.project3D(v, cx, cy));
        
        const faces = [
            [0, 1, 2, 3], // back
            [4, 5, 6, 7], // front
            [0, 1, 5, 4], // bottom
            [2, 3, 7, 6], // top
            [0, 3, 7, 4], // left
            [1, 2, 6, 5]  // right
        ];
        
        const facesWithDepth = faces.map((face) => {
            const center = face.reduce((acc, vi) => {
                const v = vertices[vi];
                return [acc[0] + v[0], acc[1] + v[1], acc[2] + v[2]];
            }, [0, 0, 0]).map(c => c / face.length);
            
            const rotated = this.rotate3D(center);
            return { face, depth: rotated[2] };
        });
        
        facesWithDepth.sort((a, b) => a.depth - b.depth);
        
        facesWithDepth.forEach(({ face }) => {
            this.ctx.beginPath();
            this.ctx.moveTo(...projected[face[0]]);
            for (let i = 1; i < face.length; i++) {
                this.ctx.lineTo(...projected[face[i]]);
            }
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        });
    }

    drawPyramid(cx, cy, baseSize, height) {
        const s = baseSize / 2;
        
        // Define vertices in 3D space
        const vertices = [
            [-s, 0, -s],     // 0: base back-left
            [s, 0, -s],      // 1: base back-right
            [s, 0, s],       // 2: base front-right
            [-s, 0, s],      // 3: base front-left
            [0, -height, 0]  // 4: apex
        ];
        
        const projected = vertices.map(v => this.project3D(v, cx, cy));
        
        // Draw base
        this.ctx.beginPath();
        this.ctx.moveTo(...projected[0]);
        for (let i = 1; i < 4; i++) {
            this.ctx.lineTo(...projected[i]);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw triangular faces
        const faces = [
            [0, 1, 4], // back
            [1, 2, 4], // right
            [2, 3, 4], // front
            [3, 0, 4]  // left
        ];
        
        const facesWithDepth = faces.map((face) => {
            const center = face.reduce((acc, vi) => {
                const v = vertices[vi];
                return [acc[0] + v[0], acc[1] + v[1], acc[2] + v[2]];
            }, [0, 0, 0]).map(c => c / face.length);
            
            const rotated = this.rotate3D(center);
            return { face, depth: rotated[2] };
        });
        
        facesWithDepth.sort((a, b) => a.depth - b.depth);
        
        facesWithDepth.forEach(({ face }) => {
            this.ctx.beginPath();
            this.ctx.moveTo(...projected[face[0]]);
            this.ctx.lineTo(...projected[face[1]]);
            this.ctx.lineTo(...projected[face[2]]);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        });
    }

    drawCylinder(cx, cy, radius, height) {
        const segments = 20;
        const topCircle = [];
        const bottomCircle = [];
        
        // Generate circle vertices in 3D
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);
            
            topCircle.push([x, -height, z]);
            bottomCircle.push([x, 0, z]);
        }
        
        // Project vertices
        const topProjected = topCircle.map(v => this.project3D(v, cx, cy));
        const bottomProjected = bottomCircle.map(v => this.project3D(v, cx, cy));
        
        // Draw side surface
        for (let i = 0; i < segments; i++) {
            // Calculate if this segment is visible (simple back-face culling)
            const v1 = topCircle[i];
            const v2 = bottomCircle[i];
            const rotated1 = this.rotate3D(v1);
            const rotated2 = this.rotate3D(v2);
            
            // Draw quad for each side segment
            this.ctx.beginPath();
            this.ctx.moveTo(...topProjected[i]);
            this.ctx.lineTo(...topProjected[i + 1]);
            this.ctx.lineTo(...bottomProjected[i + 1]);
            this.ctx.lineTo(...bottomProjected[i]);
            this.ctx.closePath();
            
            // Only fill if facing forward (z > 0)
            if (rotated1[2] > 0 || rotated2[2] > 0) {
                this.ctx.fill();
            }
            this.ctx.stroke();
        }
        
        // Draw top circle
        this.ctx.beginPath();
        this.ctx.moveTo(...topProjected[0]);
        for (let i = 1; i < topProjected.length; i++) {
            this.ctx.lineTo(...topProjected[i]);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw bottom circle
        this.ctx.beginPath();
        this.ctx.moveTo(...bottomProjected[0]);
        for (let i = 1; i < bottomProjected.length; i++) {
            this.ctx.lineTo(...bottomProjected[i]);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawSphere(cx, cy, radius) {
        const segments = 16;
        const rings = 8;
        
        // Generate sphere vertices
        const vertices = [];
        for (let ring = 0; ring <= rings; ring++) {
            const phi = (ring / rings) * Math.PI;
            const y = -radius * Math.cos(phi);
            const ringRadius = radius * Math.sin(phi);
            
            for (let seg = 0; seg <= segments; seg++) {
                const theta = (seg / segments) * Math.PI * 2;
                const x = ringRadius * Math.cos(theta);
                const z = ringRadius * Math.sin(theta);
                
                vertices.push([x, y, z]);
            }
        }
        
        // Project all vertices
        const projected = vertices.map(v => this.project3D(v, cx, cy));
        
        // Draw wireframe
        this.ctx.strokeStyle = '#66666660';
        
        // Draw latitude lines
        for (let ring = 0; ring <= rings; ring++) {
            this.ctx.beginPath();
            for (let seg = 0; seg <= segments; seg++) {
                const idx = ring * (segments + 1) + seg;
                if (seg === 0) {
                    this.ctx.moveTo(...projected[idx]);
                } else {
                    this.ctx.lineTo(...projected[idx]);
                }
            }
            this.ctx.stroke();
        }
        
        // Draw longitude lines
        for (let seg = 0; seg < segments; seg++) {
            this.ctx.beginPath();
            for (let ring = 0; ring <= rings; ring++) {
                const idx = ring * (segments + 1) + seg;
                if (ring === 0) {
                    this.ctx.moveTo(...projected[idx]);
                } else {
                    this.ctx.lineTo(...projected[idx]);
                }
            }
            this.ctx.stroke();
        }
        
        this.ctx.strokeStyle = '#333';
        
        // Draw outline circle
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius * 0.9, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawCone(cx, cy, radius, height) {
        const segments = 20;
        const baseCircle = [];
        
        // Generate base circle vertices in 3D
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);
            
            baseCircle.push([x, 0, z]);
        }
        
        // Apex point
        const apex = [0, -height, 0];
        
        // Project vertices
        const baseProjected = baseCircle.map(v => this.project3D(v, cx, cy));
        const apexProjected = this.project3D(apex, cx, cy);
        
        // Draw side surface
        for (let i = 0; i < segments; i++) {
            const v1 = baseCircle[i];
            const rotated = this.rotate3D(v1);
            
            // Draw triangle for each side segment
            this.ctx.beginPath();
            this.ctx.moveTo(...apexProjected);
            this.ctx.lineTo(...baseProjected[i]);
            this.ctx.lineTo(...baseProjected[i + 1]);
            this.ctx.closePath();
            
            // Only fill if facing forward
            if (rotated[2] > 0) {
                this.ctx.fill();
            }
            this.ctx.stroke();
        }
        
        // Draw base circle
        this.ctx.beginPath();
        this.ctx.moveTo(...baseProjected[0]);
        for (let i = 1; i < baseProjected.length; i++) {
            this.ctx.lineTo(...baseProjected[i]);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    // Helper methods
    drawLine(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    drawFace(vertices) {
        this.ctx.beginPath();
        this.ctx.moveTo(...vertices[0]);
        for (let i = 1; i < vertices.length; i++) {
            this.ctx.lineTo(...vertices[i]);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
}
