class MapGenerator {
    constructor() {
        this.map = { size: { width: 20, height: 20 }, targetDensity: 0.5, seed: '', tiles: {}, position: { x: 0, y: 0 } };
    }

    initialize(size, targetDensity, seed) {
        this.map = { size, targetDensity, seed, tiles: {}, position: { x: 0, y: 0 } };
    }

    generate() {
        const plateCount = Math.round(Math.sqrt(this.map.size.width * this.map.size.height) / (8 + Math.round(Math.random() * 3) * 3));
        const plates = this.devideMap(plateCount);
        this.merge(plates);
        this.generateBridge(plates);
        this.printMap(this.map);
    }

    merge(plates) {
        for (const plate of plates) {
            for (const index in plate.tiles) {
                const position = this.indexToPosition(plate, index);
                position.x += plate.position.x;
                position.y += plate.position.y;

                const mergedIndex = this.positionToIndex(this.map, position);
                this.map.tiles[mergedIndex] = plate.tiles[index];
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
            let hasCurrent = false;
            const position = {
                x: plate.position.x + Math.round(plate.size.width / 2),
                y: plate.position.y + Math.round(plate.size.height / 2)
            };
            for (let index in basePositions) {
                if (basePositions[index].x === position.x && basePositions[index].y === position.y) {
                    basePositions.splice(index, 1);
                    hasCurrent = true;
                }
            }

            if (basePositions.length > 0) {
                const randomIndex = Math.round(Math.random() * (basePositions.length - 1));
                const bridgePosition = basePositions[randomIndex];

                const distance = {
                    x: bridgePosition.x - position.x + Math.round(Math.random() * 3 - Math.random() * 3),
                    y: bridgePosition.y - position.y + Math.round(Math.random() * 3 - Math.random() * 3)
                }
                if (Math.abs(distance.x) > Math.abs(distance.y)) {
                    const vector2D = { x: distance.x / Math.abs(distance.x), y: distance.y / Math.abs(distance.x) };
                    for (let x = 0; x < Math.abs(distance.x); x++) {
                        const targetPosition = { x: position.x + x * vector2D.x, y: position.y + Math.round(x * vector2D.y) };
                        if (targetPosition.x >= 2 && targetPosition.x < this.map.size.width - 2 && targetPosition.y >= 2 && targetPosition.y < this.map.size.height - 1) {
                            this.map.tiles[this.positionToIndex(this.map, targetPosition)] = 1; // TODO : 1 -> Tile Data
                        }

                        const up = { x: position.x + x * vector2D.x, y: position.y + Math.round(x * vector2D.y) - 1 };
                        if (up.x >= 2 && up.x < this.map.size.width - 2 && up.y >= 2 && up.y < this.map.size.height - 1) {
                            this.map.tiles[this.positionToIndex(this.map, up)] = 1; // TODO : 1 -> Tile Data
                        }

                        const down = { x: position.x + x * vector2D.x, y: position.y + Math.round(x * vector2D.y) + 1 };
                        if (down.x >= 2 && down.x < this.map.size.width - 2 && down.y >= 2 && down.y < this.map.size.height - 1) {
                            this.map.tiles[this.positionToIndex(this.map, down)] = 1; // TODO : 1 -> Tile Data
                        }
                    }
                } else {
                    const vector2D = { x: distance.x / Math.abs(distance.y), y: distance.y / Math.abs(distance.y) };
                    for (let y = 0; y < Math.abs(distance.y); y++) {
                        const targetPosition = { x: position.x + Math.round(y * vector2D.x), y: position.y + y * vector2D.y };
                        if (targetPosition.x >= 2 && targetPosition.x < this.map.size.width - 2 && targetPosition.y >= 2 && targetPosition.y < this.map.size.height - 1) {
                            this.map.tiles[this.positionToIndex(this.map, targetPosition)] = 1; // TODO : 1 -> Tile Data
                        }

                        const left = { x: position.x + Math.round(y * vector2D.x) - 1, y: position.y + y * vector2D.y };
                        if (left.x >= 2 && left.x < this.map.size.width - 2 && left.y >= 2 && left.y < this.map.size.height - 1) {
                            this.map.tiles[this.positionToIndex(this.map, left)] = 1; // TODO : 1 -> Tile Data
                        }

                        const right = { x: position.x + Math.round(y * vector2D.x) + 1, y: position.y + y * vector2D.y };
                        if (right.x >= 2 && right.x < this.map.size.width - 2 && right.y >= 2 && right.y < this.map.size.height - 1) {
                            this.map.tiles[this.positionToIndex(this.map, right)] = 1; // TODO : 1 -> Tile Data
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
            const randomIndex = Math.round(Math.random() * (devidablePlates.length - 1));
            const devidePlate = devidablePlates[randomIndex];

            if (devidePlate.size.width >= 20 && devidePlate.size.height >= 20) {
                const size = {
                    width: Math.round(devidePlate.size.width / 5) + Math.round(Math.random() * devidePlate.size.width / 5 * 3),
                    height: Math.round(devidePlate.size.height / 5) + Math.round(Math.random() * devidePlate.size.height / 5 * 3)
                };
                devidePlate.size.width -= size.width;
                devidePlate.size.height -= size.height;

                const newPlateRU = { size: { width: size.width, height: devidePlate.size.height }, targetDensity: devidePlate.targetDensity, seed: '', tiles: {}, position: { x: devidePlate.position.x + devidePlate.size.width, y: devidePlate.position.y } };
                const newPlateLD = { size: { width: devidePlate.size.width, height: size.height }, targetDensity: devidePlate.targetDensity, seed: '', tiles: {}, position: { x: devidePlate.position.x, y: devidePlate.position.y + devidePlate.size.height } };
                const newPlateRD = { size, targetDensity: devidePlate.targetDensity, seed: '', tiles: {}, position: { x: devidePlate.position.x + devidePlate.size.width, y: devidePlate.position.y + devidePlate.size.height } };
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

        if (devidablePlates.length === 0) {
            console.log('deviding fail', plateCount, plates.length);
        }

        for (let plate of plates) {
            this.generatePlate(plate);
        }

        return plates;
    }

    generatePlate(plate) {
        const basePosition = { x: Math.round(plate.size.width / 2), y: Math.round(plate.size.height / 2) };
        const baseIndex = this.positionToIndex(plate, basePosition);
        const generatableIndexes = [baseIndex];

        while (this.getDensity(plate) < plate.targetDensity && generatableIndexes.length > 0) {
            const randomIndex = Math.round(Math.random() * (generatableIndexes.length - 1));
            const generateTileIndex = generatableIndexes.splice(randomIndex, 1);
            plate.tiles[generateTileIndex] = 1; // TODO: Tile data로 변경.

            const position = this.indexToPosition(plate, generateTileIndex);
            const generatableTile = {
                up: { x: position.x, y: position.y - 1 },
                down: { x: position.x, y: position.y + 1 },
                left: { x: position.x - 1, y: position.y },
                right: { x: position.x + 1, y: position.y }
            };

            for (let direction in generatableTile) {
                const pos = generatableTile[direction];
                const index = this.positionToIndex(plate, pos);
                if (!plate.tiles[index] && pos.x >= 1 && pos.x < plate.size.width - 2 && pos.y >= 1 && pos.y < plate.size.height - 2) {
                    generatableIndexes.push(index);
                }
            }
        }

        return plate;
    }

    getDensity(map) {
        const maxDensity = map.size.width * map.size.height;
        const currentDensity = Object.keys(map.tiles).length;
        return currentDensity / maxDensity;
    }

    positionToIndex(map, position) {
        const index = position.x + position.y * map.size.width;

        return index;
    }

    indexToPosition(map, index) {
        const x = index % map.size.width;
        const y = Math.floor(index / (map.size.width));

        return { x, y };
    }

    printMap(map) {
        let wallCount = 0;
        for (let y = 0; y < map.size.height; y++) {
            let line = '';
            let flag = false;
            for (let x = 0; x < map.size.width; x++) {
                const index = this.positionToIndex(map, { x, y });
                if (map.tiles[index]) {
                    line += '■ ';
                    flag = false;
                } else if (this.hasNeighbor(this.map, index)) {
                    line += '□ ';
                    if (!flag) {
                        flag = !flag;
                        wallCount++;
                    }
                } else {
                    line += '  ';
                }
            }

            console.log(line);
        }

        console.log(`target density: ${map.targetDensity * 100}% / density: ${this.getDensity(map) * 100}%`);
        console.log(`width: ${map.size.width * 32}px / height: ${map.size.height * 32}px`);
        console.log(`tiles: ${Object.keys(map.tiles).length} tiles`);
        console.log(`walls: ${wallCount} tiles`);
    }

    hasNeighbor(map, index) {
        const neighbor = {
            up: index - map.size.width,
            down: index + map.size.width,
            left: index - 1,
            right: index + 1,
        };
        let result = false || map.tiles[neighbor.up];
        result = result || map.tiles[neighbor.down];
        result = result || map.tiles[neighbor.left];
        result = result || map.tiles[neighbor.right];
        return result;
    }
}

function main() {
    const mapGenerator = new MapGenerator();
    const size = {
        width: 120,
        height: 60,
    };
    const density = 0.4;
    setInterval(() => {
        mapGenerator.initialize(size, density, '');
        mapGenerator.generate();
    }, 3000);
}

main();