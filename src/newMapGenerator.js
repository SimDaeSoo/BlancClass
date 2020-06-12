// import seedrandom from 'seedrandom';
const seedrandom = require('seedrandom');
class MapGenerator {
    constructor() {
        this._seedrandom = seedrandom('');
        this.map = { size: { width: 20, height: 20 }, targetDensity: 0.5, seed: '', tiles: [], position: { x: 0, y: 0 } };
    }

    initialize(size, targetDensity, seed) {
        this._seedrandom = seedrandom(seed);
        this.map = { size, targetDensity, seed, tiles: [], position: { x: 0, y: 0 } };
        for (let y=0; y<size.height; y++) {
            this.map.tiles.push([]);
            for (let x=0; x<size.width; x++) {
                this.map.tiles[y].push(0);
            }
        }
    }

    get seedrandom() {
        return this._seedrandom();
    }

    generate() {
        const plateCount = 1 + Math.round(this.seedrandom * Math.sqrt(this.map.size.width * this.map.size.height) / (8 + Math.round(this.seedrandom * 3) * 3));
        const plates = this.devideMap(plateCount);
        plates.forEach(plate => this.generatePlate(plate));

        this.merge(plates);
        this.generateBridge(plates);
        this.printMap(this.map);
    }

    merge(plates) {
        for (const plate of plates) {
            for (let y=0;y<plate.tiles.length;y++) {
                for (let x=0;x<plate.tiles[y].length;x++) {
                    const position = { x: x + plate.position.x, y: y + plate.position.y };
                    this.map.tiles[position.y][position.x] = plate.tiles[y][x];
                }
            }
        }
    }

    generateBridge(plates) {
        const basePositions = plates.map((plate) => {
            return {
                x: plate.position.x + Math.round(plate.size.width / 2),
                y: plate.position.y + Math.round(plate.size.height / 2)
            }
        });

        for (let plate of plates) {
            const position = {
                x: plate.position.x + Math.round(plate.size.width / 2),
                y: plate.position.y + Math.round(plate.size.height / 2)
            };
            for (let index in basePositions) {
                if (basePositions[index].x === position.x && basePositions[index].y === position.y) {
                    basePositions.splice(index, 1);
                }
            }

            if (basePositions.length > 0) {
                const randomIndex = Math.round(this.seedrandom * (basePositions.length - 1));
                const bridgePosition = basePositions[randomIndex];

                const distance = {
                    x: bridgePosition.x - position.x + Math.round(this.seedrandom * 3 - this.seedrandom * 3),
                    y: bridgePosition.y - position.y + Math.round(this.seedrandom * 3 - this.seedrandom * 3)
                }
                if (Math.abs(distance.x) > Math.abs(distance.y)) {
                    const vector2D = { x: distance.x / Math.abs(distance.x), y: distance.y / Math.abs(distance.x) };
                    for (let x = 0; x < Math.abs(distance.x); x++) {
                        const targetPosition = { x: position.x + x * vector2D.x, y: position.y + Math.round(x * vector2D.y) };
                        if (targetPosition.x >= 2 && targetPosition.x < this.map.size.width - 2 && targetPosition.y >= 2 && targetPosition.y < this.map.size.height - 2) {
                            this.map.tiles[targetPosition.y][targetPosition.x] = 1; // TODO : 1 -> Tile Data
                        }

                        const up = { x: position.x + x * vector2D.x, y: position.y + Math.round(x * vector2D.y) - 1 };
                        if (up.x >= 2 && up.x < this.map.size.width - 2 && up.y >= 2 && up.y < this.map.size.height - 2) {
                            this.map.tiles[up.y][up.x] = 1; // TODO : 1 -> Tile Data
                        }

                        const down = { x: position.x + x * vector2D.x, y: position.y + Math.round(x * vector2D.y) + 1 };
                        if (down.x >= 2 && down.x < this.map.size.width - 2 && down.y >= 2 && down.y < this.map.size.height - 2) {
                            this.map.tiles[down.y][down.x] = 1; // TODO : 1 -> Tile Data
                        }
                    }
                } else {
                    const vector2D = { x: distance.x / Math.abs(distance.y), y: distance.y / Math.abs(distance.y) };
                    for (let y = 0; y < Math.abs(distance.y); y++) {
                        const targetPosition = { x: position.x + Math.round(y * vector2D.x), y: position.y + y * vector2D.y };
                        if (targetPosition.x >= 2 && targetPosition.x < this.map.size.width - 2 && targetPosition.y >= 2 && targetPosition.y < this.map.size.height - 2) {
                            this.map.tiles[targetPosition.y][targetPosition.x] = 1; // TODO : 1 -> Tile Data
                        }

                        const left = { x: position.x + Math.round(y * vector2D.x) - 1, y: position.y + y * vector2D.y };
                        if (left.x >= 2 && left.x < this.map.size.width - 2 && left.y >= 2 && left.y < this.map.size.height - 2) {
                            this.map.tiles[left.y][left.x] = 1; // TODO : 1 -> Tile Data
                        }

                        const right = { x: position.x + Math.round(y * vector2D.x) + 1, y: position.y + y * vector2D.y };
                        if (right.x >= 2 && right.x < this.map.size.width - 2 && right.y >= 2 && right.y < this.map.size.height - 2) {
                            this.map.tiles[right.y][right.x] = 1; // TODO : 1 -> Tile Data
                        }
                    }
                }
            }
        }
    }

