export function randomSeed(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const index = Math.round(Math.random() * (characters.length - 1))
        result += characters[index];
    }
    return result;
}