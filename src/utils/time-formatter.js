export const HHmmss = 'HH:mm:ss';

export function simplify(duration) {
    let hours = Math.floor(duration / 3600);
    let minutes = Math.floor((duration - (hours * 3600)) / 60);

    let seconds = duration - (hours * 3600) - (minutes * 60);
    let strings = [];
    if (hours > 0) strings.push(hours + '시간');
    if (hours > 0 || minutes > 0) strings.push(minutes + '분');
    if (seconds > 0 || strings.length === 0) strings.push(seconds + '초');

    return strings.join(' ');
}