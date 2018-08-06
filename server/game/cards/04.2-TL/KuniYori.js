const DrawCard = require('../../drawcard.js');

class KuniYori extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringConflict('earth'),
            effect: ability.effects.modifyBothSkills(1)
        });

        this.action({
            title: 'Select a player to discard a card at random',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.payHonor(1),
            target: {
                mode: 'select',
                activePromptTitle:'Select a player to discard a random card from his/her hand',
                choices: {
                    'Me': ability.actions.discardAtRandom(context => ({ target: context.player })),
                    'My Opponent': ability.actions.discardAtRandom()
                }
            }
        });
    }
}

KuniYori.id = 'kuni-yori';

module.exports = KuniYori;
