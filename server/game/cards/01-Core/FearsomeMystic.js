const DrawCard = require('../../drawcard.js');

class FearsomeMystic extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: () => this.game.isDuringConflict('air'),
            effect: ability.effects.modifyGlory(2)
        });
        this.action({
            title: 'Remove fate from characters',
            condition: context => context.source.isParticipating(),
            gameAction: ability.actions.removeFate(context => ({
                target: this.game.currentConflict.getCharacters(context.player.opponent).filter(card => card.getGlory() < context.source.getGlory())
            }))
        });
    }
}

FearsomeMystic.id = 'fearsome-mystic';

module.exports = FearsomeMystic;
