// This is a class to represent an enemy
class Enemy{
  constructor(type, level){
    this.type = type;
    this.level = level;

    switch(this.type){
      case "HUMAN":
        this.baseHealth = 9;
        this.baseDamage = 3;
        break;
      case "WARLOCK":
        this.baseHealth = 9;
        this.baseDamage = 6;
        break;
      case "UNDEAD":
        this.baseHealth = 7;
        this.baseDamage = 2;
        break;
      case "CRAWLER":
        this.baseHealth = 8;
        this.baseDamage = 4;
        break;
      case "BEAST":
        this.baseHealth = 10;
        this.baseDamage = 6;
        break;
      case "GUARDIAN":
        this.baseHealth = 11;
        this.baseDamage = 7;
    }

    this.health = int(this.baseHealth * (1 + this.level * 0.07));
    this.damage = int(this.baseDamage * (1 + this.level * 0.07));

    this.dead = false;
  }

  getDamage(){
    return this.damage;
  }

  receiveDamage(dam){
    this.health -= dam;
    this.health = constrain(this.health, 0, int(this.baseHealth * (1 + this.level * 0.1)));
    if (this.health === 0){
      this.dead = true;
    }
  }
}
