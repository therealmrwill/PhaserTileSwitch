
var config = {
    type: Phaser.AUTO,
    width: 2048,
    height: 2048,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
};

const game = new Phaser.Game(config);
const startTime =  Date.now();
var elapsedTime = 0;

//Scoring
var lightScore = 0;
var darkScore = 0;
var tileData = [];

var lightColor = 0xf5edba;
var darkColor = 0x17434b;


var universalSpeedModifier = 2000;


function preload ()
{
    this.load.image('ball', '/assets/circle.png');
    this.load.image('tile', '/assets/circle.png');

    //Adding various functionality options
    document.addEventListener('pause-game', (e) => {
        this.scene.pause();
    })
    
    document.addEventListener('play-game', (e) => {
        this.scene.resume();
    })

    document.addEventListener('restart', (e) => {
        //Todo: Will eventually need to actually implement this
    })
}




function create(){
    var balls = this.physics.add.group();
    var tiles = this.physics.add.staticGroup();


    //Tile Setup
    createTiles(tiles, (x, y) => false, []);
    // (x + y) > 32
    //(x < 128 && y < 128) || (x > 128 && y > 128)

    //Ball Setup
    var ballInfoArray = [];


    for(let i = 5; i < 360; i += 10){
        ballInfoArray.push(getBallInfo(64, 64, i, 1, 'light'))
    }

    // ballInfoArray.push(getBallInfo(16, 16, 240, 1, 'dark'))
    
    // ballInfoArray.push(getBallInfo(32, 32, 55, 1, 'dark'))
    // ballInfoArray.push(getBallInfo(32, 32, 95, 1, 'dark'))
    // ballInfoArray.push(getBallInfo(32, 32, 185, 1, 'dark'))
    // ballInfoArray.push(getBallInfo(32, 32, 285, 1, 'dark'))

    createBalls(balls, ballInfoArray);

    //Physics Setup
    this.physics.add.overlap(balls, tiles, handleCollision, null, this);

    //Pauses scene after initialization
    // this.scene.pause();
}



//Adding event listeners


function handleCollision(ball, tile){

    //If the ball and the tile do not match we can ignore it
    if((ball.dark && !tile.dark) || (!ball.dark && tile.dark)){
        ball.safe += 1;
        return;
    } 

    if(ball.safe > -1){

        ball.setVelocityX(-ball.body.velocity.x);
        ball.setVelocityY(-ball.body.velocity.y);

        flipTile(tile);
    }
    
    ball.safe = 0;
}





function flipTile(tile){

    //Gives a tile a 'flip cooldown' 
    if(elapsedTime - tile.lastFlip < 50) return;
    tile.lastFlip = elapsedTime;


    if(tile.dark){
        tile.setTint(lightColor);
        this.darkScore--;
        this.lightScore++;
    }
    else{
        tile.setTint(darkColor)
        this.lightScore--;
        this.darkScore++;
        
    }
    
    tile.dark = !tile.dark;

    if(tile.watched){

    }

    const evt = new CustomEvent("score-change", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
            darkScore: this.darkScore,
            lightScore: this.lightScore,
        },
    });
    document.dispatchEvent(evt);

}



function getBallInfo(x, y, direction, speed, theme){
    var numDirection;

    const buffer = {
        x: (config.width % 16) / 2,
        y: (config.height % 16) / 2
    }

    const diameter = 16;


    var radians = direction / (180 / Math.PI)
    numDirection = {
        x: Math.cos(radians),
        y: Math.sin(radians)
    }

    return {
        position: {
            x: buffer.x + (x * diameter),
            y: buffer.y + (y * diameter),
        },
        direction: numDirection,
        speed: speed,
        theme: theme
    }
}


function createBalls(physicsObj, info){
    info.forEach(ball => {
        const {position: pos, direction: dir, speed: speed, theme: theme} = ball

        const newDirection = {
            x: dir.x * speed,
            y: dir.y * speed
        }

        createBall(physicsObj, pos, newDirection, theme);
    });
}

function createBall(balls, pos, dir, theme){
    var newBall = balls.create(pos.x + 8, pos.y + 8, 'ball');
    newBall.body.setCircle(newBall.width / 2);
    
    //Collision shenanigans
    newBall.safe = 2;
    
    if(theme == 'light'){
        newBall.setTint(lightColor);
        newBall.dark = false;
    }
    else{
        newBall.setTint(darkColor);
        newBall.dark = true;
    }

    newBall.setVelocity(dir.x * universalSpeedModifier, dir.y * universalSpeedModifier);
    newBall.setBounce(1, 1);
    newBall.setCollideWorldBounds(true);
    return newBall;
}

function createTiles(physicsObj, pattern, watchedTiles){
    //Needs to figure out height and width of our container 
    const buffer = {
        x: (config.width % 16) / 2,
        y: (config.height % 16) / 2
    }

    const max = {
        x: Math.floor(config.width / 16),
        y: Math.floor(config.height / 16),
    }

    const diameter = 16;

    for(let x = 0; x < max.x; x++){
        for(let y = 0; y < max.y; y++){
            var pos = {
                x: buffer.x + (diameter * x),
                y: buffer.y + (diameter * y),
            }

            var theme = pattern(x, y) ? 'light' : "dark";

            //Iterates over the watchTiles list until it finds a match 
            //GPT code so idk how much I trust it tbh
            var watched = watchedTiles.some(function(obj) {
                return obj.x === x && obj.y === y;
            })

            createTile(physicsObj, pos, theme, watched);

        }
    }

}


function createTile(tiles, pos, theme, watched){
    var tile = tiles.create(pos.x + 8, pos.y + 8, 'tile');
    tile.watched = watched;

    this.tileData.push({id: this.tileData.length - 1,pos: pos, theme: theme});


    if(theme == 'light'){
        tile.setTint(lightColor);
        tile.dark = false;
        this.lightScore++;
    }
    else{
        tile.setTint(darkColor);
        tile.dark = true;
        this.darkScore++;
    }

    return tile;
}



function update(){
    elapsedTime = Date.now() - startTime;
}