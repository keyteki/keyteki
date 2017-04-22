const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class JonSnow extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && challenge.isParticipating(this)
            },
            limit: ability.limit.perPhase(1),
            choices: {
                'Stand Wildlings': () => {
                    let attackingWildlings = this.controller.filterCardsInPlay(card => this.game.currentChallenge.isAttacking(card) && card.hasTrait('Wildling') && card.getType() === 'character');

                    _.each(attackingWildlings, card => {
                        card.controller.standCard(card);
                    });

                    this.game.addMessage('{0} uses {1} to stand each attacking Wildling character', this.controller, this);
                },
                'Stand Nights Watch': () => {
                    let defendingWatch = this.controller.filterCardsInPlay(card => this.game.currentChallenge.isDefending(card) && card.isFaction('thenightswatch') && card.getType() === 'character');

                    _.each(defendingWatch, card => {
                        card.controller.standCard(card);
                    });

                    this.game.addMessage('{0} uses {1} to stand each defending {2} character', this.controller, this, 'thenightswatch');
                }
            }
        });
    }
}

JonSnow.code = '07001';

module.exports = JonSnow;
