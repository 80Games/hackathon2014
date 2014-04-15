var frog;
var deadFrog;
var cars;
var fly;
var introText;
var levelText;
var lifesText;
var isGameOver = false;

var showDebugInfos = false;

var currentLevel = 7;
var lifes = 3;
var laneSize = 65;
var laneOffset = 120;

var irrerIvanQuote=0.001;

// And now we define our first and only state, I'll call it 'main'. A state is a specific scene of a game like a menu, a game over screen, etc.
var main_state = {
    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //game.physics.setBoundsToWorld();

        s = game.add.tileSprite(0, 0, 1200, 600, 'streets');

        var frogYPosition = 500;
        var frogXPosition = game.width / 2;
        frog = game.add.sprite(frogXPosition, frogYPosition, 'frog');
        frog.anchor.setTo(0.5, 0.5);
        frog.checkWorldBounds = true;
        game.physics.enable(frog, Phaser.Physics.ARCADE);
        frog.body.checkCollision.any = true;
        frog.body.collideWorldBounds = true;
        frog.body.setSize(37, 37);
        frog.events.onOutOfBounds.add(frogOut, this);

        deadFrog = game.add.sprite(0, 0, 'deadfrog');
        deadFrog.anchor.setTo(0.5, 0.5);
        deadFrog.visible = false;

        fly = game.add.sprite(frogXPosition, 0, 'fly');
        game.physics.enable(fly, Phaser.Physics.ARCADE);

        cars = game.add.group();
        cars.enableBody = true;
        cars.physicsBodyType = Phaser.Physics.ARCADE;

        updateCars();

        introText = game.add.text(game.world.centerX, 400, '- click to start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
        introText.anchor.setTo(0.5, 0.5);
        introText.visible = false;

        var currentLevelText = 'Level: ' + currentLevel;
        levelText = game.add.text(game.world.width/5*3, 20, currentLevelText, { font: "18px Arial", fill: "#ffffff", align: "center" });
        levelText.anchor.setTo(0.5, 0.5);
        levelText.visible = true;

        var lifeLevelText = 'Lifes: ' + lifes;
        lifesText = game.add.text(game.world.width/5*4, 20, lifeLevelText, { font: "18px Arial", fill: "#ffffff", align: "center" });
        lifesText.anchor.setTo(0.5, 0.5);
        lifesText.visible = true;

         // No 'this.score', but just 'score'
        score = 0; 
    },

    update: function () {

        game.physics.arcade.collide(cars, cars, swapSpeed, null, this);
        game.physics.arcade.overlap(frog, cars, frogIsDead, null, this);
        game.physics.arcade.overlap(frog, fly, flyEaten, null, this);

        if (!isGameOver) {
            if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                frog.y -= 5;
                frog.angle = 0;
            }
            if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                frog.x -= 5;
                frog.angle = 270;
            }
            if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                frog.x += 5;
                frog.angle = 90;
            }
            if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                frog.y += 1;
                frog.angle = 180;
            }
        } else {
            if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                isGameOver = false;
                introText.visible = false;

                resetFrog(frog);
            }
        }
    },

    render: function () {
        if (showDebugInfos) {
            game.debug.body(frog);
            game.debug.spriteInfo(frog);
            var carsSize = cars.length;
            for (var i = 0; i < carsSize; i++) {
                var c = cars.getAt(i);
                game.debug.body(c);
            }
        }
    }
}

function swapSpeed(a, b) {
    var bvel = b.body.velocity.x;
    b.body.velocity.x = a.body.velocity.x;
    a.body.velocity.x = bvel;
    irrerIvanWithRandom(a,0.0);
}

function carOut(car) {
    //  Move the alien to the top of the screen again
    var y = car.position.y;
    car.reset(-60, y);
    car.body.velocity.x = 50 + Math.random() * 600;
}
function resetFrog(lfrog) {
    lfrog.body.velocity.setTo(0, 0);
    lfrog.x = game.width / 2;
    lfrog.y = 500;
    lfrog.angle = 0;
    deadFrog.visible=false;
    lfrog.visible=true;
    lfrog.revive();
}
function frogOut(lfrog) {
    resetFrog(lfrog);
    isGameOver = true;
}

