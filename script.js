const canvasContainer = document.querySelector('.canvas-container');
const slider = document.querySelector('#grid-slider');
const gridSizeLabel = document.querySelector('.grid-size-label');
const shakeButton = document.querySelector('#shake-button');

//Variable ratio - wanted to experiment with a wide format
const gridRatio = 2; //Ratio of 1:gridRatio

let mouseDown = false
canvasContainer.onmousedown = () => {mouseDown = true; console.log("Mouse is down")};
canvasContainer.onmouseup = () => {mouseDown = false; console.log("Mouse is up")};

let currentSize = 25;

//Input default canvas settings
defaultCanvas(currentSize,5,50)//starting rows, min rows , max rows

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function sliderInput() {
  gridSizeLabel.innerHTML = `Grid size: ${this.value} x ${this.value * gridRatio}`;
  currentSize = this.value;
  changeGridSize(this.value);
};



//Setup default canvas
function defaultCanvas(size,min,max) {
  changeGridSize(size);
  slider.setAttribute('value',size);
  slider.setAttribute('min',min);
  slider.setAttribute('max',max);
  gridSizeLabel.innerHTML = `Grid size: ${size} x ${size * gridRatio}`; 
};

function changeGridSize(gridSize) {
  setupNewCanvas(gridSize);
  addSquares(gridSize);
};

//Clear the canvas and then add CSS grid properties to the canvas element
function setupNewCanvas(gridSize) {
  canvasContainer.innerHTML = '';
  canvasContainer.style.gridTemplateColumns = `repeat(${gridSize * gridRatio}, 1fr)`;
  canvasContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
};

//Add the correct amount of divs to the grid
function addSquares(gridSize) {
  for (let i = 1; i <= gridSize * (gridSize * gridRatio); i++) {
  const gridSquare = document.createElement('div');
  gridSquare.classList.add('grid-square');
  gridSquare.id = `Sq${i}`;
  gridSquare.addEventListener('mousedown', colourSquare);
  gridSquare.addEventListener('mouseover', mousetrail);
  canvasContainer.appendChild(gridSquare);
  };  
};

shakeButton.addEventListener('click',shakeCanvas);

function shakeCanvas() {
  changeGridSize(currentSize);
  canvasContainer.classList.add('canvas-shake');
  canvasContainer.addEventListener('animationend', ()=>{
    canvasContainer.classList.remove('canvas-shake');
    console.log("animation over")
   });
};

function colourSquare(e) {
  e.target.classList.add('draw');
};

function mousetrail(e) {
 if (mouseDown === true) {
  e.target.classList.add('draw');
 }
 e.target.classList.add('hover');
 e.target.addEventListener('transitionend', ()=>{
   e.target.classList.remove('hover')
  });
};




