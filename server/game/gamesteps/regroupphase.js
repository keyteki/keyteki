const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const ActionWindow = require('./actionwindow.js');
const EndRoundPrompt = require('./regroup/endroundprompt.js');
const GameActions = require('../GameActions/GameActions');

/*
V Regroup Phase
5.1 Regroup phase begins.
    ACTION WINDOW
5.2 Ready cards.
5.3 Discard from provinces.
5.4 Return rings.
5.5 Pass first player token.
5.6 Regroup phase ends.
 */

class RegroupPhase extends Phase {
    constructor(game) {
        super(game, 'regroup');
        this.initialise([
            new ActionWindow(this.game, 'After regroup phase begins', 'regroup'),
            new SimpleStep(game, () => this.readyCards()),
            new SimpleStep(game, () => this.discardFromProvinces()),
            new SimpleStep(game, () => this.returnRings()),
            new SimpleStep(game, () => this.passFirstPlayer()),
            new EndRoundPrompt(game),
            new SimpleStep(game, () => this.roundEnded())
        ]);
    }

    readyCards() {
        let cardsToReady = this.game.allCards.filter(card => card.bowed && card.readysDuringReadying);
        this.game.applyGameAction(null, { ready: cardsToReady }, [{ name: 'onReadyAllCards', params: { cards: cardsToReady } }]);
    }

    discardFromProvinces() {
        _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
            this.game.queueSimpleStep(() => this.discardFromProvincesForPlayer(player));
        });
    }

    discardFromProvincesForPlayer(player) {
        let cardsToDiscard = [];
        let cardsOnUnbrokenProvinces = [];
        _.each(['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'], location => {
            let provinceCard = player.getProvinceCardInProvince(location);
            let province = player.getSourceList(location);
            let dynastyCards = province.filter(card => card.isDynasty && !card.facedown);
            if(dynastyCards.length > 0 && provinceCard) {
                if(provinceCard.isBroken) {
                    cardsToDiscard = cardsToDiscard.concat(dynastyCards);
                } else {
                    cardsOnUnbrokenProvinces = cardsOnUnbrokenProvinces.concat(dynastyCards);
                }
            }
        });

        if(cardsOnUnbrokenProvinces.length > 0) {
            this.game.promptForSelect(player, {
                source: 'Discard Dynasty Cards',
                numCards: 0,
                multiSelect: true,
                optional: true,
                activePromptTitle: 'Select dynasty cards to discard',
                waitingPromptTitle: 'Waiting for opponent to discard dynasty cards',
                location: 'province',
                controller: 'self',
                cardCondition: card => cardsOnUnbrokenProvinces.includes(card),
                onSelect: (player, cards) => {
                    cardsToDiscard = cardsToDiscard.concat(cards);
                    if(cardsToDiscard.length > 0) {
                        this.game.addMessage('{0} discards {1} from their provinces', player, cardsToDiscard);
                        _.each(cardsToDiscard, card => player.moveCard(card, 'dynasty discard pile'));
                    }
                    return true;
                },
                onCancel: () => {
                    if(cardsToDiscard.length > 0) {
                        this.game.addMessage('{0} discards {1} from their provinces', player, cardsToDiscard);
                        _.each(cardsToDiscard, card => player.moveCard(card, 'dynasty discard pile'));
                    }
                    return true;
                }
            });
            return;
        }
        if(cardsToDiscard.length > 0) {
            this.game.addMessage('{0} discards {1} from their provinces', player, cardsToDiscard);
            _.each(cardsToDiscard, card => player.moveCard(card, 'dynasty discard pile'));
        }
    }

    returnRings() {
        GameActions.returnRing().resolve(_.filter(this.game.rings, ring => ring.claimed), this.game.getFrameworkContext());
    }

    passFirstPlayer() {
        let firstPlayer = this.game.getFirstPlayer();
        let otherPlayer = this.game.getOtherPlayer(firstPlayer);
        if(otherPlayer) {
            this.game.raiseEvent('onPassFirstPlayer', { player: otherPlayer }, () => this.game.setFirstPlayer(otherPlayer));
        }
    }

    roundEnded() {
        this.game.raiseEvent('onRoundEnded');
    }

}

module.exports = RegroupPhase;
