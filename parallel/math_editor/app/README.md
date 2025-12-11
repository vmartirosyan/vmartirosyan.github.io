# Math Expression Editor

A highly functional math expression editor featuring a large whiteboard and interactive math keyboard with advanced navigation capabilities.

## Features

- **Large Whiteboard Display**: Create and visualize complex mathematical expressions
- **Comprehensive Math Keyboard**: 
  - Numbers and basic operators
  - Fractions, exponents, and subscripts
  - Square roots and functions (sin, cos, tan, log, ln)
  - Greek symbols (π, θ, α, β, γ, etc.)
  - Special symbols (∫, Σ, Π)
  
- **Advanced Navigation**:
  - Arrow keys (←→↑↓) to navigate between elements
  - Move between fraction numerator/denominator
  - Navigate between base and exponent
  - Tab/Shift+Tab to cycle through sub-elements
  - Esc to exit complex elements

- **Editing Features**:
  - Undo functionality
  - Clear expression
  - Export to LaTeX format

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

### Production Mode
```bash
npm start
```

### Development Mode (with auto-reload)
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

### Keyboard Shortcuts

- **Arrow Keys**: Navigate between expression elements
  - `←` / `→`: Move cursor left/right
  - `↑` / `↓`: Move between sections (numerator/denominator, base/exponent)
  
- **Tab / Shift+Tab**: Move between sub-elements in complex expressions

- **Esc**: Exit current complex element

- **Backspace**: Delete previous element

- **Numbers (0-9)**: Insert numbers

- **Operators (+, -, *, /, =)**: Insert operators

- **Letters (a-z)**: Insert variable symbols

- **Parentheses ( )**: Insert parentheses

### Using the Math Keyboard

Click any button on the virtual keyboard to insert:
- Numbers and operators
- Fractions (automatically enters numerator)
- Powers/exponents (automatically enters base)
- Subscripts (automatically enters base)
- Square roots
- Trigonometric functions
- Greek letters and special symbols

### Navigation Examples

1. **Creating a Fraction**:
   - Click "a/b" button
   - Type numerator value
   - Press `↓` or `Tab` to move to denominator
   - Type denominator value
   - Press `Esc` or `→` to exit fraction

2. **Creating an Exponent**:
   - Click "x^y" button
   - Type base value
   - Press `Tab` to move to exponent
   - Type exponent value
   - Press `Esc` to exit

3. **Creating a Subscript**:
   - Click "x_i" button
   - Type base value
   - Press `Tab` to move to index
   - Type index value
   - Press `Esc` to exit

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Backend**: Node.js with Express
- **Architecture**: Component-based with separation of concerns
  - `mathExpression.js`: Expression tree and data structure
  - `navigation.js`: Navigation system and context management
  - `keyboard.js`: Input handling and keyboard controls
  - `app.js`: Main application controller and rendering

## Project Structure

```
app/
├── index.html          # Main HTML structure
├── styles.css          # Styling and layout
├── mathExpression.js   # Expression tree and data management
├── navigation.js       # Navigation system
├── keyboard.js         # Keyboard input handling
├── app.js             # Main application controller
├── server.js          # Node.js Express server
├── package.json       # Project dependencies
└── README.md          # Documentation
```

## Browser Support

Modern browsers with ES6+ support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT
