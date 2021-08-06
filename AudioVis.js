var song;
var fft;
var button;
var freq = 256;
var volume = 1;
var opacity = 256;
var name = 'music/Pretty Lights - Finally Moving.mp3';


function preload() { 
	song = loadSound(name); 
	button = loadImage('images/button.png');
}

function setup() {
	createCanvas(windowWidth - 20, windowHeight - 10);
	background(0);
	fft = new p5.FFT(0.6, freq);
}

function grid() {
	push();
	translate(width/2, height/2);

	strokeWeight(.5);
	noFill();
	stroke(255, 0, 0);
	line(-1000, 0, 1000, 0);
	line(0, -500, 0, 500);
	pop();

}

function draw() {

	background(0);
	var spectrum = fft.analyze();
	var amp;
	var dx = 0;

	if(song.isPlaying())
		dx = -16;
	else
		dx = 16;
	
	if(opacity > 0 && dx < 0)
		opacity += dx;
	if(opacity <= 256 && dx > 0)
		opacity += dx;

	playButton(opacity);

	//bass tones in background

	noStroke();

	for(let i = 0; i < 10; i++) {
		amp = spectrum[i+10];

		if(amp > 180) {
			amp -= 180;
			let level = amp / 10;
			
			for(let j = 0; j < level; j++) {
				let x = (width*.096) * i;
				let y = height - (j * 100) + 5;
				strokeWeight(1);
				stroke(1);
				fill(221 - i*15, 0 + i*15, 255, 40);
				rect(x + width/33, y, width*.087, 90, 10);
			}
		}
	}

	//center circle

	push();
	translate(width/2, height/2);
	rotate(-PI/2);
	noFill();
	strokeWeight(3);

	for(let i = 15; i < 325; i++) {

		if(i < 169)
			amp = spectrum[i];

		else if(i == 169 || i == 171)
			amp = spectrum[168] / 2;
		
		else if(i == 170)
			amp = spectrum[168] / 1.3;

		else
			amp = spectrum[340 - i];

		var r = map(amp, 0, 256, 200, 400);
		stroke(221 - i/1.3, i/1.3, 255);
		arc(0, 0, r, r, ((2*PI)/310)*(i-15), ((2*PI)/310)*(i-14));
	}

	pop();
}

function playButton(opacity) {

	push();
	translate(width/2 - 47, height/2 - 50);
	scale(.2, .2);
	tint(opacity);
	image(button, 0, 0);
	pop();

}

function mouseClicked() {
	if(impCircle(mouseX, mouseY, width/2, height/2, 100) < 0)
		toggle();
}

function keyPressed() {

	//spacebar
	if(keyCode == 32)
		toggle();

	//
	if(keyCode == 39)
		song.jump(29, 45);
	
	//up arrow
	if(keyCode == 38) {
		if(volume < 1)
			volume += .05;
		masterVolume(volume);
	}

	//down arrow
	if(keyCode == 40) {
		if(volume > 0)
			volume -= .05 ;
		masterVolume(volume);
	}
 
}

function toggle() {
	if(song.isPlaying()) {
		console.log("Song is now paused");
		song.pause();
	} else {
		song.play();
		console.log("song is now playing");
	}
}

function impCircle(x,y,cx,cy,r) {
	return sq(x-cx)+sq(y-cy)-sq(r);
}

function impRect(x,y,x1,y1,dx,dy) {
	if(x<(x1+dx) && x>x1 && y > y1 && y<(y1+dy))
		return -1;
	else
		return 1;
}