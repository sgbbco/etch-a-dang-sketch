const canvasContainer = document.querySelector('.canvas-container');
const slider = document.querySelector('#grid-slider');
const gridSizeLabel = document.querySelector('.grid-size-label');
const shakeButton = document.querySelector('#shake-button');
const appContainer = document.querySelector('.app-container');
const colorSelector = document.querySelector('#color-selector');
const modeSelector = document.querySelector('#mode-selector');
const colorControl = document.querySelector('#color-control');

//Variable ratio - wanted to experiment with a wide format, has to be whole numbers or we get weird sized squares
const gridRatio = 2; //Ratio of 1:gridRatio

let mouseDown = false
window.onmousedown = () => mouseDown = true;
window.onmouseup = () => mouseDown = false;

let colorChoice = "Classic";
colorSelector.textContent = colorChoice;
colorSelector.addEventListener('click',setColor);

const colorPicker = document.createElement('input');
colorPicker.setAttribute('type','color','class','picker');
colorPicker.addEventListener('input',pickColor);

let pickedColor = "#000"

function pickColor(e){
  console.log(e.target.value);
  pickedColor = e.target.value;
}

function setColor () {
  if (colorChoice === "Classic") {
  colorChoice = "Rainbow";
  } else if (colorChoice === "Rainbow") {
  colorChoice = "Tint";
  } else if (colorChoice === "Tint") {
    colorChoice = "70s";
  } else if (colorChoice === "70s") {
    colorChoice = "Picker";
    colorControl.appendChild(colorPicker);
  } else if (colorChoice === "Picker") {
    colorChoice = "Classic";
    colorControl.removeChild(colorPicker);
  };
  colorSelector.textContent = colorChoice;
};

let drawMode = "Draw";
modeSelector.textContent = drawMode;
modeSelector.addEventListener('click',setMode);

function setMode () {
  if (drawMode === "Draw") {
    drawMode = "Erase";
  } else {
    drawMode = "Draw";
  };
  modeSelector.textContent = drawMode;
};

let currentSize = 12;
//Input default canvas settings
defaultCanvas(currentSize,5,50);//starting rows, min rows , max rows

//Setup default canvas
function defaultCanvas(size,min,max) {
  changeGridSize(size);
  slider.setAttribute('value',size);
  slider.setAttribute('min',min);
  slider.setAttribute('max',max);
  gridSizeLabel.textContent = `Grid size: ${size} x ${size * gridRatio}`; 
};

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function sliderInput() {
  gridSizeLabel.textContent = `Grid size: ${this.value} x ${this.value * gridRatio}`;
  currentSize = this.value;
  changeGridSize(this.value);
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

//adds a class containing an animation
function shakeCanvas() {
  const squares = document.querySelectorAll('.grid-square');
  squares.forEach(square => square.style.backgroundColor = "");
  appContainer.classList.add('canvas-shake');
  //when the animation is finished, remove the class so it's ready to run again
  appContainer.addEventListener('animationend',() => appContainer.classList.remove('canvas-shake'));
};

function mousetrail(e) {
 if (mouseDown === true) {
  setBg(e);
 }
 e.target.classList.add('hover');
 e.target.addEventListener('transitionend',() => e.target.classList.remove('hover'));
};

//Change the background colour of the squares
function setBg(e){
  if (drawMode === "Draw") {
    if(colorChoice === "Classic") {
      e.target.style.backgroundColor = "rgb(60, 60, 60)";
    } else if (colorChoice === "Rainbow"){
      //This line generates a random HEX value
      const randomColor = Math.floor(Math.random()*16777215).toString(16);
      e.target.style.backgroundColor = "#" + randomColor;
    } else if (colorChoice === "Tint"){
      tintBg(e);
    } else if (colorChoice === "70s"){
      colourSwatches(e);
    } else if (colorChoice === "Picker"){
      e.target.style.backgroundColor = pickedColor;
  };
  //If drawMode is not 'draw', assume it's 'erase' and remove the backbround colour
  } else {
    e.target.style.backgroundColor = "";
  };
};

//function to cycle through a set of swatches one by one
//this variable references the array index of the colour we want to use
let colorSelection = 0;

function colourSwatches(e) {
  const colours = ["#3F8A8C", "#0C5679", "#0B0835",	"#E5340B","#F28A0F", "#FFE7BD"];
  if(colorSelection > colours.length - 1){colorSelection = 0}; 
  e.target.style.backgroundColor = colours[colorSelection];
  colorSelection++;
}

//This function is used for the 'Tint' draw mode
function tintBg(e) {
  //If there's no bg colour on the square, set it to the lightest tint
  if(e.target.style.backgroundColor === "") {
    e.target.style.backgroundColor = "rgb(180, 180, 180)";

  //Otherwise, get the RGB value of the current bg colour and map it to an array
  } else {
    const currnetColor = e.target.style.backgroundColor;
    const currentArray = currnetColor.match(/\d+/g).map(Number);

    //If the colour is already the darkest grey, stop tinting
    if (currnetColor === "rgb(60, 60, 60)") {
      return

    //Otherwise, if the colour is grey, make it darker
    } else if (currentArray[0] === currentArray[1] && currentArray[0] === currentArray[2]) {
      const newValue = currentArray[0] - 40;
      e.target.style.backgroundColor = `rgb(${newValue}, ${newValue}, ${newValue})`

    //If it's a colour other than grey, also set it to the lightest tint
    } else {
      e.target.style.backgroundColor = "rgb(180, 180, 180)";
    };
  };
};
