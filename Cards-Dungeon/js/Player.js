class Player{
  constructor(){
    this.stats = {
      "combat": this.randomAttribute(),
      "physique": this.randomAttribute(),
      "experience": this.randomAttribute(),
      "charm": this.randomAttribute(),
      "food": 0,
      "water": 0,
      "meds": 0,
      "weapon": [""],
      "health": 30
    };

    this.action = "";
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
}