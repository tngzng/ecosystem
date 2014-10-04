function Game(deerNum, treeNum) {
  this.$world = $('#world');
  // this.tigers = this.createBeings(Tiger, tigerNum);
  this.deer = this.createBeings(Deer, deerNum);
  this.trees = this.createBeings(Tree, treeNum);
  this.interval = setInterval(this.process.bind(this), 50);
  this.score = 0;
}

Game.prototype.process = function() {
  this.score += 1;
  // this.deer.forEach(function(deer) {
  //   deer.move();
  //   deer.roundsSinceLastMeal += 1;
  // })
  this.playRound();
  // this.handleCollisions(treeCollisions);
  // add call to remove starved deer

  if (this.checkGameover()) {
    clearInterval(this.interval);
    alert("Game over! You scored " + this.score + ".");
    $("#score_val").attr("value", this.score.toString());
    $("#score_game").trigger("submit");
  }
}

// Game.prototype.clearDeer = function() {
//   var deers = this.deer;
//   deers.forEach(function(deer) {
//     deer.$html.css('display','none');
//   });
//   deers = [];
// }

Game.prototype.checkGameover = function() {
  debugger;
  return this.trees.length == 0 && this.deer.length == 0;
}

// Game.prototype.handleCollisions = function(collisions) {
//   var trees = this.trees;
//   collisions.forEach(function(collision) {
//     collision.$html.css('display','none');
//     var collisionIndex = trees.indexOf(collision);
//     trees.splice(collisionIndex, 1);
//   });
// }

// good:
// Game.prototype.removeBeing = function(being, beingArray) {
//   var beingArray = this.beingArray;
//   var beingIndex = beingArray.indexOf(being);
//   beingArray.splice(being, 1);
// }

Game.prototype.removeTree = function(tree) {
  var trees = this.trees;
  tree.$html.css('display','none');
  treeIndex = trees.indexOf(collision);
  trees.splice(treeIndex, 1);
}

Game.prototype.removeDeer = function(deer) {
  var allDeer = this.deer;
  deer.$html.css('display','none');
  deerIndex = allDeer.indexOf(deer);
  allDeer.splice(deerIndex, 1);
}

Game.prototype.checkCollision = function(obj1, obj2) {
  debugger;
  var obj1Center = [(obj1.width - obj1.x) + ((obj1.width - obj1.x) / 2), (obj1.height - obj1.y) + ((obj1.height - obj1.y) / 2)];
  var obj2Center = [(obj2.width - obj2.x) + ((obj2.width - obj2.x)/ 2), (obj2.height - obj2.y) + ((obj2.height - obj2.y) / 2) ];
  return (  Math.abs(obj1Center[0] - obj2Center[0]) <= obj1.width / 2 + obj2.width / 2 &&
            Math.abs(obj1Center[1] - obj2Center[1]) <= obj1.height / 2 + obj2.height / 2
         )
}

Game.prototype.playRound = function() {
  var trees = this.trees;
  var game = this;
  this.deer.forEach(function(deer) {
    deer.move();
    deer.roundsSinceLastMeal += 1;
    trees.forEach(function(tree) {
      debugger;
      var collision = game.checkCollision(tree, deer);
      if (collision == true) {
        game.removeTree(tree);
        deer.eat();
      }
    })
    if (deer.starved() == true) {
      game.removeDeer(deer);
    }
  })
}

Game.prototype.createBeings = function(beingClass, beingNum, divName) {
  var beings = []
  for(var i = 0; i < beingNum; i++) {
      beings.push(new beingClass(this.$world, divName));
  }
  return beings;
}

////////////////// Tiger //////////////////

function Tiger($world) {
  this.$world = $world;
  this.$html = $("<div class='tiger'></div>");
  this.$world.append(this.$html);
  this.width = this.$html.width();
  this.height = this.$html.height();
  this.x = Math.floor( Math.random() * ($world.width() - this.$html.width() ) );
  this.y = Math.floor( Math.random() * ($world.height() - this.$html.height() ) );
  this.updatePosition();
}

////////////////// Deer //////////////////

function Deer($world) {
  this.$world = $world;
  this.$html = $("<div class='deer'></div>");
  this.$world.append(this.$html);
  this.width = this.$html.width();
  this.height = this.$html.height();
  this.x = Math.floor( Math.random() * ($world.width() - this.$html.width() ) );
  this.y = Math.floor( Math.random() * ($world.height() - this.$html.height() ) );
  this.updatePosition();
  this.dir = this.setDirection();
  this.speed = 10;
  this.roundsSinceLastMeal = 0;
}

Deer.eat = function() {
  this.roundsSinceLastMeal = 0;
}

Deer.prototype.starved = function() {
  return this.roundsSinceLastMeal >= 100; // where round is 50 milliseconds
}

Deer.prototype.setDirection = function() {
  return Math.floor( Math.random() * 360 + 1 );
}

Deer.prototype.move = function() {
  var oldX = this.x;
  var oldY = this.y;
  // convert degrees to radians
  var xSpeed = Math.cos( (this.dir / 180) * Math.PI ) * this.speed;
  var ySpeed = Math.sin( (this.dir / 180) * Math.PI ) * this.speed;
  this.x += xSpeed;
  this.y += ySpeed;

  if (this.inBounds()) {
    this.updatePosition();
    // change direction slightly for natural movement
    this.dir += (Math.random() * 20 - 10);
  } else {
    this.x = oldX;
    this.y = oldY;
    if (this.dir > 180 ) {
      this.dir -= 180;
    } else {
      this.dir += 180;
    }
  }
}

Deer.prototype.inBounds = function() {
  return (this.x > 0 &&
          this.x < (this.$world.width() - this.$html.width()) &&
          this.y > 0 &&
          this.y < (this.$world.height() - this.$html.height())
         )
}

////////////////// Tree //////////////////

function Tree($world) {
  this.$world = $world;
  this.$html = $("<div class='tree'></div>");
  this.$world.append(this.$html);
  this.width = this.$html.width();
  this.height = this.$html.height();
  this.x = Math.floor( Math.random() * ($world.width() - this.$html.width() ) );
  this.y = Math.floor( Math.random() * ($world.height() - this.$html.height() ) );
  this.updatePosition();
}

Tree.prototype.updatePosition = function() {
  this.$html.css('left', this.x);
  this.$html.css('top', this.y);
}

Tiger.prototype.updatePosition = Tree.prototype.updatePosition;
Deer.prototype.updatePosition = Tree.prototype.updatePosition;
