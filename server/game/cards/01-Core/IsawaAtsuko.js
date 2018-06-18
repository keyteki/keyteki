const DrawCard = require('../../drawcard.js');

class IsawaAtsuko extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Wield the power of the void',
            condition: () => this.game.isDuringConflict('void'),
            effect: 'give friendly characters +1/+1 and opposing characters -1/-1',
            gameAction: [
                ability.actions.cardLastingEffect(context => ({
                    target: this.game.currentConfict.getCharacters(context.player),
                    effect: ability.effects.modifyBothSkills(1)
                })),
                ability.actions.cardLastingEffect(context => ({
                    target: this.game.currentConfict.getCharacters(context.player.opponent),
                    effect: ability.effects.modifyBothSkills(-1)
                }))
            ]
        });
    }
}

IsawaAtsuko.id = 'isawa-atsuko';

module.exports = IsawaAtsuko;
