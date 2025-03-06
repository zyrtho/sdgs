let display = document.querySelector("body");

class Obj {
    #X;
    #Y;
    constructor(element, x, y) {
        this.element = element;
        element.style.position = "absolute";
        this.x = x || 0;
        this.y = y || 0;
        display.appendChild(element);
    }
    set x(x) {
        this.#X = x;
        this.element.style.left = x + "px";
    }
    set y(y) {
        this.#Y = y;
        this.element.style.top = y + "px";
    }
    get x() {
        return this.#X;
    }
    get y() {
        return this.#Y;
    }
    get width() {
        return this.element.offsetWidth;
    }
    get height() {
        return this.element.offsetHeight;
    }
}

class DynamicObj extends Obj {
    constructor(element, x, y) {
        super(element, x, y);
        element.style.position = "fixed";
    }
}

class DragObj extends DynamicObj {
    #on_grab_callback;
    #on_drag_callback;
    #on_release_callback;
    #on_dest_callback;
    #dest;
    constructor(element, draggable, x, y) {
        super(element, x, y);
        this.draggable = draggable || false;
        this.#on_grab_callback = (e) => {};
        this.#on_drag_callback = (e) => {};
        this.#on_release_callback = (e) => {};
        this.#on_dest_callback = (t) => {};
        this.#dest = [];
    }
    set on_grab(callback) {
        this.#on_grab_callback = callback;
    }
    set on_drag(callback) {
        this.#on_drag_callback = callback;
    }
    set on_release(callback) {
        this.#on_release_callback = callback;
    }
    set on_dest(callback) {
        this.#on_dest_callback = callback;
    }
    start_grab(t) {
        let offset_x = 0;
        let offset_y = 0;
        let on_drag = (e) => {
            if (!t.is_draggable) {
                document.removeEventListener("mousedown", start);
                document.removeEventListener("mousemove", on_drag);
                document.removeEventListener("mouseup", on_release);
                return;
            }
            super.x = e.clientX + offset_x;
            super.y = e.clientY + offset_y;
            t.#on_drag_callback(e);
            if (this.#dest.length > 0) {
                let overlapped = this.check_dest();
                if (overlapped == null) {return};
                this.#on_dest_callback(t, overlapped);
            }
        }
        let on_release = (e) => {
            document.removeEventListener("mousemove", on_drag);
            document.removeEventListener("mouseup", on_release);
            t.#on_release_callback(e);
        };
        let start = (e) => {
            if (!t.is_draggable) {
                document.removeEventListener("mousedown", start);
            }
            document.addEventListener("mousemove", on_drag);
            document.addEventListener("mouseup", on_release);
            let start_x = e.clientX;
            let start_y = e.clientY;
            offset_x = super.x - start_x;
            offset_y = super.y - start_y;
            t.#on_grab_callback(e);
        }
        return start;
    }
    set draggable(bool) {
        if (this.is_draggable != bool && bool) {
            this.is_draggable = bool;
            this.element.addEventListener("mousedown", this.start_grab(this));
        } else if (this.is_draggable != bool) {
            console.log("REMOVED");
            this.is_draggable = bool;
            this.element.removeEventListener("mousedown", this.start_grab(this));
        }
    }
    push_dest(dest) {
        if (this.#dest.filter((d) => {
            return dest.element == d.element;
        }).length == 0) {
            this.#dest.push(dest);
        }
    }
    remove_dest(dest) {
        this.#dest = this.#dest.filter((d) => {
            return dest.element != d.element;
        });
    }
    check_dest() {
        for (let i = 0; i < this.#dest.length; i++) {
            let dest = this.#dest[i];
            if (
                ((this.x > dest.x && this.x < dest.x + dest.width) || (this.x + this.width > dest.x && this.x + this.width < dest.x + dest.width)) &&
                ((this.y > dest.y && this.y < dest.y + dest.height) || (this.y + this.height > dest.y && this.y + this.height < dest.y + dest.height))
            ) {
                return dest;
            }
        }
    }
}

class DragObjDest extends Obj {
    constructor(element, x, y) {
        super(element, x, y);
    }
}