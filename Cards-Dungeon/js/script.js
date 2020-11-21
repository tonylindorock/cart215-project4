"use strict";
/********************************************************************

Prototype
Cards Dungeon
Yichen Wang

*********************************************************************/

// Colors
const WHITE = "#eee";
const BLACK = "#444";
const RED = "#f28888";
const ORANGE = "#f2b988";
const YELLOW = "#e8da7d";
const GREEN = "#7de8a1";
const BLUE = "#88b4f2";
const PURPLE = "#b888f2";

const MOUSE_ON_LEFT = 0;
const MOUSE_ON_RIGHT = 1;
const MOUSE_ON_MIDDLE = -1;

const EVENT_TYPE_CONTENT = "CONTENT";
const EVENT_TYPE_CHOICES = "CHOICES";

const STATUS_OUTDOOR = 0;
const STATUS_INDOOR = 1;

let themeColor;

let bgColor = {
  r: 0,
  g: 0,
  b: 0,
  patternId: 0
};

let card;
let stats;
let player;

let currentLoot;
let conseqClickCount = 0;
let disableArrowKey = false;

let gameData = {
  status: STATUS_OUTDOOR,
  state: {
    "playing": false,
    "day": 1
  },
  eventId: "other",
  currentEvent: -1,
  choices: ["Pick any side", "And click to start"],
  currentLoc: null,
  cardLimit: 4,
  consequenceId: 0,
  hasConsequence: false,
  eventObj: null
};

let FONT;
let THEME_COLORS;

let HEART_FULL;
let HEART_EMPTY;
let ICON_HERB;
let ICON_FOOD;
let ICON_COIN;

let MAP_VILLAGE;
let MAP_SWAMP;
let MAP_CASTLE;
let MAP_CITY;
let MAP_FOREST;
let MAP_TOWER;
let MAP_TEMPLE;
let MAP_DESERT;
let MAP_CAVE;
let MAP_LAND;
let MAP_DUNGEON;
let MAPS;

var eventsJSON;
var locationsJSON;
var weaponsJSON;

function preload() {
  eventsJSON = loadJSON("assets/events.json");
  locationsJSON = loadJSON("assets/locations.json");
  weaponsJSON = loadJSON("assets/weapons.json");

  HEART_FULL = loadImage("assets/images/heart_full.png");
  HEART_EMPTY = loadImage("assets/images/heart_empty.png");
  ICON_HERB = loadImage("assets/images/icon_herb.png");
  ICON_FOOD = loadImage("assets/images/icon_food.png");
  ICON_COIN = loadImage("assets/images/icon_coin.png");

  MAP_VILLAGE = loadImage("assets/images/mm_village.png");
  MAP_SWAMP = loadImage("assets/images/mm_swamp.png");
  MAP_CASTLE = loadImage("assets/images/mm_castle.png");
  MAP_CITY = loadImage("assets/images/mm_city.png");
  MAP_FOREST = loadImage("assets/images/mm_forest.png");
  MAP_TOWER = loadImage("assets/images/mm_tower.png");
  MAP_TEMPLE = loadImage("assets/images/mm_temple.png");
  MAP_DESERT = loadImage("assets/images/mm_desert.png");
  MAP_CAVE = loadImage("assets/images/mm_cave.png");
  MAP_LAND = loadImage("assets/images/mm_land.png");
  MAP_DUNGEON = loadImage("assets/images/mm_dungeon.png");
  MAPS = [MAP_VILLAGE, MAP_SWAMP, MAP_CASTLE, MAP_CITY, MAP_FOREST, MAP_TOWER, MAP_TEMPLE, MAP_DESERT, MAP_CAVE, MAP_LAND, MAP_DUNGEON];

  THEME_COLORS = [RED, ORANGE, YELLOW, GREEN, BLUE, PURPLE];
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  textFont("Verdana");
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  angleMode(DEGREES)
  imageMode(CENTER);

  //noCursor();
  randomizeBG();

  setupGame();
  //let person = prompt("Please enter your name", "Unnamed");
}

function setupGame() {
  // set up first event
  updateEvent(gameData.eventId, gameData.currentEvent);
  // create card object
  card = new Card(gameData.eventObj.title, gameData.eventObj.text, themeColor);
  updateCard(0); // update card
  // set up player
  player = new Player();
  let firstWeapon = getWeapon("melee", int(random(weaponsJSON.weapons.melee.length)));
  player.stats["weapon"][0] = firstWeapon.name;
  // creat ui object
  stats = new Stats(player);
}

