$(document).ready(function() {
  main();
});

function main() {
	setContainerSize();
  var myGrid = new grid();
  $("#play-button").one("click", function() {
    $("#instructions").hide();
		var myGame = new game(myGrid);
    myGame.mainLoop();
  });
}

function play() {
  var myGrid = new grid();
  var myGame = new game(myGrid);
  myGame.mainLoop();
}

function setContainerSize() {
	$container = $("#container");
	$title = $('#title');
	$score = $('#score');
	titleHeight = $title.outerHeight(true);
	console.log(titleHeight);
	if (($(window).height() - titleHeight - $score.outerHeight(true)) >= $(window).width()) {
		$container.css({'width': 'calc(100vw - 10px)'});	

		//$container.width('calc(100% - 5px)');
		$container.height($container.width());
	} else {
		$container.css({'height': 'calc(100vh - ' + titleHeight + 'px - ' + $score.outerHeight(true) + 'px - 10px)'});
		//$container.height('calc(100% - 5px)');
		$container.width($container.height());
	}

	$(window).on('resize', function() {
		if (($(window).height() - $title.outerHeight(true) - $score.outerHeight(true)) >= $(window).width()) {
			$container.css({'width': 'calc(100vw - 10px)'});	
			//$container.width('calc(100% - 5px)');
			$container.height($container.width());
		} else {
			$container.css({'height': 'calc(100vh - ' + $title.outerHeight(true) + 'px - ' + $score.outerHeight(true) + 'px - 10px)'});
			//$container.css({'height': 'calc(100vh - 50px)'});
			//$container.height('calc(100% - 5px)');
			$container.width($container.height());
		}
	});
}


function grid() {
	var num = 40;
	$container = $('#container');
		
  var height = $("#container").height();
  var width = $("#container").width();

  this.cols = num;
  this.rows = num;

  for (var i = 0; i < this.rows; i++) {
    for (var j = 0; j < this.cols; j++) {
      var $square = $("<div id=\"" + j + "_" + i + "\"class=\"square\"></div>");
			$square.width('calc(100% / ' + num + ')').height('calc(100% / ' + num + ')');
      $square.css("background-color", "black");
      $square.appendTo("#container");
    }
  }  
}

function game(myGrid) {
  this.myGrid = myGrid; 
  this.snakeHeadCoord = [Math.floor(this.myGrid.cols/2), Math.floor(this.myGrid.rows/2)];
  this.$snakeHead = $("#" + this.snakeHeadCoord[0] + "_" + this.snakeHeadCoord[1]);
  this.$snakeHead.css({"background-color":"green"});
  this.snake = [this.$snakeHead];
  this.$food;
  this.foodCoord;
  this.direction = 'r';
  this.mainLoop = mainLoop;
  this.placeFood = placeFood;
  this.placeFood();
  this.grow = grow;
  this.endGame = endGame;
  this.length = 1;
  this.incrementScore = incrementScore;
	//this.resize = resize;
}

function endGame() {
  $(".square").css("background-color","black");
  self = this;
  window.clearInterval(loop);
  var thenum = $("#score").text().replace( /^\D+/g, '');
  $("#dialog").html("Game Over<br>Your Score: " + thenum);
  $("#play-button").text("Play Again");
  $("#instructions").show();
  $("#play-button").one("click", function() {
    $("#instructions").hide();
    //var myGrid = new grid();
		var myGame = new game(self.myGrid);
    myGame.mainLoop();
  });

}

