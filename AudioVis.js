var song;
var fft;
var button;
var fullscreenIcon;
var freq = 256;
var volume = 1;
var playOpacity = menuOpacity = 256;
var name = 'music/Pretty Lights - Finally Moving.mp3';


function preload() 
{ 
	song = loadSound(name); 
	button = loadImage('images/button.png');
	fullscreenIcon = loadImage('images/fullscreen.png');
}

function setup() 
{
	createCanvas(windowWidth - 20, windowHeight - 10);
	background(0);
	fft = new p5.FFT(0.6, freq);
}

function grid() 
{
	push();
	translate(width/2, height/2);
	strokeWeight(.5);
	noFill();
	stroke(255, 0, 0);
	line(-1000, 0, 1000, 0);
	line(0, -500, 0, 500);
	pop();

}

function draw() 
{

	background(0);


	fill(255);
    stroke(255);
    strokeWeight(1);
    textSize(10);
    text(mouseX, 10, 10);
    text(mouseY, 60, 10);

	var amp;
	var dx = 0;
	var spectrum = fft.analyze();


	if(song.isPlaying())
		dx = -16;
	else
		dx = 16;

	if(playOpacity > 0 && dx < 0)
		playOpacity += dx;
	if(playOpacity <= 256 && dx > 0)
		playOpacity += dx;

	playButton(playOpacity);

	if(keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW))
		keyPressed();

	//bass tones in background
	noStroke();

	for(let i = 0; i < 10; i++)
	{
		amp = spectrum[i+10];

		if(amp > 180)
		{
			amp -= 180;
			let level = amp / 10;
			
			for(let j = 0; j < level; j++)
			{
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

	for(let i = 15; i < 325; i++)
	{
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

	displayMenu(menuOpacity);
}

function playButton(playOpacity)
{
	if(playOpacity == 0)
		return;

	push();
	translate(width/2 - 47, height/2 - 50);
	scale(.2, .2);
	tint(playOpacity);
	image(button, 0, 0);
	pop();

}

function displayMenu(menuOpacity)
{
	if(menuOpacity == 0)
		return;

	push();

	//volumeBar
	stroke(200, menuOpacity);
	strokeWeight(4);
	line(width - 260, height - 15, width - 60, height - 15);

	stroke(255, menuOpacity);
	strokeWeight(6);
	line(width - 260, height - 15,
		width - 260 + map(volume, 0, 1, 0, 200), height - 15);
	ellipse(width - 260 + map(volume, 0, 1, 0, 200), height - 15, 10);

	//fullscreen icon
	translate(width - 36, height - 28);
	scale(.1, .1);
	image(fullscreenIcon, 0, 0);
	pop();


}

function mouseClicked()
{
	if(impCircle(mouseX, mouseY, width/2, height/2, 100) < 0)
		toggle();
	if(impRect(mouseX, mouseY, width - 36, height - 30, 26, 26) < 0)
	{
		let screen = fullscreen();
		fullscreen(!screen);
	}

	
}

function keyPressed()
{
	//spacebar
	if(keyCode == 32)
		toggle();

	//
	if(keyCode == 39)
		song.jump(29, 45);
	
	//up arrow
	if(keyCode == 38)
	{
		if(volume < 1)
			volume += .01;
		masterVolume(volume);
	}

	//down arrow
	if(keyCode == 40)
	{
		if(volume > 0)
			volume -= .01 ;
		masterVolume(volume);
	}
 
}

function windowResized()
{
  //resizeCanvas(windowWidth - 20, windowHeight - 10);
}

function toggle()
{
	if(song.isPlaying())
		song.pause();
	else
		song.play();
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