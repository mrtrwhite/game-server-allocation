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
    },
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
