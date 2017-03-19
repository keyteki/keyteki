const DrawCard = require('../../../drawcard.js');

class PlazaOfPunishment extends DrawCard {

    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) =>
                    challenge.winner === this.controller
                    && challenge.challengeType === 'power'
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select character',
                    source: this,
                    cardCondition: card =>
                        card.location === 'play area'
                        && card.getType() === 'character'
                        && card.attachments.size() === 0,
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        this.untilEndOfPhase(ability => ({
            match: card,
            effect: [
                ability.effects.modifyStrength(-2),
                ability.effects.killByStrength
            ]
        }));

        this.game.addMessage('{0} uses {1} to give {2} -2 STR', player, this, card);

        return true;
    }

}

PlazaOfPunishment.code = '01173';

module.exports = PlazaOfPunishment;
