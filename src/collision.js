export function collision(objectsA, objectsB, dt) {
    const collisionResults = [];

    for (let objectA of objectsA) {
        const collisionResult = { hit: false, time: Infinity, object: null, position: { x: undefined, y: undefined } };
        for (let objectB of objectsB) {
            const currentCollisionResult = aabbCollision(objectA, objectB);
            if (currentCollisionResult.time <= dt && currentCollisionResult.time <= collisionResult.time) {
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
    const boundary = { min: Infinity, max: -Infinity };
    const result = { hit: false, time: Infinity, object: null, position: { x: undefined, y: undefined } };

    if (xAxis.min < yAxis.max && xAxis.max > yAxis.min) {
        boundary.min = Math.max(xAxis.min, yAxis.min);
        boundary.max = Math.min(xAxis.max, yAxis.max);
        if (boundary.max >= 0) {
            result.hit = true;
            result.time = boundary.min > 0 ? boundary.min : 0;
            result.object = objB;
            result.position = { x: objA.position.x + objA.vector.x * result.time, y: objA.position.y + objA.vector.y * result.time };
        }
    }
    return result;
}

function _aabbYAxisCollision(objA, objB) {
    const VECTOR_DIFFERENCE = objB.vector.y - objA.vector.y;
    const [BOTTOM_OF_OBJECT_A, TOP_OF_OBJECT_A] = [objA.position.y, objA.position.y + objA.size.height];
    const [BOTTOM_OF_OBJECT_B, TOP_OF_OBJECT_B] = [objB.position.y, objB.position.y + objB.size.height];

    if (VECTOR_DIFFERENCE === 0 && TOP_OF_OBJECT_A >= BOTTOM_OF_OBJECT_B && BOTTOM_OF_OBJECT_A <= TOP_OF_OBJECT_B) {
        return { min: -Infinity, max: Infinity };
    } else if (VECTOR_DIFFERENCE > 0) {
        return { min: (BOTTOM_OF_OBJECT_A - (TOP_OF_OBJECT_B)) / VECTOR_DIFFERENCE, max: (TOP_OF_OBJECT_A - BOTTOM_OF_OBJECT_B) / VECTOR_DIFFERENCE };
    } else if (VECTOR_DIFFERENCE < 0) {
        return { min: (TOP_OF_OBJECT_A - BOTTOM_OF_OBJECT_B) / VECTOR_DIFFERENCE, max: (BOTTOM_OF_OBJECT_A - (TOP_OF_OBJECT_B)) / VECTOR_DIFFERENCE };
    }
}

function _aabbXAxisCollision(objA, objB) {
    const VECTOR_DIFFERENCE = objB.vector.x - objA.vector.x;
    const [LEFT_OF_OBJECT_A, RIGHT_OF_OBJECT_A] = [objA.position.x, objA.position.x + objA.size.width];
    const [LEFT_OF_OBJECT_B, RIGHT_OF_OBJECT_B] = [objB.position.x, objB.position.x + objB.size.width];

    if (VECTOR_DIFFERENCE === 0 && RIGHT_OF_OBJECT_A >= LEFT_OF_OBJECT_B && LEFT_OF_OBJECT_A <= RIGHT_OF_OBJECT_B) {
        return { min: -Infinity, max: Infinity };
    } else if (VECTOR_DIFFERENCE > 0) {
        return { min: (LEFT_OF_OBJECT_A - RIGHT_OF_OBJECT_B) / VECTOR_DIFFERENCE, max: (RIGHT_OF_OBJECT_A - LEFT_OF_OBJECT_B) / VECTOR_DIFFERENCE };
    } else if (VECTOR_DIFFERENCE < 0) {
        return { min: (RIGHT_OF_OBJECT_A - LEFT_OF_OBJECT_B) / VECTOR_DIFFERENCE, max: (LEFT_OF_OBJECT_A - RIGHT_OF_OBJECT_B) / VECTOR_DIFFERENCE };
    }
}