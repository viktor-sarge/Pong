export default class Datastorage {
    get(key) {
        return localStorage.getItem(key);
    }

    put(key, value) {
        localStorage.setItem(key, value);
    }
}