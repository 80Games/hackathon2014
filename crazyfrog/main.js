// We start by initializing Phaser
// Parameters: width of the game, height of the game, how to render the game, the HTML div that will contain the game
var game = new Phaser.Game(500, 600, Phaser.AUTO, 'game_div');

// And now we define our first and only state, I'll call it 'main'. A state is a specific scene of a game like a menu, a game over screen, etc.
var main_state = {

    preload: function() {
   		// Load a sprite in the game
		// Parameters: name of the sprite, path to the image
		game.load.image('car', 'assets/Car.png');  
        game.load.image('frog', 'assets/frog2.png');  
    },

    create: function() { 
        game.physics.setBoundsToWorld();
    
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
        }

        var frogYPosition = 500;
        var frogXPosition = game.world.centerX;
        var frog = game.add.sprite(frogXPosition, frogYPosition, 'frog');

    },

    update: function() {
	},
}

function carOut(car) {
    //  Move the alien to the top of the screen again
    var y = car.position.y;
    car.reset(-60, y);
    car.body.velocity.x = 50 + Math.random() * 200;
}


// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', main_state);  
game.state.start('main');  