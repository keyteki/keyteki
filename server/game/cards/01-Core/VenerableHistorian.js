const DrawCard = require('../../drawcard.js');

class VenerableHistorian extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Honor this character',
            condition: context => context.source.isParticipating() && context.player.opponent && 
                                  context.player.opponent.honor < context.player.honor,
            gameAction: ability.actions.honor()
        });
    }
}

VenerableHistorian.id = 'venerable-historian';

module.exports = VenerableHistorian;
