export function collision(groupA, groupB, dt) {
    const collisionResults = [];
    
    for (let objectA of groupA) {
        const collisionResult = { hit: false, time: Infinity, object: null, position: { x: undefined, y: undefined } };
        for (let objectB of groupB) {
            const currentCollisionResult = aabbCollision(objectA, objectB);
            if (currentCollisionResult.time <= dt && currentCollisionResult.time <= collisionResult.time ) {
                collisionResult = currentCollisionResult;
            }
        }
        collisionResults.push(collisionResult);
    }

    return collisionResults;
}

export function aabbCollision(objA, objB) {
    const xAxis = _aabbXAxisCollision(objA, objB);
    const yAxis = _aabbYAxisCollision(objA, objB);
    const result = { hit: false, time: Infinity, object: null, position: { x: undefined, y: undefined } };
    const timeBoundary = { min: Infinity, max: -Infinity };
    if (xAxis.min < yAxis.max && xAxis.max > yAxis.min) {
        timeBoundary.min = Math.max(xAxis.min, yAxis.min);
        timeBoundary.max = Math.min(xAxis.max, yAxis.max);
        if (timeBoundary.max >= 0) {
            result.hit = true;
            result.time = timeBoundary.min > 0? timeBoundary.min: 0;
            result.object = objB;
            result.position = { x: objA.position.x + objA.vector.x * result.time, y: objA.position.y + objA.vector.y * result.time };
        }
    }
    return result;
}

function _aabbYAxisCollision(objA, objB) {
    const vectorYDiff = objB.vector.y - objA.vector.y;
    const timestamp = { min: Infinity, max: -Infinity };
    if (vectorYDiff === 0 && objA.position.y + objA.size.height >= objB.position.y && objA.position.y <= objB.position.y + objB.size.height) {
        timestamp.min = -Infinity;
        timestamp.max = Infinity;
    } else if (vectorYDiff > 0) {
        timestamp.max = ((objA.position.y + objA.size.height) - objB.position.y) / vectorYDiff;
        timestamp.min = (objA.position.y - (objB.position.y + objB.size.height)) / vectorYDiff;
    } else if (vectorYDiff < 0) {
        timestamp.max = (objA.position.y - (objB.position.y + objB.size.height)) / vectorYDiff;
        timestamp.min = ((objA.position.y + objA.size.height) - objB.position.y) / vectorYDiff;
    }
    return timestamp;
}

function _aabbXAxisCollision(objA, objB) {
    const vectorXDiff = objB.vector.x - objA.vector.x;
    const timestamp = { min: Infinity, max: -Infinity };
    if (vectorXDiff === 0 && objA.position.x + objA.size.width >= objB.position.x && objA.position.x <= objB.position.x + objB.size.width) {
        timestamp.min = -Infinity;
        timestamp.max = Infinity;
    } else if (vectorXDiff > 0) {
        timestamp.max = ((objA.position.x + objA.size.width) - objB.position.x) / vectorXDiff;
        timestamp.min = (objA.position.x - (objB.position.x + objB.size.width)) / vectorXDiff;
    } else if (vectorXDiff < 0) {
        timestamp.max = (objA.position.x - (objB.position.x + objB.size.width)) / vectorXDiff;
        timestamp.min = ((objA.position.x + objA.size.width) - objB.position.x) / vectorXDiff;
    }
    return timestamp;
}