import "./style.css"

class App {
  x = 8
  y = 8
  mines = Math.trunc((this.x * this.y) / 4.85)
  bombsArr = []
  tiles
  checkedTiles = new Array(this.x * this.y).fill(null)
  container = document.getElementById("app")
  resetBtn = document.querySelector(".reset")
  constructor() {
    this.grid()
    this.setBombs()
    // this.colorBombs()
    this.clickOnTile()
    this.reset()
  }
  reset() {
    this.resetBtn.addEventListener("click", () => {
      this.bombsArr = []
      this.checkedTiles = new Array(this.x, this.y)
      this.grid()
      this.setBombs()
      // this.colorBombs()
    })
  }
  grid() {
    const arr = new Array(this.x * this.y).fill({})
    const tiles = arr.map((_, i) => this.numberToCoords(i))
    this.container.innerHTML = `<ul class="grid">
    ${tiles.reduce(
      (acc, el) => acc + `<li class="tile" data-x=${el.x} data-y=${el.y}></li>`,
      ""
    )}
      </ul>
      `
    document.querySelector(
      ".grid"
    ).style.gridTemplateColumns = `repeat(${this.x},1fr)`

    this.tiles = document.querySelectorAll(".tile")
  }
  setBombs() {
    let n, p
    for (let i = 0; i < this.mines; i++) {
      do {
        n = this.bombCoords()
        p = this.bombsArr.includes(n)
        if (!p) this.bombsArr.push(n)
      } while (p)
    }
    this.bombsArr.sort((a, b) => a - b)
  }
  colorBombs() {
    this.bombsArr.forEach((el) => {
      const mine = this.tiles[el]
      if (!mine) return
      mine.style.backgroundColor = "#111"
    })
  }

  bombCoords() {
    return Math.trunc(Math.random() * this.x * this.y)
  }
  numberToCoords(num) {
    return {
      x: num % this.x,
      y: Math.trunc(num / this.y),
    }
  }
  coordToNumber(el) {
    return +el.y * +this.y + +el.x
  }
  clickOnTile() {
    this.container.addEventListener("dblclick", (e) => {
      const tile = { ...e.target.dataset }
      const numberOfTile = this.coordToNumber(tile)
      if (this.bombsArr.includes(numberOfTile)) return alert("you lost")
      // if (this.checkedTiles.includes(numberOfTile))
      //   return this.fillAroundTile(numberOfTile)
      this.tiles[numberOfTile].style.backgroundColor = "white"

      this.showNumberOfBombs(numberOfTile, tile)
    })
    this.container.addEventListener("click", (e) => {
      const tile = { ...e.target.dataset }
      const numberOfTile = this.coordToNumber(tile)
      if (this.checkedTiles.includes(numberOfTile)) return
      this.tiles[numberOfTile].style.backgroundColor = "grey"
      this.tiles[numberOfTile].textContent = ""
    })
  }
  checkIfWon() {
    const board = this.checkedTiles.filter((el) => el).concat(this.bombsArr)
    console.log(board.length)
    return board.length === this.x * this.y && alert("you won")
  }
  fillAroundTile(tile) {
    console.log(tile)
  }
  showNumberOfBombs(tileNumber, tileCoords = undefined) {
    let coords = tileCoords
    this.checkedTiles[tileNumber] = tileNumber
    if (!coords) coords = this.numberToCoords(tileNumber)
    const nearbyTiles = this.arrOfNearbyTiles(+coords.x, +coords.y)
    const minesAmount = nearbyTiles.reduce(
      (acc, el) => (this.bombsArr.includes(el) ? ++acc : acc),
      0
    )
    this.tiles[tileNumber].style.backgroundColor = "white"

    if (minesAmount === 0) {
      this.tiles[tileNumber].style.backgroundColor = "blue"
      return nearbyTiles.forEach((el) => this.showNumberOfBombs(el))
    }
    this.tiles[tileNumber].textContent = `${minesAmount}`
    this.checkIfWon()
  }
  arrOfNearbyTiles(x, y) {
    console.log(x, y)
    const arr = [
      { x: x - 1, y: y - 1 },
      { x: x - 1, y: y },
      { x: x - 1, y: y + 1 },
      { x: x, y: y - 1 },
      { x: x, y: y + 1 },
      { x: x + 1, y: y - 1 },
      { x: x + 1, y: y },
      { x: x + 1, y: y + 1 },
    ]
    console.log(arr)
    const nearbyTiles = arr
      .filter((el) => el.x >= 0 && el.y < this.y && el.x < this.x && el.y >= 0)
      .map((el) => this.coordToNumber(el))
      .filter((el) => !this.checkedTiles.includes(el))
    // return undefined
    console.log(nearbyTiles)
    return nearbyTiles
  }
}

new App()
// const arr = new Array(5).fill({}).map((el) =>)
// console.log(arr)
