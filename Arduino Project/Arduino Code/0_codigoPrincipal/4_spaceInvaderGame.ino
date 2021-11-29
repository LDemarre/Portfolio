/* Variables iniciales del juego */
byte posPlayerSpace;
byte bulletx;
byte bullety;
byte bulletEnemyx;
byte bulletEnemyy;

byte iazules[10];
byte ivioletas[10];
byte icelestes[10];
byte iverdes[10];
byte iamarillos[10];

byte scoreSpace;
byte lifesSpace;
byte BALL_DIRENEMY;

void bulletDirectionPlayer () {
  switch (BALL_DIR) {
    case DIR_UP:
      if (bullety == 0) {
        bullety = 255;
        bulletx = 255;
        break;
      } else {
        --bullety;
        break;
      }
  }
}

void bulletDirectionEnemy () {
  switch (BALL_DIRENEMY) {
    case DIR_ENEMY:
      if (bulletEnemyy == 9) {
        bulletEnemyy = 255;
        bulletEnemyx = 255;
        break;
      } else {
        ++bulletEnemyy;
        break;
      }
  }
}

void setCirculation() {
  switch (curControl) {
    case BTN_LEFT:
      if (posPlayerSpace == 1) {
        break;
      } else {
        --posPlayerSpace;
        break;
      }
    case BTN_RIGHT:
      if (posPlayerSpace == FIELD_WIDTH - 2) {
        break;
      } else {
        ++posPlayerSpace;
        break;
      }
    case BTN_FIRE:
      bulletx = posPlayerSpace;
      bullety = FIELD_HEIGHT - 3;
      BALL_DIR = DIR_UP;
      break;
    case BTN_DOWN:
      break;
    case BTN_UP:
      break;
  }
}

void spaceInit () {
  posPlayerSpace = FIELD_HEIGHT / 2;
  bulletx = 255;
  bullety = 255;
  bulletEnemyx = 255;
  bulletEnemyy = 255;

  iazules [1] = 1; iazules [2] = 2; iazules [3] = 3; iazules [4] = 4; iazules [5] = 5; iazules [6] = 6; iazules [7] = 7; iazules [8] = 8;
  ivioletas [1] = 1; ivioletas [2] = 2; ivioletas [3] = 3; ivioletas [4] = 4; ivioletas [5] = 5; ivioletas [6] = 6; ivioletas [7] = 7; ivioletas [8] = 8;
  icelestes [1] = 1; icelestes [2] = 2; icelestes [3] = 3; icelestes [4] = 4; icelestes [5] = 5; icelestes [6] = 6; icelestes [7] = 7; icelestes [8] = 8;
  iverdes [1] = 1; iverdes [2] = 2; iverdes [3] = 3; iverdes [4] = 4; iverdes [5] = 5; iverdes [6] = 6; iverdes [7] = 7; iverdes [8] = 8;
  iamarillos [1] = 1; iamarillos [2] = 2; iamarillos [3] = 3; iamarillos [4] = 4; iamarillos [5] = 5; iamarillos [6] = 6; iamarillos [7] = 7; iamarillos [8] = 8;

  scoreSpace = 0;
  lifesSpace = 3;
}

