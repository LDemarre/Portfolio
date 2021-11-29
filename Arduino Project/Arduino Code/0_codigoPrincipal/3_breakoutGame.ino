/* Variables iniciales del juego */
byte posPlayer;
byte ballbx;
byte ballby;

byte lrojos[10];
byte lnaranjas[10];
byte lamarillos[10];
byte lverdes[10];
byte lazules[10];

byte scoreBreakout;
byte prevScoreBreakout;
byte lifesBreakout;

void ballBreakOutDirection() {
  switch (BALL_DIR) {
    case DIR_DOWN:
      ++ballby;
      break;
    case DIR_DOWNRIGHT:
      if (ballbx == 9) {
        break;
      } else {
        ++ballby;
        ++ballbx;
        break;
      }
    case DIR_UPRIGHT:
      if (ballby == 0 || ballbx == 9) {
        break;
      } else {
        --ballby;
        ++ballbx;
        break;
      }
    case DIR_DOWNLEFT:
      if (ballbx == 0) {
        break;
      } else {
        ++ballby;
        --ballbx;
        break;
      }
    case DIR_UPLEFT:
      if (ballby == 0 || ballbx == 0) {
        break;
      } else {
        --ballby;
        --ballbx;
        break;
      }
  }
}

void setMovement() {
  switch (curControl) {
    case BTN_LEFT:
      if (posPlayer == 1) {
        break;
      } else {
        --posPlayer;
        break;
      }
    case BTN_RIGHT:
      if (posPlayer == (FIELD_WIDTH - 2)) {
        break;
      } else {
        ++posPlayer;
        break;
      }
    case BTN_DOWN:
      break;
    case BTN_UP:
      break;
  }
}

void breakoutInit() {
  posPlayer = FIELD_WIDTH / 2;
  ballbx = FIELD_WIDTH / 2;
  ballby = FIELD_WIDTH / 2;
  BALL_DIR = DIR_DOWN;
  lrojos[0]     = 0; lrojos[1] = 1; lrojos[2] = 2; lrojos[3] = 3; lrojos[4] = 4; lrojos[5] = 5; lrojos[6] = 6; lrojos[7] = 7; lrojos[8] = 8; lrojos[9] = 9;
  lnaranjas[0]  = 0; lnaranjas[1] = 1; lnaranjas[2] = 2; lnaranjas[3] = 3; lnaranjas[4] = 4; lnaranjas[5] = 5; lnaranjas[6] = 6; lnaranjas[7] = 7; lnaranjas[8] = 8; lnaranjas[9] = 9;
  lamarillos[0] = 0; lamarillos[1] = 1; lamarillos[2] = 2; lamarillos[3] = 3; lamarillos[4] = 4; lamarillos[5] = 5; lamarillos[6] = 6; lamarillos[7] = 7; lamarillos[8] = 8; lamarillos[9] = 9;
  lverdes[0]    = 0; lverdes[1] = 1; lverdes[2] = 2; lverdes[3] = 3; lverdes[4] = 4; lverdes[5] = 5; lverdes[6] = 6; lverdes[7] = 7; lverdes[8] = 8; lverdes[9] = 9;
  lazules[0]    = 0; lazules[1] = 1; lazules[2] = 2; lazules[3] = 3; lazules[4] = 4; lazules[5] = 5; lazules[6] = 6; lazules[7] = 7; lazules[8] = 8; lazules[9] = 9;
  scoreBreakout = 0;
  lifesBreakout = 3;
}

