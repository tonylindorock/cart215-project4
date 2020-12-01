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

const DAILY_CARD_COUNT = 6;

const TRADING_EVENT_ID = 5;
const TRADING_ITEMS = ["food", "herbs", "weapon", "acc"];

const ENEMY_TYPE = ["HUMAN", "WARLOCK", "UNDEAD", "CRAWLER", "BEAST", "GUARDIAN"];

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
let note;

let currentLoot;
let conseqClickCount = 0;
let disableArrowKey = false;
let preBattleHealth = 30;
let traderOffer;
let traderPrice = 0;
let accEffect = -1;
let guardianEncounterCount = 0;

let accBonus = {
  damageBonus: 1,
  damageReduction: 1,
  foodHerbsBonus: 1,
  healingBonus: false,
  coinsBonus: 1
};

let gameData = {
  state: {
    "playing": false,
    "day": 1,
    "lost": false,
    "won": false
  },

  eventId: "other",
  currentEvent: -1,
  choices: ["Pick any side", "And click to start"],
  currentLoc: null,
  eventObj: null,

  cardLimit: 4,
  cardDayCount: 1,

  consequenceId: 0,
  hasConsequence: false,
  hasBattle: false
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
var accessoriesJSON;

function preload() {
  eventsJSON = loadJSON("assets/events.json");
  locationsJSON = loadJSON("assets/locations.json");
  weaponsJSON = loadJSON("assets/weapons.json");
  accessoriesJSON = loadJSON("assets/accessories.json");

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

  noCursor();
  randomizeBG();

  setupGame();
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
  player.weaponDam = getWeaponDamage(player.stats["weapon"]);
  // creat ui objects
  stats = new Stats(player);
  note = new Notification();
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
  note.display();
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
  textSize(18 * height / 720);
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
      card.text = gameData.eventObj.text + "\n\na " + loot[0] + "\n\n" + compareWeaponsDam(loot) + " damage\n\n- " + gameData.choices[0] + "\n- " + gameData.choices[1];
      break;
      // ranged
    case 3:
      card.text = gameData.eventObj.text + "\n\na " + loot[0] + " (" + loot[1] + ")" + "\n\n" + compareWeaponsDam(loot) + " damage\n\n- " + gameData.choices[0] + "\n- " + gameData.choices[1];
      break;
    case 4:
      let accName;
      if (loot[1] === "") {
        accName = loot[0];
      } else {
        accName = loot[1] + " " + loot[0];
      }
      card.text = gameData.eventObj.text + "\n\na " + accName + "\n\n" + compareAccessories(loot) + " defence\n" + accessoriesJSON.effect[getAccEffectId(loot)] + "\n\n- " + gameData.choices[0] + "\n- " + gameData.choices[1];
      break;
    case 5:
      card.text = gameData.eventObj.text + "\n\n" + getTradingItem() + "\n\n" + compareItem(traderOffer) + "\n\n- " + gameData.choices[0] + "\n- " + gameData.choices[1];
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
    if (getMousePos() != MOUSE_ON_LEFT) {
      setTimeout(makeChoice, 350, 0);
    } else {
      makeChoice(0);
    }
    disableArrowKey = true;
  } else if (keyCode === RIGHT_ARROW && !card.isPlayingAnimation && !disableArrowKey) {
    card.tiltDir = 1;
    if (getMousePos() != MOUSE_ON_RIGHT) {
      setTimeout(makeChoice, 350, 1);
    } else {
      makeChoice(1);
    }
    disableArrowKey = true;
  }
}

