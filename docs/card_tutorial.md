## Keyforge Card Tutorial

This document is a tutorial on how to create a new Keyforge card. This tutorial follows the creation of a new card for Mass Mutation - so note this document contains spoilers as Mass Mutation has not been released yet.

### Getting Started
 
To get started, get your development environment setup, following the directions here:
[Keyteki README](https://github.com/keyteki/keyteki/blob/master/README.md)

When all done you should be able to use these three commands:
* ```docker-compose up```  - to start a local version of TCO on your desktop.
* ```npm run lint``` - to run lint commands on your code
* ```npm test``` - to run the test suite.

> Tip: Run these commands now to make sure your environment is working before you get started.

Later, when you want to check in code you will need to use git, so you might want to polish up on your git commands. 

> Note: This is the jank that I use. There is most likely a better way.
>
> This example is if you had a new branch called "mm_example", these are the commands that I use to create a new workspace for mass mutation cards. 
> ```
> git clone https://github.com/YOUR_GIT_USERNAME_HERE/keyteki.git
> cd keyteki
> git remote add upstream https://github.com/keyteki/keyteki.git
> git pull upstream
> git checkout --track upstream/feature/mm
> git checkout -b mm_example
> git pull upstream feature/mm
> git push -u origin mm_example
> ```

#### 1. Get the details of the card you are building.

In this example, we are building the Star Alliance card: [Access Denied](https://decksofkeyforge.com/spoilers/1768198)

> Tip: Post in dev chat what you are working on to avoid duplicating work. 

![Card](https://keyforge-card-images.s3-us-west-2.amazonaws.com/spoiler-imgs/512/access-denied.jpg)


#### 2. Look for similar cards.

Use the [cards search on DOK](https://decksofkeyforge.com/cards) to find cards that are similar. 

In this case, searching for "cannot" turned up the [Earthbind](https://decksofkeyforge.com/cards/earthbind) card.

Look at the [source](https://github.com/keyteki/keyteki/tree/master/server/game/cards) of the similar cards that you found, in this case, [Earthbind source](https://github.com/keyteki/keyteki/blob/master/server/game/cards/02-AoA/Earthbind.js):

```
const Card = require('../../Card.js');

class Earthbind extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => !this.game.cardsDiscarded.length,
            effect: ability.effects.cardCannot('use')
        });
    }
}

Earthbind.id = 'earthbind';

module.exports = Earthbind;
```

#### 3. Create your new card file.

Once you have a guess how your card might work, create the file. The files go in the ```server/game/cards/``` directory, in the folder matching the set. For a new MM card, use ```server/game/cards/04-MM```

Your file should be named using java naming syntax, which is roughly, first latter capital for each word, no spaces. In this case Access Denied becomes: ```AccessDenied.js```

Update the Earthbind card, replacing Earthbind with AccessDenied.

```
const Card = require('../../Card.js');

class AccessDenied extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => !this.game.cardsDiscarded.length,
            effect: ability.effects.cardCannot('use')
        });
    }
}

AccessDenied.id = 'access-denied';

module.exports = AccessDenied;
```

Note the id needs to be all lower case, with dashes, in this case:

```AccessDenied.id = 'access-denied';```

#### 4. Update for your effect.

In this file the code in ```setupCardAbilities(ability) {``` needs to be updated for your cards ability.

The Earthbind card prevents any use of the card, so we need to change that to just be reap.

Earthbind:
```
this.whileAttached({
  condition: () => !this.game.cardsDiscarded.length,
  effect: ability.effects.cardCannot('use')
});
```

```whileAttached``` is used to declare an effect to use while this card is attached to another card.

> The object passed to whileAttached is evaluated by the game engine when it needs to evaluate the attach action.

In this case, the object has two properties:
* ```condition``` - this is a boolean value, or a function that returns a boolean value. This is used to determine if the effect should trigger. 
* ```effect``` - this is the effect that will be executed if condition is true.

> If you are not familiar with => syntax, [read this.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) but in short it is an inline definition of a function.

In the case of our card, we want to always prevent reaping. So, we can remove ```condition``` since the default is true.

```
this.whileAttached({
  effect: ability.effects.cardCannot('use')
});
```

Next, in our case we only want to prevent reaping - fighting, actions, general use is allowed. So, lets replace ```use``` with ```reap```

```
this.whileAttached({
  effect: ability.effects.cardCannot('reap')
});
```

All together, our file looks like:

```
const Card = require('../../Card.js');

class AccessDenied extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cardCannot('reap')
        });
    }
}

AccessDenied.id = 'access-denied';

module.exports = AccessDenied;
```

> Note: effects like bonus aember are part of the card definition in the card database, these are already taken care of for you for cards that are in the database. If the card is not in the database, or wrong in the database ask for help. 

#### 5. Create a test for your card.

Tests? Yes, just do it, it will save you time as you test your card for your self, and it will help future developers when crazy changes to the engine are needed for things like large-two-card-creatures.

Create your test file in a using a name like:
```test/server/cards/04-MM/AccessDenied.spec.js```

I recommend you copy an existing test.

Here is what the final test for access denied looks like:

```
describe('access-denied', function() {
    integration(function() {
        describe('Access Denied\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'staralliance',
                        inPlay: ['cxo-taber'],
                        hand: ['access-denied']
                    },
                    player2: {
                        amber: 1,
                        inPlay: ['umbra']
                    }
                });
            });

        });
    });
});
```

Update your test file talk about your card see above where it says ```access-denied``` and ```Access Denied\'s ability```

#### 6. Update your starting test case conditions.

In the ```setupTest``` section setup the game state for what you want to test.

```
player1: {
  house: 'staralliance',
  inPlay: ['cxo-taber'],
  hand: ['access-denied']
}
```
* ```house``` - this is the starting house selected
* ```inPlay``` - these are the cards that are in play for this play
* ```hand``` - these are the cards that are in the players hand

#### 7. Add simple test case.

Add a simple test case that plays your card, or uses it so you can check if your code is working. 

```
it('should should apply to a creature', function() {
  this.player1.playUpgrade(this.accessDenied, this.umbra);
  expect(this.umbra.location).toBe('play area');
  expect(this.umbra.upgrades).toContain(this.accessDenied);
});
```

In this case with an upgrade we should test that it attaches to a creature. 

* ```this.player1.playUpgrade(this.accessDenied, this.umbra)``` this causes a player to play an upgrade from hand, onto a creature in play.


* ```expect(this.umbra.location).toBe('play area');``` this tests the expectation that umbra is in play.


* ```expect(this.umbra.upgrades).toContain(this.accessDenied);``` this checks that umbra has the upgrade that we played on it.

#### 8. Run your test.

This part is easy.

Run the command:
```npm test```

> Tip: If you have issues running the test, these commands fix up issues for me.
> ```
> git submodule init
> git submodule update
> npm install
> git submodule update --init --recursive
> ```
#### 9. Fix your issues. 

Fix any problems with your card file.


#### 10. Add more tests.

In this case, we should test that when a creature has Access Denied that it can not reap. 

```
it('creature should not be able to reap', function() {
  this.player1.playUpgrade(this.accessDenied, this.cxoTaber);
  expect(this.cxoTaber.location).toBe('play area');                
  expect(this.cxoTaber.upgrades).toContain(this.accessDenied);
  this.player1.clickCard(this.cxoTaber);
  expect(this.player1).not.toHavePromptButton('Reap with this creature');
  expect(this.player1).toHavePromptButton('Fight with this creature');
});
```

The first bit, we already know about, put the upgrade on CXO Taber, and confirm CXO has the upgrade:

```
  this.player1.playUpgrade(this.accessDenied, this.cxoTaber);
  expect(this.cxoTaber.location).toBe('play area');                
  expect(this.cxoTaber.upgrades).toContain(this.accessDenied);
```

* Next, we want to simulate that the player clicked on CXO Taber with: 
```this.player1.clickCard(this.cxoTaber);```

* Next, we want to confirm the player can not reap. Note the ```not``` part here, it is easy to miss.
```expect(this.player1).not.toHavePromptButton('Reap with this creature');```

* Last, confirm there is a fight prompt, to make sure the creature is not fully broken: ```expect(this.player1).toHavePromptButton('Fight with this creature');```

> Tip: If you are not sure what the prompt text is, just make up text like ```toHavePromptButton('FIGHT')```, and run ```npm test```, the error output will tell you what prompts were available. (So kind, thank you test bot.)

#### 11. Test your card in the UI.

1. Run the command:
```docker-compose up```
1. visit [http://localhost:4000](http://localhost:4000)
1. Setup a game using a deck that has the house your card is in.
1. Start the game.
1. Enter manual mode.
1. type: `/add-card Access Denied` to add the card to your hand.
1. Test your card.

> Note: If your card is not showing up, try updating the card database by doing the following.
>
> 1. Start the server with: ```docker-compose up```
> 1. In a new terminal run: ```docker-compose exec lobby node server/scripts/fetchdata```

#### 12. Confirm test and lint pass.

Run these commands until there are no more errors.

* ```npm run lint```
* ```npm test```

> Note: The this codebase uses spaces not tabs.

#### 13. Git your changes to the cloud.

```
git add test/server/cards/04-MM/AccessDenied.spec.js
git add server/game/cards/04-MM/AccessDenied.js
git commit -S -m "added new card foo"
git push -u origin mm_example
```

> Note: These are the commands I use, there are many ways to do this.


#### 14. Use github to create your PR.

Example template for card:


**MM: StarAlliance - Access Denied** 

```
Adding card related to issue:
<issue link>

Changes:
* new card xxxx
* new test case for card xxxx

Validation done:
* Test case passed
* Lint passed
* Tested in game
```
