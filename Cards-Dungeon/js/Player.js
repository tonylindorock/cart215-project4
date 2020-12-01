class Player{
  constructor(){
    this.baseHealth = 30;
    this.baseDamage = 7;
    this.weaponDam = 0;
    this.defence = 0;
    this.critical = 0.15;
    this.weaponCond = 100;
    this.accEffect = 0;
    this.action = "";
    this.dead = false;

    this.perk = 0;

    this.randomPerk();
    this.stats = {
      "combat": this.randomAttribute(0),
      "physique": this.randomAttribute(1),
      "wit": this.randomAttribute(2),
      "charm": this.randomAttribute(3),
      "herbs": 0,
      "food": 0,
      "coins": 0,
      "acc": [""],
      "weapon": [""],
      "health": this.baseHealth
    };
  }

  randomPerk(){
    let temp = int(random(0, 4));
    this.perk = temp;
  }

  randomAttribute(id){
    if (this.perk === id){
      return int(random(50, 70));
    }

    let temp = random();
    if (temp > 0.975){
      return int(random(60, 70));
    }else if (0.8 < temp && temp <= 0.975){
      return int(random(40, 60));
    }else if (0.5 < temp && temp <= 0.8){
      return int(random(20, 40));
    }else{
      return int(random(5, 20));
    }
  }

  outputDamage(){
    let final = 0;
    let damage = this.baseDamage * (1 + this.stats["combat"] * 0.01);
    let weaponBonus = (1 + this.weaponDam * 0.1);
    final += damage * weaponBonus;
    let p = random();
    if (p < this.critical){
      final *= 2;
      console.log("CRITICAL!");
    }
    if(this.stats["weapon"].length === 2){
      this.stats["weapon"][1] -= 1;
      if(this.stats["weapon"][1] <= 0){
        note.update(this.stats["weapon"][0] + " depleted");
        console.log(this.stats["weapon"][0] + " depleted");
        this.stats["weapon"] = [""];
        this.weaponDam = 0;
      }
    }else if (this.stats["weapon"][0] != ""){
      this.weaponCond *= (1 - this.weaponDam * 0.01);
      this.weaponCond = int(this.weaponCond);
      if(this.weaponCond < 25){
        let p = random();
        if (p > (this.weaponDam * 0.1 * 1.7)){
          note.update(this.stats["weapon"][0] + " broken");
          console.log(this.stats["weapon"][0] + " broken");
          this.stats["weapon"] = [""];
          this.weaponDam = 0;
        }
      }
    }
    return int(final);
  }

  receiveDamage(dam){
    this.stats["health"] -= dam;
    this.stats["health"] = int(constrain(this.stats["health"], 0, this.baseHealth));
    if (this.stats["health"] <= 0){
      this.dead = true;
    }
  }

  heal(health){
    this.stats["health"] += health;
    this.stats["health"] = int(constrain(this.stats["health"], 0, this.baseHealth));
  }
}
