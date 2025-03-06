function vh(percent0_100) {
    return window.innerHeight * (percent0_100 * 0.01);
}
function vw(percent0_100) {
    return window.innerWidth * (percent0_100 * 0.01);
}

let hello = document.getElementById("drag1");
let world = document.getElementById("drag2");
let d1 = document.getElementById("dest1");
let d2 = document.getElementById("dest2");
let d3 = document.getElementById("dest3");

let drag1 = new DragObj(hello, true);
let drag2 = new DragObj(world, true, vw(100) - vh(10), vh(100) - vh(10));
let dest1 = new DragObjDest(d1, vw(69), vh(42));
let dest2 = new DragObjDest(d2, vw(42), vh(69));
let dest3 = new DragObjDest(d3, vw(25), vh(25));

drag1.on_grab = (e) => {
    console.log("grabbed");
    drag1.push_dest(dest1);
    drag1.push_dest(dest2);
}
drag1.on_release = (e) => {
    console.log("released");
    let dest = drag1.check_dest();
    if (dest != null) {
        drag1.x = (dest.x) + (dest.width / 2) - (drag1.width / 2);
        drag1.y = (dest.y) + (dest.height / 2) - (drag1.height / 2);
        drag1.remove_dest(dest);
    }
}

drag2.on_grab = (e) => {
    console.log("grabbed");
    drag2.push_dest(dest1);
    drag2.push_dest(dest3);
}
drag2.on_release = (e) => {
    console.log("released");
    let dest = drag2.check_dest();
    if (dest != null) {
        drag2.x = (dest.x) + (dest.width / 2) - (drag2.width / 2);
        drag2.y = (dest.y) + (dest.height / 2) - (drag2.height / 2);
        drag2.remove_dest(dest);
    }
}