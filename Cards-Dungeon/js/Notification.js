class Notification {
  constructor() {
    this.height = height / 16;
    this.width = width / 2.5;

    this.x = width / 2;
    this.y = this.height / 1;

    this.yChange = -(this.height / 1.25) * 2;

    this.CORNER_RADIUS = 8;

    this.text = "This is a notification.";
    this.notify = false;
  }

  update(text) {
    this.yChange = -(this.height / 1.25) * 2;

    this.text = text;
    this.notify = true;
    var thisNote = this;
    setTimeout(function() {
      thisNote.notify = false;
    }, 3000);
  }

  display() {
    push();
    if (this.notify) {
      this.yChange = lerp(this.yChange, 0, 0.1);
    } else {
      this.yChange = lerp(this.yChange, -this.y * 2, 0.1);
    }
    translate(this.x, this.y + this.yChange);
    rect(0, 0, this.width, this.height, this.CORNER_RADIUS);
    textSize(14 * height / 720);
    text(this.text, 0, 0, this.width, this.height);
    pop();
  }
}