// randomizeBG()
//
// randomize background color & pattern
function randomizeBG() {
  bgColor.r = random(80, 100);
  bgColor.g = random(80, 100);
  bgColor.b = random(80, 100);

  themeColor = random(THEME_COLORS);
}

function draw() {
  background(bgColor.r, bgColor.g, bgColor.b);
  showChoices();
  card.display();
  if (gameData.state["playing"]) {
    stats.display();
  }
  drawCursor();
}

function drawCursor() {
  push();
  if (mouseIsPressed) {
    fill(200, 200, 200, 225);
  } else {
    fill(238, 238, 238, 225);
  }
  stroke(68, 68, 68, 225);
  strokeWeight(3);
  ellipse(mouseX, mouseY, 18);
  pop();
}

function getMousePos() {
  let pos;
  if (mouseX < width / 2 - card.width / 2) {
    pos = MOUSE_ON_LEFT;
  } else if (mouseX > width / 2 + card.width / 2) {
    pos = MOUSE_ON_RIGHT;
  } else {
    pos = MOUSE_ON_MIDDLE;
  }
  return pos;
}

function showChoices() {
  push();
  textSize(18);
  if (getMousePos() === MOUSE_ON_LEFT) {
    fill(WHITE);
  } else {
    fill(238, 238, 238, 75);
  }
  text(gameData.choices[0], width / 2 - width / 3, height / 2, width / 4, card.height);
  if (getMousePos() === MOUSE_ON_RIGHT) {
    fill(WHITE);
  } else {
    fill(238, 238, 238, 75);
  }
  text(gameData.choices[1], width / 2 + width / 3, height / 2, width / 4, card.height);
  pop();
}

function updateCard(id, loot = null) {
  switch (id) {
    // event
    case 0:
      card.text = gameData.eventObj.text + "\n\n- " + gameData.choices[0] + "\n- " + gameData.choices[1];
      break;
      // supplies
    case 1:
      card.text = gameData.eventObj.text + "\n\n" + loot[0] + " Food" + "\n" + loot[1] + " Herbs" + "\n" + loot[2] + " Coins" + "\n\nPick any side to contine";
      break;
      // melee
    case 2:
      card.text = gameData.eventObj.text + "\n\na " + loot[0] + "\n\n- " + gameData.choices[0] + "\n- " + gameData.choices[1];
      break;
      // gun
    case 3:
      card.text = gameData.eventObj.text + "\n\na " + loot[0] + " (" + loot[1] + ")" + "\n\n- " + gameData.choices[0] + "\n- " + gameData.choices[1];
  }
}

function mousePressed() {
  if (mouseButton === LEFT && !card.isPlayingAnimation) {
    if (getMousePos() === MOUSE_ON_LEFT) {
      makeChoice(0);
    } else if (getMousePos() === MOUSE_ON_RIGHT) {
      makeChoice(1);
    }
  }
}

// Enables arrow key for playing the game
function keyPressed() {
  if (keyCode === LEFT_ARROW && !card.isPlayingAnimation && !disableArrowKey) {
    card.tiltDir = 0;
    if (getMousePos() != MOUSE_ON_LEFT){
      setTimeout(makeChoice, 350, 0);
    }else{
      makeChoice(0);
    }
    disableArrowKey = true;
  } else if (keyCode === RIGHT_ARROW && !card.isPlayingAnimation && !disableArrowKey) {
    card.tiltDir = 1;
    if (getMousePos() != MOUSE_ON_RIGHT){
      setTimeout(makeChoice, 350, 1);
    }else{
      makeChoice(1);
    }
    disableArrowKey = true;
  }
}

function makeChoice(id) {
  // if the choice has a consequence
  if (conseqClickCount === 0 && gameData.eventObj.choices[id].result != null) {
    let hasAttribute = false;
    for (let i = 1; i < gameData.eventObj.choices[id].result.length; i++) {
      // if player has weapon
      if (gameData.eventObj.choices[id].result[i].weapon != null){
        hasAttribute = true;
        gameData.consequenceId = i;
        break;
      }
      // if player has the attribute
      if (gameData.eventObj.choices[id].result[i].attribute != null){
        if (player.stats[gameData.eventObj.choices[id].result[i].attribute[0]] >= gameData.eventObj.choices[id].result[i].attribute[1]) {
          hasAttribute = true;
          gameData.consequenceId = i;
          break;
        }
      }
    }
    if (!hasAttribute) {
      gameData.consequenceId = 0;
    }
    gameData.hasConsequence = true;
    gameData.choices[0] = "";
    gameData.choices[1] = "";
    conseqClickCount = 1;
    card.playAnimation(2);
  } else {
    gameData.hasConsequence = false;
    conseqClickCount = 0;
    card.playAnimation(id);
  }
  setTimeout(parseChoice, 450, id);
  disableArrowKey = false;
}

