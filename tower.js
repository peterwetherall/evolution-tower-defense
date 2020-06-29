//Basic Tower class
class Tower {
	//This function is run whenever a new Tower object is created
	constructor (x, y, scale, type) {
		this.x = x; //X-position of the tower
		this.y = y; //Y-position of the tower
		this.w = 3; //Width of the tower (relative to scale)
		this.h = 3; //Height of the tower (relative to scale)
		this.type = type; //Type of tower (1-4)
		this.scale = scale; //Stores the window scale into a local attribute
		this.level = 1; //Level of the tower
		this.timeout = 0; //Timeout on the tower's ability to attack (-1 = no current timeout)
		switch (this.type) {
			case 1: //Rock tower
				this.cooldown = 86 - (12 * this.level); //Cooldown of the tower
				this.damage = 10 + (10 * this.level); //Damage the tower deals
				this.range = 8; //Range of the tower (relative to scale)
				break;
			case 2: //Boulder tower
				this.cooldown = 175 - (25 * this.level); //Cooldown of the tower
				this.damage = 25 + (25 * this.level); //Damage the tower deals
				this.range = 12; //Range of the tower (relative to scale)
				break;
			case 3: //Fire tower
				this.cooldown = 20 - (5 * this.level); //Cooldown of the tower
				this.damage = 10; //Damage the tower deals
				this.range = 5; //Range of the tower (relative to scale)
				break;
			case 4: //Explosive tower
				this.cooldown = 300; //Cooldown of the tower
				this.damage = 250 * this.level; //Damage the tower deals
				this.range = 15; //Range of the tower (relative to scale)
				break;
			case 5: //Ice tower
				this.cooldown = 86 - (12 * this.level); //Cooldown of the tower
				this.damage = 100 * this.level; //Damage the tower deals
				this.range = 5; //Range of the tower (relative to scale)
		}
		//Place tower into map
		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				map[y + j][x + i] = 11; //Replace the tiles that the tower takes up with '11' (tower id)
			}
		}
	}
	//This method will be called in the game loop and will draw on the tower
	draw () {
		let baseImage = new Image(); //Create new image element
		baseImage.src = "./images/towers/tower-" + this.type + "-" + this.level + ".png"; //Select the appropriate base - depends on tower type
		ctx.drawImage(baseImage, this.x * scale - scale, this.y * scale - scale, scale * 3, scale * 3); //Draw it
	}
	//This method is also called in the game loop and will cause the tower to shoot when it is able to
	shoot () {
		this.timeout -= 1; //Reduce the cooldown of the tower
		for (let monster of monsters) { //For every active monster
			if (this.timeout < 0) { //If not on a cooldown
				switch (this.type) {
					case 1: //Rock tower
						this.cooldown = 86 - (12 * this.level); //Cooldown of the tower
						this.damage = 10 + (10 * this.level); //Damage the tower deals
						this.range = 8; //Range of the tower (relative to scale)
						break;
					case 2: //Boulder tower
						this.cooldown = 175 - (25 * this.level); //Cooldown of the tower
						this.damage = 25 + (25 * this.level); //Damage the tower deals
						this.range = 12; //Range of the tower (relative to scale)
						break;
					case 3: //Fire tower
						this.cooldown = 20 - (5 * this.level); //Cooldown of the tower
						this.damage = 10; //Damage the tower deals
						this.range = 5; //Range of the tower (relative to scale)
						break;
					case 4: //Explosive tower
						this.cooldown = 300; //Cooldown of the tower
						this.damage = 250 * this.level; //Damage the tower deals
						this.range = 15; //Range of the tower (relative to scale)
						break;
					case 5: //Ice tower
						this.cooldown = 86 - (12 * this.level); //Cooldown of the tower
						this.damage = 100 * this.level; //Damage the tower deals
						this.range = 5; //Range of the tower (relative to scale)
				}
				let centreX = this.x * this.scale + this.scale / 2;
				let centreY = this.y * this.scale + this.scale / 2;
				let dist = Math.sqrt(Math.pow((monster.x - centreX),2) + Math.pow(monster.y - centreY,2));
				if (dist < this.range * this.scale) {
					//Deal damage to enemy and enable cooldown
					projectiles.push(new Projectile(monster, this.type, this.x, this.y, this.damage, this.level));
					this.timeout = this.cooldown;
					break;
				}
			}
		}
	}
}

//Projectile class
class Projectile {
	constructor (target, type, x, y, damage, level) {
		this.target = target; //The monster the projectile is targeting
		this.type = type; //The type of projectile (1-4)
		this.pos = {x: x * scale, y: y * scale}; //The x and y position of the projectile
		this.speed = (type == 3 || type == 5) ? 15 : 10;
		this.velocity = {x: 0, y: -this.speed}; //The velocity of the projectile
		this.damage = Math.round(Math.random() * damage + damage / 2); //Randomly change damage to between 0.5-1.5x the standard
		this.break = 0; //Breaking animation
		this.level = level; //Tower level (for explosive tower range)
	}
	draw () {
		this.pos.x += this.velocity.x; //Adjust x position according to x velocity
		this.pos.y += this.velocity.y; //Adjust y position according to y velocity
		try { //Ensure no errors occur if monster is killed by another projectile first
			if (this.break == 0 && this.target.health > 0) { //Check if the target monster is still alive
				//Adjust velocity so that the projectile moves toward the monster
				let change = {x: Math.round((this.pos.x + scale / 2) - this.target.x), y: Math.round((this.pos.y + scale / 2) - this.target.y)};
				let posChange = {x: Math.abs(change.x), y: Math.abs(change.y)};
				if (Math.sqrt(Math.pow(change.x, 2) + Math.pow(change.y, 2)) > scale / 2) { //Check if projectile has reached the monster
					this.velocity.x = -this.speed * change.x / (posChange.x + posChange.y); //Adjust x velocity to point towards monster
					this.velocity.y = -this.speed * change.y / (posChange.x + posChange.y); //Adjust y velocity to point towards monster
				} else {
					if (this.type == 5) { //If the tower is an ice tower
						this.target.slowed = this.damage; //Slow the enemy for the appropriate time
					} else {
						this.target.hit(this.damage); //Deal appropriate damage to targeted monster
					}
					if (this.type == 4) { //Explosive projectile
						for (let monster of monsters) { //For every monster
							if (monster !== this.target) { //If monster isn't original target
								let explosionRange = scale * (3 + 2 * this.level); //Calculate explosion range
								let monsterGap = Math.sqrt(Math.pow((this.pos.x + scale / 2) - monster.x, 2) + Math.pow((this.pos.y + scale / 2) - monster.y, 2));
								//If monster is within range of the explosion
								if (monsterGap < explosionRange) {
									monster.hit(Math.round(Math.random() * 50 + 50 / 2)); //Deal appropriate damage to monster
								}
							}
						}
					}
					this.break = 1; //Begin breaking animation
				}
			} else {
				if (this.break == 10) { //Run out of breaking frames
					projectiles.splice(projectiles.indexOf(this), 1);
				} else if (this.break < 10) {
					this.velocity = {x: 0, y: 0}; //Remove the projectile's velocity
					this.break += 1; //Move through the breaking animation
				}
			}
		} catch {
			this.break = 1; //Begin breaking animation
		}
		if (this.type == 4 && this.break > 0) { //Explosive projectile
			//Draw explosion circle
			let explosionImage = new Image(); //Create new image element
			explosionImage.src = "./images/towers/projectile-" + this.type + "-" + Math.floor(this.break / 2) + ".png"; //Select the appropriate image
			ctx.drawImage(explosionImage, this.pos.x - scale * (1.5 + this.level), this.pos.y - scale * (1.5 + this.level), scale * (4 + 2 * this.level), scale * (4 + 2 * this.level)); //Draw it
		} else {
			let projectileImage = new Image(); //Create new image element
			projectileImage.src = "./images/towers/projectile-" + this.type + "-" + Math.floor(this.break / 2) + ".png"; //Select the appropriate image
			ctx.drawImage(projectileImage, this.pos.x, this.pos.y, scale, scale); //Draw it
		}
	}
}

