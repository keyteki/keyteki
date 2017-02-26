const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class StreetOfSilk extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (e, challenge) => challenge.winner === this.controller && this.hasParticipatingLordOrLady() && !this.controller.faction.kneeled
            },
            handler: () => {
                var events = this.controller.searchDrawDeck(5, card => {
                    return card.hasTrait('Ally') || card.hasTrait('Companion');
                });

                var buttons = _.map(events, card => {
                    return { text: card.name, method: 'cardSelected', arg: card.uuid, card: card.getSummary(true) };
                });
                buttons.push({ text: 'Done', method: 'doneSelecting' });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a card to add to your hand',
                        buttons: buttons
                    },
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

    cardSelected(player, cardId) {
        var card = player.findCardByUuid(player.drawDeck, cardId);

        if(!card) {
            return false;
        }

        this.controller.faction.kneeled = true;
        player.moveCard(card, 'hand');
        player.shuffleDrawDeck();
        this.game.addMessage('{0} uses {1} to reveal {2} and add it to their hand', player, this, card);

        return true;
    }

    doneSelecting(player) {
        this.controller.faction.kneeled = true;
        player.shuffleDrawDeck();
        this.game.addMessage('{0} does not use {1} to add a card to their hand', player, this);

        return true;
    }
}

StreetOfSilk.code = '02118';

module.exports = StreetOfSilk;
