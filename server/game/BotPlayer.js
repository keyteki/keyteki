const _ = require('underscore');
const util = require('util');

const Player = require('./player.js');

// For the bot to interact
const PlayerInteractionWrapper = require('../../test/helpers/playerinteractionwrapper.js');
const BasePlayAction = require('./BaseActions/BasePlayAction');

class BotPlayer extends Player {
    drawCardsToHand(numCards) {
        super.drawCardsToHand(numCards);

        /* For testing specific cards */

        for (let card of this.deck) {
            if (card.name === 'Mug' || card.name === 'Gateway to Dis') {
                this.moveCard(card, 'hand');
            }
        }
    }

    speak(msg) {
        this.game.chat(this.name, msg);
    }

    speakDebug(...objects) {
        let s = '';
        let inspected = objects.map(function (o) {
            return util.inspect(
                o,
                new Object({
                    maxArrayLength: 3,
                    sorted: true,
                    depth: 1
                })
            );
        });
        s = inspected.join(', ');
        console.log(s);
        //this.speak(s);
    }

    botRespond() {
        this.speakDebug('  ---   THINKING ---  ');
        this.speakDebug(this.game.pipeline.getCurrentStep());
        if (
            _.contains(['main', 'key', 'house', 'draw'], this.game.pipeline.getCurrentStep().name)
        ) {
            if (this.game.activePlayer != this) {
                return false;
            }
        }
        let didRespond = false;
        let interactor = new PlayerInteractionWrapper(this.game, this);
        if (this.promptState) {
            this.handlePrompt(interactor);
            didRespond = true;
        }
        return didRespond;
    }

    handlePrompt(interactor) {
        if (interactor.hasPrompt('Start Game')) {
            interactor.clickPrompt('Start the Game');
            return;
        } else if (interactor.hasPrompt('Mulligan')) {
            if (this.botEvaluateMulligan(this.hand)) {
                interactor.clickPrompt('Mulligan');
                this.speak('Going to mulligan');
            } else {
                interactor.clickPrompt('Keep Hand');
                this.speak("I'll keep this");
            }
            return;
        }
        this.speakDebug(this.game.effectEngine.effects);
        this.speakDebug(interactor.currentPrompt());
        this.speakDebug(this.promptState);
        this.speakDebug(this.promptState.base);
        //this.speakDebug(this.game.pipeline.getCurrentStep());
        //for(let pipeline of this.game.pipeline.getCurrentStep().pipeline.pipeline) {
        //    this.speakDebug(pipeline);
        //}
        if (interactor.hasPrompt('House Choice')) {
            this.botChooseHouse(interactor);
        } else if (interactor.hasPrompt('Play phase')) {
            this.botPlayPhase(interactor);
        } else if (interactor.hasPrompt('End Turn')) {
            interactor.clickPrompt('Yes');
        } else if (this.promptState.base && this.promptState.base.properties.botEffect) {
            this.botEvaluateEffect(interactor, this.promptState.base.properties.botEffect);
        } else {
            this.speakDebug("I'm stuck, randomly picking");
            this.botRandomChoice(interactor);
        }
    }

    botEvaluateMulligan(hand) {
        if (hand.length == 7) {
            return true;
        }
        return false;
    }

    botChooseHouse(interactor) {
        let counts = {};
        this.speakDebug('My Cards:', this.cardsInPlay);
        for (let card of this.hand.concat(this.cardsInPlay)) {
            for (let house of card.getHouses()) {
                counts[house] = counts[house] ? counts[house] + 1 : 1;
            }
        }
        this.speakDebug(counts);
        let houses = _.pairs(counts);
        houses.sort(function (a, b) {
            return -(a[1] - b[1]);
        });
        this.speak('I choose ' + houses[0][0]);
        interactor.clickPrompt(houses[0][0]);
    }

    botPlayPhase(interactor) {
        // If we have a card we can play, play it
        for (let card of _.shuffle(this.hand)) {
            for (let action of card.getLegalActions()) {
                if (action instanceof BasePlayAction) {
                    this.speakDebug('Play:' + card.name);
                    this.speakDebug(action);
                    // false: Don't know how to deploy yet
                    if (this.botShouldPlay(card)) {
                        interactor.play(card, Math.random() >= 0.5, false);
                        return;
                    }
                }
            }
        }

        // If we have a card we can use, use it
        for (let card of _.shuffle(this.cardsInPlay)) {
            this.speakDebug(card.name);
            for (let action of _.shuffle(card.getLegalActions())) {
                this.speakDebug(action);
                switch (action.title) {
                    case "Use this card's Omni ability":
                        interactor.useAction(card);
                        return;
                    case "Use this card's Action ability":
                        interactor.useAction(card);
                        return;
                    case 'Reap with this creature':
                        interactor.reap(card);
                        return;
                    case 'Fight with this creature':
                        interactor.fightWith(card, _.sample(this.opponent.cardsInPlay, 1)[0]);
                        return;
                    default:
                        continue;
                }
            }
        }
        // If we can't play or use anything, end turn
        interactor.clickPrompt('End Turn');
    }

    botEvaluateEffect(interactor, botEffect) {
        if (botEffect.type === 'card' && botEffect.cardType === 'creature') {
            let targets = [];
            if (botEffect.damage > 0) {
                targets = targets.concat(this.cardsInPlay);
            }
            if (botEffect.creatureamber < 0) {
                targets = targets.concat(this.opponent.cardsInPlay);
            }
            this.speakDebug('Chosen targets:', targets);
            if (targets.length == 0) {
                // Failed to find a target we like, choose randomly
                return this.botRandomChoice(interactor);
            }
            interactor.clickCard(_.sample(targets, 1)[0]);
        }
    }

    botShouldPlay(card) {
        for (let reaction of card.getReactions()) {
            let botEffect = reaction.properties.botEffect;
            if (botEffect) {
                if (botEffect.destroy) {
                    return this.opponent.creaturesInPlay.length - this.creaturesInPlay.length > 1;
                }
            }
        }
        return true;
    }

    botRandomChoice(interactor) {
        // Selected all of the cards we need to for a multiple card select situation

        if (this.promptState.buttons.length > 0) {
            this.speakDebug('Clicking a random button');
            interactor.clickPrompt(_.shuffle(this.promptState.buttons[0].text));
        } else if (this.promptState.selectableCards.length > 0) {
            let possible = _.shuffle(this.promptState.selectableCards);
            let statedMaximum = this.promptState.base.selector.numCards;
            let maximum = _.min([statedMaximum, possible.length]);
            while (
                possible.length > 0 &&
                (!this.promptState.selectedCards || this.promptState.selectedCards.length < maximum)
            ) {
                this.speakDebug('Clicking a random card');
                this.speakDebug(possible);
                let card = possible.pop();
                this.speakDebug(card.name);
                interactor.clickCard(card);
            }
            if (statedMaximum > 1) {
                interactor.clickPrompt('Done');
            }
        } else {
            this.speakDebug(this.promptState);
            this.speakDebug('Did not know how to respond');
        }
    }
}

module.exports = BotPlayer;
