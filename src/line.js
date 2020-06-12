function mergeLines(lines) {
    let mergedLines = [];
    const axisLines= {
        x: [...getAxisLines(lines, { x: 1, y: 0 }), ...getAxisLines(lines, { x: -1, y: 0 })],
        y: [...getAxisLines(lines, { x: 0, y: 1 }), ...getAxisLines(lines, { x: 0, y: -1 })],
        uxy: [...getAxisLines(lines, { x: -1, y: -1 }), ...getAxisLines(lines, { x: 1, y: 1 })],
        dxy: [...getAxisLines(lines, { x: -1, y: 1 }), ...getAxisLines(lines, { x: 1, y: -1 })]
    };

    for (let key in axisLines) {
        mergedLines = [...mergedLines, ...merge(axisLines[key])];
    }
    return mergedLines.map((line) => {
        return { sx: line.sx, ex: line.ex, sy: line.sy, ey: line.ey };
    });
}

function merge(lines) {
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
    const standard = Math.abs(c.ex - c.sx) > Math.abs(c.ey - c.sy)? Math.abs(c.ex - c.sx): Math.abs(c.ey - c.sy);
    const x = (c.ex - c.sx) / standard;
    const y = (c.ey - c.sy) / standard;

    if (x === vector.x && y === vector.y) {
        p.push({sx:c.sx,ex:c.ex,sy:c.sy,ey:c.ey});
    }
    return p;
  }, []);
}

function main() {
    const lines = [
        {
            sx: 0,
            ex: 1,
            sy: 0,
            ey: 0
        },{
            sx: 1,
            ex: 2,
            sy: 0,
            ey: 0
        },{
            sx: 0,
            ex: -1,
            sy: 0,
            ey: 0
        },{
            sx: -1,
            ex: -2,
            sy: 0,
            ey: 0
        },{
            sx: 0,
            ex: 0,
            sy: 0,
            ey: 1
        },{
            sx: 0,
            ex: 0,
            sy: 1,
            ey: 2
        },{
            sx: 0,
            ex: 0,
            sy: 0,
            ey: -1
        },{
            sx: 0,
            ex: 0,
            sy: -1,
            ey: -2
        },{
            sx: 0,
            ex: -1,
            sy: 0,
            ey: -1
        },{
            sx: -1,
            ex: -2,
            sy: -1,
            ey: -2
        },{
            sx: 0,
            ex: 1,
            sy: 0,
            ey: -1
        },{
            sx: 2,
            ex: 1,
            sy: -2,
            ey: -1
        }
    ];
    mergeLines(lines);
}

main();