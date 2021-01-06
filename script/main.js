"use strict";


class Paddle
{
	constructor(x, y, width, height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.dy = 0;
		this.Speed = 7;
	}

	moveUp()
	{
		this.dy = -this.Speed;
	}

	moveDown()
	{
		this.dy = this.Speed;
	}

	stop()
	{
		this.dy = 0;
	}

	draw(ctx)
	{
		ctx.fillStyle = "#0ff";
		ctx.fillRect(this.x, this.y, this.width, this.height)
	}

	update(dt)
	{
		this.y += this.dy;
		if (this.y < 0) this.y = 0;
		if (this.y > GAME_HEIGHT - this.height) this.y = GAME_HEIGHT - this.height;
	}
}


class Ball
{
	constructor(x, y, width, height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.dx = 0;
		this.dy = 0;
	}

	collides(paddle)
	{
		if (this.x > paddle.x + paddle.width || paddle.x > this.x + this.width) return false;
		else if (this.y > paddle.y + paddle.height || paddle.y > this.y + this.height) return false; 
		else return true;
	}

	draw(ctx)
	{
		ctx.fillStyle = "#0ff";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	reset()
	{
		this.x = GAME_WIDTH / 2 - 4;
		this.y = GAME_HEIGHT / 2 - 4;
		this.dx = 0;
		this.dy = 0;
	}

	update(dt)
	{
		this.y += this.dy;
		this.x += this.dx;
	}
}


class InputHandler
{
	constructor(paddle)
	{
		document.addEventListener("keydown", event => {
			if (event.key == "ArrowUp")
			{
				paddle.moveUp();
			}
			else if (event.key == "ArrowDown")
			{
				paddle.moveDown();
			}
		});

		document.addEventListener("keyup", event => {
			if (event.key == "ArrowUp")
			{
				paddle.stop();
			}

			else if (event.key == "ArrowDown")
			{
				paddle.stop();
			}

			else if (event.key == "Enter" || event.key == "Return")
			{
	        	if (gameState == "start")
	        	{
	            	gameState = "serve";
	        	}
	        	else if (gameState == "serve")
	        	{
	            	gameState = "play";
	        	}
	        	else if (gameState == "done")
	        	{
	            	gameState = "serve";

	            	ball.reset();

	            	// reset scores to 0
	            	player1Score = 0;
	            	player2Score = 0;

	            	// decide serving player as the opposite of who won
	            	if (winningPlayer == 1)
	            	{
	                	servingPlayer = 2;
	            	}
	            	else
	            	{
	                	servingPlayer = 1;
	            	}
	            }
	        }
		});
	}
}



function load()
{
	player1 = new Paddle(10, 30, 10, 50);
	player2 = new Paddle(GAME_WIDTH - 20, GAME_HEIGHT - 80, 10, 50);
	ball = new Ball(GAME_WIDTH / 2 - 4, GAME_HEIGHT / 2 - 4, 8, 8);

	player1Score = 0;
	player2Score = 0;

	servingPlayer = 1;
	winningPlayer = 0;
	gameState = "start";

}


function displayScore(ctx)
{
    ctx.font = "100px Arial";
    ctx.fillText(player1Score, GAME_WIDTH / 2 - 50, GAME_HEIGHT / 3);
    ctx.fillText(player2Score, GAME_WIDTH / 2 + 30, GAME_HEIGHT / 3);
}


function draw()
{
 	if (gameState == "start")
    {
    	ctx.font = "16px Arial";
        ctx.fillText('Welcome to Pong!', GAME_WIDTH / 2 - 30, 16);
        ctx.fillText('Press Enter to begin!', GAME_WIDTH / 2 -30, 32);
    }
    else if (gameState == "serve")
    {
    	ctx.font = "16px Arial";
        ctx.fillText("Player " + servingPlayer+"'s serve!", GAME_WIDTH / 2 - 30, 16);
        ctx.fillText('Press Enter to serve!', GAME_WIDTH / 2 - 30, 32);
    }
    else if (gameState == "play") {}
    else if (gameState == "done")
    {
        ctx.font = "32px Arial";
        ctx.fillText("Player "+ winningPlayer +" wins!", GAME_WIDTH / 2 - 30, 32);
        ctx.font = "16px Arial";
        ctx.fillText("Press Enter to restart!", GAME_WIDTH / 2 - 30, 64);
    }

    displayScore(ctx);
    
    player1.draw(ctx);
    player2.draw(ctx);
    ball.draw(ctx);
}


function update()
{
	if (gameState == "serve")
	{
		ball.dy = Math.round(Math.random()) ? -1 : 1;
		if (servingPlayer == 1)
		{
			ball.dx = 4;
		}
		else
		{
			ball.dx = -4;
		}
	}

	else if (gameState == "play")
	{
		if (ball.collides(player1))
		{
			ball.dx = -ball.dx * 1.2;
			ball.x = player1.x + 9;
			if (ball.dy < 0)
			{
				ball.dy = Math.random(10, 150);
			}
			else
			{
				ball.dy = -Math.random(10, 150);
			}
		}

		if (ball.collides(player2))
		{
			ball.dx = -ball.dx * 1.2;
			ball.x = player2.x - 4;
			if (ball.dy < 0)
			{
				ball.dy = -Math.random(10, 150);
			}
			else
			{
				ball.dy = Math.random(10, 150);
			}
		}


        if (ball.y <= 0)
        {
            ball.y = 0;
            ball.dy = -ball.dy;
        }

        if (ball.y + 8 >= GAME_HEIGHT)
        {
            ball.y = GAME_HEIGHT - 8;
            ball.dy = -ball.dy;
        }


        if (ball.x < 0)
        {
            servingPlayer = 1;
            player2Score = player2Score + 1;

            if (player2Score == 10)
            {
                winningPlayer = 2;
                gameState = "done";
            }
            else
            {
                gameState = "serve";
                ball.reset();
            }
        }


        if (ball.x + 8 > GAME_WIDTH)
        {
            servingPlayer = 2;
            player1Score = player1Score + 1;

            if (player1Score == 10)
            {
                winningPlayer = 1;
                gameState = "done";
            }
            else
            {
                gameState = "serve";
                ball.reset()
            }
        }
	}

	if (gameState == "play")
	{
		ball.update(deltaTime);
	}

	player1.update(deltaTime);
	player2.update(deltaTime);
}


function AutoPlay(paddle, ball)
{
	if (ball.y < paddle.y && ball.dx > 0)
	{
	    paddle.moveUp();
	}
	else if (ball.y > paddle.y + 20 && ball.dx > 0)
	{
	    paddle.moveDown();
	}
	else
	{
	    paddle.dy = 0;
	}
}



let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

let player1, player2, ball, player1Score, player2Score;
let servingPlayer, winningPlayer, gameState;

load();

new InputHandler(player1);

let deltaTime;
let lastTime = 0;
function gameLoop(timestamp)
{
	deltaTime = timestamp - lastTime;
	lastTime = timestamp;

	ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

	AutoPlay(player2, ball);
	update();
	draw();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);