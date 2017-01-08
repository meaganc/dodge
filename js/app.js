// Enemies our player must avoid

// https://gist.github.com/kerimdzhanov/7529623
// Get a random number within a range
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

var Enemy = function() {
    // The image/sprite for enemies, randomized starting location and speed
    this.sprite = 'images/enemy-bug.png';
    this.x = getRandom(-200, -500);
    this.y = getRandom(50, 240);
    this.speed = getRandom(125, 250);
};

// Update the enemy's positio
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // Update the enemy location
  this.x = (this.x + (this.speed * dt));
  if (player) {
    // Determine if the enemy and player are in contact
    if ((Math.abs(this.x - player.x) < 50) && (Math.abs(this.y - player.y) < 50)){
      player.reset()
      // Subtract a point unless the player would have a negative score
      if (player.score > 0){
        player.score--;
      }
      rock.flash();
    }
  }

  // Reset the position of the Enemy once it crosses the screen for another round of attack
  if (this.x > 550){
    this.x = getRandom(-200, -500);
    this.y = getRandom(50, 240);
    this.speed = getRandom(125, 250);
  }
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// The player class has an update(), render() and
// a handleInput() method.
var Player = function(){
  this.sprite = 'images/char-princess-girl.png';
  this.x = 200;
  this.y = 400;
  this.score = 0;
}

// Move player back to starting position
Player.prototype.reset = function(){
  this.x = 200;
  this.y = 400;
}

Player.prototype.update = function(){
  //Display the players score
  ctx.clearRect(0,0, canvas.width, 150);
  ctx.font="40px Arial";
  ctx.fillText('Score: ' + this.score, 175,45);

  // If the player reaches the river, increment score, show Heart
  if (this.y < 0) {
    this.score++;
    heart.flash();
    this.reset();
  }

  if ((Math.abs(this.x - gem.x) < 50) && (Math.abs(this.y - gem.y) < 50)){
    gem.reset();
    this.score = this.score + getRandom(5, 15);
    //bonus for collecting the gem
  }
}

Player.prototype.handleInput = function(keycode){
  // Unless the player will leave the game boundaries, move according to key input
  if (keycode === 'left' && (this.x > 0)){
    this.x = this.x - 25;
  } else if (keycode === 'up'){
    this.y = this.y - 25;
  } else if (keycode === 'right' && (this.x < 400)){
    this.x = this.x + 25;
  } else if (keycode === 'down' && (this.y < 425)){
    this.y = this.y + 25;
  }
}

//Render the player
Player.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//Create a default flash type for all items that briefly appear on the screen
var FlashItem = function(){
  this.x = -100;
  this.y = -100;
}

//Show flash item for 500 milliseconds on the middle of the screen, both Gem and Heart will use this
FlashItem.prototype.flash = function(){
  this.x = 200;
  this.y = 200;
  window.setTimeout(this.reset.bind(this), 500);
}

// Once the item has shown on the page, hide it again
FlashItem.prototype.reset = function(){
  this.x = -100;
  this.y = -100;
}

// Render the default flash item
FlashItem.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Set custom attributes for the Gem item
var Gem = function(){
  FlashItem.call(this);
  this.sprite = 'images/Gem Blue.png'
  this.clock = 0;
  this.counter = getRandom(1000, 100000);
}

Gem.prototype = Object.create(FlashItem.prototype);

// When the clock meets the randomly determined counter time, show the Gem
Gem.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  this.clock++
  if (this.clock === this.counter) {
    this.randomAppearance();
  }
}

// Show the gem and then hide after 500 milliseconds
Gem.prototype.randomAppearance = function(){
  this.x = 200;
  this.y = 150;
  window.setTimeout(this.reset.bind(this), 500);
}

// Create the Rock, a FlashItem that appears when enemies crash into the Player
var Rock = function(){
  FlashItem.call(this);
  this.sprite = 'images/Rock.png';
}

Rock.prototype =  Object.create(FlashItem.prototype);

//Create the Heart, a FlashItem that appears when the Player crosses to the river
var Heart = function(){
  FlashItem.call(this);
  this.sprite = 'images/Heart.png'
}

Heart.prototype =  Object.create(FlashItem.prototype);

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()];

var player = new Player();
var gem = new Gem();
var heart = new Heart();
var rock = new Rock();

// This listens for key presses and sends the keys to
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
