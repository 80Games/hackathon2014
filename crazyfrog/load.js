var load_state = {  
    preload: function() { 
        this.game.stage.backgroundColor = '#71c5cf';
        game.load.image('car', 'assets/shadowcar.png');
        game.load.image('frog', 'assets/frog3.png');
        game.load.image('deadfrog', 'assets/deadfrog.png');
        game.load.image('fly', 'assets/fly.png');
        game.load.image('streets', 'assets/widestreets.png');
    },

    create: function() {
        // When all assets are loaded, go to the 'menu' state
        this.game.state.start('menu');
    }
};