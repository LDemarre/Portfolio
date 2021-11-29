// almacenar el slider inicio y los botones en variables
var slider = $('.slider');
var siguiente = $('.btn-next');
var anterior = $('.btn-prev');

// almacenar el slider parte fisica y los botones en variables 
var sliderf = $('.slider-f');
var faseuno = $('.faseuno')
var fasedos = $('.fasedos')
var fasetres = $('.fasetres')
var fasecuatro = $('.fasecuatro')

// almacenar el slider codigo y los botones en variables 
var sliderc = $('.slider-c');
var codigo1 = $('.codigo')
var snake2 = $('.snake')
var pong3 = $('.pong')
var breakout4 = $('.breakout')
var space5 = $('.space')
var dice6 = $('.dice')
var game7 = $('.game')

//almacenar la fase en una variable
var URLhash = window.location.hash;



//slider de parte fisica
function fase1() {
  sliderf.animate({ marginLeft: 0 }, 700)
}

function fase2() {
  sliderf.animate({ marginLeft: '-' + 100 + '%' }, 700)
}

function fase3() {
  sliderf.animate({ marginLeft: '-' + 200 + '%' }, 700)
}

function fase4() {
  sliderf.animate({ marginLeft: '-' + 300 + '%' }, 700)
}

faseuno.on('click', function () {
  fase1();
});

fasedos.on('click', function () {
  fase2();
});

fasetres.on('click', function () {
  fase3();
});

fasecuatro.on('click', function () {
  fase4();
});


//mover el slider cuando se redirige desde el inicio
if (URLhash == '#fase1') {
  fase1();
}

if (URLhash == '#fase2') {
  fase2();
}

if (URLhash == '#fase3') {
  fase3();
}

if (URLhash == '#fase4') {
  fase4();
}


//slider del codigo
function codigo() {
  sliderc.animate({ marginLeft: 0 }, 700)
}

function snake() {
  sliderc.animate({ marginLeft: '-' + 100 + '%' }, 700)
}

function pong() {
  sliderc.animate({ marginLeft: '-' + 200 + '%' }, 700)
}

function breakout() {
  sliderc.animate({ marginLeft: '-' + 300 + '%' }, 700)
}

function space() {
  sliderc.animate({ marginLeft: '-' + 400 + '%' }, 700)
}

function dice() {
  sliderc.animate({ marginLeft: '-' + 500 + '%' }, 700)
}

function game() {
  sliderc.animate({ marginLeft: '-' + 600 + '%' }, 700)
}

codigo1.on('click', function () {
  codigo();
});

snake2.on('click', function () {
  snake();
});

pong3.on('click', function () {
  pong();
});

breakout4.on('click', function () {
  breakout();
});

space5.on('click', function () {
  space();
});

dice6.on('click', function () {
  dice();
});

game7.on('click', function () {
  game();
});


//slider del inicio

// mover la ultima imagen al primer lugar
$('.slider section:last').insertBefore('.slider section:first')

//mostrar la primera imagen con un margen del -100%
slider.css('margin-left', '-' + 100 + '%')


function moverIzquierda() {
  slider.animate({ marginLeft: 0 }, 700,

    function () {
      $('.slider section:last').insertBefore('.slider section:first')
      slider.css('margin-left', '-' + 100 + '%')
    });
}

function moverDerecha() {
  slider.animate({ marginLeft: '-' + 200 + '%' }, 700,

    function () {
      $('.slider section:first').insertAfter('.slider section:last');
      slider.css('margin-left', '-' + 100 + '%')
    });
}

//Cuando se haga click en el boton derecho, el slider se va a mover para la derecha
siguiente.on('click', function () {
  moverDerecha();
});

anterior.on('click', function () {
  moverIzquierda();
});

function movimientoautomatico() {
  interval = setInterval(function () {
    moverDerecha();
  }, 5000);
}

movimientoautomatico();