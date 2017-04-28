const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class RobbStark extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: event => this.isStarkCharacter(event.card),
                onSacrificed: (e, player, card) => this.isStarkCharacter(card)
            },
            limit: ability.limit.perRound(1),
            handler: () => {
                let characters = this.controller.filterCardsInPlay(card => card.getType() === 'character');
                _.each(characters, card => {
                    card.controller.standCard(card);
                });

                this.game.addMessage('{0} uses {1} to stand each {2} character they control', this.controller, this, 'stark');
            }
        });
    }

    isStarkCharacter(card) {
        return (
            card.controller === this.controller &&
            card.isFaction('stark') &&
            card.getType() === 'character' &&
            card !== this
        );
    }
}

RobbStark.code = '01146';

module.exports = RobbStark;
