import Cell from "./Cell.js";
import {startStop} from './Timer.js';
import {createGameSpace} from './GameSpace.js';

export default class PicturePuzzle {
  constructor(element, imageSrc, width, dimension, savedCellsPos, moves, time) {
    this.parentElement = element;
    this.imageSrc = imageSrc;
    this.width = document.querySelector('body').offsetWidth < 450 ? 300 : width;

    this.savedCellsPos = savedCellsPos || [];

    this.savedGames = [];

    this.moves = moves || 0;
    this.time = time || '00:00:00';
    
    this.cells = [];
    this.dimension = dimension;

    this.init();

    const img = new Image();
    
    img.onload = () => {
      
      this.height = img.height * this.width / img.width;
      this.element.style.width = `${this.width}px`;
      this.element.style.height = `${this.height}px`;

      this.setup();

      document.querySelector('.show-img-btn').addEventListener('click', () => this.showOriginalImage(img.src));

    };

    img.src = this.imageSrc;
  }

  createPuzzleWrapper() {
    const puzzleWrapper = document.createElement('div');
    puzzleWrapper.classList.add('puzzle-wrapper');

    puzzleWrapper.style.position = 'relative';
    
    return puzzleWrapper;
  }

  showOriginalImage(url) {
    const originalImageLayout = document.createElement('div');
    originalImageLayout.classList.add('layout');
    originalImageLayout.innerHTML = `
    <img src="${url}" alt="image" class="original-image">
    `;
    document.querySelector('.puzzle-area-wrapper').appendChild(originalImageLayout);

    originalImageLayout.onclick = () => {
      originalImageLayout.remove();

    };

  }

  saveGameToLocalStorage() {

    let savedGamesArray = JSON.parse(localStorage.getItem('saved-games')) || [];

    const cellsArray =  document.querySelectorAll('.puzzle-wrapper div');
    console.log(cellsArray);
    const array = [];
    for(let i = 0; i < cellsArray.length - 1; i++) {
      array.push(cellsArray[i].dataset.id);
    }
    console.log(array);
    
    const newGame = {
    name: document.querySelector('.game-name-input').value,
    moves: document.querySelector('.moves').innerHTML,
    time: document.querySelector('.time').innerHTML,
    image: document.querySelector('.puzzle-wrapper div').style.backgroundImage,
    cells: array
    };

    savedGamesArray.push(newGame);
          
    localStorage.setItem('saved-games', JSON.stringify(savedGamesArray));
    document.querySelector('.layout').remove();
  }

  saveGame(moves, time) {

     const popupSaveGameLayout = document.createElement('div');
     popupSaveGameLayout.classList.add('layout');
     
     const popupSaveGame = document.createElement('div');
     popupSaveGame.classList.add('popup-save-game');

     popupSaveGame.innerHTML =`
     <div class = "popup-text">Save game: <span>${moves}</span> moves, spent time <span>${time}</span></div>
     `
     const gameName = document.createElement('input');
     gameName.classList.add('game-name-input');
     gameName.setAttribute('placeholder', 'Enter name of the game');
    
     const yesNoBtns = document.createElement('div');
     yesNoBtns.classList.add('yes-no-buttons');
     yesNoBtns.innerHTML = '<div class = "popup-text">Save game?</div>';

     const yesBtn = document.createElement('div');
     yesBtn.classList.add('yes-button');
     yesBtn.innerHTML = 'Yes';

     yesBtn.addEventListener('click', () => {
       if(gameName.value.length === 0) {
         gameName.style.border = '3px solid red';
       } else {
         this.saveGameToLocalStorage();
       }
       
     });

     const noBtn = document.createElement('div');
     noBtn.classList.add('no-button');
     noBtn.innerHTML = 'No';

     noBtn.onclick = () => {
      popupSaveGameLayout.remove();
    };
      
     yesNoBtns.appendChild(yesBtn);
     yesNoBtns.appendChild(noBtn);

     popupSaveGame.appendChild(gameName);
     popupSaveGame.appendChild(yesNoBtns);

     popupSaveGameLayout.appendChild(popupSaveGame);
     document.querySelector('.puzzle-area-wrapper').appendChild(popupSaveGameLayout);
  }

  saveResultsToLocalStorage(time, moves, date) {
    let bestResultsArray = JSON.parse(localStorage.getItem('best-results')) || [];
    const newResult  = {
      time: time, 
      moves: moves,
      date: date.toLocaleString()
    };

    bestResultsArray.push(newResult);
          
    localStorage.setItem('best-results', JSON.stringify(bestResultsArray));
  }

  showPopupVictory(time, moves) {
    if(moves == 0 || time == '00:00:00') return;

    startStop();

    const popupVictoryLayout = document.createElement('div');
    popupVictoryLayout.classList.add('layout');
    
    const popupVictory = document.createElement('div');
    popupVictory.classList.add('popup-victory-game');

    popupVictory.innerHTML =`
    <img class="victory-img" src='./img/happy.gif' >
    <div class = "popup-text">Congratulations! You won! Your result: <span>${moves}</span> moves, time <span>${time}</span>! You can find your best games in "Best results"</div>
    
    `

    const date = new Date();

    this.saveResultsToLocalStorage(time, moves, date);

    popupVictoryLayout.appendChild(popupVictory);
    document.querySelector('.puzzle-area-wrapper').appendChild(popupVictoryLayout);

    setTimeout(function() {
      popupVictoryLayout.remove();
      document.querySelector('.puzzle-area-wrapper').remove();
    }, 3000);

    setTimeout(createGameSpace, 2500);
  }

