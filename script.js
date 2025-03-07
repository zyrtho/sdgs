function vh(percent0_100) {
    return window.innerHeight * (percent0_100 * 0.01);
}
function vw(percent0_100) {
    return window.innerWidth * (percent0_100 * 0.01);
}

class Human extends DragObj {
    #work_dests = [];
    #money_dests = [];
    constructor(w, h, x, y) {
        let human_img = Img("assets/human.png", w, h);
        super(human_img, true, x, y);
        this.working = null;
        
        this.on_grab = (e) => {
            console.log("grabbed");
            if (this.working != null) {
                console.log("please finish your work before leaving");
                clearTimeout(this.working);
                this.working = null;
            }
        }
        this.on_release = (e) => {
            console.log("released");
            let dest = this.check_dest();
            if (dest != null) {
                this.x = (dest.x) + (dest.width / 2) - (this.width / 2);
                this.y = (dest.y) + (dest.height / 2) - (this.height / 2);
            }
            if (this.#work_dests.includes(dest)) {
                this.working = setTimeout(() => {
                    console.log("work finished");
                    this.working = null;
                    this.#remove_work_dests();
                    this.#push_money_dests();
                }, 3000);
            } else if (this.#money_dests.includes(dest)) {
                console.log("gain money");
                let gain_money_img = Img("assets/gain_money.png", 64, 24);
                new DynamicObj(gain_money_img, this.x + this.width + 10, this.y);
                your_money.innerText = parseFloat(your_money.innerText) + 1.9;
                setTimeout(() => {
                    gain_money_img.remove()
                }, 2000);
                this.#remove_money_dests();
                this.#push_work_dests();
            }
        }
    }
    #push_work_dests() {
        for (let i = 0;i < this.#work_dests.length;i++) {
            this.push_dest(this.#work_dests[i]);
        }
    }
    #remove_work_dests() {
        for (let i = 0;i < this.#work_dests.length;i++) {
            this.remove_dest(this.#work_dests[i]);
        }
    }
    #push_money_dests() {
        for (let i = 0;i < this.#money_dests.length;i++) {
            this.push_dest(this.#money_dests[i]);
        }
    }
    #remove_money_dests() {
        for (let i = 0;i < this.#money_dests.length;i++) {
            this.remove_dest(this.#money_dests[i]);
        }
    }
    push_work_dest(dest) {
        this.#work_dests.push(dest);
        this.#push_work_dests();
    }
    push_money_dest(dest) {
        this.#money_dests.push(dest);
    }
}

let your_money = document.getElementById("your-money");
let w1 = document.getElementById("work1");
let w2 = document.getElementById("work2");
let m = document.getElementById("get-money");

let work1 = new DragObjDest(w1, vw(50), vh(25));
let work2 = new DragObjDest(w2, vw(75), vh(25));
let money = new DragObjDest(m, vw(75), vh(75));

let human = new Human(vh(10), vh(10));
let human2 = new Human(vh(10), vh(10), vw(10));

human.push_work_dest(work1);
human.push_work_dest(work2);
human.push_money_dest(money);

human2.push_work_dest(work1);
human2.push_work_dest(work2);
human2.push_money_dest(money);