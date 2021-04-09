```package
reaction-time-game=github:UserJHansen/reaction-time-game

# How to Start with Micro:Bit Reaction Game

## Introduction @unplugged

Let's get started!

## Step 1: Init Game

Welcome! Place the ``||Reaction Game:Set Game Controls||`` block in the ``||basic:on start||`` slot to setup the game.

```blocks
reactionGame.setup(TouchPin.P0, Button.B);
```

## Step 2: Start Game

Next, Place the ``||Reaction Game:Start The Game||`` block after the ``||Reaction Game:Set Game Controls||``

```blocks
reactionGame.setup(TouchPin.P0, Button.B);

reactionGame.start();
```

## Step 3

Click ``|Download|`` to transfer your code to your Micro:Bit!
