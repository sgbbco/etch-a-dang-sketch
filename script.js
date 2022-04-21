const canvasContainer = document.querySelector('.canvas-container');
const slider = document.querySelector('#grid-slider');
const gridSizeLabel = document.querySelector('.grid-size-label');
const shakeButton = document.querySelector('#shake-button');
const appContainer = document.querySelector('.app-container');
const colorSelector = document.querySelector('#color-selector');
const modeSelector = document.querySelector('#mode-selector');

//Variable ratio - wanted to experiment with a wide format, has to be whole numbers or we get weird sized squares
const gridRatio = 2; //Ratio of 1:gridRatio

let mouseDown = false
canvasContainer.onmousedown = () => mouseDown = true;
canvasContainer.onmouseup = () => mouseDown = false;


let colorChoice = "Classic";
colorSelector.textContent = colorChoice;
colorSelector.addEventListener('click',setColor);

function setColor () {
  if (colorChoice === "Classic") {
  colorChoice = "Rainbow";
  } else if (colorChoice === "Rainbow") {
  colorChoice = "Tint";
  } else if (colorChoice === "Tint") {
    colorChoice = "Classic";
  };
  colorSelector.textContent = colorChoice;
};

let drawMode = "Draw";
modeSelector.textContent = drawMode;
modeSelector.addEventListener('click',setMode);

function setMode () {
  if (drawMode === "Draw") {
    drawMode = "Erase";
    modeSelector.textContent = drawMode;
  } else {
    drawMode = "Draw";
    modeSelector.textContent = drawMode;
  };
};

let currentSize = 12;
//Input default canvas settings
defaultCanvas(currentSize,5,50);//starting rows, min rows , max rows

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function sliderInput() {
  gridSizeLabel.textContent = `Grid size: ${this.value} x ${this.value * gridRatio}`;
  currentSize = this.value;
  changeGridSize(this.value);
};

//Setup default canvas
function defaultCanvas(size,min,max) {
  changeGridSize(size);
  slider.setAttribute('value',size);
  slider.setAttribute('min',min);
  slider.setAttribute('max',max);
  gridSizeLabel.textContent = `Grid size: ${size} x ${size * gridRatio}`; 
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
  gridSquare.addEventListener('mousedown', setBg);
  gridSquare.addEventListener('mouseover', mousetrail);
  canvasContainer.appendChild(gridSquare);
  };  
};

shakeButton.addEventListener('click',shakeCanvas);

function shakeCanvas() {
  const squares = document.querySelectorAll('.grid-square');
  squares.forEach((square) => square.style.backgroundColor = "")
  appContainer.classList.add('canvas-shake');
  appContainer.addEventListener('animationend', ()=>{
    appContainer.classList.remove('canvas-shake');
   });
};

function mousetrail(e) {
 if (mouseDown === true) {
  setBg(e);
 }
 e.target.classList.add('hover');
 e.target.addEventListener('transitionend', ()=>{
   e.target.classList.remove('hover');
  });
};

function setBg(e){
  if (drawMode === "Draw") {
    if(colorChoice === "Classic") {
      e.target.style.backgroundColor = "rgb(80, 80, 80)";
    } else if (colorChoice === "Rainbow"){
      const randomColor = Math.floor(Math.random()*16777215).toString(16);
      e.target.style.backgroundColor = "#" + randomColor;
    } else if (colorChoice === "Tint"){
      darkenBackground (e);
    };
  //If drawMode is not 'draw', assume it's 'erase' and remove the backbround colour
  } else {
    e.target.style.backgroundColor = "";
  };
};

function darkenBackground(e) {
  //If there's no bg colour on the square, set it to the lightest tint
  if(e.target.style.backgroundColor === "") {
    e.target.style.backgroundColor = "rgb(200, 200, 200)";

  //Otherwise, get the RGB value of the current bg colour and map it to an array
  } else {
    const currnetColor = e.target.style.backgroundColor;
    const currentArray = currnetColor.match(/\d+/g).map(Number);
  
    //If the colour is already the darkest grey, stop tinting
    if (currnetColor === "rgb(80, 80, 80)") {
      return

    //Otherwise, if the colour is grey, make it darker
    } else if (currentArray[0] === currentArray[1] && currentArray[0] === currentArray[2]) {
      const newValue = currentArray[0] - 40;
      e.target.style.backgroundColor = `rgb(${newValue}, ${newValue}, ${newValue})`

    //If it's a colour other than grey, also set it to the lightest tint
    } else {
      e.target.style.backgroundColor = "rgb(200, 200, 200)";
    };
  };
};
