const DrawCard = require('../../drawcard.js');

class IconOfFavor extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.imperialFavor !== '',
            effect: ability.effects.modifyGlory(1)
        });
        this.reaction({
            title: 'Honor attached character',
            event: 'honor attached character',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.elements.some(element => element === 'fire') &&
                    event.conflict.winner === context.player
            },
            gameAction: ability.actions.honor(context => ({
                target: context.source.parent
            }))
        });
    }
}

IconOfFavor.id = 'icon-of-favor';

module.exports = IconOfFavor;
