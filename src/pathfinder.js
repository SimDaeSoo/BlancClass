import { AStarFinder, Grid } from 'pathfinding';

class PathFinder {
    static find(from, to, map) {
        const grid = new Grid(map);
        const finder = new AStarFinder({ allowDiagonal: true });
        const path = finder.findPath(from.x, from.y, to.x, to.y, grid);
        return path.map(vector => { return { x: vector[0], y: vector[1] }; });
    }
}


export default PathFinder;