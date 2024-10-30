import { backend } from 'declarations/backend';

let currentElement = null;
let undoStack = [];
let redoStack = [];
let isDragging = false;
let isResizing = false;
let dragOffsetX, dragOffsetY;

document.addEventListener('DOMContentLoaded', () => {
    setupDragAndDrop();
    setupDeviceControls();
    setupTopControls();
    setupPropertyPanel();
    setupCanvas();
    setupCodeViewOverlay();
});

function setupDragAndDrop() {
    const elements = document.querySelectorAll('.element');
    const canvas = document.getElementById('canvas');

    elements.forEach(element => {
        element.setAttribute('draggable', 'true');
        element.addEventListener('dragstart', dragStart);
    });

    canvas.addEventListener('dragover', dragOver);
    canvas.addEventListener('drop', drop);
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.type);
    e.dataTransfer.effectAllowed = 'copy';
}

function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}

function drop(e) {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('text');
    const newElement = createElementByType(elementType);
    const canvasRect = e.target.getBoundingClientRect();
    newElement.style.position = 'absolute';
    newElement.style.left = `${e.clientX - canvasRect.left}px`;
    newElement.style.top = `${e.clientY - canvasRect.top}px`;
    e.target.appendChild(newElement);
    addToUndoStack();
}

function createElementByType(type) {
    const element = document.createElement('div');
    element.classList.add('canvas-element');
    element.dataset.type = type;

    switch (type) {
        case 'heading':
            element.innerHTML = '<h2 contenteditable="true">Heading</h2>';
            break;
        case 'text':
            element.innerHTML = '<p contenteditable="true">Text content</p>';
            break;
        case 'button':
            element.innerHTML = '<button>Button</button>';
            break;
        case 'image':
            element.innerHTML = '<img src="https://via.placeholder.com/150" alt="Placeholder">';
            break;
        case 'video':
            element.innerHTML = '<video width="320" height="240" controls><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">Your browser does not support the video tag.</video>';
            break;
        case 'form':
            element.innerHTML = `
                <form>
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" required>
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                    <button type="submit">Submit</button>
                </form>
            `;
            break;
        case 'list':
            element.innerHTML = `
                <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                </ul>
            `;
            break;
        case 'table':
            element.innerHTML = `
                <table>
                    <tr>
                        <th>Header 1</th>
                        <th>Header 2</th>
                    </tr>
                    <tr>
                        <td>Row 1, Cell 1</td>
                        <td>Row 1, Cell 2</td>
                    </tr>
                    <tr>
                        <td>Row 2, Cell 1</td>
                        <td>Row 2, Cell 2</td>
                    </tr>
                </table>
            `;
            break;
        case 'social-icons':
            element.innerHTML = `
                <div class="social-icons">
                    <a href="#" class="social-icon"><i class="ri-facebook-fill"></i></a>
                    <a href="#" class="social-icon"><i class="ri-twitter-fill"></i></a>
                    <a href="#" class="social-icon"><i class="ri-instagram-fill"></i></a>
                </div>
            `;
            break;
        case 'map':
            element.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968482413!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes+Square!5e0!3m2!1sen!2sus!4v1510579767645" width="400" height="300" frameborder="0" style="border:0" allowfullscreen></iframe>';
            break;
        case 'countdown':
            element.innerHTML = '<div class="countdown">Countdown: <span id="countdown-timer">00:00:00</span></div>';
            startCountdown(element.querySelector('#countdown-timer'));
            break;
        case 'pricing-table':
            element.innerHTML = `
                <div class="pricing-table">
                    <div class="pricing-plan">
                        <h3>Basic</h3>
                        <p class="price">$9.99/mo</p>
                        <ul>
                            <li>Feature 1</li>
                            <li>Feature 2</li>
                            <li>Feature 3</li>
                        </ul>
                        <button>Choose Plan</button>
                    </div>
                </div>
            `;
            break;
        case 'section':
            element.innerHTML = '<div class="section" style="width: 100%; height: 200px; border: 1px dashed #ccc;"></div>';
            break;
        case 'container':
            element.innerHTML = '<div class="container" style="width: 80%; margin: 0 auto; border: 1px dashed #ccc;"></div>';
            break;
        case 'grid':
            element.innerHTML = `
                <div class="grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                    <div style="background-color: #f0f0f0; padding: 20px;">Grid Item 1</div>
                    <div style="background-color: #f0f0f0; padding: 20px;">Grid Item 2</div>
                    <div style="background-color: #f0f0f0; padding: 20px;">Grid Item 3</div>
                </div>
            `;
            break;
    }

    element.addEventListener('mousedown', elementMouseDown);
    element.addEventListener('dblclick', makeEditable);
    addResizeHandle(element);
    return element;
}

