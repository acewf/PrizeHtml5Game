var elementLifes = new Array();
var fristscreen = $('.fristscreen');
var backgroundGameCanvas = $('#backgroundFallback');
var life1 = $('#life1');
var life2 = $('#life2');
var life3 = $('#life3');
var defaultValue = {nome:"nome* (primeiro e último)",email:"email*",empresa:"empresa*"}
var intgame;
var deviceType;
var base32 = new Nibbler({
    dataBits: 8,
    codeBits: 5,
    keyString: '0123456789ABCDEFGHJKMNPQRSTVWXYZ',
    pad: '='
});
function senergy() {
  value = 0;
  this._energy = base32.encode(value.toString());
}

senergy.prototype = {
    get energy() {
        return base32.decode(this._energy);
    },
    get energyencode() {
        return this._energy;
    },
    set energy(value) {
        this._energy = value;
    }
};

var scores  = new senergy();
elementLifes.push(life3);
elementLifes.push(life2);
elementLifes.push(life1);
life1.fadeTo( "fast", 1 );
var orientationFunc = function() {
  // Announce the new orientation number
  if (window.orientation==0) {
    $('.changeOriention').css('display','block');
  } else {
    $('.changeOriention').css('display','none');
  }
}
window.addEventListener("orientationchange", orientationFunc, false);
orientationFunc();
$(".inputfield").focus(function() {
  this.value = "";
  console.log(this.id, "Handler for .focus() called." );

  defaultValue[this.id]
});
$(".inputfield").focusout(function() {
  if(this.value =="")
  this.value = defaultValue[this.id];
});
(function(){

  /* DOM elements */
  
  var container     = $( '#container' ),
      field         = $( '#playfield' ),
      player        = $( '#player' ),
      intro         = $( '#intro' ),
      //instructions  = $( '#instructions' ),
      leftbutton    = $( '.left' ),
      rightbutton   = $( '.right' ),
      scoredisplay  = $( '#score output' ),
      canvas        = $( '#gamecanvas' ),
      over          = $( '#gameover' ),
      ranking          = $( '#ranking' ),
      overmsg       = over.querySelector( '.message' ),
      characters    = document.querySelectorAll( 'li.introdeck' ),
      c             = canvas.getContext( '2d' ),
      startPoints = 0 ,
      totalLifes = 3,
      startenergy   = 0;//+energydisplay.innerHTML;

      //energydisplay = $( '#energy output' ),
      //scores.energy = startenergy;
      scores  = new senergy();
  /* Game data */
  
      playerincrease = +player.getAttribute( 'data-increase' );

  /* counters, etc */
  var score = 0, gamestate = null, x = 0, sprites = [], allsprites = [],
      spritecount = 0, now = 0, old = null, playerY = 0, offset = 0,
      width = 0, height = 0, levelincrease = 0, i=0 , storedscores = null,
      initsprites = 0, newsprite = 500, rightdown = false, leftdown = false;
  /* 
    Setting up the game
  */

  function init() {
    var current, sprdata, scoreinfo, i, j;

    life1.fadeTo( "fast", 1 );
    life2.fadeTo( "fast", 1 );
    life3.fadeTo( "fast", 1 );

    score = 0, gamestate = null, x = 0, sprites = [], allsprites = [],
    spritecount = 0, now = 0, playerY = 0, offset = 0, levelincrease = 0, i=0 ;
    /* retrieve sprite data from HTML */
    sprdata = document.querySelectorAll( 'img.sprite' );
    i = sprdata.length;
    while (i--) {
      current = {};
      current.effects = [];
      current.img = sprdata[ i ];
      current.offset = sprdata[ i ].offsetWidth / 2;
      scoreinfo = sprdata[ i ].getAttribute( 'data-collision' ).split(',');
      j = scoreinfo.length;
      while ( j-- ) {
        var keyval = scoreinfo[ j ].split( ':' );
        current.effects.push( {
          effect: keyval[ 0 ],
          value: keyval[ 1 ]
        } );
      }
      current.type = sprdata[ i ].getAttribute ('data-type');
      allsprites.push( current );
    }
    spritecount = allsprites.length;
    initsprites = +$( '#characters' ).getAttribute( 'data-countstart' );
    newsprite = +$( '#characters' ).getAttribute( 'data-newsprite' );

    /* make game keyboard enabled */
    container.tabIndex = -1;
    container.focus();

    /* Assign event handlers */
    
    container.addEventListener( 'keydown', onkeydown, false );
    container.addEventListener( 'keyup', onkeyup, false );
    
    container.addEventListener( 'touchstart', ontouchstart, false );
    container.addEventListener( 'touchend', ontouchend, false );
    container.addEventListener( 'click', onclick, false );

    if( navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)  || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)){
      container.addEventListener( 'touchmove', ontouchMOVE, false );
      deviceType = 'mobile'
    } else {
      container.addEventListener( 'mousemove', onmousemove, false );
      deviceType = 'desktop'
    }
    /*
    window.addEventListener( 'deviceorientation', tilt, false );
    */
    /* Get the game score, or preset it when there isn't any  */
    if( localStorage.html5catcher ) {
      storedscores = JSON.parse( localStorage.html5catcher );
    } else {
      storedscores = { last: 0, high: 0 };
      localStorage.html5catcher = JSON.stringify( storedscores );
    }
  
    /* show the intro */
    showintro();
    
    /* 
      As the android browser has no deviceorientation, I added links
      that don't work quite well :( For better mobile browsers, 
      you can tilt the phone - Firefox for example.
    */
    if( 'ondeviceorientation' in window ) {
      $( '#androidbrowsersucks' ).style.display = 'none';
    }
  };
  
  /* Event Handlers */ 

  /* Click handling */ 
  function onclick( ev ) {
    var t = ev.target;
    if ( gamestate === 'gameover' ) {
      if ( t.id === 'replay' ) { init();startgame();}
    }
    console.log('valoree..........',t.className)
    if ( t.id === 'rankingbt' ) {
      engine.getRaking();
      document.body.className = 'ranking';
      setcurrent( ranking );
    }
    if ( t.className === 'go_click' ) {
      console.log("goto",t.getAttribute('href'))
      window.open(t.getAttribute('href'),"_blank");
    }
    
    //if ( t.className === 'next' ) { instructionsnext(); }
    //if ( t.className === 'endinstructions' ) { instructionsdone(); }
    //if ( t.id === 'instructionbutton' ) { showinstructions(); }
    if ( t.id === 'playbutton' ) { startgame(); }
    ev.preventDefault();
  }

  /* Keyboard handling */
  function onkeydown( ev ) {
    if ( ev.keyCode === 39 ) { rightdown = true; }
    else if ( ev.keyCode === 37 ) { leftdown = true; }
  }
  function onkeyup( ev ) {
    if ( ev.keyCode === 39 ) { rightdown = false; }
    else if ( ev.keyCode === 37 ) { leftdown = false; }
  }
  
  /* Touch handling */
  function ontouchstart( ev ) {
    if ( gamestate === 'playing' ) { ev.preventDefault(); }
    //if (gamestate == 'gameover') {alert('touchHERE')};
    
    if ( ev.target === rightbutton ) { rightdown = true; }
    else if ( ev.target === leftbutton ) { leftdown = true; }
  }
  function ontouchMOVE( ev ) {
    var orig = ev.pageX ;
    if ( gamestate === 'playing' ) { ev.preventDefault(); }
    x = orig;
  }
  function ontouchend( ev ) {
    if ( gamestate === 'playing' ) { ev.preventDefault(); }
    if ( ev.target === rightbutton ) { rightdown = false; }
    else if ( ev.target === leftbutton ) { leftdown = false; }
  }

  /* Orientation handling */
  function tilt (ev) {
    if(ev.gamma < 0) { x = x - 2; }
    if(ev.gamma > 0) { x = x + 2; }
    if ( x < offset ) { x = offset; }
    if ( x > width-offset ) { x = width-offset; }
  }

  /* Mouse handling */
  function onmousemove ( ev ) {
    var mx = ev.clientX - container.offsetLeft;
    if ( mx < offset ) { mx = offset; }
    if ( mx > width-offset ) { mx = width-offset; }
    x = mx;
  }

  /* 
    Introduction
  */ 
  function showintro() {
    /*
    setcurrent( intro );
    gamestate = 'intro';
    var scoreelms = intro.querySelectorAll( 'output' );
    scoreelms[ 0 ].innerHTML = storedscores.last;
    scoreelms[ 1 ].innerHTML = storedscores.high;
    */
  }

  /* 
    Instructions
  */ 
  function showinstructions() {
    setcurrent( instructions );
    gamestate = 'instructions';
    now = 0;
    characters[ now ].className = 'current';
  }
  
  /* action when left is activated */
  function instructionsdone() {
    characters[ now ].className = 'introdeck';
    now = 0;
    showintro();
  }

  /* action when right is activated */
  function instructionsnext() {
    if ( characters[ now + 1 ] ) {
      now = now + 1;
    }
    if ( characters[ now ] ) {
      characters[ now - 1 ].className = 'introdeck';
      characters[ now ].className = 'current';
    }
  }

  /*
    Start the game 
  */
  function startgame() {
    totalLifes = 3;
    setcurrent( field );
    gamestate = 'playing';
    document.body.className = 'playing';
    width = field.offsetWidth;
    height = field.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    playerY = height - player.offsetHeight; 
    offset = player.offsetWidth / 2; 
    x = width / 2;
    sprites = [];
    for ( i = 0; i < initsprites; i++ ) {
      sprites.push( addsprite('sprite'+i) );
    }
    //scores.energy = startenergy;
    scores  = new senergy()
    levelincrease = 0;
    score = 0;
    //energydisplay.innerHTML = startenergy;
    loop();
    engine.changeCanvasRender();
    fristscreen.addClass( "fristscreenout" );
    fristscreen.addClass( "fristscreenout" );
    var browser=get_browser();
    var browser_version=get_browser_version();
    if (((browser=='Firefox') ||  (browser=='MSIE') ||  (browser=='Safari'))) {
      backgroundGameCanvas.addClass("backgroundCanvasGamefallback");
    }
    

    intgame = setInterval(loop, 10);
  }

  /* 
    The main game loop
  */
  function loop() {
    c.clearRect( 0, 0, width, height );

    /* render and update sprites */
    j = sprites.length;
    for ( i=0; i < j ; i++ ) {
      sprites[ i ].render(); 
      sprites[ i ].update();
    }

    /* show scores */
    var valor = scores.energy;

    if(valor<1000){
      valor = "000"+valor;
    }
    if(valor>1000 && valor<10000){
      valor = "00"+valor;
    }
    if(valor>10000 && valor<100000){
      valor = "0"+valor;
    }
    scoredisplay.innerHTML = valor;//~~(score/10);
    score++;

    /* with increasing score, add more sprites */
    if ( ~~(score/newsprite) > levelincrease ) {
      console.log('cria sprite','sprite'+sprites.length)
      sprites.push( addsprite('sprite'+sprites.length) );
      levelincrease++;
    } 

    /* position player*/
    if( rightdown ) { playerright(); }
    if( leftdown ) { playerleft(); }

    c.save(); 
    c.translate( x-offset, playerY );
    c.drawImage( player, 0, 0 );
    c.restore();

    /* when you still have energy, render next, else game over */
    //scores.energy = Math.min( scores.energy, 100 );
    if ( totalLifes > 0 ) {
      //requestAnimationFrame( loop );
    } else {
      clearInterval(intgame);
      gameover();
    }
  };

  /* action when left is activated */
  function playerleft() {
    x -= playerincrease;
    if (x < offset) { x = offset; }
  }

  /* action when left is activated */
  function playerright() {
    x += playerincrease;
    if (x > width - offset) { x = width - offset; }
  }

  /* 
    Game over
  */
  function gameover() {
    document.body.className = 'gameover';
    setcurrent( over );
    gamestate = 'gameover';
    over.querySelector( 'output' ).innerHTML = scores.energy;
    storedscores.last = scores.energy;
    if ( scores.energy > storedscores.high ) {
      //overmsg.innerHTML = overmsg.getAttribute('data-highscore');
      storedscores.high = scores.energy;
    }
    localStorage.html5catcher = JSON.stringify(storedscores);
  }

  /* 
    Helper methods 
  */

  /* Particle system */
  function sprite() {
    this.px = 0; 
    this.py = 0; 
    this.vx = 0; 
    this.vy = 0; 
    this.goodguy = false;
    this.height = 0;
    this.width = 0;
    this.effects = [];
    this.img = null; 
    this.update = function() {
      this.px += this.vx;
      this.py += this.vy;
      if ( ~~(this.py + 10) > playerY ) {
        if ( (x - offset) < this.px && this.px < (x + offset) ) {
          this.py = -200;
          i = this.effects.length;
          while ( i-- ) {
            var getVla = parseInt(scores[ this.effects[ i ].effect ])+parseInt(this.effects[ i ].value);
            scores.energy = base32.encode(getVla.toString());
          }
          setspritedata( this );
          
        }
      } 
      if ( this.px > (width - this.offset) || this.px < this.offset ) {
        this.vx = -this.vx;
      }
      if ( this.py > height) {
        if ( this.type === 'good' ) {
          removeElementFromView();
        }
        setspritedata( this );
      }
    };
    this.render = function() {
      c.save(); 
      c.translate( this.px, this.py );
      c.translate( this.width * -0.5, this.height * -0.5 );
      c.drawImage( this.img, 0, 0) ;
      this.last = this.img;
      c.restore();
    };
  };

  function removeElementFromView(){
    totalLifes--;
    var elem = elementLifes[totalLifes];
    elem.fadeTo( "fast", 0 );
  }

  function addsprite(name) {
    var s = new sprite(); 
    s.name = name;
    setspritedata( s );
    return s;
  };
  var timesCallSpecial = 0;
  var limitCall = 8;
  function setspritedata( sprite ) {
    var r = ~~rand( 0, spritecount );
    if (timesCallSpecial>limitCall) {
      r = 3;
      timesCallSpecial = 0;
    };
    timesCallSpecial++;
    sprite.img = allsprites[ r ].img;
    sprite.height = sprite.img.offsetHeight;
    sprite.width = sprite.img.offsetWidth;
    sprite.type = allsprites[ r ].type;
    sprite.effects = allsprites[ r ].effects;

    sprite.offset = allsprites[ r ].offset;
    sprite.py = -sprite.height;
    sprite.px = rand( sprite.width / 2, width - sprite.width / 2  );
    var tempvalue = Math.round(levelincrease/4);
    sprite.vx = rand( -(2+tempvalue), 4+tempvalue );
    sprite.vy = (levelincrease/2)+rand( 3, 5 );
    
  };

  /* yeah, yeah... */
  function $( str ) { 
    return document.querySelector( str );
  };

  /* Get a random number between min and max */
  function rand( min, max ) {
    return ( (Math.random() * (max-min)) + min ); 
  };

  /* Show the current part of the game and hide the old one */
  function setcurrent(elm) {
    if (old) { old.className = ''; }
    elm.className = 'current';
    old = elm;
  };

  /* Detect and set requestAnimationFrame 
  if ( !window.requestAnimationFrame ) {
    window.requestAnimationFrame = (function() {
      return window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function( callback, element ) {
        window.setTimeout( callback, 1000 / 60 );
      };
    })();
  }
  */
  /* off to the races */
  init();
})();
