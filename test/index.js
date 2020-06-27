import MapGenerator from '../src/mapgenerator';
import { randomSeed } from '../src/utils';

function mapGenerator() {
    setInterval(() => {
        const mapGenerator = new MapGenerator();
        mapGenerator.initialize({ width: 130, height: 60 }, 0.5, randomSeed(10));
        mapGenerator.generate();
    }, 1000)
}

mapGenerator();