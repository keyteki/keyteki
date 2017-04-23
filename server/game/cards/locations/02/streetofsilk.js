const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class StreetOfSilk extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (e, challenge) => challenge.winner === this.controller && this.hasParticipatingLordOrLady()
            },
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 5,
                    activePromptTitle: 'Select a card to add to your hand',
                    cardCondition: card => card.getType() === 'character' && (card.hasTrait('Ally') || card.hasTrait('Companion')),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    hasParticipatingLordOrLady() {
        var challenge = this.game.currentChallenge;
        if(!challenge) {
            return false;
        }

        var ourCards = challenge.attackingPlayer === this.controller ? challenge.attackers : challenge.defenders;
        return _.any(ourCards, card => card.hasTrait('Lord') || card.hasTrait('Lady'));
    }

    cardSelected(player, card) {
        player.moveCard(card, 'hand');
        this.game.addMessage('{0} uses {1} to reveal {2} and add it to their hand', player, this, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not use {1} to add a card to their hand', player, this);
    }
}

StreetOfSilk.code = '02118';

module.exports = StreetOfSilk;