void runSpaceInvader () {
  spaceInit();

  unsigned long prevUpdateTime = 0;
  boolean spaceRunning = true;

  while (spaceRunning) {

    if (scoreSpace == 40) {
      Serial.print("e");
      spaceRunning = false;
      gameOverAnim(4);
      break;
    }

    setCirculation();

    /* Elegir de forma aleatoria la linea de invaders que va a disparar, el invader que va a disparar */
    if (bulletEnemyx == 255 && bulletEnemyy == 255) {
      byte binvaders = random(0, 5);

      byte bamarillos = random(1, 9);
      byte bverdes = random(1, 9);
      byte bcelestes = random(1, 9);
      byte bvioletas = random(1, 9);
      byte bazules = random(1, 9);

      for (byte i = 1; i < FIELD_WIDTH - 1; i++) {
        if (binvaders == 0) {
          if (iazules[bazules] != ivioletas[i] && iazules[bazules] != 255) {
            bulletEnemyx = iazules[bazules];
            bulletEnemyy = 1;
            BALL_DIRENEMY = DIR_ENEMY;
          } else {
            binvaders = random (1, 5);
          }
        }
        else if (binvaders == 1) {
          if (ivioletas[bvioletas] != icelestes[i] && ivioletas[bvioletas] != 255) {
            bulletEnemyx = ivioletas[bvioletas];
            bulletEnemyy = 2;
            BALL_DIRENEMY = DIR_ENEMY;
          } else {
            binvaders = random (2, 5);
          }
        }
        else if (binvaders == 2) {
          if (icelestes[bcelestes] != iverdes[i] && icelestes[bcelestes] != 255) {
            bulletEnemyx = icelestes[bcelestes];
            bulletEnemyy = 3;
            BALL_DIRENEMY = DIR_ENEMY;
          } else {
            binvaders = random (3, 5);
          }
        }
        else if (binvaders == 3) {
          if (iverdes[bverdes] != iamarillos[i] && iverdes[bverdes] != 255) {
            bulletEnemyx = iverdes[bverdes];
            bulletEnemyy = 4;
            BALL_DIRENEMY = DIR_ENEMY;
          } else {
            binvaders = 4;
          }
        }
        else if (binvaders == 4) {
          if (iamarillos[bamarillos] != iazules[i] && iamarillos[bamarillos] != 255) {
            bulletEnemyx = iamarillos[bamarillos];
            bulletEnemyy = 5;
            BALL_DIRENEMY = DIR_ENEMY;
          }
        }
      }
    }

    /* Revisar colisiones de la bala enemiga con el jugador */
    for (byte i = posPlayerSpace - 1; i <= posPlayerSpace + 1; i++) {
      if (i == posPlayerSpace - 1) {
        if (collide(bulletEnemyx, i, bulletEnemyy, 9)) {
          bulletEnemyx = 255;
          bulletEnemyy = 255;
          --lifesSpace;
        }
      }
      else if (i == posPlayerSpace) {
        if (collide(bulletEnemyx, i, bulletEnemyy, 8)) {
          bulletEnemyx = 255;
          bulletEnemyy = 255;
          --lifesSpace;
        }
      }
      else if (i == posPlayerSpace + 1) {
        if (collide(bulletEnemyx, i, bulletEnemyy, 9)) {
          bulletEnemyx = 255;
          bulletEnemyy = 255;
          --lifesSpace;
        }
      }
    }

    /* Revisar colision de la bala de jugador con los invaders */
    for (byte i = 1; i < FIELD_WIDTH - 1; i++) {
      if (collide(bulletx, iamarillos[i], bullety, 4)) {
        iamarillos[i] = 255;
        bulletx = 255;
        bullety = 255;
        ++scoreSpace;
        Serial.print(scoreSpace);
      }
      else if (collide(bulletx, iverdes[i], bullety, 3)) {
        iverdes[i] = 255;
        bulletx = 255;
        bullety = 255;
        ++scoreSpace;
        Serial.print(scoreSpace);
      }
      else if (collide(bulletx, icelestes[i], bullety, 2)) {
        icelestes[i] = 255;
        bulletx = 255;
        bullety = 255;
        ++scoreSpace;
        Serial.print(scoreSpace);
      }
      else if (collide(bulletx, ivioletas[i], bullety, 1)) {
        ivioletas[i] = 255;
        bulletx = 255;
        bullety = 255;
        ++scoreSpace;
        Serial.print(scoreSpace);
      }
      else if (collide(bulletx, iazules[i], bullety, 0)) {
        iazules[i] = 255;
        bulletx = 255;
        bullety = 255;
        ++scoreSpace;
        Serial.print(scoreSpace);
      }
    }

    bulletDirectionPlayer();
    bulletDirectionEnemy();

    /* Sistema de vidas */
    if (lifesSpace == 0) {
      spaceRunning = false;
      Serial.print("e");
      gameOverAnim(4);
      break;
    }

    clearTablePixels();

    /* Dibujar bala del jugador y bala enemiga */
    setTablePixel(bulletx, bullety, 15, 15, 15);
    setTablePixel(bulletEnemyx, bulletEnemyy, 15, 0, 0);


    /* Dibujar invaders */
    for (byte i = 1; i < FIELD_WIDTH - 1; i++) {
      setTablePixel(iazules[i], 0, 0, 0, 15);
      setTablePixel(ivioletas[i], 1, 15, 0, 15);
      setTablePixel(icelestes[i], 2, 0, 7, 15);
      setTablePixel(iverdes[i], 3, 7, 15, 0);
      setTablePixel(iamarillos[i], 4, 15, 15, 0);
    }

    /* Dibujar al jugador */
    for (byte i = posPlayerSpace - 1; i <= posPlayerSpace + 1; i++) {
      if (i == posPlayerSpace) {
        setTablePixel(i, 9, 15, 15, 15);
        setTablePixel(i, 8, 15, 15, 15);
      } else {
        setTablePixel(i, 9, 15, 15, 15);
      }
    }

    pixels.show();

    unsigned long curTime;
    boolean dirChanged = false;
    do {
      readInput();
      if (curControl == BTN_EXIT) {
        spaceRunning = false;
        gameOverAnim(4);
        break;
      }
      if (curControl != BTN_NONE && !dirChanged) { //Solo se puede cambiar de dirección una vez
        dirChanged = true;
        setCirculation();
        curControl = BTN_NONE;
      }
      curTime = millis();
    }
    while ((curTime - prevUpdateTime) < 250); //Luego de 250ms el juegador se mueve
    prevUpdateTime = curTime;
  }
}
