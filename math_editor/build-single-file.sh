#!/bin/bash

# Script to create a single HTML file with all resources embedded

OUTPUT_FILE="deployment/math-editor-standalone.html"

echo "Building single-file Math Expression Editor..."

# Start HTML file
cat > "$OUTPUT_FILE" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Math Expression Editor</title>
    <style>
EOF

# Append CSS
cat app/styles.css >> "$OUTPUT_FILE"

# Continue HTML
cat >> "$OUTPUT_FILE" << 'EOF'
    </style>
</head>
<body>
EOF

# Extract body content from index.html (between <body> and </body>)
sed -n '/<body>/,/<\/body>/p' app/index.html | sed '1d;$d' >> "$OUTPUT_FILE"

# Add scripts
cat >> "$OUTPUT_FILE" << 'EOF'

    <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"></script>
    <script>
EOF

# Append all JavaScript files in correct order
cat app/translations.js >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
cat app/mathExpression.js >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
cat app/navigation.js >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
cat app/keyboard.js >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
cat app/graphing.js >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
cat app/transformations.js >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
cat app/drawing.js >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
cat app/app.js >> "$OUTPUT_FILE"

# Close HTML
cat >> "$OUTPUT_FILE" << 'EOF'
    </script>
</body>
</html>
EOF

echo "✅ Single-file build complete: $OUTPUT_FILE"
echo "📏 File size: $(du -h "$OUTPUT_FILE" | cut -f1)"
