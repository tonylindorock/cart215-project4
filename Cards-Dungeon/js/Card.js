// Card
//
//
class Card{
  constructor(title, text, color){
    // position
    this.x = width/2;
    this.y = height/2;
    // size
    this.height = height * 0.6;
    this.width = this.height * 2.5/3.5;

    this.CORNER_RADIUS = 24;
    this.border = 10;

    this.WIDTH_MARGIN = 0.8;
    this.HIEGHT_MARGIN = 0.85;
    this.textWidth = this.width * this.WIDTH_MARGIN;
    this.textHeight = this.height * this.HIEGHT_MARGIN;

    this.color = color;
    this.title = title;
    this.text = text;

    this.rotation = 0;
    this.MAX_DEGREE = 8;

    this.isPlayingAnimation = false;
    this.animationId = -1;
    this.change = 0;
    this.changeWidth = 0;
    this.flippedSideOne = false;
  }

  tilt(){
    translate(this.x + 2 * this.rotation, this.y);
    if (mouseX > width/2 + card.width/2){
      this.rotation = lerp(this.rotation, this.MAX_DEGREE, 0.1);
    }else if (mouseX < width/2 - card.width/2){
      this.rotation = lerp(this.rotation, -this.MAX_DEGREE, 0.1);
    }else{
      this.rotation = lerp(this.rotation, 0, 0.1);
    }
    rotate(this.rotation);
  }

  flyAway(){
    translate(this.x + 2 * this.rotation + this.change, this.y);
    rotate(this.rotation);
    if (this.animationId === 0){
      this.change = lerp(this.change, -width/2 * 1.5, 0.06);
      if (this.change <= -width/2 * 1.25 + 1){
        this.reset();
        //this.playAnimation(2);
      }
    }else if (this.animationId === 1){
      this.change = lerp(this.change, width/2 * 1.5, 0.06);
      if (this.change >= width/2 * 1.25 - 1){
        this.reset();
        //this.playAnimation(2);
      }
    }
  }

  flip(){
    translate(this.x, this.y - this.changeWidth/8);
    if (!this.flippedSideOne){
      this.changeWidth = lerp(this.changeWidth, this.width, 0.2);
    }else{
      this.changeWidth = lerp(this.changeWidth, 0, 0.2);
    }
    if(int(this.changeWidth) === int(this.height * 2.5/3.5)){
      this.flippedSideOne = true;
    }else if (int(this.changeWidth) === 0){
      this.reset();
    }
  }

  playAnimation(id){
    this.animationId = id;
    this.isPlayingAnimation = true;
  }

  reset(){
    this.rotation = 0;
    this.change = 0;
    this.animationId = -1;
    this.flippedSideOne = false;
    this.isPlayingAnimation = false;
  }

  display(){
    // card stack
    push();
    fill(68, 68, 68, 200);
    rect(this.x, this.y, this.width + 48, this.height + 48, this.CORNER_RADIUS * 2);
    fill(WHITE);
    stroke(this.color);
    strokeWeight(this.border);
    rect(this.x, this.y, this.width, this.height, this.CORNER_RADIUS);
    pop();
    // front card
    push();
    if (this.animationId >= 0 && this.animationId < 2){
      this.flyAway();
    }else if (this.animationId === 2){
      this.flip();
    }else{
      this.tilt();
    }

    fill(WHITE);
    stroke(this.color);
    strokeWeight(this.border);
    rect(0, 0, this.width - this.changeWidth, this.height, this.CORNER_RADIUS);
    noStroke();
    fill(BLACK);
    textSize(18);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    if (this.animationId != 2){
      // title
      text(this.title, 0, 0, this.textWidth, this.textHeight);
      // text
      textSize(18);
      textStyle(NORMAL);
      text("\n\n\n" + this.text, 0, 0, this.textWidth, this.textHeight);
    }
    pop();
  }
}