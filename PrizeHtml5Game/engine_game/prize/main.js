var engine = new Object();
var layerCircles = $('#layerCircles');
var present = $('.present');
var insidetxt = $('.insidetxt');
engine.particules = [];
var W = 525, H = 525;
var canvas;
engine.onLoad = function(){

	canvas = document.getElementById("layerCircles");
	engine.ctx  = canvas.getContext("2d");
	
	//Make the canvas occupy the full page
	
	canvas.width = W;
	canvas.height = H;
	
	var particles = [];
	var mouse = {};
	
	//Lets create some particles now
	var particle_count = 200;
	for(var i = 0; i < particle_count; i++)
	{
		engine.particules.push(new engine.particle());
	}

	present.addClass( "present presentin");
	console.log(insidetxt)
	insidetxt.addClass( "insidetxt inalpha").toggleClass( "outalpha" )//
}


engine.particle = function()
{
	//speed, life, location, life, colors
	//speed.x range = -2.5 to 2.5 
	//speed.y range = -15 to -5 to make it move upwards
	//lets change the Y speed to make it look like a flame
	this.speed = {x: -2+Math.random()*4, y: -3/2+Math.random()*2};
	//location = mouse coordinates
	//Now the flame follows the mouse coordinates
	

	this.location = {x: 260+Math.round(-250+Math.random()*500), y: 560+Math.round(-50+Math.random()*100)};
	//radius range = 10-30
	this.radius = 1+Math.random()*60;
	//life range = 20-30
	this.life = 80+Math.random()*500;
	this.remaining_life = this.life;
	//colors
	this.r = 255-Math.round(Math.random()*4);
	this.g = 255-Math.round(Math.random()*7);
	this.b = 255-Math.round(Math.random()*4);
}

engine.draw = function ()
	{
		//Painting the canvas black
		//Time for lighting magic
		//particles are painted with "lighter"
		//In the next frame the background is painted normally without blending to the 
		//previous frame
		engine.ctx.clearRect(0, 0, canvas.width, canvas.height);
		engine.ctx.globalCompositeOperation = "source-over";
		engine.ctx.fillStyle = "rgba(0, 0, 0, 0)";
		engine.ctx.fillRect(0, 0, W, H);
		engine.ctx.globalCompositeOperation = "lighter";
		
		for(var i = 0; i < engine.particules.length; i++)
		{
			var p = engine.particules[i];
			engine.ctx.beginPath();
			//changing opacity according to the life.
			//opacity goes to 0 at the end of life of a particle
			p.opacity = Math.round(p.remaining_life/p.life*80)/100
			//a gradient instead of white fill
			var gradient = engine.ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
			gradient.addColorStop(0.1, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
			gradient.addColorStop(0.5, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
			gradient.addColorStop(1, "rgba("+p.r+", "+p.g+", "+p.b+", 0)");
			engine.ctx.fillStyle = gradient;
			engine.ctx.arc(p.location.x, p.location.y, p.radius, Math.PI*2, false);
			engine.ctx.fill();
			
			//lets move the particles
			p.remaining_life--;
			var remaningRadius = p.radius--; //+Math.round(-2.5+Math.random()*5)
			p.radius=remaningRadius;
			p.location.x += p.speed.x;
			p.location.y += p.speed.y;
			
			//regenerate particles
			if(p.remaining_life < 0 || p.radius < 0)
			{
				
				//engine.ctx.clearRect();
				//a brand new particle replacing the dead one
				engine.particules[i] = new engine.particle();
			}
		}
	}
	
	setInterval(engine.draw, 50);

window.onload = function(){
engine.onLoad();
}