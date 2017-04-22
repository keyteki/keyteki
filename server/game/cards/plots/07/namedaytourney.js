const PlotCard = require('../../../plotcard.js');

class NameDayTourney extends PlotCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (e, challenge) => (
                    challenge.winner === this.controller && 
                    this.hasParticipatingKnight() &&
                    this.hasSingleParticipatingChar())
            },
            target: {
                activePromptTitle: 'Select Lord or Lady',
                cardCondition: card => (
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    (card.hasTrait('Lord') || card.hasTrait('Lady')) &&
                    card.getType() === 'character')
            },
            handler: context => {
                context.target.modifyPower(1);
                this.game.addMessage('{0} uses {1} to have {2} gain 1 power', 
                                      this.controller, this, context.target);
            }
        });
    }

    hasParticipatingKnight() {
        var cards = this.controller.filterCardsInPlay(card => {
            return (this.game.currentChallenge.isParticipating(card) &&
                    card.hasTrait('Knight') && 
                    card.getType() === 'character');
        });

        return cards.length >= 1;
    }

    hasSingleParticipatingChar() {
        if(this.game.currentChallenge.attackingPlayer === this.controller) {
            return this.game.currentChallenge.attackers.length === 1;
        }
        return this.game.currentChallenge.defenders.length === 1;
    }
}

NameDayTourney.code = '07051';

module.exports = NameDayTourney;
