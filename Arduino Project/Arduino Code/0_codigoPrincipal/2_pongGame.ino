/* Variables y constantes iniciales del juego */
#define MAX_SCORE 5

byte posPlayerIzq;
byte posPlayerDer;
byte scoreIzq;
byte scoreDer;
byte scoreDerApp;
byte ballx;
byte bally;

/* Dirección de la pelota */
void ballDirection() {
  switch (BALL_DIR) {
    case DIR_LEFT:
      --ballx;
      break;
    case DIR_RIGHT:
      ++ballx;
      break;
    case DIR_DOWNRIGHT:
      ++bally;
      ++ballx;
      break;
    case DIR_UPRIGHT:
      --bally;
      ++ballx;
      break;
    case DIR_DOWNLEFT:
      ++bally;
      --ballx;
      break;
    case DIR_UPLEFT:
      --bally;
      --ballx;
      break;
  }
}

/* Movimiento jugador izquierda */
void setPosition() {
  switch (curControl) {
    case BTN_LEFT:
      break;
    case BTN_RIGHT:
      break;
    case BTN_DOWN:
      if (posPlayerIzq == (FIELD_HEIGHT - 2))
        break;
      else {
        ++posPlayerIzq;
        break;
      }
    case BTN_UP:
      if (posPlayerIzq == 1)
        break;
      else {
        --posPlayerIzq;
        break;
      }
  }
}


void pongInit() {
  //Posición inicial de los jugadores y la pelota
  posPlayerIzq = FIELD_HEIGHT / 2;
  posPlayerDer = FIELD_HEIGHT / 2;
  scoreIzq = 0;
  scoreDer = 0;
  ballx = 4;
  bally = FIELD_HEIGHT / 2;
  BALL_DIR = DIR_RIGHT;
  curControl = BTN_NONE;
}

void runPong() {
  pongInit();

  unsigned long prevUpdateTime = 0;
  boolean pongRunning = true;
  while (pongRunning) {
    /*Revisar si alguien ganó*/
    if (scoreIzq == MAX_SCORE || scoreDer == MAX_SCORE) {
      clearTablePixels();
      pixels.show();
      Serial.print("e");
      pongRunning = false;
      gameOverAnim(2);
      break;
    }

    /* Revisar desde qué dirección y en qué parte del jugador 1 chocó la pelota */
    for (byte i = posPlayerIzq - 1; i <= posPlayerIzq + 1; i++) {
      if (collide(ballx, 1, bally, i)) {
        if (i == posPlayerIzq) {
          BALL_DIR = DIR_RIGHT;
        }
        else if (i == posPlayerIzq + 1) {
          if (BALL_DIR == DIR_LEFT || BALL_DIR == DIR_DOWNLEFT) {
            BALL_DIR = DIR_DOWNRIGHT;
          }
          else if (BALL_DIR == DIR_UPLEFT) {
            BALL_DIR = DIR_UPRIGHT;
          }
        }
        else if (i == posPlayerIzq - 1) {
          if (BALL_DIR == DIR_LEFT || BALL_DIR == DIR_UPLEFT) {
            BALL_DIR = DIR_UPRIGHT;
          }
          else if (BALL_DIR == DIR_DOWNLEFT) {
            BALL_DIR = DIR_DOWNRIGHT;
          }
        }
      }
    }

    /* Revisar desde qué dirección y en qué parte del jugador 2 chocó la pelota */
    for (byte i = posPlayerDer - 1; i <= posPlayerDer + 1; i++) {
      if (collide(ballx, 8, bally, i)) {
        if (i == posPlayerDer) {
          BALL_DIR = DIR_LEFT;
        }
        else if (i == posPlayerDer + 1) {
          if (BALL_DIR == DIR_RIGHT || BALL_DIR == DIR_DOWNRIGHT) {
            BALL_DIR = DIR_DOWNLEFT;
          }
          else if (BALL_DIR == DIR_UPRIGHT) {
            BALL_DIR = DIR_UPLEFT;
          }
        }
        else if (i == posPlayerDer - 1) {
          if (BALL_DIR == DIR_RIGHT || BALL_DIR == DIR_UPRIGHT) {
            BALL_DIR = DIR_UPLEFT;
          }
          else if (BALL_DIR == DIR_DOWNRIGHT) {
            BALL_DIR = DIR_DOWNLEFT;
          }
        }
      }
    }

    /* Colisión de la pelota con los extremos superior e inferior*/
    for (byte i = 0; i < FIELD_WIDTH; i++) {
      if (collide(ballx, i, bally, 9 )) {
        if (BALL_DIR == DIR_DOWNRIGHT) {
          BALL_DIR = DIR_UPRIGHT;
        }
        else if (BALL_DIR == DIR_DOWNLEFT) {
          BALL_DIR = DIR_UPLEFT;
        }
      }
      else if (collide(ballx, i, bally, 0)) {
        if (BALL_DIR == DIR_UPRIGHT) {
          BALL_DIR = DIR_DOWNRIGHT;
        }
        else if (BALL_DIR == DIR_UPLEFT) {
          BALL_DIR = DIR_DOWNLEFT;
        }
      }
    }

    if (ballx == 0) {
      ++scoreDer;
      scoreDerApp = scoreDer + 5;
      Serial.print(scoreDerApp);
      ballx = 5;
      bally = FIELD_HEIGHT / 2;
      BALL_DIR = DIR_LEFT;
    }
    else if (ballx == 9) {
      ++scoreIzq;
      Serial.print(scoreIzq);
      ballx = 4;
      bally = FIELD_HEIGHT / 2;
      BALL_DIR = DIR_RIGHT;
    }

    ballDirection();

    /* Movimiento de la CPU */
    if (posPlayerDer != 8 && posPlayerDer != 1 && ballx > 5) {
      if (bally == posPlayerDer) {
        posPlayerDer = bally;
      }

      else if (bally > posPlayerDer) {
        ++posPlayerDer;
      }

      else if (bally < posPlayerDer) {
        --posPlayerDer;
      }
    } else {
      if (bally == 7 && posPlayerDer == 8) {
        --posPlayerDer;
      }
      else if (bally == 2 && posPlayerDer == 1) {
        ++posPlayerDer;
      }
    }


    clearTablePixels();

    //Dibujar la pelota
    setTablePixel(ballx, bally, 15, 15, 15);

    //Dibujar el jugador de la izquierda
    for (byte i = posPlayerIzq - 1; i <= posPlayerIzq + 1; i++) {
      setTablePixel(0, i, 0, 0, 15);
    }

    //Dibujar el jugador de la derecha
    for (byte  i = posPlayerDer - 1; i <= posPlayerDer + 1; i++) {
      setTablePixel((FIELD_WIDTH - 1), i, 15, 0, 0);
    }

    pixels.show();

    /* Revisar dirección del jugador 1 mientras se espera otra dirección */
    unsigned long curTime;
    boolean dirChanged = false;
    do {
      readInput();
      if (curControl == BTN_EXIT) {
        pongRunning = false;
        gameOverAnim(2);
        break;
      }
      if (curControl != BTN_NONE && !dirChanged) { //Solo se puede cambiar de dirección una vez
        dirChanged = true;
        setPosition();
      }
      curTime = millis();
    }
    while ((curTime - prevUpdateTime) < 250); //Luego de 250ms la pelota se mueve
    prevUpdateTime = curTime;
    curControl = BTN_NONE;
  }
}
