//An array containing the aspect ratio and number of tiles that should be applied to the screen
let aspect = [4, 3, 10]; //For example: this should result in a 40x30 tiled setup
let canvas = document.getElementsByTagName("canvas")[0]; //Select the canvas element and assign it to a variable
let ctx = canvas.getContext("2d"); //Set the variable 'ctx' to be the 2D context of the canvas
let scale = null; //Define variable scale with global scope
let health = 10; //Sets the player's health to 10 (default)
let wave = 1; //Wave number
let monsters = []; //Array for storing monster objects
let monsterStats = []; //Array for storing monster statistics in order to evolve them
let projectiles = []; //Array for storing projectile objects
let towers = []; //Array for storing tower objects
let towerCosts = [500, 1000, 2000, 4000, 1500]; //Prices for each of the towers
let upgradeCosts = [[750, 1000], [1500, 2000], [3000, 4000], [6000, 8000], [2250, 3000]]; //Prices for upgrading each tower
let towerRanges = [8, 12, 5, 15, 5]; //Ranges of each of the towers
let landValues = []; //Store whether a tile is dirty/grassy
let coins = 1000; //Default number of starting coins
let selected = null; //Default selection
let towerNames = ["Rock", "Boulder", "Fire", "Explosive", "Ice"]; //The names of the four types of towers
if (localStorage.getItem("hs1") == null) { //If highscore storage has not been setup
	//Set empty highscores into the browser's cache
	for (let i = 1; i < 6; i++) {
		localStorage.setItem("hs" + i, "-|0|-");
	}
}
//If window is resized, reload the page
window.onresize = function() {
	location.reload();
}
//Configure canvas with relevant aspect ratio
if (window.innerWidth / aspect[0] > (window.innerHeight - 115) / aspect[1] && window.innerWidth > 800 && window.innerHeight > 610) {
	//If the player's screen has a greater width than height (after apsect ratio has been applied) then fit canvas
	canvas.height = (window.innerHeight - 115);
	canvas.width = ((window.innerHeight - 115) / aspect[1]) * aspect[0];
	//Set the scale according to the smaller value (height or width)
  	scale = ((window.innerHeight - 115) / aspect[1]) / aspect[2];
} else {
	//If the player's screen has a greater height than width (after apsect ratio has been applied) then display error message
	document.getElementsByTagName("body")[0].style.background = "#FFFFFF"; //Change body's background to white
	//Display an error message to the user
	document.getElementsByTagName("body")[0].innerHTML = "<br>Please change the window size or your device's orientation."
}
//Play button
function playButton() {
	document.getElementById("home").classList.add("hidden"); //Hide home menu so the player can play the game
}
let tilesheet = document.getElementById("tilesheet");
//Draw map
let map = window.maps.one;
function drawMap() {
//For every tile across the y-axis
for (let i = 0; i < aspect[0] * aspect[2]; i++) {
	//For every tile across the x-axis
	for (let j = 0; j < aspect[1] * aspect[2]; j++) {
  	//Determine what type of tile is present in the position (j, i)
		switch (map[j][i]) {
			//Path
			case 0:
				//Check is land value has already been generated
				if (typeof landValues[i * 40 + j] === "undefined") {
					//50% chance of plain, 25% chance of type of dirt
					tmpR = Math.random();
				} else {
					tmpR = landValues[i * aspect[1] * aspect[2] + j];
				}
				if (tmpR < 0.5) {
					ctx.fillStyle = "#D4C044";
					ctx.fillRect(i * scale, j * scale, scale + 1, scale + 1);
				} else if (tmpR < 0.75) {
					ctx.drawImage(tilesheet, 49, 81, 14, 14, i * scale, j * scale, scale, scale);
				} else {
					ctx.drawImage(tilesheet, 65, 81, 14, 14, i * scale, j * scale, scale, scale);
				}		
				break;
			//Path (left border)
			case -4:
				ctx.drawImage(tilesheet, 1, 65, 14, 14, i * scale, j * scale, scale, scale);			
				break;
			//Path (right border)
			case -5:
				ctx.drawImage(tilesheet, 33, 65, 14, 14, i * scale, j * scale, scale, scale);				
				break;
			//Path (top border)
			case -6:
				ctx.drawImage(tilesheet, 17, 49, 14, 14, i * scale, j * scale, scale, scale);			
				break;
			//Path (bottom border)
			case -7:
				ctx.drawImage(tilesheet, 17, 81, 14, 14, i * scale, j * scale, scale, scale);			
				break;
			//Path (top left outer corner)
			case -8:
				ctx.drawImage(tilesheet, 1, 49, 14, 14, i * scale, j * scale, scale, scale);			
				break;
			//Path (top right outer corner)
			case -9:
				ctx.drawImage(tilesheet, 33, 49, 14, 14, i * scale, j * scale, scale, scale);				
				break;
			//Path (bottom left outer corner)
			case -12:
				ctx.drawImage(tilesheet, 1, 81, 14, 14, i * scale, j * scale, scale, scale);			
				break;
			//Path (bottom right outer corner)
			case -13:
				ctx.drawImage(tilesheet, 33, 81, 14, 14, i * scale, j * scale, scale, scale);			
				break;
			//Path (top left inner corner)
			case -14:
				ctx.drawImage(tilesheet, 49, 49, 14, 14, i * scale, j * scale, scale, scale);				
				break;
			//Path (top right inner corner)
			case -15:
				ctx.drawImage(tilesheet, 65, 49, 14, 14, i * scale, j * scale, scale, scale);			
				break;
			//Path (bottom left inner corner)
			case -16:
				ctx.drawImage(tilesheet, 49, 65, 14, 14, i * scale, j * scale, scale, scale);				
				break;
			//Path (bottom right inner corner)
			case -17:
				ctx.drawImage(tilesheet, 65, 65, 14, 14, i * scale, j * scale, scale, scale);			
				break;
			//Land
			case 1:
				//Check is land value has already been generated
				if (typeof landValues[i * 40 + j] === "undefined") {
					//90% chance of plain, 5% chance of type of grass
					tmpR = Math.random();
				} else {
					tmpR = landValues[i * aspect[1] * aspect[2] + j];
				}
				if (tmpR < 0.9) {
					ctx.fillStyle = "#83D135";
					ctx.fillRect(i * scale, j * scale, scale, scale);
				} else if (tmpR < 0.95) {
					ctx.drawImage(tilesheet, 49, 33, 14, 14, i * scale, j * scale, scale, scale);
				} else {
					ctx.drawImage(tilesheet, 65, 33, 14, 14, i * scale, j * scale, scale, scale);
				}
				break;
		}
		if (landValues.length < 1600) {
			landValues.push(tmpR);
		}
	}
}
}
//Animation loop
function animate () {
	//Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//Draw the map
	drawMap();
	//For every monster in the active monsters array
	for (let monster of monsters) {
		monster.move(); //Call the move method of the current monster
		monster.draw(); //Call the draw method of the current monster
	}
	//Draws on a grey square behind a selected tower
	if (selected !== null) {
		ctx.fillStyle = "rgba(0, 0, 0, 0.25)"; //Grey box background
		ctx.fillRect((selected.x - 1) * scale, (selected.y - 1) * scale, scale * 3, scale * 3); //Draw grey box
		ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; //White circle outline
		ctx.beginPath(); //Begin path
		ctx.arc((selected.x + 0.4) * scale, (selected.y + 0.4) * scale, selected.range * scale, 0, 2 * Math.PI); //Range
		ctx.closePath(); //Close path
		ctx.lineWidth = 2; //Set width of circle to two pixels
		ctx.stroke(); //Draw range circle
	}
	//For every tower in the active towers array
	for (let tower of towers) {
		tower.draw(); //Call the draw method of the current tower
		tower.shoot(); //Call the shoot method of the current tower
	}
	//For every projectile in the active projectile array
	for (let projectile of projectiles) {
		projectile.draw(); //Call the draw method of the current projectile
	}
	//If the player is in the process of building
	if (building !== false) {
		if (mouse.x < scale * aspect[0] * aspect[2] && mouse.x > 0) { //Check mouse is within width of canvas
			if (mouse.y < scale * aspect[1] * aspect[2] && mouse.y > 0) { //Check mouse is within height of canvas
				let activeTileX = Math.floor(mouse.x / scale); //Calculate which X tile mouse is in
				let activeTileY = Math.floor(mouse.y / scale); //Calculate which Y tile mouse is in
				//Check for collision with potential building
				if (collision(activeTileX - 1, activeTileY - 1, 3, 3)) {
					ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; //Draw red square onto canvas
					ctx.strokeStyle = "rgba(255, 0, 0, 0.5)"; //Red circle outline
				} else {
					ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; //Draw white square onto canvas
					ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; //White circle outline
				}
				ctx.fillRect(activeTileX * scale - scale, activeTileY * scale - scale, scale * 3, scale * 3);
				ctx.beginPath();
				ctx.arc(activeTileX * scale + scale / 2, activeTileY * scale + scale / 2, scale * towerRanges[building - 1], 0, 2 * Math.PI);
				ctx.closePath();
				ctx.lineWidth = 2; //Set width of circle to two pixels
				ctx.stroke(); //Draw range circle
			}
		}
	}
  	//This recalls the animate loop function at a rate which the computer's GPU/CPU can handle
	requestAnimationFrame(animate);
}
drawMap();
//Next wave button
function nextWave () {
	document.getElementById("next-wave").disabled = true;
	if (monsterStats.length == 0) { //First ever wave - generate all of the monsters randomly
		monsterStats = []; //Clear out monster statistics from previous round
		for (let i = 0; i < wave + 2; i++) {
			let r = Math.random();
			monsterStats.push({gene: r, distance: 0}); //Store the monster's gene within the monsterStats array
			monsters.push(new Monster(i, r, null));
		}
	} else {
		let monsterStatsTotal = 0;
		//Increment all of the distances in the monsterStats array by one and calculate the total
		for (let i = 0; i < monsterStats.length; i++) {
			monsterStats[i].distance += 1; //Increment by one
			monsterStatsTotal += monsterStats[i].distance; //Add on to total
		}
		let oldMonsterStats = []; //Create copy of previous stats
		let cumulativeTotal = 0; //The probabilities will be cumulative
		for (let i = 0; i < monsterStats.length; i++) {
			cumulativeTotal += monsterStats[i].distance / monsterStatsTotal; //Calculate and add the probability
			oldMonsterStats.push({gene: monsterStats[i].gene, probability: cumulativeTotal}); //Store this for breeding
		}
		monsterStats = []; //Clear out monster statistics from previous round
		for (let i = 0; i < 2; i++) { //Create two random monsters
			let r = Math.random();
			monsterStats.push({gene: r, distance: 0}); //Store the monster's gene within the monsterStats array
			monsters.push(new Monster(i, r, null));
		}
		//Breed the previous monsters to create a new wave of monsters
		for (let i = 0; i < wave; i++) {
			//Select two 'parents' according to the monsters' probabilities
			let parent1 = Math.random();
			for (let previousGene of oldMonsterStats) {
				if (parent1 <= previousGene.probability) {
					parent1 = previousGene.gene;
					break;
				}
			}
			let parent2 = Math.random();
			for (let previousGene of oldMonsterStats) {
				if (parent2 <= previousGene.probability) {
					parent2 = previousGene.gene;
					break;
				}
			}
			let r = (parent1 + parent2) / 2; //Combine the two selected parents' genes
			monsterStats.push({gene: r, distance: 0}); //Store the monster's gene within the monsterStats array
			monsters.push(new Monster(i + 2, r, null)); //Add the new monsters
		}
	}
	wave++;
}
//When the user clicks on the canvas
document.getElementsByTagName("canvas")[0].addEventListener("click", canvasClick);
//Build tower buttons
let building = false;
function buildTower (id) {
	if (building == false) { //Check whether the user is currently in the process of building
		building = id; //Get building ID
		for (let button of document.getElementsByClassName("build-tower")) {
			button.disabled = true; //Disable all building buttons temporarily
		}
	}
}
//Start the animation loop when the program loads
window.onload = function () {
	animate();
}
//Record the player's mouse x and y position, relative to the canvas object
let mouse = {x: null, y: null};
document.addEventListener("mousemove", function (e) {
	let canvasPosition = canvas.getBoundingClientRect(); //Retrive position of the canvas
	mouse.x = Math.round(e.clientX - canvasPosition.left); //Relative x co-ordinate
	mouse.y = Math.round(e.clientY - canvasPosition.top); //Relative y co-ordinate
});
//Function called whenever the user clicks on the canvas
function canvasClick () {
	if (mouse.x < scale * aspect[0] * aspect[2]) { //Check if mouse is within canvas (x)
		if (mouse.y < scale * aspect[1] * aspect[2]) { // ^^ (y)
			let activeTileX = Math.floor(mouse.x / scale); //Work out which tile the mouse is within (x)
			let activeTileY = Math.floor(mouse.y / scale); // ^^ (y)
			if (building) { //Check if user is currently building
				if (collision(activeTileX - 1, activeTileY - 1, 3, 3) == false) { //Check for collision
					//Build new building
					towers.push(new Tower(activeTileX, activeTileY, scale, building)); //Append new tower to array
					coinsUpdate(-towerCosts[building - 1]);
				} else {
					building = false; //Leave 'building mode'
					coinsUpdate(0);
				}
			} else {	
				if (collision(activeTileX - 1, activeTileY - 1, 3, 3) == true)	{ //Check for collision with tower/path
					let selectedTower = false; //Assume they haven't clicked on a tower
					for (let tower of towers) { //For every tower in the active towers array
						if (tower.x - 1 <= activeTileX && tower.x + 1 >= activeTileX) { //If the x position falls on the tower
							if (tower.y - 1 <= activeTileY && tower.y + 1 >= activeTileY) { //If the y position falls on the tower
								selectedTower = tower; //Select the tower
								break; //Break out of the for loop as the tower has already been identified
							}
						}
					}											
					if (selectedTower !== false) { //If a tower has been selected
						selected = selectedTower; //Set value of global 'selected' variable
						document.getElementById("tower-type").innerHTML = towerNames[selected.type - 1]; //Show tower type
						document.getElementById("tower-level").innerHTML = selected.level; //Show tower level	
						//Show appropriate image on the upgrade button
						if (selected.level < 3) {
							document.getElementById("upgrade-button").style.display = "inline-block"; //Show upgrade button
							document.getElementById("upgrade-image").src = "./images/towers/tower-" + selected.type + "-" + (selected.level + 1) + ".png";
							document.getElementById("upgrade-cost").innerHTML = upgradeCosts[selected.type - 1][selected.level - 1]; //Show appropriate price
							//Check if the player has enough money to buy the upgrade
							if (coins < upgradeCosts[selected.type - 1][selected.level - 1]) {
								document.getElementById("upgrade-button").disabled = true; //Disable button
							} else {
								document.getElementById("upgrade-button").disabled = false; //Enable button
							}
						} else {
							document.getElementById("upgrade-button").style.display = "none"; //Hide upgrade button
						}
						document.getElementById("selection").style.display = "inline"; //Show selection menu
						for (let element of document.querySelectorAll("#menu button")) { //For all default menu buttons
							element.style.display = "none"; //Hide the button
						}
					} else {
						if (selected !== null) { //If currently selecting something
							deselect(); //Deselect the current selected tower
						}
					}
				} else {
					if (selected !== null) { //If currently selecting something
						deselect(); //Deselect the current selected tower
					}
				}
			}
		}

	}	
}
//Function to be called to de-select the current tower
function deselect() {
	selected = null; //Set selected variable back to default
	document.getElementById("selection").style.display = "none"; //Hide selection menu
	for (let element of document.querySelectorAll("#menu button")) { //For all default menu buttons
		element.style.display = "inline-block"; //Show the buttons
	}
}
//Function to be called to sell the current tower
function sellTower() {
	let refund = Math.round((towerCosts[selected.type - 1] * (0.5 + 0.5 * selected.level)) * 0.5); //Calculate the player's refund
	coinsUpdate(refund); //Add the refund to the player's coin balance
	//Remove tower from map
	for (let i = -1; i < 2; i++) {
		for (let j = -1; j < 2; j++) {
			map[selected.y + j][selected.x + i] = 1; //Replace the tiles that the tower takes up with '1' (grass ID)
		}
	}
	towers.splice(towers.indexOf(selected), 1); //Remove the tower from the active towers array
	deselect(); //De-select current tower - it doesn't exist anymore!
}
//Function to be called to upgrade the current tower
function upgradeTower() {
	coinsUpdate(-upgradeCosts[selected.type - 1][selected.level - 1]); //Charge the appropriate price
	selected.level += 1; //Increase the tower's level
	deselect(); //De-select the current tower
}
//Function called to update coin count
function coinsUpdate (change) {
	coins = coins + change; //Update global variable
	document.getElementById("coins-display").innerHTML = coins; //Update coins display
	if (building == false) { //If not currently in 'build mode'
		for (let i = 1; i <= 5; i++) { //For each tower build button ...
			if (coins >= towerCosts[i - 1]) { //If the player has enough to build the tower
				document.getElementById("tower-" + i).disabled = false; //Enable the button
			} else {
				document.getElementById("tower-" + i).disabled = true; //Disable the button
			}
		}
	}
	if (selected !== null) { //If selecting a tower
		if (selected.level < 3) { //Check if the tower is upgradable
			//Check if the player has enough money to buy the upgrade
			if (coins < upgradeCosts[selected.type - 1][selected.level - 1]) {
				document.getElementById("upgrade-button").disabled = true; //Disable button
			} else {
				document.getElementById("upgrade-button").disabled = false; //Enable button
			}
		}
	}
}
//Function called to show the player the leaderboard from the menu
function showLeaderboard() {
	for (let i = 1; i < 6; i++) {
		let hsData = localStorage.getItem("hs" + i).split("|"); //Retrieve highscore data
		document.getElementById("hs-name" + i).innerHTML = hsData[0]; //Show name
		document.getElementById("hs-score" + i).innerHTML = (hsData[1] == 0) ? "-" : hsData[1]; //Show wave number (score)
		document.getElementById("hs-coins" + i).innerHTML = "$ " + hsData[2]; //Show number of coins
	}
	document.getElementById('leaderboard').classList.remove('hidden'); //Actually show the leaderboard page
}
//Function called once the game is over
function gameOver() {
	monsters = []; //Reset the monsters array
	towers = []; //Reset the towers array
	document.getElementById("score-display").innerHTML = wave - 1; //Update score display to show the wave number
	//Check if player has a new highscore
	let curLowHS = localStorage.getItem("hs5").split("|")[1]; //Retrieve lowest current highscore on the leaderboard
	if (wave - 1 > parseInt(curLowHS)) { //If lowest score is blank or lower than the player's new score
		//Load all highscores into an array
		let highscores = [];
		for (let i = 1; i < 6; i++) {
			let data = localStorage.getItem("hs" + i).split("|");
			highscores.push([data[0], parseInt(data[1]), data[2]]); //Retrieve and store leaderboard data
		}
		let username = ""; //Blank username
		document.getElementById("enterName").classList.remove("hidden"); //Show name input screen
		document.getElementById("nameSubmit").onclick = function () {
			username = document.getElementById("nameInput").value.replace(/[^0-9a-z]/gi, ""); //Retrieve name and remove non alpha-numeric chars
			if (username.length > 0) { //If username is valid
				highscores.push([username, (wave - 1), String(coins)]); //Append new highscore data to the array
				highscores.sort(function (a, b) { //Sort two-dimensional highscores array by score
						return b[1] - a[1]; //Returns true if positive and false if negative
				});
				highscores.splice(-1, 1); //Remove the lowest score from the array
				//Put data back into the browser cache
				for (let i = 1; i < 6; i++) {
					localStorage.setItem("hs" + i, highscores[i - 1].join("|"));
				}
				document.getElementById("endGame").classList.remove("hidden"); //Show the end game screen
			} else {
				document.getElementById("nameInput").style["border-color"] = "red"; //Change box border to red to show the player there is an error
			}
		}	
	} else {
		document.getElementById("endGame").classList.remove("hidden"); //Show the end game screen
	}
}