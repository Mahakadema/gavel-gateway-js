
class Queue {
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

    values() {
        let current = this._first;
        return Array.from({ length: this.length }, () => {
            const content = current.content;
            current = current.next;
            return content;
        });
    }
}

class Node {
    constructor(content) {
        this.content = content;
        this.next = null;
    }
}

class PriorityLinkedList {
    constructor() {
        this._priority = new Queue();
        this._generic = new Queue();
        this.length = 0;
    }

    first() {
        return this._priority.first() ?? this._generic.first() ?? null;
    }

    isEmpty() {
        return this.length === 0;
    }

    append(content, priority = false) {
        const queue = priority ? this._priority : this._generic;
        queue.append(content);
        this.length++;
        return this;
    }

    remove(index) {
        let queue = this._priority;
        if (index >= this._priority.length) {
            index -= this._priority.length;
            queue = this._generic;
        }
        if (index >= queue.length)
            return null;
        if (index === 0) {
            return queue.shift();
        }
        let current = queue._first;
        while(--index) {
            current = current.next;
        }
        const content = current.next.content;
        current.next = current.next.next;
        return content;
    }

    shift() {
        if (this.isEmpty())
            return null;
        this.length--;
        if (!this._priority.isEmpty())
            return this._priority.shift();
        return this._generic.shift();
    }

    values() {
        return this._priority.values().concat(this._generic.values());
    }
}

module.exports = {
    Queue,
    PriorityQueue: PriorityLinkedList
};
