class MarkingEditor {
constructor(viewport, world, targetSegments) {
this.viewport = viewport;
        this.canvas = viewport.canvas;
        this.world = world;
        this.ctx = this.canvas.getContext("2d");
        this.mouse = null;
        this.intent = null;
        this.targetSegements = targetSegments
        this.markings= world.markings;
}
// to be overwritten
createMarking(center, directionVector){
    return center;
}


enable() {
this.#addEventListeners();
}

disable() {
this.#removeEventListeners();
}

#addEventListeners() {
this.boundMouseDown = this.#handleMouseDown.bind(this);
        this.handleMouseMove = this.#handleMouseMove.bind(this)

        this.boundContextMenu = (evt) => evt.preventDefault();
        this.canvas.addEventListener("mousedown", this.boundMouseDown);
        this.canvas.addEventListener("mousemove", this.handleMouseMove);
        this.canvas.addEventListener("contextmenu", this.boundContextMenu);
}

#removeEventListeners() {
this.canvas.removeEventListener("mousedown", this.boundMouseDown);
        this.canvas.removeEventListener("mousemove", this.handleMouseMove);
        this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
}

#handleMouseMove(evt) {
this.mouse = this.viewport.getMouse(evt, true);
        const seg = getNearestSegment(
                this.mouse,
                this.targetSegements,
                10 * this.viewport.zoom
                );
        if (seg){
const proj = seg.projectPoint(this.mouse);
        if (proj.offset >= 0 && proj.offset <= 1){
this.intent = this.createMarking(
        proj.point,
        seg.directionVector()
        )
} else {
this.intent = null;
}
} else {
this.intent = null;
}
}

#handleMouseDown(evt) {

if (evt.button == 0) { // left click
if (this.intent) {
this.markings.push(this.intent);
        this.intent = null;
     
}

}

if (evt.button == 2) { // left click
for(let i=0; i<this.markings.lenght; i++){
    const poly= this.markings[i].poly;
    if (poly.containsPoint(this.mouse)){
        this.markings.splice(i,1);
        return;
    }
};

};
}



#select(point) {
if (this.selected) {
this.graph.tryAddSegment(new Segment(this.selected, point));
}
this.selected = point;
}

#removePoint(point) {
this.graph.removePoint(point);
        this.hovered = null;
        if (this.selected == point) {
this.selected = null;
}
}

dispose() {
this.graph.dispose();
        this.selected = null;
        this.hovered = null;
}

display() {

if (this.intent) {
this.intent.draw(this.ctx);
}

}
}