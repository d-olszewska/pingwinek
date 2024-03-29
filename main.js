// Start enchant.js
enchant();
 
window.onload = function() {
    // Starting point
    var game = new Game(320, 440);
    game.preload('BG.png',
				 'BG2.png',
				 'anchor.png',
                 'penguinSheet.png',
				 'fishSheet.png',
                 'Ice.png',
                 'Hit.mp3',
				 'Eat.mp3',
				 'applause.mp3',
                 'bgm.mp3');
    game.fps = 30;
    game.scale = 1.4;
    game.onload = function() {
        // Once Game finish loading
        console.log("Witaj, Oceanie!");
       

		var pad = new Pad();
        pad.x = 0;
        pad.y = 224;
		var scene = new SceneStart;
		scene.addChild(pad);
		game.pushScene(scene);
    }
    window.scrollTo(0,0);
    game.start();   
};



/**
 * SceneGameFirstLevel  
 */
var SceneGameFirstLevel = Class.create(Scene, {
    /**
     * The main gameplay scene.     
     */
    initialize: function() {
        var game, label, bg, penguin, fishGroup, anchorGroup;
 
        // Call superclass constructor
        Scene.apply(this);
 
        // Access to the game singleton instance
        game = Game.instance;
 
        label = new Label('WYNIK<br>0');
        label.x = 9;
        label.y = 32;        
        label.color = 'white';
        label.font = '16px strong';
        label.textAlign = 'center';
        label._style.textShadow ="-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black";
        this.scoreLabel = label;        
 
        bg = new Sprite(320,440);
        bg.image = game.assets['BG2.png'];

        penguin = new Penguin();
        penguin.x = game.width/2 - penguin.width/2;
        penguin.y = 280;
        this.penguin = penguin;
		
		this.addEventListener('enterframe', function() {
			if (game.input.left) {
				this.penguin.x-=20;
			}
			
			if (game.input.right) {
				this.penguin.x+=20;
			}
			if (game.input.up) {
				this.penguin.y-=10;
			}
			if (game.input.down) {
				this.penguin.y+=10;
			}
		});

        fishGroup = new Group();
        this.fishGroup = fishGroup;
		
		anchorGroup = new Group();
        this.anchorGroup = anchorGroup;
 
        this.addChild(bg);
        this.addChild(fishGroup);
		this.addChild(anchorGroup);
        this.addChild(penguin);
        this.addChild(label);


        this.addEventListener(Event.ENTER_FRAME,this.update);
		
        // Instance variables
        this.generateFishTimer = 0;
		this.generateAnchorTimer = 0;
        this.scoreTimer = 0;
        this.score = 0;

        this.bgm = game.assets['bgm.mp3']; // Add this line
 
        // Start BGM
        this.bgm.play();
    },

    handleTouchControl: function (evt) {
        var laneWidth, lane;
        laneWidth = 320/3;
        lane = Math.floor(evt.x/laneWidth);
        lane = Math.max(Math.min(2,lane),0);
        this.penguin.switchToLaneNumber(lane);
    },

    update: function(evt) {
        

        // Check if it's time to create a new set of obstacles
		
        this.generateFishTimer += evt.elapsed * 0.001;
        if(this.generateFishTimer >= 0.5)
        {
            var fish;
            this.generateFishTimer -= 0.5;
            fish = new Fish(Math.floor(Math.random()*3));
            this.fishGroup.addChild(fish);
        }
		
		this.generateAnchorTimer += evt.elapsed * 0.001;
		if(this.generateAnchorTimer >= 0.5)
        {
            var anchor;
            this.generateAnchorTimer -= 0.5;
            anchor = new Anchor(Math.floor(Math.random()*3));
            this.anchorGroup.addChild(anchor);
        }

        // Check eaten
        for (var i = this.fishGroup.childNodes.length - 1; i >= 0; i--) {
            var fish;
            fish = this.fishGroup.childNodes[i];
            if(fish.intersect(this.penguin)){  
                var game;
                game = Game.instance;
                game.assets['Eat.mp3'].play();                    
                this.fishGroup.removeChild(fish);
                this.setScore(this.score + 1);
                
            }
        }
		
		// Check collision
        for (var i = this.anchorGroup.childNodes.length - 1; i >= 0; i--) {
            var anchor;
            anchor = this.anchorGroup.childNodes[i];
            if(anchor.intersect(this.penguin)){  
                var game;
                game = Game.instance;
                game.assets['Hit.mp3'].play();                    
                this.anchorGroup.removeChild(anchor);
                this.bgm.stop();
                game.replaceScene(new SceneGameOver(this.score));        
                break;
            }
        }

		
		if (this.score > 10){
			game.replaceScene(new SceneGameBreak(this.score)); 
			game.assets['applause.mp3'].play();
			
		}

        // Loop BGM
        if( this.bgm.currentTime >= this.bgm.duration ){
            this.bgm.play();
        }
    },

    setScore: function (value) {
        this.score = value;
        this.scoreLabel.text = 'WYNIK<br>' + this.score;
    }
});






