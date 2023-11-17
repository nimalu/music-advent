function dec2hex(dec: number) {
    return dec.toString(16).padStart(2, "0")
}

export function randomString(len: number) {
    var arr = new Uint8Array((len || 40) / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
}
