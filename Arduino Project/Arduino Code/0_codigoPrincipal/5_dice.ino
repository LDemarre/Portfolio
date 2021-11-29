byte diceface = 0;

byte one[4]   = {44, 45, 54, 55};
byte two[8]   = {11, 12, 27, 28, 77, 78, 81, 82};
byte three[12] = {11, 12, 27, 28, 44, 45, 54, 55, 77, 78, 81, 82};
byte four[16]  = {11, 12, 17, 18, 21, 22, 27, 28, 71, 72, 77, 78, 81, 82, 87, 88};
byte five[20]  = {11, 12, 17, 18, 21, 22, 27, 28, 44, 45, 54, 55, 71, 72, 77, 78, 81, 82, 87, 88};
byte six[24]   = {11, 12, 17, 18, 21, 22, 27, 28, 41, 42, 47, 48, 51, 52, 57, 58, 71, 72, 77, 78, 81, 82, 87, 88};


void runDice() {
  boolean diceRunning = true;
  unsigned long prevUpdateTime = 0;


  while (diceRunning) {
    if (diceface == 1) {
      for (byte i = 0; i < 4; i++) {
        pixels.setPixelColor(one[i], pixels.Color(15, 15, 15));
        diceface = 0;
      }
    }
    else if (diceface == 2) {
      for (byte i = 0; i < 8; i++) {
        pixels.setPixelColor(two[i], pixels.Color(15, 15, 15));
        diceface = 0;
      }
    }
    else if (diceface == 3) {
      for (byte i = 0; i < 12; i++) {
        pixels.setPixelColor(three[i], pixels.Color(15, 15, 15));
        diceface = 0;
      }
    }
    else if (diceface == 4) {
      for (byte i = 0; i < 16; i++) {
        pixels.setPixelColor(four[i], pixels.Color(15, 15, 15));
        diceface = 0;
      }
    }
    else if (diceface == 5) {
      for (byte i = 0; i < 20; i++) {
        pixels.setPixelColor(five[i], pixels.Color(15, 15, 15));
        diceface = 0;
      }
    }
    else if (diceface == 6) {
      for (byte i = 0; i < 24; i++) {
        pixels.setPixelColor(six[i], pixels.Color(15, 15, 15));
        diceface = 0;
      }
    }

    pixels.show();
    delay(2500);
    clearTablePixels();

    unsigned long curTime;
    do {
      readInput();
      if (curControl == BTN_EXIT) {
        diceRunning = false;
        mainMenu();
        break;
      }
      if (curControl != BTN_NONE) {
        diceface = random(1, 7);
        break;
      }
      curTime = millis();
    }
    while ((curTime - prevUpdateTime) < 250);
    prevUpdateTime = curTime;
    curControl = BTN_NONE;
  }
}
