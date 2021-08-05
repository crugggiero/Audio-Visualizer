var song;
var fft;
var freq = 256;
var volume = 1;

var song1 = 'music/Raw Raw Ft. Lil Uzi Vert - Travis Scott (320kbps).mp3';
var song2 = 'music/trilla - A$AP Rocky.mp3';
var song3 = 'music/Travis Scott - Backyard.mp3';
var song4 = 'music/Pretty Lights - Finally Moving.mp3';


function preload() {  }

function setup() {
	createCanvas(1500, 710);
	background(0);
	fft = new p5.FFT(0.6, freq);
	song = loadSound(song4);
}

function draw() {

	background(0);
	var spectrum = fft.analyze();
	var amp;


	//bass tones in background

	for(let i = 0; i < 10; i++) {
		amp = spectrum[i+10];

		if(amp > 180) {
			amp -= 180;
			let level = amp / 10;
			
			for(let j = 0; j < level; j++) {
				let x = 10 + (150 * i);
				let y = height - (j * 100) + 5;
				strokeWeight(1);
				stroke(1);
				fill(221 - i*15, 0 + i*15, 255, 40);
				rect(x, y, 130, 90, 10);
			}
		}
	}


	//center circle

	push();
	translate(width/2, height/2);
	rotate(-PI/2);
	noFill();

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
		stroke(221 - i/1.3, 0 + i/1.3, 255);
		strokeWeight(3);
		arc(0, 0, r, r, ((2*PI)/310)*(i-15), ((2*PI)/310)*(i-14));
	}
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

function impCircle(x,y,cx,cy,r)
{
	return sq(x-cx)+sq(y-cy)-sq(r);
}

function impRect(x,y,x1,y1,dx,dy)
{
	if(x<(x1+dx) && x>x1 && y > y1 && y<(y1+dy))
		return -1;
	else
		return 1;
}