function makeChoice(id) {
  let delay = 450;
  // if the choice has a consequence
  if (conseqClickCount === 0 && gameData.eventObj.choices[id].result != undefined) {
    let hasAttribute = false;
    for (let i = 1; i < gameData.eventObj.choices[id].result.length; i++) {
      // if player has the attribute
      if (gameData.eventObj.choices[id].result[i].attribute != undefined) {
        if (player.stats[gameData.eventObj.choices[id].result[i].attribute[0]] >= gameData.eventObj.choices[id].result[i].attribute[1]) {
          hasAttribute = true;
          gameData.consequenceId = i;
          break;
        }
      }
    }
    if (!hasAttribute) {
      gameData.consequenceId = 0;
      if (gameData.eventObj.enemy != undefined && id === 1) {
        preBattleHealth = player.stats["health"];
        let enemyArray = getEnemy(gameData.eventObj.enemy);
        if (battle(enemyArray[0], enemyArray[1])) {
          gameData.consequenceId = 1;
        }
        gameData.hasBattle = true;
        //card.showClock = true;
        delay += 200;
      }
    }
    gameData.hasConsequence = true;
    gameData.choices[0] = "";
    gameData.choices[1] = "";
    conseqClickCount = 1;
    card.playAnimation(2);
  } else {
    gameData.hasConsequence = false;
    gameData.hasBattle = false;
    conseqClickCount = 0;
    card.playAnimation(id);
  }
  setTimeout(parseChoice, delay, id);
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
  let specialCase = gameData.eventObj.choices[0].caseText;
  if (specialCase != undefined) {
    for (let i = 0; i < specialCase.length; i++) {
      if (gameData.state[specialCase[i][0]] === specialCase[i][1]) {
        choices[0] = specialCase[i][2];
        break;
      }
    }
  }
  specialCase = gameData.eventObj.choices[1].caseText;
  if (specialCase != undefined) {
    for (let i = 0; i < specialCase.length; i++) {
      if (gameData.state[specialCase[i][0]] === specialCase[i][1]) {
        choices[1] = specialCase[i][2];
        break;
      }
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
  } else if (gameData.eventId === "rest") {
    targetArray = eventsJSON.events.rest;
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
    if (conseqObj.playerData != undefined) {
      for (var key in conseqObj.playerData) {
        let value = conseqObj.playerData[key];
        // if changing num
        if (typeof(value) == 'number') {
          // neg or pos
          if (value != 0) {
            let prev = player.stats[key];
            player.stats[key] += value;
            player.stats[key] = constrain(player.stats[key], 0, 100);
            if (value < 0) {
              change += "\n-" + str(abs(player.stats[key] - prev)) + " " + key;
              // player don't have enough food
              if (key === "food") {
                if (prev + value < 0) {
                  console.log("Player out of food");
                  change += "\nRunnning out of food:\n" + "-5 charm";
                  player.stats["charm"] -= 5;
                }
              }
              if (key === "herbs") {
                if (prev + value < 0) {
                  console.log("Player out of herbs");
                  change += "\nRunnning out of herbs";
                }
              }
            } else {
              change += "\n+" + str(value) + " " + key;
            }
            // 0
          } else {
            change += "\n-" + str(player.stats[key]) + " " + key;
            player.stats[key] = value;
          }
          // if adding random num
        } else if (value.includes("+")) {
          let randTemp = int(random(1, 4));
          change += "\n+" + str(randTemp) + " " + key;
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
              if (player.stats["weapon"] != value && value[0] != "") {
                change += "\nYou lost your weapon";
              }
              updatePlayerData(value);
            }
          }
        }
      }
      stats.updateStats(player);
    }
    if (gameData.hasBattle) {
      let healthChange = player.stats["health"] - preBattleHealth;
      if (healthChange > 0) {
        change += "\n+" + str(healthChange) + " health";
      } else {
        change += "\n-" + str(-healthChange) + " health";
      }
    }
    if (conseqObj.next != undefined) {
      if (conseqObj.next === "out") {
        gameData.cardLimit = 0;
        player.action = "";
      }
    }
    if (change === ""){
      card.text = conseqObj.text + "\n\nPick any side to continue";
    }else{
      card.text = conseqObj.text + "\n" + change + "\n\nPick any side to continue";
    }
  } else {
    // change event to the next event
    if (gameData.eventObj.choices[id].next != undefined) {
      if (gameData.eventObj.choices[id].next.constructor === Array) {
        updateEvent(gameData.eventObj.choices[id].next[0], gameData.eventObj.choices[id].next[1]);
        updateCard(0);
        if (player.dead || gameData.state["lost"] || gameData.state["won"]) {
          resetGame(id);
        }
      } else if (gameData.eventObj.choices[id].next === "loc") {
        player.action = "EXPLORING";

        gameData.currentLoc = getLocation(gameData.choices[id]);
        gameData.cardLimit = gameData.currentLoc.size;

        stats.updateMap(gameData.currentLoc);
        console.log("Day " + gameData.state["day"]);
        getExploreEvent();
      }
      // if null, it's a looting event
    } else {
      if (gameData.eventId === "looting") {
        // if finding weapon
        if (gameData.currentEvent === 1 || gameData.currentEvent === 2) {
          // taking the weapon
          if (id === 0) {
            updatePlayerData(currentLoot);
          }
          // if finding supplies
        } else if (gameData.currentEvent === 0) {
          updatePlayerData(currentLoot);
        }
      } else if (gameData.eventId === "travel" && gameData.currentEvent === TRADING_EVENT_ID && id === 0) {
        if (traderPrice <= player.stats["coins"]) {
          player.stats["coins"] -= traderPrice;
          if (traderOffer[0] === "food" || traderOffer[0] === "herbs") {
            player.stats[traderOffer[0]] += traderOffer[1];
          } else {
            updatePlayerData(traderOffer);
          }
        }
      }
      switch (player.action) {
        case "EXPLORING":
          getExploreEvent();
          break;
        case "RESTING":
          getRestEvent();
          break;
        default:
          getTravelEvent();
      }
    }
  }
  // update event on the card
  let title = gameData.eventObj.title;
  if (title.includes("@LOC")) {
    title = title.replace("@LOC", gameData.currentLoc.name);
  }
  card.title = title;
  //card.showClock = false;
  stats.updateStats(player);
  if (player.dead) {
    updateEvent("other", 9);
    card.title = gameData.eventObj.title;
    updateCard(0);
  }
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
  while (gameData.currentEvent === randomTravelEv.id || (gameData.cardDayCount != 0 && randomTravelEv.id === 0)) {
    randomTravelEv = random(eventsJSON.events.travel);
  }
  if (gameData.cardDayCount === 0) {
    randomTravelEv = eventsJSON.events.travel[0];
  }
  updateEvent("travel", randomTravelEv.id);

  if (gameData.state["day"] === 7 && gameData.state["won"]) {
    randomTravelEv = eventsJSON.events.other[11];
    updateEvent("other", randomTravelEv.id);
  } else {
    healPlayer();
  }

  if (gameData.currentEvent === TRADING_EVENT_ID) {
    updateCard(5);
  } else {
    updateCard(0);
  }
  console.log(randomTravelEv.title);
  gameData.cardDayCount += 1;
  if (gameData.cardDayCount >= DAILY_CARD_COUNT - 1) {
    console.log("Player will be resting.");
    player.action = "RESTING";
  }
}