    devideMap(plateCount) {
        const firstPlate = JSON.parse(JSON.stringify(this.map));
        const plates = [firstPlate];
        const devidablePlates = [firstPlate];

        while (plates.length < plateCount && devidablePlates.length > 0) {
            const randomIndex = Math.round(this.seedrandom * (devidablePlates.length - 1));
            const devidePlate = devidablePlates[randomIndex];

            if (devidePlate.size.width >= 20 && devidePlate.size.height >= 20) {
                const size = {
                    width: Math.round(devidePlate.size.width / 5) + Math.round(this.seedrandom * devidePlate.size.width / 5 * 3),
                    height: Math.round(devidePlate.size.height / 5) + Math.round(this.seedrandom * devidePlate.size.height / 5 * 3)
                };
                devidePlate.size.width -= size.width;
                devidePlate.size.height -= size.height;

                const newPlateRU = { size: { width: size.width, height: devidePlate.size.height }, targetDensity: devidePlate.targetDensity, seed: '', tiles: [], position: { x: devidePlate.position.x + devidePlate.size.width, y: devidePlate.position.y } };
                const newPlateLD = { size: { width: devidePlate.size.width, height: size.height }, targetDensity: devidePlate.targetDensity, seed: '', tiles: [], position: { x: devidePlate.position.x, y: devidePlate.position.y + devidePlate.size.height } };
                const newPlateRD = { size, targetDensity: devidePlate.targetDensity, seed: '', tiles: [], position: { x: devidePlate.position.x + devidePlate.size.width, y: devidePlate.position.y + devidePlate.size.height } };
                plates.push(newPlateRU);
                plates.push(newPlateLD);
                plates.push(newPlateRD);
                devidablePlates.push(newPlateRU);
                devidablePlates.push(newPlateLD);
                devidablePlates.push(newPlateRD);
            } else {
                devidablePlates.splice(randomIndex, 1);
            }
        }

        return plates;
    }

    generatePlate(plate) {
        plate.tiles = [];
        for (let y=0; y<plate.size.height; y++) {
            plate.tiles.push([]);
            for (let x=0; x<plate.size.width; x++) {
                plate.tiles[y].push(0);
            }
        }
        const basePosition = { x: Math.round(plate.size.width / 2), y: Math.round(plate.size.height / 2) };
        const generatablePositions = [basePosition];

        while (this.getDensity(plate) < plate.targetDensity && generatablePositions.length > 0) {
            const randomIndex = Math.round(this.seedrandom * (generatablePositions.length - 1));
            const position = generatablePositions.splice(randomIndex, 1)[0];
            plate.tiles[position.y][position.x] = 1;

            const generatableTile = {
                up: { x: position.x, y: position.y - 1 },
                down: { x: position.x, y: position.y + 1 },
                left: { x: position.x - 1, y: position.y },
                right: { x: position.x + 1, y: position.y }
            };

            for (let direction in generatableTile) {
                const pos = generatableTile[direction];
                if (plate.tiles[pos.y] && !plate.tiles[pos.y][pos.x] && pos.x >= 2 && pos.x < plate.size.width - 2 && pos.y >= 2 && pos.y < plate.size.height - 2) {
                    generatablePositions.push(pos);
                }
            }
        }

        return plate;
    }

    getDensity(map) {
        const maxDensity = map.size.width * map.size.height;
        let currentDensity = 0;
        for (let y=0; y<map.size.height; y++) {
            for (let x=0; x<map.size.width; x++) {
                if (map.tiles[y][x]) {
                    currentDensity++;
                }
            }
        }
        return currentDensity / maxDensity;
    }

    printMap(map) {
        for (let y = 0; y < map.size.height; y++) {
            let line = '';

            for (let x = 0; x < map.size.width; x++) {
                if (map.tiles[y][x]) {
                    line += '■ ';
                } else {
                    line += '  ';
                }
            }

            console.log(line);
        }

        console.log(`seed: ${this.map.seed}`);
        console.log(`target density: ${map.targetDensity * 100}% / density: ${this.getDensity(map) * 100}%`);
        console.log(`width: ${map.size.width * 32}px / height: ${map.size.height * 32}px`);
        console.log(`tiles: ${this.getDensity(map) * map.size.width * map.size.height} tiles`);
    }
}

exports.module = MapGenerator;