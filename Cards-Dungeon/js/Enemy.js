// This is a class to represent an enemy
class Enemy{
  constructor(type, level){
    this.type = type;
    this.level = level;

    this.baseHealth = 20;
    this.baseDamage = 10;

    this.health = int(this.baseHealth * (1 + this.level * 0.1));
    this.damage = this.baseDamage * (1 + this.level * 0.1);

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