function updateEvent(type, id) {
  gameData.eventId = type;
  gameData.currentEvent = id;
  gameData.eventObj = getEvent();
  let choices = [];
  choices.push(gameData.eventObj.choices[0].text);
  choices.push(gameData.eventObj.choices[1].text);

  // if has special cases
  if (gameData.eventObj.choices[0].caseText != null) {
    if (gameData.state[gameData.eventObj.choices[0].caseText[0][0]] === gameData.eventObj.choices[0].caseText[0][1]) {
      choices[0] = gameData.eventObj.choices[0].caseText[1];
    }
  }
  if (gameData.eventObj.choices[1].caseText != null) {
    if (gameData.state[gameData.eventObj.choices[1].caseText[0][0]] === gameData.eventObj.choices[1].caseText[0][1]) {
      choices[1] = gameData.eventObj.choices[1].caseText[1];
    }
  }

  if (typeof(choices[0]) == 'object') {
    gameData.choices[0] = parseChoiceArray(choices[0]);
  } else {
    gameData.choices[0] = choices[0];
  }
  if (typeof(choices[1]) == 'object') {
    gameData.choices[1] = parseChoiceArray(choices[1]);
  } else {
    gameData.choices[1] = choices[1];
  }
}

function getEvent() {
  let targetArray;

  if (gameData.eventId === "other") {
    targetArray = eventsJSON.events.other;
  } else if (gameData.eventId === "travel") {
    targetArray = eventsJSON.events.travel;
  } else if (gameData.eventId === "explore") {
    targetArray = eventsJSON.events.explore;
  } else if (gameData.eventId === "looting") {
    targetArray = eventsJSON.events.looting;
  }

  for (let i = 0; i < targetArray.length; i++) {
    if (targetArray[i].id === gameData.currentEvent) {
      return targetArray[i];
    }
  }
}

function parseChoice(id) {
  // checking if need to change state
  if ("state" in gameData.eventObj.choices[id]) {
    gameData.state[gameData.eventObj.choices[id].state[0]] = gameData.eventObj.choices[id].state[1];
  }
  // if the choice has consequence, don't jump to the next event
  if (gameData.hasConsequence) {
    let conseqObj = gameData.eventObj.choices[id].result[gameData.consequenceId];
    let change = "";
    if (conseqObj.playerData != null) {
      for (var key in conseqObj.playerData) {
        let value = conseqObj.playerData[key];
        // if changing num
        if (typeof(value) == 'number') {
          // neg or pos
          if (value != 0) {
            change += "\n" + str(value) + " " + key;
            player.stats[key] += value;
            player.stats[key] = constrain(player.stats[key], 0, 100);
            // 0
          } else {
            change += "\n-" + str(player.stats[key]) + " " + key;
            player.stats[key] = value;
          }
          // if adding random num
        } else if (value.includes("+")) {
          let randTemp = int(random(0, 4));
          change += "\n" + str(randTemp) + " " + key;
          player.stats[key] += randTemp;
          // if supplies cut to half
        } else if (value.includes("/2")) {
          let temp = int(player.stats[key] / 2) - player.stats[key];
          change += "\n" + str(temp) + " " + key;
          player.stats[key] += temp;
          // if some changes to the weapon
        } else if (key === "weapon") {
          // make sure it's an array
          if (typeof(value) == 'object') {
            // size 2/1, changing the weapon
            if (value.length === 2 || value.length === 1) {
              player.stats["weapon"] = value;
              // size 4, change weapon stats
            }
          }
        }
      }
      stats.updateStats(player);
    }
    if (conseqObj.next != null) {
      if (conseqObj.next === "out") {
        gameData.cardLimit = 0;
        player.action = "";
      }
    }
    card.text = conseqObj.text + "\n" + change;
  } else {
    // change event to the next event
    if (gameData.eventObj.choices[id].next != null) {
      if (gameData.eventObj.choices[id].next.constructor === Array) {
        updateEvent(gameData.eventObj.choices[id].next[0], gameData.eventObj.choices[id].next[1]);
        updateCard(0);
      } else if (gameData.eventObj.choices[id].next === "loc") {
        player.action = "EXPLORING";

        gameData.currentLoc = getLocation(gameData.choices[id]);
        gameData.cardLimit = gameData.currentLoc.size;

        stats.updateMap(gameData.currentLoc);
        gameData.state["day"] = stats.mapRevealed;
        console.log("Day " + gameData.state["day"]);
        getExploreEvent();
      }
      // if null, it's a looting event
    } else {
      if (gameData.eventId === "looting") {
        // if finding weapon
        if (gameData.currentEvent === 1) {
          // taking the weapon
          if (id === 0) {
            updatePlayerData(currentLoot);
          }
          // if finding supplies
        } else if (gameData.currentEvent === 0) {
          updatePlayerData(currentLoot);
        }
      }
      switch (player.action) {
        case "EXPLORING":
          getExploreEvent();
          break;
        default:
          getTravelEvent();
      }
    }
  }
  // update event on the card
  card.title = gameData.eventObj.title;
}

