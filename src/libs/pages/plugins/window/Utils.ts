const avatarColor = ['#2391d3', '#00c800', '#fb0807', '#ff8900', '#fe5ebd', '#9c00fe', '#febf02'];


export const firstChar = (str: string) => {
    if (!str || !str.length) {
        return '';
    }
    const first = str.substring(0, 1);
    return first.toUpperCase();
}
export const hashString = (str: string) => {
    let hash = 5381;
    let i = str.length;
    while (i) {
        hash = (hash * 33) ^ str.charCodeAt(--i)
    }
    return hash >>> 0;
}
export const getAvatarColor = (name: string) => {
    const hashValue = hashString(name)
    const idx = hashValue % avatarColor.length;
    return avatarColor[idx] || '#febf02';
}