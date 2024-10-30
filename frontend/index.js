import { backend } from 'declarations/backend';

let currentElement = null;
let undoStack = [];
let redoStack = [];
let isDragging = false;
let isResizing = false;
let dragOffsetX, dragOffsetY;

document.addEventListener('DOMContentLoaded', () => {
    setupTemplateSelection();
    setupDragAndDrop();
    setupDeviceControls();
    setupTopControls();
    setupPropertyPanel();
    setupCanvas();
    setupCodeViewOverlay();
});

function setupTemplateSelection() {
    const templateSelection = document.getElementById('template-selection');
    const builder = document.getElementById('builder');
    const templates = document.querySelectorAll('.template');

    templates.forEach(template => {
        template.addEventListener('click', () => {
            const templateType = template.dataset.template;
            loadTemplate(templateType);
            templateSelection.classList.remove('active');
            templateSelection.classList.add('hidden');
            builder.classList.remove('hidden');
            builder.classList.add('active');
        });
    });
}

function loadTemplate(templateType) {
    const canvas = document.getElementById('canvas');
    canvas.style.position = 'relative';
    let templateHTML = '';

    switch (templateType) {
        case 'business':
            templateHTML = getBusinessTemplate();
            break;
        case 'portfolio':
            templateHTML = getPortfolioTemplate();
            break;
        case 'blog':
            templateHTML = getBlogTemplate();
            break;
        case 'ecommerce':
            templateHTML = getEcommerceTemplate();
            break;
        case 'blank':
        default:
            templateHTML = '';
            break;
    }

    canvas.innerHTML = templateHTML;
    setupCanvasElements();
    addDeleteButtons();
    addToUndoStack();
}

// ... (previous template functions remain unchanged)

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
    addDeleteButton(newElement);
    addToUndoStack();
}

// ... (previous createElementByType function remains unchanged)

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
        const canvasRect = canvas.getBoundingClientRect();
        let newX = e.clientX - canvasRect.left - dragOffsetX;
        let newY = e.clientY - canvasRect.top - dragOffsetY;

        currentElement.style.left = `${newX}px`;
        currentElement.style.top = `${newY}px`;
        updatePropertyPanel();
    } else if (isResizing && currentElement) {
        e.preventDefault();
        const canvas = document.getElementById('canvas');
        const canvasRect = canvas.getBoundingClientRect();
        const newWidth = e.clientX - canvasRect.left - currentElement.offsetLeft;
        const newHeight = e.clientY - canvasRect.top - currentElement.offsetTop;
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

// ... (rest of the code remains unchanged)

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
        addResizeHandle(element);
        addDeleteButton(element);
    });
}

// ... (rest of the code remains unchanged)