function frogIsDead(frog, car) {
    deadFrog.x=frog.x;
    deadFrog.y=frog.y;
    deadFrog.angle=frog.angle;
    deadFrog.visible=true;

    frog.visible=false;
    frog.kill();

    lifes = lifes - 1;
    if (lifes < 1) {
        introText.text = 'Game Over!';
        introText.visible = true;
        lifes = 3;
        currentLevel = 1;
        updateCars();
        updateLevelText();
        this.game.state.start('menu');
    }
    lifesText.text = 'Lives: '+lifes;
    isGameOver = true;
}

function updateLevelText() {
    levelText.text = 'Level: ' + currentLevel;
}
function flyEaten(frog, fly) {
    introText.text = 'Next Level! Press SPACEBAR to continue';
    introText.visible = true;
    isGameOver = true;
    resetFrog(frog);
    currentLevel++;
    updateCars();
    updateLevelText();
    score = score + 1;
    if (score > localStorage.getItem("highscore")) {
        localStorage.setItem("highscore", score);
    }
}

function updateCars() {
    cars.callAll('kill');
    cars.callAll('remove');
    var lanes = currentLevel;
    var maxCars = currentLevel;
    var numberOfCars = 0;
    if (lanes > 5) {
        lanes = 5;
    }

    do {
        for (var i = 0; i < lanes; i++) {
            if (maxCars > numberOfCars) {
                numberOfCars++;
                var velocity = 50 + Math.random() * 200;
                var car_sprite = cars.create(Math.random() * game.world.width, laneOffset + i * laneSize, 'car');
                game.physics.enable(car_sprite, Phaser.Physics.ARCADE);
                car_sprite.body.velocity.x = velocity;
                car_sprite.checkWorldBounds = true;
                car_sprite.enableBody = true;
                car_sprite.physicsBodyType = Phaser.Physics.ARCADE;
                car_sprite.events.onOutOfBounds.add(carOut, this);
                car_sprite.body.checkCollision.any = true;
                car_sprite.body.bounce.setTo(1,1);
                //car_sprite.body.immovable = true;
                car_sprite.body.setSize(76, 36, 0, 7);

                game.time.events.loop(game.rnd.integerInRange(25, 100), irrerIvan, this, car_sprite);
            }
        }
    } while (numberOfCars<maxCars);
}

function irrerIvanWithRandom(c, random) {
    var nextLaneOffset = laneSize;
    var changeLaneStep = 1;
    var delta = 0;
    if ((typeof c.irrerIvan === "undefined") || (c.irrerIvan === 0)) {
        c.irrerIvan = 0;
        if (random < irrerIvanQuote) {
            console.log("IrrerIvan: "+random);
            c.irrerIvan = 0 > Math.random() - 0.5 ? -nextLaneOffset : nextLaneOffset;
            if (c.y <= laneOffset) {
                c.irrerIvan = nextLaneOffset;
            }
            if (c.y >= (laneOffset + (4 * laneSize))) {
                c.irrerIvan = -nextLaneOffset;
            }
        } else {
            console.log("No IrrerIvan");
        }
    }
    if (c.irrerIvan > 0) {
        c.irrerIvan -= changeLaneStep;
        delta = +changeLaneStep;
        if (c.irrerIvan < 0) c.irrerIvan = 0;
    } else {
        if (c.irrerIvan < 0) {
            c.irrerIvan += changeLaneStep;
            delta = -changeLaneStep;
            if (c.irrerIvan > 0) c.irrerIvan = 0;
        }
    }

    c.y += delta;
}

function irrerIvan(c) {
    var cr=Math.random();
    irrerIvanWithRandom(c, cr);
}

// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', main_state);
game.state.start('main');  