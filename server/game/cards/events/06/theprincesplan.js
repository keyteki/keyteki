const DrawCard = require('../../../drawcard.js');

class ThePrincesPlan extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give +1 STR per used plot + icon',
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'play area' && card.getType() === 'character'
            },
            handler: context => {
                this.targetCharacter = context.target;
                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Choose an icon to gain',
                        buttons: [
                            { text: 'Military', method: 'addStrengthAndIcon', arg: 'military' },
                            { text: 'Intrigue', method: 'addStrengthAndIcon', arg: 'intrigue' },
                            { text: 'Power', method: 'addStrengthAndIcon', arg: 'power' }
                        ]
                    },
                    source: this
                });
            }
        });

        this.reaction({
            location: 'discard pile',
            when: {
                afterChallenge: (event, challenge) => challenge.loser === this.controller
            },
            ignoreEventCosts: true,
            cost: ability.costs.payGold(1),
            handler: () => {
                this.game.addMessage('{0} pays 1 gold to move {1} back to their hand', this.controller, this);
                this.controller.moveCard(this, 'hand');
            }
        });
    }

    addStrengthAndIcon(player, icon) {
        this.game.addMessage('{0} uses {1} to give {2} +1 STR per used plot and a {3} icon until the end of the phase', player, this, this.targetCharacter, icon);
        this.untilEndOfPhase(ability => ({
            match: this.targetCharacter,
            effect: [
                ability.effects.dynamicStrength(() => this.controller.getNumberOfUsedPlots()),
                ability.effects.addIcon(icon)
            ]
        }));
        return true;
    }
}

ThePrincesPlan.code = '06016';

module.exports = ThePrincesPlan;
