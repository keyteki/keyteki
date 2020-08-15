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

    speak(...args) {
        this.game.gameChat.addMessage('{0}: {1}', this, args);
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
        let interactor = new PlayerInteractionWrapper(this.game, this);
        if (this.promptState) {
            return this.handlePrompt(interactor);
        }
        return false;
    }

    handlePrompt(interactor) {
        this.speakDebug(this.currentPrompt());
        if (interactor.currentPrompt().menuTitle.includes('Waiting')) {
            return false;
        }

        if (interactor.hasPrompt('Start Game')) {
            interactor.clickPrompt('Start the Game');
            return true;
        } else if (interactor.hasPrompt('Mulligan')) {
            if (this.botEvaluateMulligan(this.hand)) {
                interactor.clickPrompt('Mulligan');
                this.speak('Going to mulligan');
            } else {
                interactor.clickPrompt('Keep Hand');
                this.speak("I'll keep this");
            }
            return true;
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
            this.speak('Choosing a house:');
            this.botChooseHouse(interactor);
        } else if (interactor.hasPrompt('Play phase')) {
            this.speak('Playing the main phase');
            try {
                this.botPlayPhase(interactor);
            } catch (err) {
                return true;
            }
        } else if (interactor.hasPrompt('End Turn')) {
            this.speak('Ending the turn');
            interactor.clickPrompt('Yes');
        } else if (this.promptState.base && this.promptState.base.properties.botEffect) {
            this.speak('Thinking about what to do');
            this.botEvaluateEffect(interactor, this.promptState.base.properties.botEffect);
        } else {
            this.speak('Making a random choice');
            this.botRandomChoice(interactor);
        }
        return true;
    }

    botEvaluateMulligan(hand) {
        if (hand.length >= 7) {
            this.speak('I always mulligan with 7 or more cards');
            return true;
        }
        this.speak('I never mulligan with 6 cards');
        return false;
    }

    botChooseHouse(interactor) {
        let counts = {};
        for (let card of this.hand.concat(this.cardsInPlay)) {
            for (let house of card.getHouses()) {
                counts[house] = counts[house] ? counts[house] + 1 : 1;
            }
        }
        let houses = _.pairs(counts);
        houses.sort(function (a, b) {
            return -(a[1] - b[1]);
        });
        for (let house of houses) {
            this.speak('I see ' + house[1] + ' cards of house ' + house[0]);
        }
        this.speak('I choose ' + houses[0][0]);
        interactor.clickPrompt(houses[0][0]);
        this.speak('Cards in my hand:', this.hand);
    }

    botPlayPhase(interactor) {
        // If we have a card we can play, play it
        let unplayed = [];
        for (let card of _.shuffle(this.hand)) {
            let actions = card.getLegalActions();
            this.speak(
                'legal actions for',
                card,
                actions
                    .map((action) => {
                        return action.title;
                    })
                    .join(', ')
            );
            for (let action of card.getLegalActions()) {
                if (action instanceof BasePlayAction) {
                    this.speakDebug('Play:' + card.name);
                    this.speakDebug(action);
                    // false: Don't know how to deploy yet
                    if (this.botShouldPlay(card)) {
                        if (card.type === 'creature') {
                            this.speak('Playing ' + card.name + ' as a creature');
                            interactor.play(card, Math.random() >= 0.5, false);
                            return;
                        } else if (card.type === 'upgrade') {
                            let target = this.botUpgradeTarget(card);
                            if (target) {
                                this.speak('Playing ' + card.name + ' as an upgrade');
                                interactor.playUpgrade(card, target);
                                return;
                            }
                        } else {
                            this.speak('Playing ' + card.name);
                            interactor.play(card);
                            return;
                        }
                    }
                }
            }
            unplayed.push(card);
        }
        if (unplayed.length > 0) {
            this.speak('Could not play ', unplayed);
        }

        // If we have a card we can use, use it
        let unused = [];
        for (let card of _.shuffle(this.cardsInPlay)) {
            this.speakDebug(card.name);
            let actions = card.getLegalActions();
            if (actions.length == 0) {
                continue;
            }
            for (let action of _.shuffle(actions)) {
                this.speakDebug(action);
                this.speak('Thinking about action ' + action.title);
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
            unused.push(card);
        }
        if (unused.length > 0) {
            this.speak('Wanted to use ', unused);
        }

        // If we can't play or use anything, end turn
        interactor.clickPrompt('End Turn');
    }

    botUpgradeTarget(card) {
        let targets = [];
        let playOnThis = true;
        let playOnOpponent = false;
        for (let effect of card.getPersistentEffects()) {
            if (!effect.properties || !effect.properties.botEffect) {
                continue;
            }
            let botEffect = effect.properties.botEffect;
            if (botEffect) {
                if (botEffect.gainAbility) {
                    playOnOpponent = false;
                }
            }
        }
        if (playOnThis) {
            this.speak('  this upgrade would be good for my creatures');
            targets.concat(this.cardsInPlay);
        }
        if (playOnOpponent) {
            this.speak('  this upgrade would be good on an opponent');
            targets.concat(this.opponent.cardsInPlay);
        }
        if (targets.length > 0) {
            return _.sample(targets, 1)[0];
        }
        this.speak('  but no good targets were found');
    }

    botEvaluateEffect(interactor, botEffect) {
        if (botEffect.type === 'card' && botEffect.cardType === 'creature') {
            let targets = [];
            if (botEffect.damage > 0) {
                this.speak('  this would damage something, look at opponents');
                targets = targets.concat(this.cardsInPlay);
            }
            if (botEffect.creatureamber < 0) {
                this.speak('  this would gain amber, look at creatures with amber');
                targets = targets.concat(
                    this.game.findAnyCardsInPlay((card) => {
                        card.tokens.amber > 0;
                    })
                );
            }
            // Limit desired selection by legal selection
            targets = _.intersection(targets, this.promptState.selectableCards);
            // No targets we'd like, we'll have to choose something selectable
            // TODO: check for *may* abilities where we could select nothing
            if (targets.length == 0) {
                targets = this.promptState.selectableCards;
            }
            this.speakDebug('Chosen targets:', targets);
            if (targets.length == 0) {
                // Failed to find a target we like, choose randomly
                return this.botRandomChoice(interactor);
            }
            let card = _.sample(targets, 1)[0];
            this.speak('Targeting ' + card.name);
            interactor.clickCard(card);
        }
    }

    botShouldPlay(card) {
        for (let reaction of card.getReactions()) {
            let botEffect = reaction.properties.botEffect;
            if (botEffect) {
                if (botEffect.destroy) {
                    let hold =
                        this.opponent.creaturesInPlay.length - this.creaturesInPlay.length > 1;
                    this.speak('Might hold ' + card.name + ' ' + hold);
                    return hold;
                }
            }
        }
        this.speak('Yes I should play ' + card.name);
        return true;
    }

    botRandomChoice(interactor) {
        // Selected all of the cards we need to for a multiple card select situation

        if (this.promptState.buttons.length > 0) {
            this.speakDebug('Clicking a random button');
            let choice = _.sample(this.promptState.buttons, 1)[0].text;
            this.speak('Clicking random button of ' + choice);
            interactor.clickPrompt(choice);
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
                this.speak('Selecting card ' + card.name);
                interactor.clickCard(card);
            }
            if (statedMaximum > 1) {
                this.speak('No new creature selections to add');
                interactor.clickPrompt('Done');
            }
        } else {
            this.speakDebug(this.promptState);
            this.speakDebug('Did not know how to respond');
            this.speak('Really stuck');
        }
    }
}

module.exports = BotPlayer;
