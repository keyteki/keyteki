const DrawCard = require('../../drawcard.js');

class Misinformation extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give opponent\'s participating cards -1/-1',
            condition: context => this.game.isDuringConflict() &&
                                  context.player.opponent && context.player.showBid > context.player.opponent.showBid + 1,
            effect: 'give all opposing characters -1{1}/-1{2}',
            effectArgs: () => ['military', 'political'],
            gameAction: ability.actions.cardLastingEffect(context => ({
                target: this.game.currentConflict.getCharacters(context.player.opponent),
                effect: ability.effects.modifyBothSkills(-1)
            }))
        });
    }
}

Misinformation.id = 'misinformation';

module.exports = Misinformation;