void runBreakout() {
  breakoutInit();

  unsigned long prevUpdateTime = 0;
  boolean breakoutRunning = true;
  while (breakoutRunning) {

    if (scoreBreakout == 50) {
      Serial.print("e");
      breakoutRunning = false;
      gameOverAnim(3);
      break;
    }

    /* Revisar colisión del jugador con la pelota */
    for (byte i = posPlayer - 1; i <= posPlayer + 1; i++) {
      if (collide(ballbx, i, ballby, 8)) {
        if (i == posPlayer) {
          byte a = random(1, 3);
          if (BALL_DIR == DIR_DOWN) {
            if (a == 1) {
              BALL_DIR = DIR_UPRIGHT;
            }
            else if (a == 2) {
              BALL_DIR = DIR_UPLEFT;
            }
          }
          else if (BALL_DIR == DIR_DOWNRIGHT) {
            BALL_DIR = DIR_UPRIGHT;
          }
          else if (BALL_DIR == DIR_DOWNLEFT) {
            BALL_DIR = DIR_UPLEFT;
          }
        }
        else if (i == posPlayer - 1) {
          if (BALL_DIR == DIR_DOWN) {
            BALL_DIR = DIR_UPLEFT;
          }
          else if (BALL_DIR == DIR_DOWNLEFT) {
            BALL_DIR = DIR_UPLEFT;
          }
          else if (BALL_DIR == DIR_DOWNRIGHT) {
            BALL_DIR = DIR_UPRIGHT;
          }
        }
        else if (i == posPlayer + 1) {
          if (BALL_DIR == DIR_DOWN) {
            BALL_DIR = DIR_UPRIGHT;
          }
          else if (BALL_DIR == DIR_DOWNLEFT) {
            BALL_DIR = DIR_UPLEFT;
          }
          else if (BALL_DIR == DIR_DOWNRIGHT) {
            BALL_DIR = DIR_UPRIGHT;
          }
        }
      }
      else if (collide(ballbx, posPlayer - 2, ballby, 8) && BALL_DIR == DIR_DOWNRIGHT) {
        BALL_DIR = DIR_UPLEFT;
      }
      else if (collide(ballbx, posPlayer + 2, ballby, 8) && BALL_DIR == DIR_DOWNLEFT) {
        BALL_DIR = DIR_UPRIGHT;
      }
    }


    /* Revisar colisión de la pelota con los extremos y el techo */
    for (byte i = 0; i < FIELD_WIDTH; i++) {
      if (collide(ballbx, 9, ballby, i )) {
        if (BALL_DIR == DIR_UPRIGHT) {
          BALL_DIR = DIR_UPLEFT;
        }
        else if (BALL_DIR == DIR_DOWNRIGHT) {
          BALL_DIR = DIR_DOWNLEFT;
        }
      }
      else if (collide(ballbx, 0, ballby, i)) {
        if (BALL_DIR == DIR_UPLEFT) {
          BALL_DIR = DIR_UPRIGHT;
        }
        else if (BALL_DIR == DIR_DOWNLEFT) {
          BALL_DIR = DIR_DOWNRIGHT;
        }
      }
      else if (collide(ballbx, i, ballby, 0)) {
        if (BALL_DIR == DIR_UPRIGHT) {
          BALL_DIR = DIR_DOWNRIGHT;
        }
        else if (BALL_DIR == DIR_UPLEFT) {
          BALL_DIR = DIR_DOWNLEFT;
        }
      }
    }


    /* Revisar colisión de la pelota con los ladrillos dependiendo de su direccion */
    for (byte i = 0; i < 6; i++) {
      for (byte i = 0; i < FIELD_WIDTH; i++) {
        /* Direccion arriba-derecha */
        if (BALL_DIR == DIR_UPRIGHT) {
          //Azules
          if (collide(ballbx, lazules[i] , ballby, 5)) {
            lazules[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNRIGHT;
          }
          else if (collide(ballbx, lazules[i] - 1 , ballby, 4)) {
            lazules[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPLEFT;
          }
          else if (collide(ballbx, lazules[i] - 1, ballby, 5) && !collide(ballbx, lazules[i - 1] , ballby, 5)) {
            lazules[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNLEFT;
          }

          //Verdes
          else if (collide(ballbx, lverdes[i] , ballby, 4)) {
            lverdes[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNRIGHT;
          }
          else if (collide(ballbx, lverdes[i] - 1 , ballby, 3)) {
            lverdes[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPLEFT;
          }
          else if (collide(ballbx, lverdes[i] - 1, ballby, 4) && !collide(ballbx, lverdes[i - 1] , ballby, 4) &&
                   !collide(ballbx, lazules[i] - 1 , ballby, 4)) {
            lverdes[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNLEFT;
          }

          //Amarillos
          else if (collide(ballbx, lamarillos[i] , ballby, 3)) {
            lamarillos[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNRIGHT;
          }
          else if (collide(ballbx, lamarillos[i] - 1 , ballby, 2)) {
            lamarillos[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPLEFT;
          }
          else if (collide(ballbx, lamarillos[i] - 1, ballby, 3) && !collide(ballbx, lamarillos[i - 1] , ballby, 3) &&
                   !collide(ballbx, lverdes[i] - 1 , ballby, 2)) {
            lamarillos[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNLEFT;
          }

          //Naranjas
          else if (collide(ballbx, lnaranjas[i] , ballby, 2)) {
            lnaranjas[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNRIGHT;
          }
          else if (collide(ballbx, lnaranjas[i] - 1 , ballby, 1)) {
            lnaranjas[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPLEFT;
          }
          else if (collide(ballbx, lnaranjas[i] - 1, ballby, 2) && !collide(ballbx, lnaranjas[i - 1] , ballby, 2) &&
                   !collide(ballbx, lamarillos[i] - 1 , ballby, 2)) {
            lnaranjas[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNLEFT;
          }

          //Rojos
          else if (collide(ballbx, lrojos[i] , ballby, 1)) {
            lrojos[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNRIGHT;
          }
          else if (collide(ballbx, lrojos[i] - 1 , ballby, 0)) {
            lrojos[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPLEFT;
          }
          else if (collide(ballbx, lrojos[i] - 1, ballby, 1) && !collide(ballbx, lrojos[i - 1] , ballby, 1) &&
                   !collide(ballbx, lnaranjas[i] - 1 , ballby, 1)) {
            lrojos[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNLEFT;
          }
        }


        /* Direccion arriba-izquierda */
        else if (BALL_DIR == DIR_UPLEFT) {
          //Azules
          if (collide(ballbx, lazules[i], ballby, 5)) {
            lazules[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNLEFT;
          }
          else if (collide(ballbx, lazules[i] + 1 , ballby, 4)) {
            lazules[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPRIGHT;
          }
          else if (collide(ballbx, lazules[i] + 1, ballby, 5) && !collide(ballbx, lazules[i + 1] , ballby, 5)) {
            lazules[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNRIGHT;
          }

          //Verdes
          else if (collide(ballbx, lverdes[i] , ballby, 4)) {
            lverdes[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNLEFT;
          }
          else if (collide(ballbx, lverdes[i] + 1 , ballby, 3)) {
            lverdes[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPRIGHT;
          }
          else if (collide(ballbx, lverdes[i] + 1, ballby, 4) && !collide(ballbx, lverdes[i + 1] , ballby, 4) &&
                   !collide(ballbx, lazules[i] + 1 , ballby, 4)) {
            lverdes[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNRIGHT;
          }

          //Amarillos
          else if (collide(ballbx, lamarillos[i] , ballby, 3)) {
            lamarillos[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNLEFT;
          }
          else if (collide(ballbx, lamarillos[i] + 1 , ballby, 2)) {
            lamarillos[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPRIGHT;
          }
          else if (collide(ballbx, lamarillos[i] + 1, ballby, 3) && !collide(ballbx, lamarillos[i + 1] , ballby, 3) &&
                   !collide(ballbx, lverdes[i] + 1 , ballby, 3)) {
            lamarillos[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNRIGHT;
          }

          //Naranjas
          else if (collide(ballbx, lnaranjas[i] , ballby, 2)) {
            lnaranjas[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNLEFT;
          }
          else if (collide(ballbx, lnaranjas[i] + 1 , ballby, 1)) {
            lnaranjas[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPRIGHT;
          }
          else if (collide(ballbx, lnaranjas[i] + 1, ballby, 2) && !collide(ballbx, lnaranjas[i + 1] , ballby, 2) &&
                   !collide(ballbx, lamarillos[i] + 1 , ballby, 2)) {
            lnaranjas[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNRIGHT;
          }

          //Rojos
          else if (collide(ballbx, lrojos[i] , ballby, 1)) {
            lrojos[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNLEFT;
          }
          else if (collide(ballbx, lrojos[i] + 1 , ballby, 0)) {
            lrojos[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPRIGHT;
          }
          else if (collide(ballbx, lrojos[i] + 1, ballby, 1) && !collide(ballbx, lrojos[i + 1] , ballby, 1) &&
                   !collide(ballbx, lnaranjas[i] + 1 , ballby, 1)) {
            lrojos[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNRIGHT;
          }
        }


        /* Direccion abajo-derecha */
        else if (BALL_DIR == DIR_DOWNRIGHT) {
          //Azules
          if (collide(ballbx, lazules[i], ballby, 3)) {
            lazules[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPRIGHT;
          }
          else if (collide(ballbx, lazules[i] - 1 , ballby, 4)) {
            lazules[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNLEFT;
          }
          else if (collide(ballbx, lazules[i] - 1, ballby, 3) && !collide(ballbx, lazules[i - 1] , ballby, 3) &&
                   !collide (ballbx, lverdes[i] - 1, ballby, 3)) {
            lazules[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPLEFT;
          }

          //Verdes
          else if (collide(ballbx, lverdes[i] , ballby, 2)) {
            lverdes[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPRIGHT;
          }
          else if (collide(ballbx, lverdes[i] - 1 , ballby, 3)) {
            lverdes[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNLEFT;
          }
          else if (collide(ballbx, lverdes[i] - 1, ballby, 2) && !collide(ballbx, lverdes[i - 1] , ballby, 2) &&
                   !collide(ballbx, lamarillos[i] - 1 , ballby, 2)) {
            lverdes[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPLEFT;
          }

          //Amarillos
          else if (collide(ballbx, lamarillos[i] , ballby, 1)) {
            lamarillos[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPRIGHT;
          }
          else if (collide(ballbx, lamarillos[i] - 1 , ballby, 2)) {
            lamarillos[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNLEFT;
          }
          else if (collide(ballbx, lamarillos[i] - 1, ballby, 1) && !collide(ballbx, lamarillos[i - 1] , ballby, 1) &&
                   !collide(ballbx, lnaranjas[i] - 1 , ballby, 1)) {
            lamarillos[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPLEFT;
          }

          //Naranjas
          else if (collide(ballbx, lnaranjas[i] , ballby, 0)) {
            lnaranjas[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPRIGHT;
          }
          else if (collide(ballbx, lnaranjas[i] - 1 , ballby, 1)) {
            lnaranjas[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNLEFT;
          }
          else if (collide(ballbx, lnaranjas[i] - 1, ballby, 0) && !collide(ballbx, lnaranjas[i - 1] , ballby, 0) &&
                   !collide(ballbx, lrojos[i] - 1 , ballby, 0)) {
            lnaranjas[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPLEFT;
          }

          //Rojos
          else if (collide(ballbx, lrojos[i] - 1, ballby, 0)) {
            lrojos[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNLEFT;
          }
        }


        /* Direccion abajo-left */
        else if (BALL_DIR == DIR_DOWNLEFT) {
          //Azules
          if (collide(ballbx, lazules[i], ballby, 3)) {
            lazules[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPLEFT;
          }
          else if (collide(ballbx, lazules[i] + 1 , ballby, 4)) {
            lazules[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNRIGHT;
          }
          else if (collide(ballbx, lazules[i] + 1, ballby, 3) && !collide(ballbx, lazules[i + 1] , ballby, 3) &&
                   !collide (ballbx, lverdes[i] + 1, ballby, 3)) {
            lazules[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPRIGHT;
          }

          //Verdes
          else if (collide(ballbx, lverdes[i] , ballby, 2)) {
            lverdes[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPLEFT;
          }
          else if (collide(ballbx, lverdes[i] + 1 , ballby, 3)) {
            lverdes[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNRIGHT;
          }
          else if (collide(ballbx, lverdes[i] + 1, ballby, 2) && !collide(ballbx, lverdes[i + 1] , ballby, 2) &&
                   !collide(ballbx, lamarillos[i] + 1 , ballby, 2)) {
            lverdes[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPRIGHT;
          }

          //Amarillos
          else if (collide(ballbx, lamarillos[i] , ballby, 1)) {
            lamarillos[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPLEFT;
          }
          else if (collide(ballbx, lamarillos[i] + 1 , ballby, 2)) {
            lamarillos[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNRIGHT;
          }
          else if (collide(ballbx, lamarillos[i] + 1, ballby, 1) && !collide(ballbx, lamarillos[i + 1] , ballby, 1) &&
                   !collide(ballbx, lnaranjas[i] + 1 , ballby, 1)) {
            lamarillos[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPRIGHT;
          }

          //Naranjas
          else if (collide(ballbx, lnaranjas[i] , ballby, 0)) {
            lnaranjas[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPLEFT;
          }
          else if (collide(ballbx, lnaranjas[i] + 1 , ballby, 1)) {
            lnaranjas[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNRIGHT;
          }
          else if (collide(ballbx, lnaranjas[i] + 1, ballby, 0) && !collide(ballbx, lnaranjas[i + 1] , ballby, 0) &&
                   !collide(ballbx, lrojos[i] + 1 , ballby, 0)) {
            lnaranjas[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_UPRIGHT;
          }

          //Rojos
          else if (collide(ballbx, lrojos[i] + 1, ballby, 0)) {
            lrojos[i] = 255;
            ++scoreBreakout;
            BALL_DIR = DIR_DOWNRIGHT;
          }
        }
      }
    }

    ballBreakOutDirection();

    if (scoreBreakout - prevScoreBreakout > 0) {
      Serial.println(scoreBreakout);
      prevScoreBreakout = scoreBreakout;
    }



    /* Sistema de vidas */
    for (byte i = 0; i < FIELD_WIDTH; i++) {
      if (collide(ballbx, i, ballby, 9 )) {
        --lifesBreakout;
        ballbx = FIELD_WIDTH / 2;
        ballby = (FIELD_WIDTH / 2) + 1;
        BALL_DIR = DIR_DOWN;
        if (lifesBreakout == 0) {
          breakoutRunning = false;
          Serial.print("e");
          gameOverAnim(3);
          break;
        }
      }
    }

    clearTablePixels();

    /* Dibujar la pelota */
    setTablePixel(ballbx, ballby, 15, 15, 15);

    /* Dibujar los ladrillos */
    for (byte i = 0; i < FIELD_WIDTH; i++) {
      setTablePixel(lrojos[i], 0, 15, 0, 0);      // Ladrillos rojos,
      setTablePixel(lnaranjas[i], 1, 15, 7, 0);   // naranjas,
      setTablePixel(lamarillos[i], 2, 15, 15, 0); // amarillos,
      setTablePixel(lverdes[i], 3, 7, 15, 0);     // verdes,
      setTablePixel(lazules[i], 4, 0, 7, 15);     // y azules
    }

    /* Dibujar al jugador */
    for (byte i = posPlayer - 1; i <= posPlayer + 1; i++) {
      setTablePixel(i, 9, 15, 15, 15);
    }

    pixels.show();

    unsigned long curTime;
    boolean dirChanged = false;
    do {
      readInput();
      if (curControl == BTN_EXIT) {
        breakoutRunning = false;
        gameOverAnim(3);
        break;
      }
      if (curControl != BTN_NONE && !dirChanged) { //Solo se puede cambiar de dirección una vez
        dirChanged = true;
        setMovement();
        curControl = BTN_NONE;
      }
      curTime = millis();
    }
    while ((curTime - prevUpdateTime) < 250); //Luego de 250ms el juegador se mueve
    prevUpdateTime = curTime;
  }
}
