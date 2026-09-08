# Your first SARDU-Matrix message

[Italiano](_locales/it/tutorial.md)

## Introduction @unplugged

Create a 16×16 RGB matrix, display a static message and then make another message scroll from right to left.

Connect the matrix data input to P1. Power the LEDs from a suitable external supply and connect its ground to both the matrix and the Micro:Bit ground.

## Create the matrix

From **SARDU Matrix → Creation**, add **create matrix**. Keep width and height at 16, pin P1 and brightness 128.

```blocks
let matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 128)
```

## Draw static text

From **SARDU Matrix → Static text**, add the centered-width text block. Write `HI`, keep Y at 0 and select white.

```blocks
let matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 128)
matrix.drawTextCenteredWidth("HI", 0, neopixel.colors(NeoPixelColors.White), MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal)
```

The drawing is now in the RGB buffer, but it has not yet been sent to the LEDs.

## Show the message

From **SARDU Matrix → Display**, add **show matrix**.

```blocks
let matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 128)
matrix.drawTextCenteredWidth("HI", 0, neopixel.colors(NeoPixelColors.White), MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal)
matrix.show()
```

## Add scrolling text

Add a one-second pause, then choose **scroll text from edge** from **SARDU Matrix → Scrolling text**. Enter `HELLO` and keep entry from the right, white, 100 ms and Exclusive mode.

```blocks
let matrix = sarduMatrix.create(16, 16, DigitalPin.P1, 128)
matrix.drawTextCenteredWidth("HI", 0, neopixel.colors(NeoPixelColors.White), MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal)
matrix.show()
basic.pause(1000)
matrix.scrollTextFromEdge("HELLO", MatrixScrollEdge.Right, neopixel.colors(NeoPixelColors.White), 100, MatrixFont.Sardu, MatrixFontSize.X1, 128, MatrixTextOrientation.Normal, MatrixScrollMode.Exclusive)
```

## Download

Connect the Micro:Bit, select **Download** and transfer the program. The static `HI` appears first; after one second, `HELLO` enters from the right and leaves from the left.
