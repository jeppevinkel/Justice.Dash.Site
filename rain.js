const rain = [];
let isEnabled = false;

function toggleRain(enable = true) {
    isEnabled = enable;

    if (!enable) {
        for (let i = 0; i < rain.length; i++) {
            rain[i].reset();
        }
    }
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('rainy');
    for (let i = 0; i < 50; i++) {
        rain[i] = new Drop();
    }

    checkForRain();
    setInterval(checkForRain, 60000);
}

function draw() {
    clear();
    if (!isEnabled) return;
    for (let i = 0; i < rain.length; i++) {
        rain[i].fall();
        rain[i].show();
    }
}

function Drop() {
    this.x = random(width);
    this.y = random(-500, -50);
    this.z = random(0, 5);
    this.len = map(this.z, 0, 20, 10, 20);
    this.yspeed = map(this.z, 0, 5, 1, 5);

    this.fall = function () {
        this.y = this.y + this.yspeed;
        const grav = map(this.z, 0, 20, 0, 0.2);
        this.yspeed = this.yspeed + grav;

        if (this.y > height) {
            this.y = random(-200, -100);
            this.yspeed = map(this.z, 0, 5, 4, 10);
        }
    };

    this.reset = function () {
        this.y = random(-200, -100);
        this.yspeed = map(this.z, 0, 20, 4, 10);
    };

    this.show = function () {
        const thick = map(this.z, 0, 20, 1, 3);
        strokeWeight(thick);
        // stroke(138, 43, 226);
        stroke(43, 43, 226);
        line(this.x, this.y, this.x, this.y + this.len);
    };
}

function checkForRain() {
    fetch('/data/rain.json', {cache: "reload"}).then(res => res.json()).then(rainData => {
        const rainValue = rainData.rainValue;
        console.log('rainValue', rainValue);
        if (rainValue > 0.2) {
            toggleRain();
        } else toggleRain(false);
    });
}