function getRestEvent() {
  let randomRestEv = random(eventsJSON.events.rest);
  while (gameData.currentEvent === randomRestEv.id) {
    randomRestEv = random(eventsJSON.events.rest);
  }
  updateEvent("rest", randomRestEv.id);
  updateCard(0);
  console.log(randomRestEv.title);
  gameData.cardDayCount += 1;
  if (gameData.cardDayCount >= DAILY_CARD_COUNT) {
    console.log("Player will be traveling.");
    player.action = "";
    gameData.cardDayCount = 0;
    gameData.state["day"] += 1;
  }
  healPlayer();
}

function getExploreEvent() {
  let temp = random();
  if (gameData.state["day"] === 7) {
    temp = 0.15;
  }
  if (temp >= 0.3) {
    updateEvent("looting", 0);
    let loot = getLoot();
    currentLoot = loot;
    console.log(loot);
    if (loot.length === 3) {
      updateCard(1, loot);
    } else if (loot.length === 2) {
      if (!isAccessory(loot)) {
        updateEvent("looting", 1);
        updateCard(3, loot);
      } else {
        updateEvent("looting", 2);
        updateCard(4, loot);
      }
    } else {
      updateEvent("looting", 1);
      updateCard(2, loot);
    }
  } else {
    let randomExploreEv = random(eventsJSON.events.explore);

    if (gameData.state["day"] === 7) {
      while (randomExploreEv.enemy === undefined || (randomExploreEv.enemy != undefined && !gameData.currentLoc.spawn.enemy.includes(randomExploreEv.enemy[0])) || (randomExploreEv.enemy[0] === "GUARDIAN" && guardianEncounterCount > 5)) {
        randomExploreEv = random(eventsJSON.events.explore);
      }
    } else {
      while (randomExploreEv.enemy != undefined && !gameData.currentLoc.spawn.enemy.includes(randomExploreEv.enemy[0])) {
        randomExploreEv = random(eventsJSON.events.explore);
      }
    }
    updateEvent("explore", randomExploreEv.id);
    updateCard(0);
    console.log(randomExploreEv.title);
  }
  gameData.cardLimit -= 1;
  if (gameData.cardLimit <= 0) {
    if (gameData.state["day"] === 7) {
      gameData.state["won"] = true;
    }
    console.log("Location exploration is finished.");
    player.action = "";
  }
  stats.nextPos();
  healPlayer();
}

