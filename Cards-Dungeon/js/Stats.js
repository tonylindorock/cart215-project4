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

    this.iconWidth = 32;

    this.top_y = this.height / 1.25;
    this.bottom_y = height - this.height / 1.25;

    this.CORNER_RADIUS = 8;

    this.attributes = {
      combat: player.stats["combat"],
      physique: player.stats["physique"],
      wit: player.stats["wit"],
      charm: player.stats["charm"]
    };
    this.possessions = {
      herbs: 0,
      food: 0,
      coins: 0,
      amour: player.stats["amour"],
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

  getSupplies(id) {
    let weaponName;
    if (this.possessions.weapon.length === 1) {
      weaponName = this.possessions.weapon[0];
    } else if (this.possessions.weapon.length === 2) {
      weaponName = this.possessions.weapon[0] + " (" + this.possessions.weapon[1] + ")";
    }
    if (id = -1) {
      return "Herbs: " + this.possessions.herbs + "\nFood: " + this.possessions.food +
        "\nCoins: " + this.possessions.coins + "\nWeapon: " + weaponName;
    }
  }

  updateStats(player) {
    this.attributes.combat = player.stats["combat"];
    this.attributes.physique = player.stats["physique"];
    this.attributes.wit = player.stats["wit"];
    this.attributes.charm = player.stats["charm"];
    this.possessions.herbs = player.stats["herbs"];
    this.possessions.food = player.stats["food"];
    this.possessions.coins = player.stats["coins"];
    this.possessions.amour = player.stats["amour"];
    this.possessions.weapon = player.stats["weapon"];
    this.health = player.stats["health"];
  }

  display() {
    push();
    //fill("#555");
    //rect(this.x - width/3, height - this.height/3.5, this.width / 1.25, 32, this.CORNER_RADIUS);
    //rect(this.x + width/3, height - this.height/3.5, this.width / 1.25, 32, this.CORNER_RADIUS);
    fill(WHITE);
    textSize(16);
    textAlign(RIGHT);
    text(this.getAttributes(-1), this.x - width / 3.25, height - this.height);
    text(this.getSupplies(-1), this.x + width / 2.75, height - this.height);
    //text("[Z] SHOW ATTRITUBES",this.x - width/3, height - this.height/3.5);
    //text("[X] SHOW RESOURCES",this.x + width/3, height - this.height/3.5);
    // top
    textAlign(CENTER);
    textSize(32);
    text("DAY 1 | MORNING", this.x, this.top_y);
    // health
    this.displayHealth();
    pop();
  }

  displayHealth() {
    push();
    translate(this.x, this.bottom_y);
    if (this.health > 0) {
      push();
      this.heartTransparency(0);
      image(HEART_FULL, -this.iconWidth * 1.25, 0, this.iconWidth, this.iconWidth);
      pop();
    }
    if (this.health > 10) {
      push();
      this.heartTransparency(1);
      image(HEART_FULL, 0, 0, this.iconWidth, this.iconWidth);
      pop();
    }
    if (this.health > 20) {
      push();
      this.heartTransparency(2);
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
}
