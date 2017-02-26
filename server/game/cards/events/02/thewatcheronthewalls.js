const _ = require('underscore');

const ChallengeEvent = require('../../challengeevent.js');

class TheWatcherOnTheWalls extends ChallengeEvent {

    constructor(owner, cardData) {
        super(owner, cardData, 'military');
    }

    canPlay(player, card) {
        var standingRangers = this.controller.cardsInPlay.filter(
            card =>
                !card.kneeled
                && card.hasTrait('Ranger'));

        return (super.canPlay(player, card)
                && standingRangers.length >= 2);
    }

    play(player) {
        this.game.promptForSelect(player, {
            numCards: 2,
            activePromptTitle: 'Select 2 standing rangers',
            source: this,
            cardCondition: card =>
                card.location === 'play area'
                && !card.kneeled
                && card.controller === this.controller
                && card.hasTrait('Ranger'),
            onSelect: (player, cards) => this.onSelect(player, cards)
        });
    }

    onSelect(player, cards) {
        _.each(cards, card => player.kneelCard(card));
        _.each(this.game.currentChallenge.attackers, attacker => {
            attacker.controller.killCharacter(attacker);
        });

        this.game.addMessage('{0} uses {1} to kill each attacking character',
                             player, this);

        return true;
    }
}

TheWatcherOnTheWalls.code = '02066';

module.exports = TheWatcherOnTheWalls;
