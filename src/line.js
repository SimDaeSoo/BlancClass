function getLightingPolygon(position, lines, length) {
    const epsilon = 0.01 * Math.PI / 180;
    const polygon = [];

    for (const line of lines) {
        const boundary = { begin: Math.atan2(line.sy - position.y, line.sx - position.x), end: Math.atan2(line.ey - position.y, line.ex - position.x) };
        const radians = [boundary.begin - epsilon, boundary.begin + epsilon, boundary.end - epsilon, boundary.end + epsilon];
        const lightLines = [
            { sx: position.x, sy: position.y, ex: position.x + Math.cos(radians[0]) * length, ey: position.y + Math.sin(radians[0]) * length },
            { sx: position.x, sy: position.y, ex: position.x + Math.cos(radians[1]) * length, ey: position.y + Math.sin(radians[1]) * length },
            { sx: position.x, sy: position.y, ex: position.x + Math.cos(radians[2]) * length, ey: position.y + Math.sin(radians[2]) * length },
            { sx: position.x, sy: position.y, ex: position.x + Math.cos(radians[3]) * length, ey: position.y + Math.sin(radians[3]) * length }
        ];

        for (const lineA of lightLines) {
            const target = { distance: Infinity, position: undefined };

            for (const lineB of lines) {
                const result = lineIntersection(lineA, lineB);

                if (result.hit) {
                    const distance = Math.sqrt((result.position.x - position.x) ** 2 + (result.position.y - position.y) ** 2);
                    const isNearest = target.distance > distance;
                    target.position = isNearest ? result.position : target.position;
                    target.distance = isNearest ? distance : target.distance;
                }
            }

            if (target.distance !== Infinity) {
                polygon.push(target.position);
            }
        }
    }

    return polygon;
}

function getLineMaxLength(lines) {
    const boundary = { min: { x: Infinity, y: Infinity }, max: { x: -Infinity, y: -Infinity } };
    for (const line of lines) {
        boundary.min.x = boundary.min.x > line.sx ? line.sx : boundary.min.x;
        boundary.min.x = boundary.min.x > line.ex ? line.ex : boundary.min.x;

        boundary.min.y = boundary.min.y > line.sy ? line.sy : boundary.min.y;
        boundary.min.y = boundary.min.y > line.ey ? line.ey : boundary.min.y;

        boundary.max.x = boundary.max.x < line.sx ? line.sx : boundary.max.x;
        boundary.max.x = boundary.max.x < line.ex ? line.ex : boundary.max.x;

        boundary.max.y = boundary.max.y < line.sy ? line.sy : boundary.max.y;
        boundary.max.y = boundary.max.y < line.ey ? line.ey : boundary.max.y;
    }

    return Math.sqrt((boundary.max.x - boundary.min.x) ** 2 + (boundary.max.y - boundary.min.y) ** 2);
}

function lineIntersection(lineA, lineB) {
    const BASE = (lineB.ey - lineB.sy) * (lineA.ex - lineA.sx) - (lineB.ex - lineB.sx) * (lineA.ey - lineA.sy);
    if (BASE === 0) return { hit: false, position: { x: undefined, y: undefined } };

    const TIME_A = ((lineB.ex - lineB.sx) * (lineA.sy - lineB.sy) - (lineB.ey - lineB.sy) * (lineA.sx - lineB.sx)) / BASE;
    const TIME_B = ((lineA.ex - lineA.sx) * (lineA.sy - lineB.sy) - (lineA.ey - lineA.sy) * (lineA.sx - lineB.sx)) / BASE;
    if (TIME_A < 0 || TIME_A > 1 || TIME_B < 0 || TIME_B > 1) return { hit: false, position: { x: undefined, y: undefined } };

    return { hit: true, position: { x: lineA.sx + TIME_A * (lineA.ex - lineA.sx), y: lineA.sy + TIME_A * (lineA.ey - lineA.sy) } };
}

function merge(lines) {
    let mergedLines = [];
    const axisLines = {
        x: [...getAxisLines(lines, { x: 1, y: 0 }), ...getAxisLines(lines, { x: -1, y: 0 })],
        y: [...getAxisLines(lines, { x: 0, y: 1 }), ...getAxisLines(lines, { x: 0, y: -1 })],
        uxy: [...getAxisLines(lines, { x: -1, y: -1 }), ...getAxisLines(lines, { x: 1, y: 1 })],
        dxy: [...getAxisLines(lines, { x: -1, y: 1 }), ...getAxisLines(lines, { x: 1, y: -1 })]
    };

    for (let key in axisLines) {
        mergedLines = [...mergedLines, ...lineMerge(axisLines[key])];
    }
    return mergedLines.map((line) => {
        return { sx: line.sx, ex: line.ex, sy: line.sy, ey: line.ey };
    });
}

function lineMerge(lines) {
    const mergedLines = [];

    for (let lineA of lines) {
        if (lineA.merged) continue;

        for (let lineB of lines) {
            if (lineB.merged) continue;
            if ((lineA.ex - lineA.sx) !== (lineB.ex - lineB.sx) || (lineA.ey - lineA.sy) !== (lineB.ey - lineB.sy)) {
                [lineB.sx, lineB.ex, lineB.sy, lineB.ey] = [lineB.ex, lineB.sx, lineB.ey, lineB.sy];
            }
            if (lineA.sx === lineB.ex && lineA.sy === lineB.ey) {
                lineA.sx = lineB.sx;
                lineA.sy = lineB.sy;
                lineB.merged = true;
            } else if (lineA.ex === lineB.sx && lineA.ey === lineB.sy) {
                lineA.ex = lineB.ex;
                lineA.ey = lineB.ey;
                lineB.merged = true;
            }
        }
        lineA.merged = true;
        mergedLines.push(lineA);
    }

    return mergedLines;
}

function getAxisLines(lines, vector) {
    return lines.reduce((p, c) => {
        const standard = Math.abs(c.ex - c.sx) > Math.abs(c.ey - c.sy) ? Math.abs(c.ex - c.sx) : Math.abs(c.ey - c.sy);
        const x = (c.ex - c.sx) / standard;
        const y = (c.ey - c.sy) / standard;

        if (x === vector.x && y === vector.y) {
            p.push({ sx: c.sx, ex: c.ex, sy: c.sy, ey: c.ey });
        }
        return p;
    }, []);
}

function main() {
    const lines = [];

    for (let i = 0; i < 100; i++) {
        lines.push({
            sx: Math.random() * 100 - Math.random() * 100,
            sy: Math.random() * 100 - Math.random() * 100,
            ex: Math.random() * 100 - Math.random() * 100,
            ey: Math.random() * 100 - Math.random() * 100
        });
    }

    // const mergedLines = merge(lines);
    const light = { x: 0, y: 0 };

    const begin = Date.now();
    const length = getLineMaxLength(lines);
    for (let i =0; i < 20; i++) {
        const polygon = getLightingPolygon(light, lines, length);
    }
    const end = Date.now();
    console.log(`${1000/(end - begin)} ups`);
}

main();