/**
 * SceneGameSecondLevel  
 */
var SceneGameSecondLevel = Class.create(Scene, {
    /**
     * The main gameplay scene.     
     */
	    initialize: function() {
        var game, label, bg, penguin, fishGroup, iceGroup;
 
        // Call superclass constructor
        Scene.apply(this);
 
        // Access to the game singleton instance
        game = Game.instance;
 
        label = new Label('WYNIK<br>0');
        label.x = 9;
        label.y = 32;        
        label.color = 'white';
        label.font = '16px strong';
        label.textAlign = 'center';
        label._style.textShadow ="-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black";
        this.scoreLabel = label;        
 
        bg = new Sprite(320,440);
        bg.image = game.assets['BG.png'];

        penguin = new Penguin();
        penguin.x = game.width/2 - penguin.width/2;
        penguin.y = 280;
        this.penguin = penguin;
		
		this.addEventListener('enterframe', function() {
			if (game.input.left) {
				this.penguin.x-=20;
			}
			
			if (game.input.right) {
				this.penguin.x+=20;
			}
			if (game.input.up) {
				this.penguin.y-=10;
			}
			if (game.input.down) {
				this.penguin.y+=10;
			}
		});

        fishGroup = new Group();
        this.fishGroup = fishGroup;
		
		iceGroup = new Group();
        this.iceGroup = iceGroup;
 
        this.addChild(bg);
        this.addChild(fishGroup);
		this.addChild(iceGroup);
        this.addChild(penguin);
        this.addChild(label);

        this.addEventListener(Event.ENTER_FRAME,this.update);
		
        // Instance variables
        this.generateFishTimer = 0;
		this.generateIceTimer = 0;
        this.scoreTimer = 0;
        this.score = 0;

        this.bgm = game.assets['bgm.mp3']; // Add this line
 
        // Start BGM
        this.bgm.play();
    },

    handleTouchControl: function (evt) {
        var laneWidth, lane;
        laneWidth = 320/3;
        lane = Math.floor(evt.x/laneWidth);
        lane = Math.max(Math.min(2,lane),0);
        this.penguin.switchToLaneNumber(lane);
    },

    update: function(evt) {
        

        // Check if it's time to create a new set of obstacles
		
        this.generateFishTimer += evt.elapsed * 0.001;
        if(this.generateFishTimer >= 0.5)
        {
            var fish;
            this.generateFishTimer -= 0.5;
            fish = new Fish(Math.floor(Math.random()*3));
            this.fishGroup.addChild(fish);
        }
		
		this.generateIceTimer += evt.elapsed * 0.001;
		if(this.generateIceTimer >= 0.5)
        {
            var ice;
            this.generateIceTimer -= 0.5;
            ice = new Ice(Math.floor(Math.random()*3));
            this.iceGroup.addChild(ice);
        }

        // Check eaten
        for (var i = this.fishGroup.childNodes.length - 1; i >= 0; i--) {
            var fish;
            fish = this.fishGroup.childNodes[i];
            if(fish.intersect(this.penguin)){  
                var game;
                game = Game.instance;
                game.assets['Eat.mp3'].play();                    
                this.fishGroup.removeChild(fish);
                this.setScore(this.score + 1);
                
            }
        }
		
		// Check collision
        for (var i = this.iceGroup.childNodes.length - 1; i >= 0; i--) {
            var ice;
            ice = this.iceGroup.childNodes[i];
            if(ice.intersect(this.penguin)){  
                var game;
                game = Game.instance;
                game.assets['Hit.mp3'].play();                    
                this.iceGroup.removeChild(ice);
                this.bgm.stop();
                game.replaceScene(new SceneGameOver(this.score));        
                break;
            }
        }

		
		if (this.score > 10){
			game.replaceScene(new SceneGameWinner(this.score)); 
			game.assets['applause.mp3'].play();
			
		}

        // Loop BGM
        if( this.bgm.currentTime >= this.bgm.duration ){
            this.bgm.play();
        }
    },

    setScore: function (value) {
        this.score = value;
        this.scoreLabel.text = 'WYNIK<br>' + this.score;
    }
 
 
 
});

