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

    this.sliderPos = - this.miniMapWidth * 3.5;
    this.mapRevealed = 7;
    this.sliderMoving = false;

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
  }

  getAttributes(id) {
    if (id = -1) {
      return "Combat: " + this.attributes.combat + "\nPhysique: " + this.attributes.physique +
        "\nWit: " + this.attributes.wit + "\nCharm: " + this.attributes.charm;
    }
  }

  displayValuables(id) {
    let weaponName;
    if (this.valuables.weapon.length === 1) {
      weaponName = this.valuables.weapon[0];
    } else if (this.valuables.weapon.length === 2) {
      weaponName = this.valuables.weapon[0] + " (" + this.valuables.weapon[1] + ")";
    }
    if (id = -1) {
      return "Herbs: " + this.valuables.herbs + "\nFood: " + this.valuables.food +
        "\nCoins: " + this.valuables.coins + "\nWeapon: " + weaponName;
    }
  }

  getWeapons(id){
    let weaponName;
    if (this.valuables.weapon.length === 1) {
      weaponName = this.valuables.weapon[0];
    } else if (this.valuables.weapon.length === 2) {
      weaponName = this.valuables.weapon[0] + " (" + this.valuables.weapon[1] + ")";
    }
    if (id === -1){
      return "Accessory:\n" + this.valuables.acc + "\nWeapon:\n" + weaponName;
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
  }

  display() {
    push();
    fill(WHITE);
    this.displayValuables();
    textSize(16);
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
    textSize(16);
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
      //this.heartTransparency(0);
      image(HEART_FULL, -this.iconWidth * 1.25, 0, this.iconWidth, this.iconWidth);
      pop();
    }
    if (this.health > 10) {
      push();
      //this.heartTransparency(1);
      image(HEART_FULL, 0, 0, this.iconWidth, this.iconWidth);
      pop();
    }
    if (this.health > 20) {
      push();
      //this.heartTransparency(2);
      image(HEART_FULL, this.iconWidth * 1.25, 0, this.iconWidth, this.iconWidth);
      pop();
    }
    image(HEART_EMPTY, -this.iconWidth * 1.25, 0, this.iconWidth, this.iconWidth);
    image(HEART_EMPTY, 0, 0, this.iconWidth, this.iconWidth);
    image(HEART_EMPTY, this.iconWidth * 1.25, 0, this.iconWidth, this.iconWidth);
    pop();
  }

  heartTransparency(num){
    let transparence = this.health;
    transparence = int(map(transparence, num * 10, num * 10 + 10, 0, 255));
    tint(255, transparence);
  }

  displayMiniMap(){
    push();
    fill(BLACK);
    translate(this.x, this.TOP_Y);
    // bg
    stroke(BLACK);
    strokeWeight(4);
    rect(0, 0, this.miniMapStripWidth + 16, this.height, this.CORNER_RADIUS/2);
    // loc
    image(MAP_VILLAGE, - this.miniMapWidth * 3, 0, this.miniMapWidth, this.miniMapHeight);
    fill(BLACK);
    if (this.mapRevealed < 1 ){
      rect(- this.miniMapWidth * 3, 0, this.miniMapWidth, this.miniMapHeight);
    }
    if (this.mapRevealed < 2 ){
      rect(- this.miniMapWidth * 2, 0, this.miniMapWidth, this.miniMapHeight);
    }
    if (this.mapRevealed < 3 ){
      rect(- this.miniMapWidth, 0, this.miniMapWidth, this.miniMapHeight);
    }
    if (this.mapRevealed < 4 ){
      rect(0, 0, this.miniMapWidth, this.miniMapHeight);
    }
    if (this.mapRevealed < 5 ){
      rect(this.miniMapWidth, 0, this.miniMapWidth,this.miniMapHeight);
    }
    if (this.mapRevealed < 6 ){
      rect(this.miniMapWidth * 2, 0, this.miniMapWidth,this.miniMapHeight);
    }
    if (this.mapRevealed < 7 ){
      rect(this.miniMapWidth * 3, 0, this.miniMapWidth,this.miniMapHeight);
    }
    //slider
    fill(WHITE);
    translate(this.sliderPos, 0);
    noStroke();
    //ellipse(0, 0, 8);
    rect(0, 0, 4, this.miniMapHeight * 1.5, 16);
    pop();
    if (this.sliderMoving){
      let time = frameCount;
      if (time % 60 === 0){
        this.sliderPos += this.miniMapWidth/14;
      }
    }
  }
}
