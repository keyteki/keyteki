const Card = require('../../Card.js');

class HandCannon extends Card {
    // This creature gains skirmish and, "Fight: Move 1A from the creature this creature fights to your pool."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addKeyword({ skirmish: 1 }),
                ability.effects.gainAbility('fight', {
                    gameAction: ability.actions.removeAmber((context) => ({
                        target: context.event.card
                    })),
                    then: {
                        gameAction: ability.actions.gainAmber()
                    }
                })
            ]
        });
    }
}

HandCannon.id = 'hand-cannon';

module.exports = HandCannon;