function getLoot() {
  let result = [];
  let temp = random();
  // spawn random loots
  if (temp >= 0.3) {
    let tempItem = random();
    if (tempItem <= gameData.currentLoc.spawn.food) {
      append(result, int(random(1, 4) * accBonus.foodHerbsBonus));
    } else {
      append(result, 0);
    }
    //tempItem = random();
    if (tempItem <= gameData.currentLoc.spawn.herbs) {
      append(result, int(random(1, 4) * accBonus.foodHerbsBonus));
    } else {
      append(result, 0);
    }
    //tempItem = random();
    if (tempItem <= gameData.currentLoc.spawn.coins) {
      append(result, int(random(1, 4) * accBonus.coinsBonus));
    } else {
      append(result, 0);
    }
    // spawn random weapon
  } else {
    let temp2 = random();
    if (temp2 < gameData.currentLoc.spawn.acc) {
      let randWeapon = random();
      if (randWeapon <= gameData.currentLoc.spawn.ranged) {
        let tempRanged = getWeapon("ranged", int(random(weaponsJSON.weapons.ranged.length)))
        append(result, tempRanged.name);
        append(result, tempRanged.ammo);
      } else {
        let tempMelee = getWeapon("melee", int(random(weaponsJSON.weapons.melee.length)));
        append(result, tempMelee.name);
      }
    } else {
      let randAcc = random(accessoriesJSON.acc);
      let randAdj = 0;
      let temp3 = random();
      if (temp3 < 0.25) {
        randAdj = int(random(1, accessoriesJSON.adj.length));
      }
      append(result, randAcc.name);
      append(result, accessoriesJSON.adj[randAdj]);
    }
    return result;
  }
  return result;
}

