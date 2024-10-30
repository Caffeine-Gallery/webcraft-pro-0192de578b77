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

function getBusinessTemplate() {
    return `
        <header class="canvas-element" style="position: absolute; top: 0; left: 0; width: 100%; padding: 20px; background-color: #f8f9fa;">
            <h1 contenteditable="true">Business Name</h1>
            <nav>
                <a href="#" contenteditable="true">Home</a>
                <a href="#" contenteditable="true">About</a>
                <a href="#" contenteditable="true">Services</a>
                <a href="#" contenteditable="true">Contact</a>
            </nav>
        </header>
        <main>
            <section class="canvas-element" style="position: absolute; top: 100px; left: 0; width: 100%; padding: 40px; text-align: center;">
                <h2 contenteditable="true">Welcome to Our Business</h2>
                <p contenteditable="true">We provide top-notch services to help your business grow.</p>
                <button contenteditable="true">Learn More</button>
            </section>
            <section class="canvas-element" style="position: absolute; top: 300px; left: 0; width: 100%; display: flex; justify-content: space-around; padding: 40px;">
                <div>
                    <h3 contenteditable="true">Service 1</h3>
                    <p contenteditable="true">Description of service 1</p>
                </div>
                <div>
                    <h3 contenteditable="true">Service 2</h3>
                    <p contenteditable="true">Description of service 2</p>
                </div>
                <div>
                    <h3 contenteditable="true">Service 3</h3>
                    <p contenteditable="true">Description of service 3</p>
                </div>
            </section>
        </main>
        <footer class="canvas-element" style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 20px; background-color: #f8f9fa; text-align: center;">
            <p contenteditable="true">&copy; 2023 Business Name. All rights reserved.</p>
        </footer>
    `;
}

function getPortfolioTemplate() {
    return `
        <header class="canvas-element" style="position: absolute; top: 0; left: 0; width: 100%; padding: 20px; background-color: #f8f9fa;">
            <h1 contenteditable="true">Your Name</h1>
            <nav>
                <a href="#" contenteditable="true">Home</a>
                <a href="#" contenteditable="true">Projects</a>
                <a href="#" contenteditable="true">About</a>
                <a href="#" contenteditable="true">Contact</a>
            </nav>
        </header>
        <main>
            <section class="canvas-element" style="position: absolute; top: 100px; left: 0; width: 100%; padding: 40px; text-align: center;">
                <h2 contenteditable="true">Welcome to My Portfolio</h2>
                <p contenteditable="true">I'm a passionate creator specializing in web design and development.</p>
            </section>
            <section class="canvas-element" style="position: absolute; top: 300px; left: 0; width: 100%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 40px;">
                <div style="background-color: #f0f0f0; padding: 20px;">
                    <h3 contenteditable="true">Project 1</h3>
                    <p contenteditable="true">Description of project 1</p>
                </div>
                <div style="background-color: #f0f0f0; padding: 20px;">
                    <h3 contenteditable="true">Project 2</h3>
                    <p contenteditable="true">Description of project 2</p>
                </div>
                <div style="background-color: #f0f0f0; padding: 20px;">
                    <h3 contenteditable="true">Project 3</h3>
                    <p contenteditable="true">Description of project 3</p>
                </div>
            </section>
        </main>
        <footer class="canvas-element" style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 20px; background-color: #f8f9fa; text-align: center;">
            <p contenteditable="true">&copy; 2023 Your Name. All rights reserved.</p>
        </footer>
    `;
}

function getBlogTemplate() {
    return `
        <header class="canvas-element" style="position: absolute; top: 0; left: 0; width: 100%; padding: 20px; background-color: #f8f9fa;">
            <h1 contenteditable="true">Blog Title</h1>
            <nav>
                <a href="#" contenteditable="true">Home</a>
                <a href="#" contenteditable="true">Categories</a>
                <a href="#" contenteditable="true">About</a>
                <a href="#" contenteditable="true">Contact</a>
            </nav>
        </header>
        <main style="position: absolute; top: 100px; left: 0; width: 100%; display: flex; padding: 40px;">
            <section class="canvas-element" style="flex: 2; padding-right: 40px;">
                <article>
                    <h2 contenteditable="true">Blog Post Title</h2>
                    <p contenteditable="true">Published on <time datetime="2023-05-01">May 1, 2023</time></p>
                    <p contenteditable="true">This is the content of your blog post. It can be as long as you want and include various elements like images, quotes, and more.</p>
                </article>
            </section>
            <aside class="canvas-element" style="flex: 1;">
                <h3 contenteditable="true">Recent Posts</h3>
                <ul>
                    <li contenteditable="true">Post 1</li>
                    <li contenteditable="true">Post 2</li>
                    <li contenteditable="true">Post 3</li>
                </ul>
                <h3 contenteditable="true">Categories</h3>
                <ul>
                    <li contenteditable="true">Category 1</li>
                    <li contenteditable="true">Category 2</li>
                    <li contenteditable="true">Category 3</li>
                </ul>
            </aside>
        </main>
        <footer class="canvas-element" style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 20px; background-color: #f8f9fa; text-align: center;">
            <p contenteditable="true">&copy; 2023 Blog Title. All rights reserved.</p>
        </footer>
    `;
}