function parseChoiceArray(array) {
  if (array[0] === "loc") {
    return getLocation(array[1]);
  } else if (array[0] === "out") {

  }
}

function getLocation(id) {
  // if id is array
  if (typeof(id) == 'object') {
    let temp = random(id);
    return locationsJSON.loc[temp].name;
    // if id is a num
  } else if (typeof(id) == 'number') {
    // -1 random
    if (id < 0) {
      let tempId = int(random(locationsJSON.loc.length - 1));
      return locationsJSON.loc[tempId].name;
      // a specified loc
    } else {
      for (let i = 0; i < locationsJSON.loc.length; i++) {
        if (locationsJSON.loc[i].id === id) {
          return locationsJSON.loc[i].name;
        }
      }
    }
    // if id is a string
  } else if (typeof(id) == 'string') {
    for (let i = 0; i < locationsJSON.loc.length; i++) {
      if (locationsJSON.loc[i].name === id) {
        return locationsJSON.loc[i];
      }
    }
  }
  return null;
}

function getTravelEvent() {
  let randomTravelEv = random(eventsJSON.events.travel);
  updateEvent("travel", randomTravelEv.id);
  updateCard(0);
  console.log(randomTravelEv.title);
}

function getExploreEvent() {
  let temp = random();
  if (temp >= 0.15) {
    updateEvent("looting", 0);
    let loot = getLoot();
    currentLoot = loot;
    console.log(loot);
    if (loot.length === 3) {
      updateCard(1, loot);
    } else if (loot.length === 2) {
      updateEvent("looting", 1);
      updateCard(3, loot);
    } else {
      updateEvent("looting", 1);
      updateCard(2, loot);
    }
  } else {
    let randomExploreEv = random(eventsJSON.events.explore);
    updateEvent("explore", randomExploreEv.id);
    updateCard(0);
    console.log(randomExploreEv.title);
  }
  gameData.cardLimit -= 1;
  if (gameData.cardLimit <= 0) {
    console.log("Location exploration is finished.");
    player.action = "";
  }
  stats.nextPos();
}

function getLoot() {
  let result = [];
  let temp = random();
  // spawn random loots
  if (temp >= 0.3) {
    let tempItem = random();
    if (tempItem <= gameData.currentLoc.spawn.food) {
      append(result, int(random(1, 4)));
    } else {
      append(result, 0);
    }
    //tempItem = random();
    if (tempItem <= gameData.currentLoc.spawn.herbs) {
      append(result, int(random(1, 4)));
    } else {
      append(result, 0);
    }
    //tempItem = random();
    if (tempItem <= gameData.currentLoc.spawn.coins) {
      append(result, int(random(1, 4)));
    } else {
      append(result, 0);
    }
    // spawn random weapon
  } else {
    let tempWeapon = random();
    if (tempWeapon <= gameData.currentLoc.spawn.ranged) {
      let tempRanged = getWeapon("ranged", int(random(weaponsJSON.weapons.ranged.length)))
      append(result, tempRanged.name);
      append(result, tempRanged.ammo);
    } else {
      let tempMelee = getWeapon("melee", int(random(weaponsJSON.weapons.melee.length)));
      append(result, tempMelee.name);
    }
    return result;
  }
  return result;
}

function getWeapon(type, id) {
  let targetArray;
  if (type === "melee") {
    targetArray = weaponsJSON.weapons.melee;
  } else if (type === "ranged") {
    targetArray = weaponsJSON.weapons.ranged;
  }
  for (let i = 0; i < targetArray.length; i++) {
    if (targetArray[i].id === id) {
      return targetArray[i];
    }
  }
}

function updatePlayerData(array) {
  if (array.length === 1 || array.length === 2) {
    player.stats["weapon"] = array;
  } else if (array.length === 3) {
    player.stats["food"] += array[0];
    player.stats["herbs"] += array[1];
    player.stats["coins"] += array[2];
  }
  stats.updateStats(player);
}
