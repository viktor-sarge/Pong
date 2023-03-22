export default class Datastorage {
    get(key) {
        localStorage.getItem(key);
    }

    put(key, value) {
        localStorage.setItem(key, value);
    }
}