function elementMouseDown(e) {
    if (currentElement) {
        currentElement.classList.remove('selected');
    }
    currentElement = e.target.closest('.canvas-element');
    currentElement.classList.add('selected');
    updatePropertyPanel();

    if (e.target.classList.contains('resize-handle')) {
        isResizing = true;
    } else {
        isDragging = true;
        dragOffsetX = e.clientX - currentElement.offsetLeft;
        dragOffsetY = e.clientY - currentElement.offsetTop;
    }

    document.addEventListener('mousemove', elementDrag);
    document.addEventListener('mouseup', elementMouseUp);
}

function elementDrag(e) {
    if (isDragging && currentElement) {
        e.preventDefault();
        const canvas = document.getElementById('canvas');
        let newX = e.clientX - canvas.offsetLeft - dragOffsetX;
        let newY = e.clientY - canvas.offsetTop - dragOffsetY;

        // Ensure the element stays within the canvas
        newX = Math.max(0, Math.min(newX, canvas.clientWidth - currentElement.offsetWidth));
        newY = Math.max(0, Math.min(newY, canvas.clientHeight - currentElement.offsetHeight));

        currentElement.style.left = `${newX}px`;
        currentElement.style.top = `${newY}px`;
        updatePropertyPanel();
    } else if (isResizing && currentElement) {
        e.preventDefault();
        const newWidth = e.clientX - currentElement.offsetLeft;
        const newHeight = e.clientY - currentElement.offsetTop;
        currentElement.style.width = `${newWidth}px`;
        currentElement.style.height = `${newHeight}px`;
        updatePropertyPanel();
    }
}

function elementMouseUp() {
    isDragging = false;
    isResizing = false;
    document.removeEventListener('mousemove', elementDrag);
    document.removeEventListener('mouseup', elementMouseUp);
    addToUndoStack();
}

function makeEditable(e) {
    const element = e.target.closest('.canvas-element');
    const content = element.querySelector('h2, p, button');
    if (content) {
        content.contentEditable = true;
        content.focus();
    }
}

function addResizeHandle(element) {
    const resizeHandle = document.createElement('div');
    resizeHandle.classList.add('resize-handle');
    element.appendChild(resizeHandle);
}

function setupDeviceControls() {
    const deviceButtons = document.querySelectorAll('.device-button');
    deviceButtons.forEach(button => {
        button.addEventListener('click', () => {
            deviceButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const device = button.dataset.device;
            document.getElementById('canvas').className = device;
            adjustCanvasSize(device);
        });
    });
}

function adjustCanvasSize(device) {
    const canvas = document.getElementById('canvas');
    switch (device) {
        case 'desktop':
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            break;
        case 'tablet':
            canvas.style.width = '768px';
            canvas.style.height = '1024px';
            break;
        case 'mobile':
            canvas.style.width = '375px';
            canvas.style.height = '667px';
            break;
    }
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
        setupCanvasElements();
    }
}

function redo() {
    if (redoStack.length > 0) {
        undoStack.push(redoStack.pop());
        canvas.innerHTML = undoStack[undoStack.length - 1];
        setupCanvasElements();
    }
}

function toggleCodeView() {
    const overlay = document.getElementById('code-view-overlay');
    const generatedCode = document.getElementById('generated-code');
    
    if (overlay.style.display === 'none') {
        generatedCode.textContent = formatHTML(canvas.innerHTML);
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
    }
}

function formatHTML(html) {
    let formatted = '';
    let indent = '';
    const tab = '    ';
    html.split(/>\s*</).forEach(element => {
        if (element.match(/^\/\w/)) {
            indent = indent.substring(tab.length);
        }
        formatted += indent + '<' + element + '>\r\n';
        if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("input")) {
            indent += tab;
        }
    });
    return formatted.substring(1, formatted.length - 3);
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

function setupCanvas() {
    const canvas = document.getElementById('canvas');
    canvas.addEventListener('click', canvasClick);
}

function canvasClick(e) {
    if (e.target === canvas) {
        if (currentElement) {
            currentElement.classList.remove('selected');
        }
        currentElement = null;
        updatePropertyPanel();
    }
}

function setupCanvasElements() {
    const elements = document.querySelectorAll('.canvas-element');
    elements.forEach(element => {
        element.addEventListener('mousedown', elementMouseDown);
        element.addEventListener('dblclick', makeEditable);
        addResizeHandle(element);
    });
}

function setupCodeViewOverlay() {
    const closeButton = document.getElementById('close-code-view');
    closeButton.addEventListener('click', () => {
        document.getElementById('code-view-overlay').style.display = 'none';
    });
}

function startCountdown(element) {
    let time = 24 * 60 * 60; // 24 hours in seconds
    const countdownTimer = setInterval(() => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        
        element.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (time <= 0) {
            clearInterval(countdownTimer);
            element.textContent = "Countdown finished!";
        }
        time--;
    }, 1000);
}
