/*

This is an Audio Visualiser, feel free to use it and remix it, just give credit.

All the music comes from IncredFx, check him out:
https://soundcloud.com/incredfx

*/


function setup() {
	createCanvas(windowWidth, windowHeight);
	background(360);
	strokeWeight(10)
	noFill();
	colorMode(HSB);
	strokeCap(ROUND); //PROJECT for rectangles, ROUND for circles and rounded rectangles
	
	sound = 1; // Used by load to check if sound has been properly loaded or not

	//Load the first song
	song = 1
	load(song) // This function just loads in a song by number
	
	radius = height*2.03/8; // Radius of the circle made

	number = 90; // Number of points making up the circle
	
	baseAngle = -PI*1.1;
	angle = baseAngle; // Used to draw the circle of points
	
	frameRate(60000000000000000000000000000000000000000000000000000000000000000000000);
	translate(width/2, height/2);
	rotate(PI/3.0);
	
	fft = new p5.FFT(); // This allows us to then generate a waveform and spectrum
	
	amplitude = new p5.Amplitude();
	amplitude.setInput(sound);
	
	rec = 0; // This only needs to be non-zero if using strokeCap(Project), since it means they will be properly rotated
	img=loadImage("https://github.com/juddcraft12/music/blob/534694c58cc60026f46c9d9e6587172a48456e6b/Ignus%20logo.png")
}

function draw() {
	background(0);
	image(img,110,0,1150,610)
	if(sound.isLoaded()){
		if(sound.isPlaying() == false && sound.isPaused() == false){ // Will return true if a sound has just been loaded in
			sound.play();
			fft = new p5.FFT(); // Generate a new Fourier Transform for the new track
			amplitude.setInput(sound);
		}
	}
	else{
		sound.pause(); // This will trigger while waiting for a new track to load
	}
	
	magnitude = radius/20
	angle = baseAngle;
	
	var spectrum = fft.analyze(); // This is what gives us the shape
	var waveform = fft.waveform(); // I am not using waveform but it's here if you want it
	////////
	
	beginShape();
	translate(width/2, height/2);
	for(var i = 0; i < number; i++){
		
		spec = spectrum[i*2]; // Most of the 1024 parts of the spectrum are unused, we only need 1-200ish really (does depend on the song)
		
		size = sq(map(spec, 0, 255, 0, 1)); // Squaring the map() just means there is a bigger difference between the highs and the lows
		
		level = amplitude.getLevel(); // Get the current volume
		
		x1 = sin(angle)*radius; // Get the inner coords of the point on the circle using trig
		y1 = cos(angle)*radius;

		modifier = (1 + size/2)*(1+level/10) + rec; // This basically calculates the length of each line, play around with the values!
		
		x2 = x1 * modifier; // Get the second set of coords for the end of the line
		y2 = y1 * modifier;

		strokeWeight((level+1)*6); // Change line width based on volume
		
		stroke(i*(360/number), (30*level)+55, 360); // Rainbow colours
		line(x1, y1, x2, y2);
		angle += -TWO_PI/number;
	}
	endShape();	
	//////
}

function keyPressed() {
	if(keyCode == RIGHT_ARROW){next()} // Next track (loops back to start if at end)
	if(keyCode == LEFT_ARROW){prev()} // Previous track (loops back to end if at start)
	if(keyCode == DOWN_ARROW){noLoop(); sound.pause()} // noLoop() is used to make sure the wave freezes
	if(keyCode == UP_ARROW){loop(); sound.play()}
	if(key == 'R'){strokeCap(ROUND); rec = 0} // Circles
	if(key == 'P'){strokeCap(SQUARE); rec = 0.001} // Squares
}

function next(){
	if(song < 6){song ++}
	else{song = 1}
	load(song)
}

function prev(){
	if(song > 1){song --}
	else{song = 6}
	load(song)
}

function load(num) {
	if(sound != 1){sound.stop();} // Stop current sound from playing, unless its the very first time loading
	sound = loadSound(num+'.mp3')
}