  changeSoundStatus() {
    const soundBtn = document.querySelector('.sound-btn');
    soundBtn.classList.toggle('sound-off');
    if(soundBtn.classList.contains('sound-off')) {
      localStorage.setItem('sound', 'false');
    } else {
      localStorage.setItem('sound', 'true');
    }
  }

  createTimeMovesArea() {
    if(document.querySelector('.time-moves-wrapper')) {
      document.querySelector('.time-moves-wrapper').remove();
    }
    const timeMovesWrapper = document.createElement('div');
    timeMovesWrapper.classList.add('time-moves-wrapper');

    const saveGameBtn = document.createElement('div');
    saveGameBtn.innerHTML = 'Save game';
    saveGameBtn.classList.add('save-game-btn');

    saveGameBtn.addEventListener('click', () => {
      startStop();
      this.time = document.querySelector('.time').innerHTML;

      this.saveGame(this.moves, this.time, this.cells);
    });

    const pauseGameBtn = document.createElement('div');
    pauseGameBtn.innerHTML = 'Pause game';
    pauseGameBtn.classList.add('pause-game-btn');

    pauseGameBtn.addEventListener('click', startStop);

    const showOriginImgBtn = document.createElement('div');
    showOriginImgBtn.innerHTML = 'Show picture';
    showOriginImgBtn.classList.add('show-img-btn');

    const sound = document.createElement('div');
    sound.classList.add('sound-btn');

    if(localStorage.getItem('sound') === 'false' || !localStorage.getItem('sound')) {
      sound.classList.add('sound-off');
    }
    
    sound.addEventListener('click', this.changeSoundStatus);

    timeMovesWrapper.innerHTML = `
    <div class="time-wrapper">
      <div>Time</div>
      <div class="time">${this.time}</div>
    </div>

    <div class="moves-wrapper">
      <div>Moves</div>
      <div class="moves">${this.moves}</div>
    </div>
    `;

    timeMovesWrapper.appendChild(showOriginImgBtn);
    timeMovesWrapper.appendChild(pauseGameBtn);
    timeMovesWrapper.appendChild(saveGameBtn);
    timeMovesWrapper.appendChild(sound);

    return timeMovesWrapper;
  }

  init() {
    this.element = this.createPuzzleWrapper();
    this.timesMovesElement = this.createTimeMovesArea();
    this.parentElement.appendChild(this.element);
    this.parentElement.appendChild(this.timesMovesElement);
  }

  setup() {
    for (let i = 0; i < this.dimension * this.dimension; i++) {
      this.cells.push(new Cell(this, i, this.savedCellsPos));
    }

    if(this.savedCellsPos.length === 0 ) {
      let generatorDone = 0;
      while(generatorDone == 0) {
        this.shuffle();
        const emptyCellId = this.findEmptyCell();
        let rowNumber = Math.floor(emptyCellId / this.dimension) + 1;
        let sum = 0;

        for(let i = 0; i < (this.dimension * this.dimension) - 1; i++) {
          let currentNumber;
          currentNumber = this.cells[i].index + 1;
          
          if (currentNumber != this.dimension * this.dimension) {
            let j;
            for(j = i + 1; j <= this.dimension*this.dimension - 1; j++) {
              let comparedNumber;
              
              comparedNumber = this.cells[j].index + 1;

              if (currentNumber > comparedNumber && comparedNumber != this.dimension*this.dimension) {
                sum = sum + 1;
                
              }
            }
          }
        }
        if(this.dimension % 2 === 0) {sum += rowNumber;} 
        if (sum % 2 === 0) generatorDone = 1;
      }
      
    } else {
      const someArray = [];
      for (let i = 0; i < this.dimension * this.dimension; i++) {
        const index = this.savedCellsPos.findIndex(cell => cell == i);
        someArray.push(this.cells[index]);
    }
    this.cells = someArray;

    for (let i = 0; i < this.dimension * this.dimension; i++) {
      this.swapCells(i, i);
    }
   }
  }

  shuffle() {
    for(let i = this.cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      this.swapCells(i, j);
    }
  }

  swapCells(i, j) {

    [this.cells[i], this.cells[j]] = [this.cells[j], this.cells[i]];

      this.cells[i].setPosition(i);
      this.cells[j].setPosition(j);


      if(this.isCompleted()) {
        this.showPopupVictory(document.querySelector('.time').innerHTML, document.querySelector('.moves').innerHTML);
      }

      if(!document.querySelector('.sound-btn').classList.contains('sound-off')) {
        
        let audio = new Audio();
        audio.src = './../sounds/sound1.mp3'
        if(!audio) return;
        audio.currentTime = 0;
        audio.play();                     
    } 
  }

  isCompleted() {
    for (let i = 0; i < this.cells.length; i++) {
      if(i !== this.cells[i].index) {
        return false;
      }
    }
    return true;
  }

  findPosition(ind) {
    return this.cells.findIndex(cell => cell.index === ind);
  }

  findEmptyCell() {
    return this.cells.findIndex(cell => cell.isEmpty);
  }

  countMoves() {
    this.moves++;
  }
}
