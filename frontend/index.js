import { backend } from 'declarations/backend';

let currentElement = null;
let undoStack = [];
let redoStack = [];

document.addEventListener('DOMContentLoaded', () => {
    setupDragAndDrop();
    setupDeviceControls();
    setupTopControls();
    setupPropertyPanel();
});

function setupDragAndDrop() {
    const elements = document.querySelectorAll('.element');
    const canvas = document.getElementById('canvas');

    elements.forEach(element => {
        element.addEventListener('dragstart', dragStart);
    });

    canvas.addEventListener('dragover', dragOver);
    canvas.addEventListener('drop', drop);
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.type);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('text');
    const newElement = createElementByType(elementType);
    newElement.style.position = 'absolute';
    newElement.style.left = `${e.clientX - canvas.offsetLeft}px`;
    newElement.style.top = `${e.clientY - canvas.offsetTop}px`;
    canvas.appendChild(newElement);
    addToUndoStack();
}

function createElementByType(type) {
    const element = document.createElement('div');
    element.classList.add('canvas-element');
    element.dataset.type = type;

    switch (type) {
        case 'heading':
            element.innerHTML = '<h2>Heading</h2>';
            break;
        case 'text':
            element.innerHTML = '<p>Text content</p>';
            break;
        case 'button':
            element.innerHTML = '<button>Button</button>';
            break;
        case 'image':
            element.innerHTML = '<img src="https://via.placeholder.com/150" alt="Placeholder">';
            break;
        // Add more cases for other element types
    }

    element.addEventListener('click', selectElement);
    return element;
}

function selectElement(e) {
    if (currentElement) {
        currentElement.classList.remove('selected');
    }
    currentElement = e.target.closest('.canvas-element');
    currentElement.classList.add('selected');
    updatePropertyPanel();
}

function setupDeviceControls() {
    const deviceButtons = document.querySelectorAll('.device-button');
    deviceButtons.forEach(button => {
        button.addEventListener('click', () => {
            deviceButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            document.getElementById('canvas').className = button.dataset.device;
        });
    });
}

function setupTopControls() {
    document.getElementById('undo-btn').addEventListener('click', undo);
    document.getElementById('redo-btn').addEventListener('click', redo);
    document.getElementById('view-code-btn').addEventListener('click', toggleCodeView);
    document.getElementById('toggle-grid-btn').addEventListener('click', toggleGrid);
    document.getElementById('save-btn').addEventListener('click', saveDesign);
    document.getElementById('preview-btn').addEventListener('click', previewDesign);
    document.getElementById('publish-btn').addEventListener('click', publishDesign);
}

function setupPropertyPanel() {
    const inputs = document.querySelectorAll('.property-input');
    inputs.forEach(input => {
        input.addEventListener('change', updateElementProperty);
    });
}

function updatePropertyPanel() {
    if (!currentElement) return;

    document.getElementById('element-width').value = currentElement.style.width;
    document.getElementById('element-height').value = currentElement.style.height;
    document.getElementById('element-bgcolor').value = rgb2hex(currentElement.style.backgroundColor);
    document.getElementById('element-text').value = currentElement.innerText;
    document.getElementById('element-font-size').value = currentElement.style.fontSize;
    document.getElementById('element-font-color').value = rgb2hex(currentElement.style.color);
}

function updateElementProperty(e) {
    if (!currentElement) return;

    const property = e.target.id.replace('element-', '');
    const value = e.target.value;

    switch (property) {
        case 'width':
        case 'height':
            currentElement.style[property] = value;
            break;
        case 'bgcolor':
            currentElement.style.backgroundColor = value;
            break;
        case 'text':
            currentElement.innerText = value;
            break;
        case 'font-size':
            currentElement.style.fontSize = value;
            break;
        case 'font-color':
            currentElement.style.color = value;
            break;
    }

    addToUndoStack();
}

function rgb2hex(rgb) {
    if (!rgb) return '#000000';
    if (rgb.search("rgb") == -1) return rgb;
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function addToUndoStack() {
    undoStack.push(canvas.innerHTML);
    redoStack = [];
}

function undo() {
    if (undoStack.length > 1) {
        redoStack.push(undoStack.pop());
        canvas.innerHTML = undoStack[undoStack.length - 1];
    }
}

function redo() {
    if (redoStack.length > 0) {
        undoStack.push(redoStack.pop());
        canvas.innerHTML = undoStack[undoStack.length - 1];
    }
}

function toggleCodeView() {
    const overlay = document.getElementById('code-view-overlay');
    const generatedCode = document.getElementById('generated-code');
    
    if (overlay.style.display === 'none') {
        generatedCode.textContent = canvas.innerHTML;
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
    }
}

function toggleGrid() {
    document.querySelector('.grid-overlay').classList.toggle('visible');
}

async function saveDesign() {
    const design = canvas.innerHTML;
    try {
        await backend.saveDesign(design);
        alert('Design saved successfully!');
    } catch (error) {
        console.error('Error saving design:', error);
        alert('Failed to save design. Please try again.');
    }
}

function previewDesign() {
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write('<html><head><title>Preview</title></head><body>');
    previewWindow.document.write(canvas.innerHTML);
    previewWindow.document.write('</body></html>');
    previewWindow.document.close();
}

async function publishDesign() {
    const design = canvas.innerHTML;
    try {
        const publishedUrl = await backend.publishDesign(design);
        alert(`Design published successfully! URL: ${publishedUrl}`);
    } catch (error) {
        console.error('Error publishing design:', error);
        alert('Failed to publish design. Please try again.');
    }
}
