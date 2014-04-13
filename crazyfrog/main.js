// We start by initializing Phaser
// Parameters: width of the game, height of the game, how to render the game, the HTML div that will contain the game
var game = new Phaser.Game(500, 600, Phaser.AUTO, 'game_div');
var frog;
var cars;
var fly;
var introText;
var isGameOver = false;

var showDebugInfos = false;

var currentLevel = 6;
var laneSize = 60;
var laneOffset = 50;

// And now we define our first and only state, I'll call it 'main'. A state is a specific scene of a game like a menu, a game over screen, etc.
var main_state = {

    preload: function () {
        // Load a sprite in the game
        // Parameters: name of the sprite, path to the image
        game.load.image('car', 'assets/Car.png');
        game.load.image('frog', 'assets/frog2.png');
        game.load.image('fly', 'assets/fly.png');
    },

    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //game.physics.setBoundsToWorld();

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

        fly = game.add.sprite(frogXPosition, 0, 'fly');
        game.physics.enable(fly, Phaser.Physics.ARCADE);

        cars = game.add.group();
        cars.enableBody = true;
        cars.physicsBodyType = Phaser.Physics.ARCADE;

        updateCars();

        introText = game.add.text(game.world.centerX, 400, '- click to start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
        introText.anchor.setTo(0.5, 0.5);
        introText.visible = false;
    },

    update: function () {

        game.physics.arcade.collide(cars);
        game.physics.arcade.overlap(frog, cars, deadFrog, null, this);
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
        } else {
            if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                isGameOver = false;
                introText.visible = false;

                frog.x = game.width / 2;
                frog.y = 500;
                frog.angle = 0;
                frog.body.velocity.setTo(0, 0);
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

function carOut(car) {
    //  Move the alien to the top of the screen again
    var y = car.position.y;
    car.reset(-60, y);
    car.body.velocity.x = 50 + Math.random() * 200;
}
function resetFrog(lfrog) {
    lfrog.body.velocity.setTo(0, 0);
    lfrog.x = game.width / 2;
    lfrog.y = 500;
    lfrog.angle = 0;
}
function frogOut(lfrog) {
    resetFrog(lfrog);
    isGameOver = true;
}

function deadFrog(frog, car) {
    introText.text = 'Game Over!';
    introText.visible = true;
    isGameOver = true;

}

function flyEaten(frog, fly) {
    introText.text = 'You win! Next Level=' + (currentLevel + 1);
    introText.visible = true;
    isGameOver = true;
    resetFrog(frog);
    currentLevel++;
    updateCars();
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
                var car_sprite = cars.create(Math.random() * 300, laneOffset + i * laneSize, 'car');
                car_sprite.body.velocity.x = velocity;
                car_sprite.checkWorldBounds = true;
                car_sprite.enableBody = true;
                car_sprite.physicsBodyType = Phaser.Physics.ARCADE;
                car_sprite.events.onOutOfBounds.add(carOut, this);
                game.physics.enable(car_sprite, Phaser.Physics.ARCADE);
                car_sprite.body.checkCollision.any = true;
                //car_sprite.body.immovable = true;
                car_sprite.body.setSize(76, 36, 0, 7);
            }
        }
    } while (numberOfCars<maxCars);
}

// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', main_state);
game.state.start('main');  