function getEcommerceTemplate() {
    return `
        <header class="canvas-element" style="position: absolute; top: 0; left: 0; width: 100%; padding: 20px; background-color: #f8f9fa;">
            <h1 contenteditable="true">Store Name</h1>
            <nav>
                <a href="#" contenteditable="true">Home</a>
                <a href="#" contenteditable="true">Products</a>
                <a href="#" contenteditable="true">Cart</a>
                <a href="#" contenteditable="true">Account</a>
            </nav>
        </header>
        <main>
            <section class="canvas-element" style="position: absolute; top: 100px; left: 0; width: 100%; padding: 40px; text-align: center;">
                <h2 contenteditable="true">Featured Products</h2>
            </section>
            <section class="canvas-element" style="position: absolute; top: 200px; left: 0; width: 100%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 40px;">
                <div style="border: 1px solid #ddd; padding: 20px;">
                    <h3 contenteditable="true">Product 1</h3>
                    <p contenteditable="true">$19.99</p>
                    <button contenteditable="true">Add to Cart</button>
                </div>
                <div style="border: 1px solid #ddd; padding: 20px;">
                    <h3 contenteditable="true">Product 2</h3>
                    <p contenteditable="true">$24.99</p>
                    <button contenteditable="true">Add to Cart</button>
                </div>
                <div style="border: 1px solid #ddd; padding: 20px;">
                    <h3 contenteditable="true">Product 3</h3>
                    <p contenteditable="true">$29.99</p>
                    <button contenteditable="true">Add to Cart</button>
                </div>
            </section>
        </main>
        <footer class="canvas-element" style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 20px; background-color: #f8f9fa; text-align: center;">
            <p contenteditable="true">&copy; 2023 Store Name. All rights reserved.</p>
        </footer>
    `;
}

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

