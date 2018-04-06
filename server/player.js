function Player(id, xPos, yPos) {
  this.speed = 8;
  this.xPos = xPos;
  this.yPos = yPos;
  this.id = id;
  this.pressingLeft = false;
  this.pressingRight = false;
  this.pressingUp = false;
  this.pressingDown = false;

  this.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
  this.score = 0;
}

Player.prototype.tick = function() {
  if(this.pressingLeft)
    this.xPos -= this.speed;
  if(this.pressingRight)
    this.xPos += this.speed;
  if(this.pressingUp)
    this.yPos -= this.speed;
  if(this.pressingDown)
    this.yPos += this.speed;
}

Player.prototype.render = function(context) {

}

module.exports = Player;
