/**
 * Collection of UI functions
 */
//% color=190 weight=115 icon="\uf108" block="UI"
namespace UI {
    //% block
    export function countdown (length: number = 3): void { // Do a countdown for length seconds, the default is three
        for (let i = length; i > 0; i--) { 
            basic.showNumber(i);  
            basic.pause(1000);
        }
        basic.clearScreen();
    }
}
namespace Timing {
    /**
    * A Simple Timer Class
    */
    export class timer {
        private startTime: number;
        private stopTime: number;
        private hasStopped: boolean;
        toSeconds(): number {
            return (this.stopTime - this.startTime) / 1000;
        }
        start(): void {
            this.hasStopped = false;
            this.startTime = control.millis();
        }
        stop(): void {
            this.hasStopped = true;
            this.stopTime = control.millis();
        }
    }
}
/**
 * The Main Game Class
 */
//% color=190 weight=114 icon="\uf11b" block="Reaction Game"
namespace reactionGame {
    let ReactionGame: _NewReactionGame;
    /**
     * Setup the Game Controls
     */
    //% block="Set Game Controls: First Player Pin: %player1PinSecond Player Button %player2Pin||Start Button: %startButtonFirst Player Light: %player1LightSecond Player Light: %player2Light" weight=150
    //% expandableArgumentMode="enabled"
    //% player1Pin.defl=TouchPin.P0
    //% player2Pin.defl=Button.B
    //% startButton.defl=Button.A
    //% player1Light.defl=AnalogPin.P1
    //% player2Light.defl=AnalogPin.P2
    export function setup(player1Pin: TouchPin, player2Pin: Button, startButton: Button = Button.A, player1Light: AnalogPin = AnalogPin.P1, player2Light: AnalogPin = AnalogPin.P2): void {
        ReactionGame = new _NewReactionGame(player1Pin, player2Pin, startButton, player1Light, player2Light);
    }
    //% block="Start The Game" weight=100
    /**
     * Starts the reaction Game
     */
    export function start(): void {
        ReactionGame.init();
    }
    class _NewReactionGame {
        private startButton: Button;                           // Define the Button to start the game
        private player1Pin: TouchPin;                          // Define the Button the first player has to hit
        private player2Pin: Button;                            // Define the Button the second player has to hit
        private player1Light: AnalogPin;                       // Define the Light for the first player
        private player2Light: AnalogPin;                       // Define the Light for the second player
        private winnerNum: number = 0;                         // Make sure we keep track of who won
        private hasStarted: boolean = false;                   // Make sure that it does not run more than once at a time
        private timer: Timing.timer = new Timing.timer();      // Create a timer object

        constructor (player1Pin: TouchPin, player2Pin: Button, startButton: Button = Button.A, player1Light: AnalogPin, player2Light: AnalogPin) {
            this.startButton = startButton;  // Assign the Variables to the class so it
            this.player1Pin = player1Pin;    // can access them later
            this.player2Pin = player2Pin;
            this.player1Light = player1Light;
            this.player2Light = player2Light;
        }

        public init(): void {
            input.onButtonPressed(this.startButton, function () { // Run the start function 
                this.onStart();                                   // when the start button
            });                                                   // is pressed

            input.onPinPressed(this.player1Pin, function () { 
                if (this.hasStarted) {  // Make sure there is actually a game running
                    this.win(1);        // Announce that player 2 has won
                }
            });
            input.onButtonPressed(this.player2Pin, function () {
                if (this.hasStarted) {  // Make sure there is actually a game running
                    this.win(2);        // Announce that player 2 has won
                }
            });
            
            // Make sure Everything is off
            pins.analogWritePin(this.player1Light, 0);
            pins.analogWritePin(this.player2Light, 0);
            basic.clearScreen();
            this.winnerNum = 0;
            this.hasStarted = false;
        }

        private onStart (): void {
            if (this.hasStarted) { // Make sure the Game hasn't already started
                return; // if it has stop
            }

            UI.countdown(3); // Do the Countdown

            basic.pause(1000); // Make sure the time is not less than one second
            basic.pause(Math.random() * 5000); // Wait for a random amount of time, up to 5 seconds

            this.hasStarted = true; // Allow button presses to be calculated
            basic.plotLeds(`
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            # # # # #`); // Show the Alert that they should press the buttons

            this.timer.start(); // Start the timer
            
        }

        private win(winner: number): void {
            this.winnerNum = winner;   // Keep track of who won
            basic.clearScreen();       // Clear the screen
            this.showScore();          // Call the function to show the score
        }

        private showScore(): void {
            if (this.winnerNum == 1) {
                pins.analogWritePin(this.player1Light, 512);     // Make the winners light turn on
                pins.analogSetPeriod(this.player1Light, 250000); // Make it flash
            } else {
                pins.analogWritePin(this.player2Light, 512);     // Make the winners light turn on
                pins.analogSetPeriod(this.player2Light, 250000); // Make it flash
            }

            this.timer.stop(); // Stop the Timer
            for (let j = 0; j < 3; j++) {                  // Repeat three times
                basic.showNumber(this.timer.toSeconds());      // Show the winners score
                basic.pause(500);                              // Wait a bit
            }

            this.init(); // Restart the Cycle
        }
    }
}