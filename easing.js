export function linear(dt) {
    return dt;
}

export function easeInQuad(dt) {
    return dt * dt;
}

export function easeOutQuad(dt) {
    return dt * (2 - dt);
}

export function easeInOutQuad(dt) {
    return dt < .5 ? 2 * dt * dt : -1 + (4 - 2 * dt) * dt;
}

export function easeInCubic(dt) {
    return dt * dt * dt;
}

export function easeOutCubic(dt) {
    return (--dt) * dt * dt + 1;
}

export function easeInOutCubic(dt) {
    return dt < .5 ? 4 * dt * dt * dt : (dt - 1) * (2 * dt - 2) * (2 * dt - 2) + 1;
}

export function easeInQuart(dt) {
    return dt * dt * dt * dt;
}

export function easeOutQuart(dt) {
    return 1 - (--dt) * dt * dt * dt;
}

export function easeInOutQuart(dt) {
    return dt < .5 ? 8 * dt * dt * dt * dt : 1 - 8 * (--dt) * dt * dt * dt;
}

export function easeInQuint(dt) {
    return dt * dt * dt * dt * dt;
}

export function easeOutQuint(dt) {
    return 1 + (--dt) * dt * dt * dt * dt;
}

export function easeInOutQuint(dt) {
    return dt < .5 ? 16 * dt * dt * dt * dt * dt : 1 + 16 * (--dt) * dt * dt * dt * dt;
}