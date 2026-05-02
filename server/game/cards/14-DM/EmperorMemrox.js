const Card = require('../../Card.js');

class EmperorMemrox extends Card {
    // While Emperor Memrox is in the center of your battleline, it gains invulnerable. (It cannot be destroyed or dealt damage.)
    // After Reap: Archive a card. Gain 1A for each card in your archives.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isInCenter(),
            effect: ability.effects.addKeyword({ invulnerable: 1 })
        });

        this.reap({
            gameAction: ability.actions.sequential([
                ability.actions.archive({
                    promptForSelect: {
                        location: 'hand',
                        controller: 'self'
                    }
                }),
                ability.actions.gainAmber((context) => ({
                    amount: context.player.archives.length
                }))
            ])
        });
    }
}

EmperorMemrox.id = 'emperor-memrox';

module.exports = EmperorMemrox;
