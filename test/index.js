import MapGenerator from '../src/mapgenerator.js';
import { randomSeed } from '../src/utils.js';

function mapGenerator() {
    setInterval(() => {
        const mapGenerator = new MapGenerator();
        mapGenerator.initialize({ width: 100, height: 50 }, 0.5, randomSeed(10));
        mapGenerator.generate();
    }, 1000)
}

mapGenerator();