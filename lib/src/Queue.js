
module.exports = class Queue {
    constructor() {
        this._first = null;
        this._last = null;
        this.length = 0;
    }

    first() {
        return this._first?.content ?? null;
    }

    isEmpty() {
        return this.length === 0;
    }

    append(content) {
        if (this.isEmpty()) {
            this._first = new Node(content);
            this._last = this._first;
        } else {
            this._last.next = new Node(content);
            this._last = this._last.next;
        }
        this.length++;
        return this;
    }

    shift() {
        if (this.isEmpty())
            return null;
        const content = this._first.content;
        this._first = this._first.next;
        this.length--;
        if (!this._first)
            this._last = null;
        return content;
    }
}

class Node {
    constructor(content) {
        this.content = content;
        this.next = null;
    }
}
