const canvasContainer = document.querySelector('.canvas-container');
const slider = document.querySelector('#grid-slider');
const gridSizeLabel = document.querySelector('.grid-size-label');
const gridRatio = 2; //Ratio of 1:gridRatio


//Input default canvas settings
defaultCanvas(15,5,50)//starting rows, min rows , max rows

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function sliderInput() {
  gridSizeLabel.innerHTML = `Grid size: ${this.value} x ${this.value * gridRatio}`;
  changeGridSize(this.value);
  console.log(this);
}


//Setup default canvas
function defaultCanvas(size,min,max) {
  changeGridSize(size);
  slider.setAttribute('value',size);
  slider.setAttribute('min',min);
  slider.setAttribute('max',max);
  gridSizeLabel.innerHTML = `Grid size: ${size} x ${size * gridRatio}`; 
} 

function changeGridSize(gridSize) {
  setupNewCanvas(gridSize);
  addSquares(gridSize);
};

//Clear the canvas and then add CSS grid properties to the canvas element
function setupNewCanvas(gridSize) {
  canvasContainer.innerHTML = '';
  canvasContainer.style.gridTemplateColumns = `repeat(${gridSize * gridRatio}, 1fr)`;
  canvasContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
}

//Add the correct amount of divs to the grid
function addSquares(gridSize) {
  for (let i=1; i <= gridSize * (gridSize * gridRatio); i++) {
  const gridSquare = document.createElement('div');
  gridSquare.classList.add('grid-square');
  gridSquare.id = `Sq${i}`;
  canvasContainer.appendChild(gridSquare);
  }
}




