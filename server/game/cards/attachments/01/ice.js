const DrawCard = require('../../../drawcard.js');

class Ice extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller &&
                    challenge.challengeType === 'military' &&
                    challenge.isParticipating(this.parent)
                )
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character to kill',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    cardCondition: card => card.location === 'play area' && card.controller !== this.controller && card.getType() === 'character',
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || card.getFaction() !== this.getFaction()) {
            return false;
        }

        return super.canAttach(player, card);
    }

    onCardSelected(player, card) {
        card.owner.killCharacter(card);

        this.controller.sacrificeCard(this);

        this.game.addMessage('{0} sacrifices {1} to kill {2}', player, this, card);

        return true;
    }
}

Ice.code = '01153';

module.exports = Ice;
