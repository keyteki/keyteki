const DrawCard = require('../../../drawcard.js');

class SerEdmureTully extends DrawCard {

    setupCardAbilities(ability) {
        this.reaction({
            when: {
                // TODO this should trigger only when power is *gained*, but currently also
                // triggers when power is *moved* between cards. To make the distinction we
                // need a new high-level event and review all uses of card power modifications
                onCardPowerChanged: (event, card, power) => {
                    var tullyCharacters = this.game.findAnyCardsInPlay(this.isTullyCharacter);

                    if(card.getType() === 'character'
                       && power > 0
                       && tullyCharacters.length > 0) {
                        this.powerGainingCharacter = card;

                        return true;
                    }
                    return false;
                }
            },
            limit: ability.limit.perRound(1),
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => (
                        card.location === 'play area' &&
                        card !== this.powerGainingCharacter &&
                        this.isTullyCharacter(card)
                    ),
                    activePromptTitle: 'Select a Tully character to move power to',
                    source: this,
                    onSelect: (player, card) => this.transferPower(card)
                });
            }
        });
    }

    isTullyCharacter(card) {
        return card.getType() === 'character' && card.hasTrait('House Tully');
    }

    transferPower(toCharacter) {
        if(!this.powerGainingCharacter) {
            return false;
        }

        this.powerGainingCharacter.modifyPower(-1);
        toCharacter.modifyPower(1);

        this.game.addMessage('{0} uses {1} to move 1 power from {2} to {3}',
                             this.controller, this, this.powerGainingCharacter, toCharacter);

        this.powerGainingCharacter = undefined;

        return true;
    }

}

SerEdmureTully.code = '04041';

module.exports = SerEdmureTully;
