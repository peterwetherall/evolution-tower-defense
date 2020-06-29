//Monster class
class Monster {
	//This function is run whenever a new Monster object is created
	constructor (i, a, b) {
		this.id = i; //Used to update monsterStats array
		this.scale = scale; //Store window scale into atrribute
		if (map == window.maps.one) {
			this.x = 5 * scale; //Set default x-position
			this.y = -this.scale - (this.scale * this.id); //Set default y-position
			this.v = {x: 0, y: (this.scale / 80) + ((this.scale / 5) * a)}; //Set speed of the monster
			this.dir = 0; //Set direction of monster
		} else if (map == window.maps.two) {
			this.x = -this.scale - (this.scale * this.id); //Set default x-position
			this.y = 25 * this.scale; //Set default y-position
			this.v = {x: (this.scale / 80) + ((this.scale / 5) * a), y: 0}; //Set speed of the monster
			this.dir = 1; //Set direction of monster
		} else if (map == window.maps.three) {
			this.x = -this.scale - (this.scale * this.id); //Set default x-position
			this.y = 5 * this.scale; //Set default y-position
			this.v = {x: (this.scale / 80) + ((this.scale / 5) * a), y: 0}; //Set speed of the monster
			this.dir = 1; //Set direction of monster
		} else if (map == window.maps.four) {
			this.x = 20 * this.scale; //Set default x-position
			this.y = -this.scale - (this.scale * this.id); //Set default y-position
			this.v = {x: 0, y: (this.scale / 80) + ((this.scale / 5) * a)}; //Set speed of the monster
			this.dir = 0; //Set direction of monster
		}
		this.map = 0; //Set map to original
		this.health = Math.round((1 - a) * 145 + 5); //Set health of the monster
		this.slowed = 0; //If the monster has been slowed by an ice tower
		//Determine if the bug should be special (i.e. blue or yellow)
		let r = Math.random(); //Generate a random number between 0 and 1
		this.type = "red"; //Default to red bug
		if (wave > 9 && r < 0.05) { //If the random number is below 0.05 (5%)
			this.type = "yellow"; //Yellow bug
			this.v.y = this.v.y * 3; //Increase the monster's speed by a factor of 3
		} else if (r >= 0.05 && r < 0.1 && wave > 19) { //If the random number is above 0.05 and below 0.1 (5%)
			this.type = "blue"; //Blue bug
			this.health = Math.round(this.health * 15); //Increase the monster's health by a factor of 15
		}
	}
	//Draw the monster onto the canvas
	draw () {
		let monsterImage = new Image(); //Create new image element
		monsterImage.src = "./images/bug/" + this.type + "-" + this.dir + ".png"; //Select the bug image
		ctx.drawImage(monsterImage, this.x - (scale * 1.5 / 2), this.y - (scale * 1.5 / 2), scale * 1.5, scale * 1.5);
	}
	move () {
		if (this.slowed > 0) {
			this.x += 0.5 * this.v.x;
			this.y += 0.5 * this.v.y;
			this.slowed--;
		} else {
			this.x += this.v.x;
			this.y += this.v.y;
		}
		//Path-find according to map
		if (map == window.maps.one) {
			switch (this.map) {
				case 0:
					if (this.y > this.scale * 25) {
						this.y = this.scale * 25;
						this.v.x = this.v.y;
						this.v.y = 0;
						this.map++;
						this.dir = 1;
					}
					break;
				case 1:
					if (this.x > this.scale * 15) {
						this.x = this.scale * 15;
						this.v.y = -this.v.x;
						this.v.x = 0;
						this.map++;
						this.dir = 2;
					}
					break;
				case 2:
					if (this.y < this.scale * 15) {
						this.y = this.scale * 15;
						this.v.x = -this.v.y;
						this.v.y = 0;
						this.map++;
						this.dir = 1;
					}
					break;
				case 3:
					if (this.x > this.scale * 35) {
						this.x = this.scale * 35;
						this.v.y = -this.v.x;
						this.v.x = 0;
						this.map++;
						this.dir = 2;
					}
					break;
				case 4:
					if (this.y < this.scale * 5) {
						this.y = this.scale * 5;
						this.v.x = this.v.y;
						this.v.y = 0;
						this.map++;
						this.dir = 3;
					}
					break;
				case 5:
					if (this.x < this.scale * 25) {
						this.x = this.scale * 25;
						this.v.y = -this.v.x;
						this.v.x = 0;
						this.map++;
						this.dir = 0;
					}
					break;
				case 6:
					if (this.y > this.scale * 25) {
						this.y = this.scale * 25;
						this.v.x = this.v.y;
						this.v.y = 0;
						this.map++;
						this.dir = 1;
					}
					break;
				case 7:
					if (this.x > this.scale * 41) {
						this.kill();
						health--;
						if (health > 0) {
							document.getElementById("health-display").src = "./images/health/" + health + ".png";
						} else {
							document.getElementById("health-display").src = "./images/health/" + health + ".png";
							gameOver();
						}
						this.map++;
					}
					break;
			}
		} else if (map == window.maps.two) {
			switch (this.map) {
				case 0:
					if (this.x > this.scale * 5) {
						this.x = this.scale * 5;
						this.v.y = -this.v.x;
						this.v.x = 0;
						this.map++;
						this.dir = 2;
					}
					break;
				case 1:
					if (this.y < this.scale * 5) {
						this.y = this.scale * 5;
						this.v.x = -this.v.y;
						this.v.y = 0;
						this.map++;
						this.dir = 1;
					}
					break;
				case 2:
					if (this.x > this.scale * 18) {
						this.x = this.scale * 18;
						this.v.y = this.v.x;
						this.v.x = 0;
						this.map++;
						this.dir = 0;
					}
					break;
				case 3:
					if (this.y > this.scale * 25) {
						this.y = this.scale * 25;
						this.v.x = this.v.y;
						this.v.y = 0;
						this.map++;
						this.dir = 1;
					}
					break;
				case 4:
					if (this.x > this.scale * 31) {
						this.x = this.scale * 31;
						this.v.y = -this.v.x;
						this.v.x = 0;
						this.map++;
						this.dir = 2;
					}
					break;
				case 5:
					if (this.y < this.scale * 5) {
						this.y = this.scale * 5;
						this.v.x = -this.v.y;
						this.v.y = 0;
						this.map++;
						this.dir = 1;
					}
					break;
				case 6:
					if (this.x > this.scale * 41) {
						this.kill();
						health--;
						if (health > 0) {
							document.getElementById("health-display").src = "./images/health/" + health + ".png";
						} else {
							document.getElementById("health-display").src = "./images/health/" + health + ".png";
							gameOver();
						}
						this.map++;
					}
					break;
			}
		} else if (map == window.maps.three) {
			switch (this.map) {
				case 0:
					if (this.x > this.scale * 30) {
						this.x = this.scale * 30;
						this.v.y = this.v.x;
						this.v.x = 0;
						this.map++;
						this.dir = 0;
					}
					break;
				case 1:
					if (this.y > this.scale * 15) {
						this.y = this.scale * 15;
						this.v.x = -this.v.y;
						this.v.y = 0;
						this.map++;
						this.dir = 3;
					}
					break;
				case 2:
					if (this.x < this.scale * 13) {
						this.x = this.scale * 13;
						this.v.y = -this.v.x;
						this.v.x = 0;
						this.map++;
						this.dir = 0;
					}
				case 3:
					if (this.y > this.scale * 25) {
						this.y = this.scale * 25;
						this.v.x = this.v.y;
						this.v.y = 0;
						this.map++;
						this.dir = 1;
					}
					break;
				case 4:
					if (this.x > this.scale * 20) {
						this.x = this.scale * 20;
						this.v.y = this.v.x;
						this.v.x = 0;
						this.map++;
						this.dir = 0;
					}
					break;
				case 5:
					if (this.y > this.scale * 31) {
						this.kill();
						health--;
						if (health > 0) {
							document.getElementById("health-display").src = "./images/health/" + health + ".png";
						} else {
							document.getElementById("health-display").src = "./images/health/" + health + ".png";
							gameOver();
						}
						this.map++;
					}
					break;
			}
		} else if (map == window.maps.four) {
			switch (this.map) {
				case 0:
					if (this.y > this.scale * 31) {
						this.kill();
						health--;
						if (health > 0) {
							document.getElementById("health-display").src = "./images/health/" + health + ".png";
						} else {
							document.getElementById("health-display").src = "./images/health/" + health + ".png";
							gameOver();
						}
						this.map++;
					}
					break;
			}
		}
		monsterStats[this.id].distance = this.map;
	}
	kill () {
		monsters.splice(monsters.indexOf(this), 1);
		if (monsters.length == 0) {
			document.getElementById("wave-display").innerHTML = wave;
			if (wave == 20) {
				coinsUpdate(10000);
				horizontalSlide("two");
				this.map = 0;
			} else if (wave == 40) {
				coinsUpdate(25000);
				horizontalSlide("three");
				this.map = 0;
			} else if (wave == 60) {
				coinsUpdate(50000);
				verticalSlide("four");
				this.map = 0;
			} else {
				document.getElementById("next-wave").disabled = false;
			}
		}
	}
	hit (damage) {
		this.health -= damage; //Deduct appropriate damage from the monster's health
		coinsUpdate(Math.round(damage)); //Increase the player's coins by the appropriate amount
		if (this.health < 1) { //If the monster's health is 0 or less
			this.kill(); //Kill the monster
		}
	}
}
