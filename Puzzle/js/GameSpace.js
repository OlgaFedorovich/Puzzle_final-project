import PicturePuzzle from './PicturePuzzle.js';
//import Cell from './Cell';
//import img from './../img/111.jpg';
import {picturesArray} from './PicturesSource.js';
import {startStop, resetTime} from './Timer.js';

const createGameSpace = function() {
    const puzzleGameWrapper = document.createElement('div');
    puzzleGameWrapper.classList.add('puzzle-area-wrapper');
    document.body.appendChild(puzzleGameWrapper);

    const puzzleTitle = document.createElement('div');
    puzzleTitle.classList.add('puzzle-title');
    puzzleTitle.innerHTML = 'Solve puzzles and read quotes';

    const quotesWrapper = document.createElement('div');
    quotesWrapper.classList.add('quote-wrapper-block');
    quotesWrapper.innerHTML = `
    <div class='quote_wrapper'>
        <div class="quote-author_wrapper">
            <div class="quote" id="quote"></div>
            <div class="author" id="author"></div>              
        </div>    
    </div>
    `;

    const changeQuoteBtn = document.createElement('button');
    changeQuoteBtn.classList.add('change_quote_btn');
    quotesWrapper.appendChild(changeQuoteBtn);

    const puzzleSettings = document.createElement('div');
    puzzleSettings.classList.add('puzzle-settings');
    
    const boardSize = document.createElement('div'),
        boardSizeLabel = document.createElement('label'),
        boardSizeOptions = document.createElement('select');

        boardSize.classList.add('board-size');
        boardSizeLabel.innerHTML = 'Choose size of the game';
        boardSizeOptions.innerHTML = `
        <option value="3">3*3</option>
        <option value="4" selected>4*4</option>
        <option value="5">5*5</option>
        <option value="6">6*6</option>
        <option value="7">7*7</option>
        <option value="8">8*8</option>`;
    boardSize.appendChild(boardSizeLabel);
    boardSize.appendChild(boardSizeOptions);

    const bestResults = document.createElement('div');
    bestResults.innerHTML = 'Best results';

    const savedGame = document.createElement('div');
    savedGame.innerHTML = 'Saved games';

    const changeBackgroundBtn = document.createElement('div');
    changeBackgroundBtn.innerHTML = 'Change background';

    const saveSettingsBtn = document.createElement('div');
    saveSettingsBtn.innerHTML = 'Start new game';

    const hideMenuBtn = document.createElement('div');
    hideMenuBtn.classList.add('hide-menu');

    puzzleSettings.appendChild(boardSize);
    puzzleSettings.appendChild(bestResults);
    puzzleSettings.appendChild(savedGame);
    puzzleSettings.appendChild(changeBackgroundBtn);
    puzzleSettings.appendChild(saveSettingsBtn);
    puzzleSettings.appendChild(hideMenuBtn);

    puzzleGameWrapper.appendChild(puzzleTitle);
    puzzleGameWrapper.appendChild(quotesWrapper);
    puzzleGameWrapper.appendChild(puzzleSettings);

    const getRandomQuote = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    
    const setQuote = async function() {
        await fetch("https://type.fit/api/quotes")
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
    
          let quoteIndex = getRandomQuote(0, data.length - 1);
          
          document.querySelector('.quote').innerHTML = `<strong>&ldquo;</strong> ${data[quoteIndex].text} <strong>&rdquo;</strong>`;
          document.querySelector('.author').innerHTML = data[quoteIndex].author;
        });
    };

    const showBestGamesList = () => {
        
        let bestGamesList = JSON.parse(localStorage.getItem('best-results'));

        if(bestGamesList === null) {
            alert('У Вас еще нет сохраненных игр!');
            return;
        }

        const bestGamesLayout = document.createElement('div');
        bestGamesLayout.classList.add('layout');

        bestGamesLayout.addEventListener('click', function(e) {
            if(e.target.className === 'layout') {
                bestGamesLayout.remove();
            }

        });

        const popupBestGamesList = document.createElement('div');
        popupBestGamesList.classList.add('popup-saved-gamed-list');
        popupBestGamesList.innerHTML =`
        <h2>Best results</h2>
        <div class="saved-games-item header">
            <div>№</div>
            <div>Date</div>
            <div>Time</div>
            <div>Moves</div>
        </div>`

        const movesArray = [];
        const bestGames = [];

        bestGamesList.forEach((game, index) => {
            movesArray.push(+game.moves);

        });

        movesArray.sort(function(a,b) {
            return (a - b);
        });
        console.log(movesArray, 'movesArray');

        for(let i = 0; i < 10; i++) {
            if(movesArray[i] !== undefined) {
                bestGamesList.forEach(game => {
                    
                    if(+game.moves === movesArray[i]) {
                        bestGames.push(game);
                    }
                });                 
            }
        }
        console.log(bestGames, 'best');

        bestGames.forEach((game, index) => {
            
            const bestGamesElement = document.createElement('div');
            bestGamesElement.classList.add('saved-games-item');
            bestGamesElement.innerHTML = `
                <div>${index + 1}</div>
                <div>${game.date}</div>
                <div>${game.time}</div>
                <div>${game.moves}</div>
            `

            popupBestGamesList.appendChild(bestGamesElement);
        });

        bestGamesLayout.appendChild(popupBestGamesList);
        document.querySelector('.puzzle-area-wrapper').appendChild(bestGamesLayout);

    };

    const showSavedGamesList = () => {
        let savedGamesList = JSON.parse(localStorage.getItem('saved-games'));
        if(savedGamesList === null) {
            alert('You do not have games yet!');
            return;
        }

        const savedGamesLayout = document.createElement('div');
        savedGamesLayout.classList.add('layout');

        savedGamesLayout.addEventListener('click', function(e) {
            if(e.target.className === 'layout') {
                savedGamesLayout.remove();
                console.dir(e.target);
            }

        });

        const popupSavedGamesList = document.createElement('div');
        popupSavedGamesList.classList.add('popup-saved-gamed-list');
        popupSavedGamesList.innerHTML =`
        <h2>Choose game to continue</h2>
        <div class="saved-games-item header">
            <div>№</div>
            <div>Name</div>
            <div>Time</div>
            <div>Moves</div>
        </div>`

        savedGamesList.forEach((game, index) => {

            const savedGamesElement = document.createElement('div');
            savedGamesElement.classList.add('saved-games-item');
            savedGamesElement.innerHTML = `
                <div>${index + 1}</div>
                <div>${game.name}</div>
                <div>${game.time}</div>
                <div>${game.moves}</div>
            `

            popupSavedGamesList.appendChild(savedGamesElement);
            savedGamesElement.addEventListener('click', () => {
                console.log(game.image, game.cells);
                const url = game.image.match(/https:[^"]*/gm);
                if(document.querySelector('.puzzle-wrapper')) {
                    document.querySelector('.puzzle-wrapper').remove();
                } 

                const picturePuzzle = new PicturePuzzle(
                    document.querySelector('.puzzle-area-wrapper'),
                    url,
                    400, Math.sqrt(game.cells.length), game.cells, game.moves, game.time
                );
                
                savedGamesLayout.remove();

            });

        });

        savedGamesLayout.appendChild(popupSavedGamesList);
        document.querySelector('.puzzle-area-wrapper').appendChild(savedGamesLayout);
    
    };

    const changeBackground = () => {

        const changeBgLayout = document.createElement('div');
        changeBgLayout.classList.add('layout');

        const changeBgPopup = document.createElement('div');
        changeBgPopup.classList.add('change-bg-popup');

        changeBgPopup.innerHTML = `
        <h2>Enter thematic word</h2>
        <input class="change-bg-input" type="text" name="bg-theme" id="bg-theme-input">`;

        const changeBgPopupBtn = document.createElement('div');
        changeBgPopupBtn.classList.add('change-bg-popup-btn');
        changeBgPopupBtn.textContent = 'Change background';

        changeBgPopup.appendChild(changeBgPopupBtn);
        changeBgLayout.appendChild(changeBgPopup);
        document.querySelector('.puzzle-area-wrapper').appendChild(changeBgLayout);

        changeBgLayout.addEventListener('click', (e) => {
            if(e.target.className === 'layout') {
                changeBgLayout.remove();
            }
        })

        changeBgPopupBtn.addEventListener('click', () => {
            const inputValue = document.querySelector('.change-bg-input').value;
            if(inputValue.length > 0) {
                document.body.style.background = `url(https://source.unsplash.com/1600x900/?${inputValue})`;
                changeBgLayout.remove();
            }
        })
    }

    const saveSettings = () => {

        let boardSizeValue = boardSizeOptions.value;
        console.log(boardSizeValue);

        if(document.querySelector('.puzzle-wrapper')) {
            document.querySelector('.puzzle-wrapper').remove();
            
            const picturePuzzle = new PicturePuzzle(
                document.querySelector('.puzzle-area-wrapper'),
                `${picturesArray[Math.floor(Math.random() * (picturesArray.length + 1))]}`,
                400, boardSizeValue
            );
        } else {
            const picturePuzzle = new PicturePuzzle(
                document.querySelector('.puzzle-area-wrapper'),
                `${picturesArray[Math.floor(Math.random() * (picturesArray.length + 1))]}`,
                400, boardSizeValue
            );
        }

        if(status === 'stopped') {
           startStop(); 
        } else {
            resetTime();
            startStop();
        }
        
    };    

    const hideMenu = () => {
        puzzleSettings.classList.add('closed-settings');
        hideMenuBtn.classList.add('open-menu');
    };

    const openMenu = () => {
        puzzleSettings.classList.remove('closed-settings');
        hideMenuBtn.classList.remove('open-menu');
    };

    saveSettingsBtn.addEventListener('click', saveSettings);

    hideMenuBtn.addEventListener('click', hideMenu);

    changeBackgroundBtn.addEventListener('click', changeBackground);

    savedGame.addEventListener('click', showSavedGamesList);

    bestResults.addEventListener('click', showBestGamesList);

    changeQuoteBtn.addEventListener('click', setQuote);

    puzzleSettings.addEventListener('click', function(event) {
        if(event.target.className !== 'hide-menu open-menu') {
            openMenu();
        }
    });

    setQuote();

};

export {createGameSpace};

