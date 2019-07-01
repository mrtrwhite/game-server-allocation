export default {
    makeid (length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    makeHash (str) {
        var hash = 0, i, chr;
        if (str.length === 0) return hash;
        for (i = 0; i < str.length; i++) {
            chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return Math.abs(hash);
    },
    f (a, b) {
        return [].concat(...a.map(d => b.map(e => [].concat(d, e))));
    },
    cartesian (a, b, ...c) {
        return (b ? this.cartesian(this.f(a, b), ...c) : a);
    },
    sortByCreatedAt (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
    },
    sliceObject (obj, length) {
        return Object.entries(obj).slice(0, length);
    },
    sliceEndOfObject (obj, length) {
        return Object.entries(obj).slice(-Math.abs(length));
    }
}