/**
 * Penguin
 */
 var Penguin = Class.create(Sprite, {
    /**
     * The player character.     
     */
    initialize: function() {
        // Call superclass constructor
        Sprite.apply(this,[30, 43]);
        this.image = Game.instance.assets['penguinSheet.png'];        
        this.animationDuration = 0;
        this.addEventListener(Event.ENTER_FRAME, this.updateAnimation);

    },

    updateAnimation: function (evt) {        
        this.animationDuration += evt.elapsed * 0.001;       
        if(this.animationDuration >= 0.25)
        {
            this.frame = (this.frame + 1) % 2;
            this.animationDuration -= 0.25;
        }
    },

    switchToLaneNumber: function(lane){     
        var targetX = 160 - this.width/2 + (lane-1)*90;
        this.x = targetX;
    }
});

 /**
 * Ice Cube
 */
var Ice = Class.create(Sprite, {
    /**
     * The obstacle that the penguin must avoid
     */
    initialize: function(lane) {
        // Call superclass constructor
        Sprite.apply(this,[48, 49]);
        this.image  = Game.instance.assets['Ice.png'];      
        this.rotationSpeed = 0;
        this.setLane(lane);
        this.addEventListener(Event.ENTER_FRAME, this.update);
    },

    setLane: function(lane) {
        var game, distance;
        game = Game.instance;        
        distance = 90;
     
        this.rotationSpeed = Math.random() * 100 - 50;
     
        this.x = game.width/2 - this.width/2 + (lane - 1) * distance;
        this.y = -this.height;    
        this.rotation = Math.floor( Math.random() * 360 );    
    },

    update: function(evt) { 
        var ySpeed, game;
     
        game = Game.instance;
        ySpeed = 250;
     
        this.y += ySpeed * evt.elapsed * 0.001;
        this.rotation += this.rotationSpeed * evt.elapsed * 0.001;           
        if(this.y > game.height)
        {
            this.parentNode.removeChild(this);          
        }
    }
});



 /**
 * Anchor
 */
var Anchor = Class.create(Sprite, {
    /**
     * The obstacle that the penguin must avoid
     */
    initialize: function(lane) {
        // Call superclass constructor
        Sprite.apply(this,[29, 35]);
        this.image  = Game.instance.assets['anchor.png'];      
        this.rotationSpeed = 0;
        this.setLane(lane);
        this.addEventListener(Event.ENTER_FRAME, this.update);
    },

    setLane: function(lane) {
        var game, distance;
        game = Game.instance;        
        distance = 90;
     
        this.rotationSpeed = Math.random() * 100 - 50;
     
        this.x = game.width/2 - this.width/2 + (lane - 1) * distance;
        this.y = -this.height;    
        this.rotation = Math.floor( Math.random() * 360 );    
    },

    update: function(evt) { 
        var ySpeed, game;
     
        game = Game.instance;
        ySpeed = 250;
     
        this.y += ySpeed * evt.elapsed * 0.001;
        this.rotation += this.rotationSpeed * evt.elapsed * 0.001;           
        if(this.y > game.height)
        {
            this.parentNode.removeChild(this);          
        }
    }
});



/**
 * Fish
 */
var Fish = Class.create(Sprite, {
    /**
     * The obstacle that the penguin must avoid
     */
    initialize: function(lane) {
        // Call superclass constructor
        Sprite.apply(this,[31, 34]);
        this.image  = Game.instance.assets['fishSheet.png'];      
        this.rotationSpeed = 0;
        this.setLane(lane);
        this.addEventListener(Event.ENTER_FRAME, this.update);
		
		this.animationDuration = 0;
        this.addEventListener(Event.ENTER_FRAME, this.updateAnimation);

    },

    updateAnimation: function (evt) {        
        this.animationDuration += evt.elapsed * 0.001;       
        if(this.animationDuration >= 0.25)
        {
            this.frame = (this.frame + 1) % 2;
            this.animationDuration -= 0.25;
        }
    },

    setLane: function(lane) {
        var game, distance;
        game = Game.instance;        
        distance = 90;
     
        this.rotationSpeed = Math.random() * 100 - 50;
     
        this.x = game.width/2 - this.width/2 + (lane - 1) * distance;
        this.y = -this.height;    
          
    },

    update: function(evt) { 
        var ySpeed, game;
     
        game = Game.instance;
        ySpeed = 150;
     
        this.y += ySpeed * evt.elapsed * 0.001;
       
        if(this.y > game.height)
        {
            this.parentNode.removeChild(this);          
        }
    }
});

 /**
 * Ice Cube
 */
