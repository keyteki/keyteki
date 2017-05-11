const DrawCard = require('../../../drawcard.js');

class TheSeastoneChair extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onClaimApplied: (event, challenge) => (
                    challenge.isUnopposed() &&
                    challenge.challengeType === 'military' &&
                    challenge.attackingPlayer === this.controller)
            },
            cost: ability.costs.kneelFactionCard(),
            handler: context => {
                context.skipHandler();
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character to kill',
                    source: this,
                    cardCondition: card => (
                        card.location === 'play area' && 
                        card.getType() === 'character' && 
                        card.controller !== this.controller &&
                        card.attachments.size() === 0),
                    gameAction: 'kill',
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to kneel their faction and kill {2} instead of normal claim effects', player, this, card);
        card.controller.killCharacter(card);

        return true;
    }
}

TheSeastoneChair.code = '02011';

module.exports = TheSeastoneChair;
