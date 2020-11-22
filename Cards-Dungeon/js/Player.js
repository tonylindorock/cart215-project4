class Player{
  constructor(){
    this.stats = {
      "combat": this.randomAttribute(),
      "physique": this.randomAttribute(),
      "wit": this.randomAttribute(),
      "charm": this.randomAttribute(),
      "herbs": 0,
      "food": 0,
      "coins": 0,
      "acc": "",
      "weapon": [""],
      "health": 30
    };

    this.baseDamage = 7;
    this.critical = 0.15;
    this.weaponCond = 100;
    this.action = "";
    this.dead = false;
  }

  randomAttribute(){
    let temp = random();
    if (temp > 0.975){
      return int(random(75, 80));
    }else if (0.8 < temp && temp <= 0.975){
      return int(random(50, 75));
    }else if (0.5 < temp && temp <= 0.8){
      return int(random(25, 50));
    }else{
      return int(random(1, 25));
    }
  }

  getWeaponDamage(){
    let weaponDam = 0;
    let targetArray;
    if (this.stats["weapon"].length === 1) {
      targetArray = weaponsJSON.weapons.melee;
    } else if (this.stats["weapon"].length === 2) {
      targetArray = weaponsJSON.weapons.ranged;
    }
    for (let i = 0; i < targetArray.length; i++) {
      if (targetArray[i].name === this.stats["weapon"][0]) {
        weaponDam = targetArray[i].dam;
      }
    }
    return weaponDam;
  }

  outputDamage(){
    let final = 0;
    let damage = this.baseDamage * (1 + this.stats["combat"] * 0.01);
    let weaponBonus = (1 + this.getWeaponDamage() * 0.1);
    final += damage * weaponBonus;
    let p = random();
    if (p < this.critical){
      final *= 2;
    }
    if(this.stats["weapon"].length === 2){
      this.stats["weapon"][1] -= 1;
      if(this.stats["weapon"][1] <= 0){
        console.log(this.stats["weapon"][0] + " depleted");
        this.stats["weapon"] = [""];
      }
    }else if (this.stats["weapon"][0] != ""){
      this.weaponCond *= (1 - (this.getWeaponDamage() * 0.1 * 1.3));
      this.weaponCond = int(this.weaponCond);
      if(this.weaponCond < 25){
        let p = random();
        if (p < (this.getWeaponDamage() * 0.1 * 1.3)){
          console.log(this.stats["weapon"][0] + " broken");
          this.stats["weapon"] = [""];
        }
      }
    }
    return int(final);
  }

  receiveDamage(dam){
    this.stats["health"] -= dam;
    this.stats["health"] = constrain(this.stats["health"], 0, 30);
    if (this.stats["health"] === 0){
      this.dead = true;
    }
  }
}