var Ice = Class.create(Sprite, {
    /**
     * The obstacle that the penguin must avoid
     */
    initialize: function(lane) {
        // Call superclass constructor
        Sprite.apply(this,[48, 49]);
        this.image  = Game.instance.assets['Ice.png'];      
        this.rotationSpeed = 0;
        this.setLane(lane);
        this.addEventListener(Event.ENTER_FRAME, this.update);
    },

    setLane: function(lane) {
        var game, distance;
        game = Game.instance;        
        distance = 90;
     
        this.rotationSpeed = Math.random() * 100 - 50;
     
        this.x = game.width/2 - this.width/2 + (lane - 1) * distance;
        this.y = -this.height;    
        this.rotation = Math.floor( Math.random() * 360 );    
    },

    update: function(evt) { 
        var ySpeed, game;
     
        game = Game.instance;
        ySpeed = 300;
     
        this.y += ySpeed * evt.elapsed * 0.001;
        this.rotation += this.rotationSpeed * evt.elapsed * 0.001;           
        if(this.y > game.height)
        {
            this.parentNode.removeChild(this);          
        }
    }
});


/**
 * SceneGameStart
 */
var SceneStart= Class.create(Scene, {
    initialize: function(score) {
        var startLabel;
        Scene.apply(this);
        this.backgroundColor = 'black';

        startLabel = new Label("Naciśnij<br><br>START");
        startLabel.x = 8;
        startLabel.y = 128;
        startLabel.color = 'white';
        startLabel.font = '32px strong';
        startLabel.textAlign = 'center';


        this.addChild(startLabel);

        this.addEventListener(Event.TOUCH_START, this.touchToRestart);


    },

    touchToRestart: function(evt) {
        var game = Game.instance;
		
		var pad = new Pad();
        pad.x = 0;
        pad.y = 324;
		var scene = new SceneGameFirstLevel;
		scene.addChild(pad);
		game.pushScene(scene);
		
    }
});



/**
 * SceneGameBreak
 */
var SceneGameBreak= Class.create(Scene, {
    initialize: function(score) {
        var startLabel;
        Scene.apply(this);
        this.backgroundColor = 'black';

        startLabel = new Label("Poziom 2<br><br>START");
        startLabel.x = 8;
        startLabel.y = 128;
        startLabel.color = 'white';
        startLabel.font = '32px strong';
        startLabel.textAlign = 'center';

        this.addChild(startLabel);
        this.addEventListener(Event.TOUCH_START, this.touchToRestart);
    },

    touchToRestart: function(evt) {
        var game = Game.instance;

		var pad = new Pad();
        pad.x = 0;
        pad.y = 324;
		var scene = new SceneGameSecondLevel;
		scene.addChild(pad);
		game.pushScene(scene);
    }
});




/**
 * SceneGameOver  
 */
var SceneGameOver = Class.create(Scene, {
    initialize: function(score) {
        var gameOverLabel, scoreLabel;
        Scene.apply(this);
        this.backgroundColor = 'black';

        gameOverLabel = new Label("KONIEC GRY<br><br>Spróbuj ponownie");
        gameOverLabel.x = 8;
        gameOverLabel.y = 128;
        gameOverLabel.color = 'white';
        gameOverLabel.font = '32px strong';
        gameOverLabel.textAlign = 'center';

        scoreLabel = new Label('WYNIK<br>' + score);
        scoreLabel.x = 9;
        scoreLabel.y = 32;        
        scoreLabel.color = 'white';
        scoreLabel.font = '16px strong';
        scoreLabel.textAlign = 'center';

        this.addChild(gameOverLabel);
        this.addChild(scoreLabel);

        this.addEventListener(Event.TOUCH_START, this.touchToRestart);


    },

    touchToRestart: function(evt) {
        var game = Game.instance;
		var pad = new Pad();
        pad.x = 0;
        pad.y = 324;
		var scene = new SceneGameFirstLevel;
		scene.addChild(pad);
		game.pushScene(scene);
    }
});


/**
 * SceneGameWinner  
 */
var SceneGameWinner = Class.create(Scene, {
    initialize: function(score) {
        var gameOverLabel, scoreLabel;
        Scene.apply(this);
        this.backgroundColor = 'black';

        gameOverLabel = new Label("Wygrałeś!!!<br><br>Spróbuj ponownie");
        gameOverLabel.x = 8;
        gameOverLabel.y = 128;
        gameOverLabel.color = 'white';
        gameOverLabel.font = '32px strong';
        gameOverLabel.textAlign = 'center';

        scoreLabel = new Label('WYNIK<br>' + score);
        scoreLabel.x = 9;
        scoreLabel.y = 32;        
        scoreLabel.color = 'white';
        scoreLabel.font = '16px strong';
        scoreLabel.textAlign = 'center';

        this.addChild(gameOverLabel);
        this.addChild(scoreLabel);

        this.addEventListener(Event.TOUCH_START, this.touchToRestart);


    },

    touchToRestart: function(evt) {
        var game = Game.instance;
        var pad = new Pad();
        pad.x = 0;
        pad.y = 324;
		var scene = new SceneGameFirstLevel;
		scene.addChild(pad);
		game.pushScene(scene);
    }
});