function createElementByType(type) {
    const element = document.createElement('div');
    element.classList.add('canvas-element');
    element.dataset.type = type;
    element.style.position = 'absolute';

    switch (type) {
        case 'heading':
            element.innerHTML = '<h2 contenteditable="true">Heading</h2>';
            break;
        case 'text':
            element.innerHTML = '<p contenteditable="true">Text content</p>';
            break;
        case 'button':
            element.innerHTML = '<button contenteditable="true">Button</button>';
            break;
        case 'image':
            element.innerHTML = '<img src="https://via.placeholder.com/150" alt="Placeholder"><p contenteditable="true">Image caption</p>';
            break;
        case 'video':
            element.innerHTML = '<video width="320" height="240" controls><source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">Your browser does not support the video tag.</video><p contenteditable="true">Video caption</p>';
            break;
        case 'form':
            element.innerHTML = `
                <form>
                    <label for="name" contenteditable="true">Name:</label>
                    <input type="text" id="name" name="name" required>
                    <label for="email" contenteditable="true">Email:</label>
                    <input type="email" id="email" name="email" required>
                    <button type="submit" contenteditable="true">Submit</button>
                </form>
            `;
            break;
        case 'list':
            element.innerHTML = `
                <ul>
                    <li contenteditable="true">Item 1</li>
                    <li contenteditable="true">Item 2</li>
                    <li contenteditable="true">Item 3</li>
                </ul>
            `;
            break;
        case 'table':
            element.innerHTML = `
                <table>
                    <tr>
                        <th contenteditable="true">Header 1</th>
                        <th contenteditable="true">Header 2</th>
                    </tr>
                    <tr>
                        <td contenteditable="true">Row 1, Cell 1</td>
                        <td contenteditable="true">Row 1, Cell 2</td>
                    </tr>
                    <tr>
                        <td contenteditable="true">Row 2, Cell 1</td>
                        <td contenteditable="true">Row 2, Cell 2</td>
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
                <p contenteditable="true">Follow us on social media</p>
            `;
            break;
        case 'map':
            element.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968482413!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes+Square!5e0!3m2!1sen!2sus!4v1510579767645" width="400" height="300" frameborder="0" style="border:0" allowfullscreen></iframe><p contenteditable="true">Map location</p>';
            break;
        case 'countdown':
            element.innerHTML = '<div class="countdown">Countdown: <span id="countdown-timer">00:00:00</span></div><p contenteditable="true">Countdown description</p>';
            startCountdown(element.querySelector('#countdown-timer'));
            break;
        case 'pricing-table':
            element.innerHTML = `
                <div class="pricing-table">
                    <div class="pricing-plan">
                        <h3 contenteditable="true">Basic</h3>
                        <p class="price" contenteditable="true">$9.99/mo</p>
                        <ul>
                            <li contenteditable="true">Feature 1</li>
                            <li contenteditable="true">Feature 2</li>
                            <li contenteditable="true">Feature 3</li>
                        </ul>
                        <button contenteditable="true">Choose Plan</button>
                    </div>
                </div>
            `;
            break;
        case 'carousel':
            element.innerHTML = `
                <div class="carousel">
                    <div class="carousel-item" contenteditable="true">Slide 1</div>
                    <div class="carousel-item" contenteditable="true">Slide 2</div>
                    <div class="carousel-item" contenteditable="true">Slide 3</div>
                </div>
            `;
            break;
        case 'accordion':
            element.innerHTML = `
                <div class="accordion">
                    <div class="accordion-item">
                        <h3 class="accordion-header" contenteditable="true">Section 1</h3>
                        <div class="accordion-content" contenteditable="true">Content for section 1</div>
                    </div>
                    <div class="accordion-item">
                        <h3 class="accordion-header" contenteditable="true">Section 2</h3>
                        <div class="accordion-content" contenteditable="true">Content for section 2</div>
                    </div>
                </div>
            `;
            break;
        case 'tabs':
            element.innerHTML = `
                <div class="tabs">
                    <div class="tab-headers">
                        <div class="tab-header" contenteditable="true">Tab 1</div>
                        <div class="tab-header" contenteditable="true">Tab 2</div>
                    </div>
                    <div class="tab-contents">
                        <div class="tab-content" contenteditable="true">Content for Tab 1</div>
                        <div class="tab-content" contenteditable="true">Content for Tab 2</div>
                    </div>
                </div>
            `;
            break;
        case 'testimonial':
            element.innerHTML = `
                <div class="testimonial">
                    <p class="testimonial-content" contenteditable="true">"This is an amazing product!"</p>
                    <p class="testimonial-author" contenteditable="true">- John Doe</p>
                </div>
            `;
            break;
        case 'section':
            element.innerHTML = '<div class="section" style="width: 100%; height: 200px; border: 1px dashed #ccc;"><p contenteditable="true">Section content</p></div>';
            break;
        case 'container':
            element.innerHTML = '<div class="container" style="width: 80%; margin: 0 auto; border: 1px dashed #ccc;"><p contenteditable="true">Container content</p></div>';
            break;
        case 'grid':
            element.innerHTML = `
                <div class="grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                    <div style="background-color: #f0f0f0; padding: 20px;" contenteditable="true">Grid Item 1</div>
                    <div style="background-color: #f0f0f0; padding: 20px;" contenteditable="true">Grid Item 2</div>
                    <div style="background-color: #f0f0f0; padding: 20px;" contenteditable="true">Grid Item 3</div>
                </div>
            `;
            break;
    }

    element.addEventListener('mousedown', elementMouseDown);
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
    const canvasContainer = document.getElementById('canvas-container');
    switch (device) {
        case 'desktop':
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvasContainer.style.overflow = 'hidden';
            break;
        case 'tablet':
            canvas.style.width = '768px';
            canvas.style.height = '1024px';
            canvasContainer.style.overflow = 'auto';
            break;
        case 'mobile':
            canvas.style.width = '375px';
            canvas.style.height = '667px';
            canvasContainer.style.overflow = 'auto';
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
}

function setupPropertyPanel() {
    const inputs = document.querySelectorAll('.property-input');
    inputs.forEach(input => {
        input.addEventListener('change', updateElementProperty);
    });

    const propertiesToggle = document.getElementById('properties-toggle');
    propertiesToggle.addEventListener('click', togglePropertiesPanel);
}

function togglePropertiesPanel() {
    const propertiesPanel = document.getElementById('properties-panel');
    propertiesPanel.classList.toggle('collapsed');
}

function updatePropertyPanel() {
    if (!currentElement) return;

    document.getElementById('element-width').value = currentElement.style.width;
    document.getElementById('element-height').value = currentElement.style.height;
    document.getElementById('element-bgcolor').value = rgb2hex(currentElement.style.backgroundColor);
    document.getElementById('element-text').value = currentElement.innerText;
    document.getElementById('element-font-size').value = currentElement.style.fontSize;
    document.getElementById('element-font-color').value = rgb2hex(currentElement.style.color);
    document.getElementById('element-link').value = currentElement.getAttribute('href') || '';
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
        case 'link':
            if (currentElement.tagName === 'A') {
                currentElement.href = value;
            } else {
                const link = document.createElement('a');
                link.href = value;
                link.innerHTML = currentElement.innerHTML;
                currentElement.parentNode.replaceChild(link, currentElement);
                currentElement = link;
            }
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

function setupCanvas() {
    const canvas = document.getElementById('canvas');
    canvas.addEventListener('click', canvasClick);
}

function canvasClick(e) {if (e.target === canvas) {
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

function addDeleteButtons() {
    const elements = document.querySelectorAll('.canvas-element');
    elements.forEach(element => {
        addDeleteButton(element);
    });
}

function addDeleteButton(element) {
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '&times;';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteElement(element);
    });
    element.appendChild(deleteButton);
}

function deleteElement(element) {
    element.remove();
    if (currentElement === element) {
        currentElement = null;
        updatePropertyPanel();
    }
    addToUndoStack();
}
