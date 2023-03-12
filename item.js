const items = require("./fakeDb");

class Item {
    constructor(name, price) {
        this.name = name;
        this.price = price;

        items.push(this);
    }

    static getAll() {
        return items;
    }

    static get(name) {
        return items.find(item=>item.name == name);
    }

    static remove(name) {
        const index = items.findIndex(item => item.name == name);
        if (index !== -1) {
            const removedItem = items[index];
            items.splice(index, 1);
            return removedItem;
        }

        return null;
    }

    static update(name, data) {
        const item = Item.get(name);

        if (!item)
            return null;

        item.name = data.name;
        item.price = data.price;

        return item;
    }
}

module.exports = Item;