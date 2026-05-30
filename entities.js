class Snake {
    constructor(x,y,color,isPlayer=false){
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.speed = 2.5;
        this.body = [];
        this.length = 20;
        this.color = color;
        this.isPlayer = isPlayer;
    }

    move(){
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        this.body.push({x:this.x,y:this.y});

        if(this.body.length > this.length){
            this.body.shift();
        }
    }
}

class Food {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}
