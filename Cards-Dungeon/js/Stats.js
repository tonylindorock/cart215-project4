// Stats
//
//
class Stats {
  constructor(player) {
    // position
    this.x = width / 2;
    this.y = height / 2;

    this.height = height / 10;
    this.width = height * 0.6 * 2.5 / 3.5;

    this.miniMapStripWidth = this.width * 2;
    this.miniMapWidth = this.miniMapStripWidth / 7;
    this.miniMapHeight = this.miniMapWidth/2;

    this.iconWidth = 32;

    this.TOP_Y = this.height / 1.25;
    this.BOTTOM_Y = height - this.height / 1.75;
    this.MARGIN_EDGE = this.height / 1.25;

    this.CORNER_RADIUS = 8;

    this.maps = [];

    this.sliderPos = - this.miniMapWidth * 3.5;
    this.mapRevealed = 0;
    this.step = 4;
    this.currentStep = 0;

    this.attributes = {
      combat: player.stats["combat"],
      physique: player.stats["physique"],
      wit: player.stats["wit"],
      charm: player.stats["charm"]
    };
    this.valuables = {
      herbs: player.stats["herbs"],
      food: player.stats["food"],
      coins: player.stats["coins"],
      acc: player.stats["acc"],
      weapon: player.stats["weapon"]
    };
    this.health = 30;
    this.weaponCond = 100;
  }

  getAttributes(id) {
    if (id = -1) {
      return "Combat: " + this.attributes.combat + "\nPhysique: " + this.attributes.physique +
        "\nWit: " + this.attributes.wit + "\nCharm: " + this.attributes.charm;
    }
  }

  getWeapons(id){
    let weaponName;
    if (this.valuables.weapon.length === 1) {
      weaponName = this.valuables.weapon[0];
      if (this.valuables.weapon[0] != ""){
        weaponName += " (" + this.weaponCond + "%)";
      }
    } else if (this.valuables.weapon.length === 2) {
      weaponName = this.valuables.weapon[0] + " (" + this.valuables.weapon[1] + ")";
    }
    let accName;
    if(this.valuables.acc.length === 2){
      accName = this.valuables.acc[1] + " " + this.valuables.acc[0];
    }else{
      accName = "";
    }
    if (id === -1){
      return "Accessory:\n" + accName + "\nWeapon:\n" + weaponName;
    }
  }

  updateStats(player) {
    this.attributes.combat = player.stats["combat"];
    this.attributes.physique = player.stats["physique"];
    this.attributes.wit = player.stats["wit"];
    this.attributes.charm = player.stats["charm"];
    this.valuables.herbs = player.stats["herbs"];
    this.valuables.food = player.stats["food"];
    this.valuables.coins = player.stats["coins"];
    this.valuables.acc = player.stats["acc"];
    this.valuables.weapon = player.stats["weapon"];
    this.health = player.stats["health"];
    this.weaponCond = player.weaponCond;
  }

  updateMap(mapObj){
    this.maps.push(MAPS[mapObj.id]);
    this.step = mapObj.size;
    this.mapRevealed += 1;
  }

  nextPos(){
    this.sliderPos += this.miniMapWidth/this.step;
    this.currentStep += 1;
  }

  display() {
    push();
    fill(WHITE);
    this.displayValuables();
    textSize(16 * height/720);
    textAlign(RIGHT);
    text(this.getAttributes(-1), this.x - width / 3.25, height - this.height);
    textAlign(LEFT);
    text(this.getWeapons(-1), this.x + width / 3.25, height - this.height);
    // top
    this.displayMiniMap()
    // health
    this.displayHealth();
    pop();
  }

  displayValuables(){
    push();
    textSize(16 * height/720);
    translate(this.x - this.iconWidth/2, this.BOTTOM_Y - this.iconWidth * 1.25);
    image(ICON_FOOD, -this.iconWidth * 2, 0, this.iconWidth, this.iconWidth);
    text(this.valuables.food, -this.iconWidth * 2 + this.iconWidth, 0);

    image(ICON_HERB, 0, 0, this.iconWidth, this.iconWidth);
    text(this.valuables.herbs, this.iconWidth, 0);

    image(ICON_COIN, this.iconWidth * 2, 0, this.iconWidth, this.iconWidth);
    text(this.valuables.coins, this.iconWidth * 2 + this.iconWidth, 0);
    pop();
  }

  displayHealth() {
    push();
    translate(this.x, this.BOTTOM_Y);
    if (this.health > 0) {
      push();
      image(HEART_FULL, -this.iconWidth * 1.25, 0, this.heartSize(0), this.heartSize(0));
      pop();
    }
    if (this.health > 10) {
      push();
      image(HEART_FULL, 0, 0, this.heartSize(1), this.heartSize(1));
      pop();
    }
    if (this.health > 20) {
      push();
      image(HEART_FULL, this.iconWidth * 1.25, 0, this.heartSize(2), this.heartSize(2));
      pop();
    }
    image(HEART_EMPTY, -this.iconWidth * 1.25, 0, this.iconWidth, this.iconWidth);
    image(HEART_EMPTY, 0, 0, this.iconWidth, this.iconWidth);
    image(HEART_EMPTY, this.iconWidth * 1.25, 0, this.iconWidth, this.iconWidth);
    pop();
  }

  heartSize(num){
    return int(map(this.health, num * 10, num * 10 + 10, 10, this.iconWidth, true));
  }

  displayMiniMap(){
    push();
    fill(BLACK);
    translate(this.x, this.TOP_Y);
    // bg
    stroke(BLACK);
    strokeWeight(4);
    rect(0, 0, this.miniMapStripWidth + 16, this.height, this.CORNER_RADIUS/2);
    fill(WHITE);
    for(let i = 0; i < 4; i++){
      ellipse(- this.miniMapWidth * i, 0, 8);
      ellipse(this.miniMapWidth * i, 0, 8);
    }
    // loc
    if (this.mapRevealed >= 1 ){
      image(this.maps[0], - this.miniMapWidth * 3, 0, this.miniMapWidth, this.miniMapHeight);
    }
    if (this.mapRevealed >= 2 ){
      image(this.maps[1], - this.miniMapWidth * 2, 0, this.miniMapWidth, this.miniMapHeight);
    }
    if (this.mapRevealed >= 3 ){
      image(this.maps[2], - this.miniMapWidth, 0, this.miniMapWidth, this.miniMapHeight);
    }
    if (this.mapRevealed >= 4 ){
      image(this.maps[3], 0, 0, this.miniMapWidth, this.miniMapHeight);
    }
    if (this.mapRevealed >= 5 ){
      image(this.maps[4], this.miniMapWidth, 0, this.miniMapWidth, this.miniMapHeight);
    }
    if (this.mapRevealed >= 6 ){
      image(this.maps[5], this.miniMapWidth * 2, 0, this.miniMapWidth, this.miniMapHeight);
    }
    if (this.mapRevealed >= 7 ){
      image(this.maps[6], this.miniMapWidth * 3, 0, this.miniMapWidth, this.miniMapHeight);
    }
    //slider
    translate(this.sliderPos, 0);
    //rect(0, 0, 4, this.miniMapHeight * 1.5, 16);
    noStroke();
    fill(68, 68, 68, 200);
    ellipse(0, 0, 34);
    fill(themeColor);
    stroke(WHITE);
    strokeWeight(4);
    ellipse(0, 0, 24);
    fill(WHITE);
    noStroke();
    ellipse(0, 0, 12);
    pop();
  }
}