function grow() {
  var self = this;
  if (self.snake.length >= 2) {
    var coord0 = self.snake[0].attr('id').split('_');
    var coord1 = self.snake[1].attr('id').split('_');
    var x = coord1[0] - coord0[0];
    var y = coord1[1] - coord0[1];
    if (x == 1) {
      var $tail = $("#" + coord0[0] - 1 + "_" + coord0[1]);
      self.snake.unshift($tail);
      $tail.css("background-color", "green");
    } else if (x == -1) {
      var $tail = $("#" + coord0[0] + 1 + "_" + coord0[1]);
      self.snake.unshift($tail);
      $tail.css("background-color", "green");
    } else if (y == 1) {
      var $tail = $("#" + coord0[0] + "_" + coord0[1] - 1);
      self.snake.unshift($tail);
      $tail.css("background-color", "green");
    } else if (y == -1) {
      var $tail = $("#" + coord0[0] + "_" + coord0[1] + 1);
      self.snake.unshift($tail);
      $tail.css("background-color", "green");
    }
  } else {
    var coord = self.$snakeHead.attr('id').split('_');
    if (self.direction == 'r') {
      var $tail = $("#" + coord[0] - 1 + "_" + coord[1]);
      self.snake.unshift($tail);
      $tail.css("background-color", "green");
    } else if (self.direction == 'l') {
      var $tail = $("#" + coord[0] + 1 + "_" + coord[1]);
      self.snake.unshift($tail);
      $tail.css("background-color", "green");
    } else if (self.direction == 'u') {
      var $tail = $("#" + coord[0] + "_" + coord[1] + 1);
      self.snake.unshift($tail);
      $tail.css("background-color", "green");
    } else if (self.direction == 'd') {
      var $tail = $("#" + coord[0] + "_" + coord[1] - 1);
      self.snake.unshift($tail);
      $tail.css("background-color", "green");
    }
  }
}

function placeFood() {
  var self = this;
  function notEqual(snake) {
    return !(self.$food.is(snake));
  }
  self.foodCoord = [Math.floor(Math.random() * self.myGrid.cols), Math.floor(Math.random() * self.myGrid.rows)];
  self.$food = $("#" + self.foodCoord[0] + "_" + self.foodCoord[1]);

  while (!(self.snake.every(notEqual))) {
    self.foodCoord = [Math.floor(Math.random() * self.myGrid.cols), Math.floor(Math.random() * self.myGrid.rows)];
    self.$food = $("#" + self.foodCoord[0] + "_" + self.foodCoord[1]);

  }
  self.$food.css({"background-color":"red"});

}

function incrementScore() {
  var self = this;
  self.length += 1;
  $("#score").text("Length: " + self.length); 
}

function mainLoop() {
  var self = this;
  var x = self.snakeHeadCoord[0];
  var y = self.snakeHeadCoord[1];
  document.onkeydown = function(e) {
    var code = e.keyCode || e.which;
    if (code == 39) {
      if (self.direction == 'l' && self.snake.length > 1) {
        self.direction = 'l';
      } else {
        self.direction = 'r';
      }
    } else if (code == 38) {
      if (self.direction == 'd' && self.snake.length > 1) {
        self.direction = 'd';
      } else {
        self.direction = 'u';
      }
    } else if (code == 37) {
      if (self.direction == 'r' && self.snake.length > 1) {
        self.direction = 'r';
      } else {
        self.direction = 'l';
      }
    } else if (code == 40) {
      if (self.direction == 'u' && self.snake.length > 1) {
        self.direction = 'u';
      } else {
        self.direction = 'd';
      }
    }
  }

  
  loop = setInterval(function() {
    if (self.$snakeHead.is(self.$food)) {
      self.placeFood();
      self.grow();
      self.incrementScore();
    }
    if (self.direction == 'r') { 
      x++;
    }else if (self.direction == 'u') {
      y--;
    } else if (self.direction == 'd') {
      y++;
    } else if (self.direction == 'l') {
      x--;
    }

    if (x == self.myGrid.cols || x == -1 || y == self.myGrid.rows || y == -1) {
      self.endGame();
      return;
    }
    
    var $head = $("#" + x + "_" + y);
    for (var i = 0; i < self.snake.length; i++) {
      if (self.snake[i].is($head)) {
        self.endGame();
        return;
      }
    }
    self.snake[0].css("background-color", "black");
    self.$snakeHead = $("#" + x + "_" + y);
    self.snake.shift();
    self.snake.push(self.$snakeHead);
    self.$snakeHead.css({"background-color":"green"});
  }, 50);
}