function getTradingItem() {
  let item = [];
  let price = 0;
  let result;
  let type = random(TRADING_ITEMS);
  switch (type) {
    case "food":
      append(item, "food");
      append(item, int(random(5, 11)));
      price = int(item[1] * 0.5);
      result = item[1] + " food for " + price + " coins.";
      break;
    case "herbs":
      append(item, "herbs");
      append(item, int(random(2, 5)));
      price = item[1] * 2;
      result = item[1] + " herbs for " + price + " coins.";
      break;
    case "weapon":
      let randWeapon = random();
      if (randWeapon < 0.5) {
        let tempRanged = getWeapon("ranged", int(random(weaponsJSON.weapons.ranged.length)))
        append(item, tempRanged.name);
        append(item, tempRanged.ammo);
        price = tempRanged.dam;
        result = "a " + item[0] + " (" + item[1] + ")" + " for " + price + " coins.";
      } else {
        let tempMelee = getWeapon("melee", int(random(weaponsJSON.weapons.melee.length)));
        append(item, tempMelee.name);
        price = tempMelee.dam;
        result = "a " + item[0] + " for " + price + " coins.";
      }
      break;
    case "acc":
      let randAcc = random(accessoriesJSON.acc);
      let randAdj = int(random(1, accessoriesJSON.adj.length));
      append(item, randAcc.name);
      append(item, accessoriesJSON.adj[randAdj]);
      price = 4 + randAcc.def;
      result = "a " + item[1] + " " + item[0] + " for " + price + " coins.";
  }
  traderPrice = price;
  traderOffer = item;
  if (traderPrice > player.stats["coins"]) {
    gameData.choices[0] = "\"I don't have enough coins.\"";
  }
  console.log(traderOffer + " " + traderPrice);
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

function getWeaponDamage(weapon) {
  let weaponDam = 0;
  let targetArray;
  if (weapon.length === 1) {
    if (weapon[0] === "") {
      return weaponDam;
    }
    targetArray = weaponsJSON.weapons.melee;
  } else if (weapon.length === 2) {
    targetArray = weaponsJSON.weapons.ranged;
  }
  for (let i = 0; i < targetArray.length; i++) {
    if (targetArray[i].name === weapon[0]) {
      weaponDam = targetArray[i].dam;
    }
  }
  return weaponDam;
}

function compareItem(item) {
  if (isAccessory(item)) {
    return compareAccessories(item) + " defence\n" + accessoriesJSON.effect[getAccEffectId(item)];
  } else {
    if (item[0] != "food" && item[0] != "herbs") {
      return compareWeaponsDam(item) + " damage";
    }
  }
  return "";
}

function compareWeaponsDam(weapon) {
  let result;
  let num = player.weaponDam - getWeaponDamage(weapon);
  if (num <= 0) {
    result = "+" + (-num);
  } else {
    result = "-" + num;
  }
  return result;
}

function compareAccessories(acc) {
  let result;
  let num = player.defence - getAccessory(acc)["def"];
  if (num <= 0) {
    result = "+" + (-num);
  } else {
    result = "-" + num;
  }
  return result;
}

function getAccessory(id) {
  if (typeof(id) == 'string') {
    for (let i = 0; i < accessoriesJSON.acc.length; i++) {
      if (id === accessoriesJSON.acc[i].name) {
        return accessoriesJSON.acc[i];
      }
    }
  } else if (typeof(id) == 'number') {
    for (let i = 0; i < accessoriesJSON.acc.length; i++) {
      if (id === accessoriesJSON.acc[i].id) {
        return accessoriesJSON.acc[i];
      }
    }
  } else if (typeof(id) == 'object') {
    return getAccessory(id[0]);
  }
}

function getAccEffectId(array) {
  for (let i = 0; i < accessoriesJSON.adj.length; i++) {
    if (array[1] === accessoriesJSON.adj[i]) {
      return i;
    }
  }
}

function isAccessory(array) {
  for (let i = 0; i < accessoriesJSON.acc.length; i++) {
    if (array[0] === accessoriesJSON.acc[i].name) {
      return true;
    }
  }
  return false;
}

function updatePlayerData(array) {
  if (array.length === 1 || array.length === 2) {
    if (isAccessory(array)) {
      player.stats["acc"] = array;
      player.accEffect = array[1];
      player.defence = getAccessory(array)["def"];
      if (!player.dead) {
        if (array[1] === "") {
          note.update("You equipped the " + array[0]);
        } else {
          note.update("You equipped the " + array[1] + " " + array[0]);
        }
      }
      setAccessoryEffect(0);
      setAccessoryEffect(getAccEffectId(array));
      console.log("Player accessory changed.");
    } else {
      player.stats["weapon"] = array;
      player.weaponCond = 100;
      player.weaponDam = getWeaponDamage(array);
      if (!player.dead) {
        if (player.weaponDam != 0) {
          note.update("You equipped the " + array[0]);
        }
      }
      console.log("Player weapon changed.");
    }
  } else if (array.length === 3) {
    player.stats["food"] += array[0];
    player.stats["herbs"] += array[1];
    player.stats["coins"] += array[2];
  }
  stats.updateStats(player);
}

function getEnemy(array) {
  let result = [];
  // specified enemy type
  if (ENEMY_TYPE.includes(array[0])) {
    result.push(array[0]);
  } else {
    result.push(random(gameData.currentLoc.spawn.enemy));
  }
  if (array[1] < 0) {
    result.push(int(random(1, 4)));
  } else {
    result.push(array[1]);
  }
  return result;
}

function battle(enemyType, num) {
  if (enemyType === "GUARDIAN"){
    guardianEncounterCount += 1;
  }
  let enemy;
  console.log("******** BATTLE STARTED ********");
  if (accBonus.healingBonus) {
    player.heal(10);
    note.update("You got 10 healing");
  }
  for (let i = 0; i < num; i++) {
    enemy = new Enemy(enemyType, gameData.state["day"]);
    while (!enemy.dead) {
      console.log("Enemy " + i + ": " + enemy.health);
      console.log("Player: " + player.stats["health"]);
      let p = random();
      if (p >= 0.3 * (1 - player.stats["combat"] * 0.01)) {
        enemy.receiveDamage(player.outputDamage() * accBonus.damageBonus);
      }
      p = random();
      if (p >= 0.5 * (1 + player.stats["physique"] * 0.01)) {
        player.receiveDamage(enemy.getDamage() * accBonus.damageReduction * (1 - player.defence * 0.1));
      }
      // player dies
      if (player.dead || player.stats["health"] <= 0) {
        console.log("Player died " + player.dead + " " + player.stats["health"]);
        console.log("******** BATTLE ENDED ********");
        return false;
      }
      // player loses
      if (preBattleHealth - player.stats["health"] >= int(preBattleHealth / 2)) {
        console.log("Player lost the battle, Health: " + player.stats["health"]);
        console.log("******** BATTLE ENDED ********");
        return false;
      }
    }
  }
  console.log("******** BATTLE ENDED ********");
  return true;
}

function healPlayer() {
  let herbUsed = 0;
  if (player.stats["herbs"] >= 2 && player.stats["health"] <= player.baseHealth - (4 * (1 + player.stats["physique"] * 0.01))) {
    console.log("Player started healing " + player.stats["health"] + " Herbs: " + player.stats["herbs"]);
    while (player.stats["herbs"] - 2 >= 0 && player.baseHealth - player.stats["health"] >= 5) {
      player.heal(4 * (1 + player.stats["physique"] * 0.01));
      player.stats["herbs"] -= 2;
      herbUsed += 2;
    }
    if (herbUsed > 0) {
      note.update("You healed yourself with " + herbUsed + " herbs");
    }
    console.log("Player finished healing " + player.stats["health"] + " Herbs: " + player.stats["herbs"]);
  }
}

function setAccessoryEffect(id) {
  switch (id) {
    // reset
    case 0:
      accBonus.damageBonus = 1;
      accBonus.damageReduction = 1;
      accBonus.foodHerbsBonus = 1;
      accBonus.healingBonus = false;
      accBonus.coinsBonus = 1;
      console.log("Player now has no bonus.");
      break;
    case 1:
      accBonus.damageBonus = 1.25;
      console.log("Player now has combat bonus.");
      break;
    case 2:
      accBonus.damageReduction = (1 - 0.35);
      console.log("Player now has damage reduction.");
      break;
    case 3:
      accBonus.foodHerbsBonus = 1.5;
      console.log("Player now has food & herbs bonus.");
      break;
    case 4:
      accBonus.healingBonus = true;
      console.log("Player now has healing bonus.");
      break;
    case 5:
      accBonus.coinsBonus = 1.35;
      console.log("Player now has coins bonus.");
  }
  accEffect = id;
}

function resetGame(id) {
  gameData.state["playing"] = false;
  gameData.state["lost"] = false;
  gameData.state["won"] = false;
  gameData.state["day"] = 1;
  guardianEncounterCount = 0;
  // reset player
  player = new Player();
  let firstWeapon = getWeapon("melee", int(random(weaponsJSON.weapons.melee.length)));
  player.stats["weapon"][0] = firstWeapon.name;
  player.weaponDam = getWeaponDamage(player.stats["weapon"]);
  // reset stats ui
  stats = new Stats(player);
  stats.updateStats(player);
  if (id === 1) {
    randomizeBG();
    card.color = themeColor;
  }
}
