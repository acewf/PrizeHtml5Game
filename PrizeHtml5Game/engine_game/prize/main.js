var engine = new Object();
var layerCircles = $('#layerCircles');
var backgroundCanvas = $('.backgroundCanvas');
var present = $('.present');
var insidetxt = $('.insidetxt');
engine.particules = [];
var W = 525, H = 525;
var canvas;
var intVeral;
var startAlpha = 80;
function get_browser(){
    var N=navigator.appName, ua=navigator.userAgent, tem;
    var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
    return M[0];
    }
function get_browser_version(){
	var N=navigator.appName, ua=navigator.userAgent, tem;
	var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
	if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
	M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
	return M[1];
}
engine.onLoad = function(){
	
	canvas = document.getElementById("layerCircles");
	engine.ctx  = canvas.getContext("2d");
	//Make the canvas occupy the full page
	canvas.width = W;
	canvas.height = H;
	
	var particles = [];
	var mouse = {};
	
	//Lets create some particles now
	var particle_count = 400;
	for(var i = 0; i < particle_count; i++)
	{
		engine.particules.push(new engine.particle());
	}
	var browser=get_browser();
	var browser_version=get_browser_version();
	console.log(browser,browser_version)
	if (!((browser=='Firefox') ||  (browser=='MSIE'))) {
		if(deviceType=='desktop'){
			intVeral = setInterval(engine.draw, 50);
		}
	} else {
		backgroundCanvas.addClass( "backgroundCanvasfallback");
	}
	//console.log(browser_version);
	present.toggleClass( "presentdefault" ).addClass( "present presentin");
	insidetxt.addClass( "insidetxt inalpha").toggleClass( "outalpha" )//
}

engine.clearParticleCreator = function (argument) {
	clearInterval(intVeral);
	engine.ctx.clearRect(0, 0, W, H);
}
engine.successHandle = function(data){
	$('.feedinfo').css('display','block');
	$('#feedback').html(data);
	setTimeout(engine.outSucess, 1500);
}
engine.outSucess = function(data){
	$('.feedinfo').css('display','none');
}
engine.errorHandle = function(){
	$('.feedinfo').css('display','block');
	$('#feedback').html("ERRO A CONECTAR SERVIDOR");
	setTimeout(engine.outSucess, 1500);
	console.log('error');
}

engine.processForm = function(){
	console.log("engine.processForm")
		

	console.log('[scores.energy]',scores.energy,scores.energy.toString());
	var returnEncode = base32.encode(scores.energy.toString());
	console.log('returnEncode',returnEncode);
	console.log(scores.energyencode,'returnEncode',base32.decode(returnEncode)  );
	
	var sendValues = $("#my_form").serialize()+ "&pontos="+scores.energyencode;
	 $.ajax({
         type: "POST",
         crossDomain: true,
         url: "http://prize.pixelkiller.net/prize/queryengine.php",
         data: sendValues,
         success:engine.successHandle,
         error: engine.errorHandle
      });
}
engine.successHandleRanking = function(data){
	$('.listaresultados').html(data);
	console.log("sucess",data)
}
engine.getRaking = function(){
	console.log("engine.getRaking")
	$.ajax({
         type: "GET",
         crossDomain: true,
         url: "http://prize.pixelkiller.net/prize/queryrankin.php",
         success:engine.successHandleRanking,
         error: engine.errorHandle
      });
}


engine.changeCanvasRender = function (argument) {
	clearInterval(intVeral);
	engine.ctx.clearRect(0, 0, W, H);

	var browser=get_browser();
	var browser_version=get_browser_version();
	if (!((browser=='Firefox') ||  (browser=='MSIE') ||  (browser=='Safari'))) {
		if(deviceType=='desktop'){
			canvas = document.getElementById("effectgame");
			W = window.innerWidth, H = window.innerHeight;
			engine.ctx  = canvas.getContext("2d");
			//Make the canvas occupy the full page
			canvas.width = W;
			canvas.height = H;
			
			var particles = [];
			var mouse = {};
			engine.particules = [];
			//Lets create some particles now
			var particle_count = 400;
			for(var i = 0; i < particle_count; i++)
			{
				engine.particules.push(new engine.particle());
			}
			intVeral = setInterval(engine.draw, 10);
		}
	}
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
	

	this.location = {x: W/2+Math.round(-W/2+Math.random()*W), y: H+Math.round(-50+Math.random()*H/5)};
	//radius range = 10-30
	this.radius = 1+Math.random()*20;
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
		engine.ctx.clearRect(0, 0, W, H);
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
			p.opacity = Math.round(p.remaining_life/p.life*startAlpha)/100
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
			var remaningRadius = p.radius-Math.round(-1+Math.random()*2)
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


window.onload = function(){
	console.log('onLoad')
	engine.onLoad();
}