const carCanvas = document.getElementById("carCanvas");
carCanvas.width = window.innerWidth - 330;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;
const miniMapCanvas = document.getElementById("miniMapCanvas");
miniMapCanvas.width = 300;
carCanvas.height = window.innerHeight;
networkCanvas.height = window.innerHeight - 300;
miniMapCanvas.height = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

//const ctx = carCanvas.getContext("2d");
/*
 const worldString = localStorage.getItem("world");
 const worldInfo = worldString ? JSON.parse(worldString) : null;
 const  world = worldInfo
 ? World.load(worldInfo)
 : new World(new Graph());
 
 */

const viewport = new Viewport(carCanvas, world.zoom, world.offset);
const miniMap = new MiniMap(miniMapCanvas, world.graph, 300)


const N = 50;

const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(
                localStorage.getItem("bestBrain"));
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.25);
        }
    }
}



const traffic = [];
const roadBorders = world.roadBorders.map((s) => [s.p1, s.p2]);


animate();

function save() {
    localStorage.setItem("bestBrain",
            JSON.stringify(bestCar.brain));
}

function load() {
    localStorage.setItem("bestBrain",
                 JSON.stringify(           {
   "levels":[
      {
         "inputs":[
            0.7456299831769235,
            0.7643248049457416,
            0.6346207949169731,
            0.6129753708547163,
            0.7563809133947832
         ],
         "outputs":[
            1,
            0,
            1,
            0
         ],
         "biases":[
            -0.09099576387726754,
            0.3376090254681554,
            -0.3537054802935906,
            0.17436386585175648
         ],
         "weights":[
            [
               0.306876902446387,
               -0.545436711894618,
               0.12325224548706842,
               -0.45247644675507626
            ],
            [
               -0.06499716973477832,
               -0.04374465445864371,
               0.522204118637738,
               -0.5507964356612061
            ],
            [
               0.0010389023467434755,
               0.5701915999666243,
               -0.15760118325727412,
               -0.5030016624475245
            ],
            [
               -0.03867699088273541,
               -0.017842737155808808,
               -0.2500103056481267,
               -0.10143820950791782
            ],
            [
               0.3462885652256115,
               0.46331516589874,
               -0.7262424070213144,
               -0.3275019086111708
            ]
         ]
      }
   ]
}
          )  );
}


function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(N) {
    const startPoints = world.markings.filter((m) => m instanceof Start);
    const startPoint = startPoints.length > 0
            ? startPoints[0].center :
            new Point(100, 100);

    const dir = startPoints.length > 0
            ? startPoints[0].directionVector :
            new Point(0, -1);

    const startAngle = -angle(dir) + Math.PI / 2

    const cars = [];
    for (let i = 1; i <= N; i++) {
        cars.push(new Car(startPoint.x, startPoint.y, 30, 50, "AI", startAngle));
    }
    return cars;
}

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(roadBorders, []);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(roadBorders, traffic);
    }
    bestCar = cars.find(
            c => c.fittness == Math.max(
                        ...cars.map(c => c.fittness)
                        ));

    world.cars = cars;
    world.bestCar = bestCar;

    viewport.offset.x = -bestCar.x;
    viewport.offset.y = -bestCar.y;



    viewport.reset();

    const viewPoint = scale(viewport.getOffset(), -1)
    world.draw(carCtx, viewPoint, false);
    miniMap.update(viewPoint);

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx);
    }




    networkCtx.lineDashOffset = -time / 50;
    networkCtx.clearRect(0, 0, networkCanvas.width, networkCanvas.height)
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}
