// We start by initializing Phaser
// Parameters: width of the game, height of the game, how to render the game, the HTML div that will contain the game
var game = new Phaser.Game(500, 600, Phaser.AUTO, 'game_div');
var frog;
var cars;
var introText;
var isGameOver=false;

// And now we define our first and only state, I'll call it 'main'. A state is a specific scene of a game like a menu, a game over screen, etc.
var main_state = {

    preload: function() {
   		// Load a sprite in the game
		// Parameters: name of the sprite, path to the image
		game.load.image('car', 'assets/Car.png');  
        game.load.image('frog', 'assets/frog2.png');  
    },

    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //game.physics.setBoundsToWorld();

        var frogYPosition = 500;
        var frogXPosition = game.width / 2;
        frog = game.add.sprite(frogXPosition, frogYPosition, 'frog');
        frog.anchor.setTo(0.5, 0.5);
        frog.checkWorldBounds = true;
        game.physics.enable(frog, Phaser.Physics.ARCADE);
        frog.body.checkCollision.any=true;
        frog.body.collideWorldBounds = true;


        cars = game.add.group();
        cars.enableBody = true;
        cars.physicsBodyType = Phaser.Physics.ARCADE;
    
        for (var i = 0; i < 4; i++) {
            var car_sprite = cars.create(0, 50 + i * 100, 'car');
            car_sprite.body.velocity.x=50 + Math.random() * 200;
            car_sprite.checkWorldBounds = true;
            car_sprite.enableBody = true;
            car_sprite.physicsBodyType = Phaser.Physics.ARCADE;
            car_sprite.events.onOutOfBounds.add(carOut, this);
            game.physics.enable(car_sprite, Phaser.Physics.ARCADE);
            car_sprite.body.checkCollision.any=true;
        }

        introText = game.add.text(game.world.centerX, 400, '- click to start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
        introText.anchor.setTo(0.5, 0.5);
        introText.visible = false;
    },

    update: function() {

        game.physics.arcade.collide(frog, cars, deadFrog, null, this);

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
        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            if (isGameOver) {
                isGameOver=false;
                introText.visible=false;

                frog.x=game.width / 2;
                frog.y=500;
                frog.angle = 0;
                frog.body.velocity.setTo(0,0);
            }
        }
	},

    render: function() {
        game.debug.body(frog);
        game.debug.spriteInfo(frog);
    }
}

function carOut(car) {
    //  Move the alien to the top of the screen again
    var y = car.position.y;
    car.reset(-60, y);
    car.body.velocity.x = 50 + Math.random() * 200;
}

function deadFrog(frog, car) {
    introText.text = 'Game Over!';
    introText.visible = true;
    isGameOver=true;

}


// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', main_state);  
game.state.start('main');  