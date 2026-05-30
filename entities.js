class Snake {
    constructor(x,y,name,color,isPlayer=false){
        this.x=x;
        this.y=y;
        this.angle=0;
        this.speed=2;
        this.length=10;
        this.body=[];
        this.name=name;
        this.color=color;
        this.isPlayer=isPlayer;
        this.mass=10;
    }

    move(){
        this.x += Math.cos(this.angle)*this.speed;
        this.y += Math.sin(this.angle)*this.speed;

        this.body.push({x:this.x,y:this.y});

        while(this.body.length > this.length){
            this.body.shift();
        }
    }
}

class Food {
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
}

class PowerUp {
    constructor(x,y,type){
        this.x=x;
        this.y=y;
        this.type=type;
    }
}
