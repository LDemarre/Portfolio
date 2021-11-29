/* Variables y constantes iniciales del juego */
byte curLength;//Longitud de la serpiente
short xs[100];//Matriz que contiene todos los segmentos de la serpiente, su máxima longitud es el tamaño de la matriz
short ys[100];//xs es su posición en x, ys es su posición en y
byte dir;//Dirección actual de la serpiente
byte ax = 0;//Posición en x de la manzana
byte ay = 0;//Posición en y de la manzana
byte scoreSnake;
byte prevScoreSnake;
byte speedSnake;

boolean snakeGameOver;

/* Morir */
void die() {
  snakeGameOver = true;
}

/* Direcciones */
void setDirection() {
  switch (curControl) {
    case BTN_LEFT:
      if (dir == DIR_RIGHT) {
        break;
      } else {
        dir = DIR_LEFT;
        break;
      }
    case BTN_RIGHT:
      if (dir == DIR_LEFT) {
        break;
      } else {
        dir = DIR_RIGHT;
        break;
      }
    case BTN_DOWN:
      if (dir == DIR_UP) {
        break;
      } else {
        dir = DIR_DOWN;
        break;
      }
    case BTN_UP:
      if (dir == DIR_DOWN) {
        break;
      } else {
        dir = DIR_UP;
        break;
      }
  }
}


void snakeInit() {
  //Posición, dirección y variables iniciales de la serpiente
  curLength = 3;
  xs[0] = 3; xs[1] = 2; xs[2] = 1;
  ys[0] = FIELD_HEIGHT / 2; ys[1] = FIELD_HEIGHT / 2; ys[2] = FIELD_HEIGHT / 2;
  dir = DIR_RIGHT;
  //Crear manzana en una posición aleatoria
  ax = random(FIELD_WIDTH);
  ay = random(FIELD_HEIGHT);
  scoreSnake = 0;
  prevScoreSnake = 0;
  speedSnake = 250;

  snakeGameOver = false;
}

void runSnake() {
  snakeInit();
  unsigned long prevUpdateTime = 0;
  boolean snakeRunning = true;
  while (snakeRunning) {
    //Revisar colisión de la serpiente consigo misma
    byte i = curLength - 1;
    while (i >= 4) {
      if (collide(xs[0], xs[i], ys[0], ys[i])) {
        die();
        Serial.print("e");
      }
      i = i - 1;
    }

    if (snakeGameOver) {
      clearTablePixels();
      pixels.show();
      snakeRunning = false;
      gameOverAnim(1);
      break;
    }

    //Revisar colisión de la serpiente con la manzana
    if (collide(xs[0], ax, ys[0], ay)) {
      //Incrementar longitud de la serpiente
      curLength = curLength + 1;
      ++scoreSnake;
      Serial.print(scoreSnake);
      //Nuevo segmento de la serpiente con posición temporal
      xs[curLength - 1] = 255;
      ys[curLength - 1] = 255;

      //Crear otra manzana en una posición aleatoria
      ax = random(FIELD_WIDTH);
      ay = random(FIELD_HEIGHT);

      //Asegurarse de que la manzana no se genere dentro del cuerpo de la serpiente
      byte i = curLength - 1;
      for (byte i = 0; i < curLength; i++) {
        if (collide(ax, xs[i], ay, ys[i])) {
          ax = random(FIELD_WIDTH);
          ay = random(FIELD_HEIGHT);
          i = 0;
        }
      }
    }

    //Aumento de velocidad de la serpiente
    if ((scoreSnake - prevScoreSnake) == 5) {
      prevScoreSnake = scoreSnake;
      speedSnake = speedSnake - 25;
    }

    //Desfasar los segmentos del cuerpo de la serpiente
    i = curLength - 1;
    while (i >= 1) {
      xs[i] = xs[i - 1];
      ys[i] = ys[i - 1];
      i = i - 1;
    }

    //Determinar nueva direción de la cabeza de la serpiente
    if (dir == DIR_RIGHT) {          //Derecha
      xs[0] = xs[0] + 1;
    }
    else if (dir == DIR_LEFT) {      //Izquierda
      xs[0] = xs[0] - 1;
    }
    else if (dir == DIR_UP) {        //Arriba
      ys[0] = ys[0] - 1;
    }
    else {                           //Abajo
      ys[0] = ys[0] + 1;
    }

    //Revisar si la serpiente sale de los bordes del tablero
    if ((xs[0] < 0) || (xs[0] >= FIELD_WIDTH) || (ys[0] < 0) || (ys[0] >= FIELD_HEIGHT)) {
      if (xs[0] < 0) {
        xs[0] = FIELD_WIDTH - 1;
      }
      else if (xs[0] >= FIELD_WIDTH) {
        xs[0] = 0;
      }
      else if (ys[0] < 0) {
        ys[0] = FIELD_HEIGHT - 1;
      }
      else if (ys[0] >= FIELD_HEIGHT) {
        ys[0] = 0;
      }
    }

    clearTablePixels();

    //Dibujar la manzana
    setTablePixel (ax, ay, 15, 0, 0);

    //Dibujar la serpiente
    for (byte i = 0; i < curLength; i++) {
      setTablePixel(xs[i], ys[i], 0, 15, 0);
    }

    pixels.show();

    //Revisar dirección de la serpiente mientras se espera otra dirección
    unsigned long curTime;
    do {
      readInput();
      if (curControl == BTN_EXIT) {
        die();
        break;
      }
      if (curControl != BTN_NONE) {
        setDirection();
      }
      curTime = millis();
    }
    while ((curTime - prevUpdateTime) < speedSnake); //Luego de que pase el tiempo equivalente a "speedSnake" la serpiente se mueve
    prevUpdateTime = curTime;
  }
}
