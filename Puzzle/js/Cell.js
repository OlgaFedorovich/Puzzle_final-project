export default class Cell {
    constructor(puzzle, index, savedCells) {

        this.savedCells = savedCells;

        this.isEmpty = false;
        this.index = index;
        this.puzzle = puzzle;
        this.width = this.puzzle.width / this.puzzle.dimension;
        this.height = this.puzzle.height / this.puzzle.dimension;
        
        this.el = this.createDiv();
        
        puzzle.element.appendChild(this.el);

        if(this.index === this.puzzle.dimension * this.puzzle.dimension - 1) {
            this.isEmpty = true;
            this.el.style.background = 'white';
            this.el.innerHTML = '';
            return;
        }
        
        this.setImage();
    }

    createDiv() {
        const cell = document.createElement('div');

        cell.style.backgroundSize = `${this.puzzle.width}px ${this.puzzle.height}px`;
        cell.style.position = 'absolute';
        cell.style.border = `1px solid #fff`;

        cell.style.width = `${this.width}px`;
        cell.style.height = `${this.height}px`;

        cell.innerHTML = `${this.index + 1}`;

        cell.setAttribute('draggable', 'true');
       
        cell.onclick = () => {
            console.log('clicl', this.index, this.puzzle.findPosition(this.index));
            console.log('empty', this.puzzle.findEmptyCell());

            const currentCellIndex = this.puzzle.findPosition(this.index);
            const emptyCellIndex = this.puzzle.findEmptyCell();

            const { x, y } = this.getXY(currentCellIndex);
            const { x: emptyX, y: emptyY} = this.getXY(emptyCellIndex);

            if((x === emptyX || y === emptyY) && 
            (Math.abs(x - emptyX) === 1 || Math.abs(y - emptyY) === 1 )) {
                this.puzzle.swapCells(currentCellIndex, emptyCellIndex);

                this.puzzle.moves++;
                document.querySelector('.moves').innerHTML = `${this.puzzle.moves}`;
            }
        };

        cell.addEventListener('dragover', function(e) {
            if(this.innerHTML === '') {
                e.preventDefault();
            }
            else {
                return;
            }  
        });

        cell.addEventListener('dragend', () => {
            const currentCellIndex = this.puzzle.findPosition(this.index);
            const emptyCellIndex = this.puzzle.findEmptyCell();

            const { x, y } = this.getXY(currentCellIndex);
            const { x: emptyX, y: emptyY} = this.getXY(emptyCellIndex);

            if((x === emptyX || y === emptyY) && 
            (Math.abs(x - emptyX) === 1 || Math.abs(y - emptyY) === 1 )) {
                this.puzzle.swapCells(currentCellIndex, emptyCellIndex);
                this.puzzle.moves++;
                document.querySelector('.moves').innerHTML = `${this.puzzle.moves}`;
            }
        });

        return cell;
    }

    setImage() {

        const { x, y } = this.getXY(this.index);

        const left = this.width * x;
        const top = this.height * y;

        this.el.style.backgroundImage = `url(${this.puzzle.imageSrc})`;
        this.el.style.backgroundPosition = `-${left}px -${top}px`;
    }

    setPosition(ind) {

        const { left, top } = this.getPositionFromIndex(ind);
        this.el.style.left = `${left}px`;
        this.el.style.top = `${top}px`;
        this.el.dataset.id = ind;
    }

    getPositionFromIndex(index) {
        const { x, y } = this.getXY(index);
        return {
            left: this.width * x,
            top: this.height * y
        };
    }

    getXY(index) {
        return {
            x: index % this.puzzle.dimension,
            y: Math.floor((index / this.puzzle.dimension))
        };

    }

}