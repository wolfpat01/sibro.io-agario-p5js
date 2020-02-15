var socket;
var player;
var players = [];
var foods = [];
var zoom = 1;
var id = '';
var indexofplayer = 0;
var nickname = '';
function login() {
    nickname = document.getElementById("nickname").value;
    var blobs = [];
    blobs.push(new Blob(random(-width, width), random(-height, height), 50));
    player = new Player(socket.id, 'Guest');
    //player.blobs = blobs;
    socket.on('connect', function () {
        player.id = socket.id;
        var data = {
            x: player.pos.x,
            y: player.pos.y,
            c: color(random(100, 255), random(0, 120), random(0, 120)),
            Blobs: player.blobs,
            id: player.id,
            nickname: nickname
        }; socket.emit('ready', data);
    });

}
// controls
var pos = 200;
function mouseWheel(event) {
    //to zoom in and out
    pos += event.delta;
    pos = constrain(pos, 1, 2001);
}
function keyPressed() {
    if (key === 's') {
        console.log('SPACEBAR DETECTED');
        //we need it to tell the server that 
        //it got pressed
        data = { id: player.id };
        socket.emit('split', data);
    }
}
function setup() {
    socket = io.connect('http://localhost:3000/');
    this.connecttotheserver = function () {
        socket = io.connect('http://localhost:3000/');
    }
    document.getElementById("play").onclick = function () {
        socket = io.connect('http://localhost:3000/');
        login();
    }
    login();
    socket.on('updatepipis', updatepeeps);
    socket.on('updateyamies', updateyamies);
    socket.on('warfeilddata', warfeilddata);

}

function searchindexwithid(id) {
    for (var i = 0; i < players.length; i++) {
        if (this.players[i].id == id) {
            return i;
        }
    }
}
function draw() {

    createCanvas(windowWidth, windowHeight - 22);
    //background(255);
    fill(240);
    square(width, height, 100);
    translate(width / 2, height / 2);
    for (let i = 0; i < players.length; i++) {
        if (player.id == players[i].id) {
            indexofplayer = i;
            player.r = players[i].r;
        }
    }
    var newzoom = pos;
    zoom = lerp(zoom, newzoom, 0.2);
    //console.log(newzoom);
    scale(120 /  (zoom));
    translate(-player.pos.x, -player.pos.y);


    //fill(100);
    //square(-5000, -5000, 10000);

    for (let index = 0; index < foods.length; index++) {
        foods[index].show();
    }
    for (let index = 0; index < players.length; index++) {
        players[index].show();
    }

    player.update();
    //console.log(player.pos);
    //player.show();
    // player.constrain();

    var data = {
        velx: player.vx,
        vely: player.vy,
        id: player.id
    };
    socket.emit('updateplayer', data);

}
function updatepeeps(pips) {
    players = [];

    for (let i = 0; i < pips.length; i++) {
        players[i] = new Player(pips[i].id, pips[i].nickname);
        players[i].r = pips[i].r;
        var blobs = [];
        // players[i].updatepos(pips[i].x, pips[i].y);
        for (var j = 0; j < pips[i].blobs.length; j++) {
            var newblob = new Blob(pips[i].blobs[j].x, pips[i].blobs[j].y, pips[i].blobs[j].r);
            
            blobs.push(newblob);
            players[i].blobs = blobs;
           //console.log(" has "+ blobs.length);
        }

        if (player.id == pips[i].id) {
            //player.updatepos(pips[i].x, pips[i].y);
            player.r = lerp(parseInt(player.r), pips[i].r, 0.8);
            indexofplayer = i;
        }
        //console.log('list players updated' );


    }
}
function updateyamies(yam) {
    foods = [];
    for (var i = 0; i < yam.length; i++) {
        foods[i] = new Food(0, yam[i].x, yam[i].y, yam[i].r, yam[i].id);
    }
}
function warfeilddata(data) {
    if (data.aterid == player.id) {
        console.log("You KILLED HIM");
    } else if (data.atenid == player.id) {
        console.log("You are dead");
        imspectating()
    }
}
function imspectating() {

}


