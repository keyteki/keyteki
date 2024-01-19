const Card = require('../../Card.js');

class IlxidAvenger extends Card {
    // Play/After Fight: Give Ilxid Avenger a +1 power counter for
    // each Mars card in your discard pile.
    //
    // Scrap: Give a friendly creature a +1 power counter for each Mars card
    // in your discard pile.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            gameAction: ability.actions.addPowerCounter((context) => ({
                amount: context.player.discard.filter((c) => c.hasHouse('mars')).length
            }))
        });

        this.scrap({
            gameAction: ability.actions.sequentialForEach((context) => ({
                num: context.player.discard.filter((c) => c.hasHouse('mars')).length,
                effect: 'give a +1 power counter for each Mars card in their discard pile',
                action: ability.actions.addPowerCounter({
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature',
                        controller: 'self',
                        cardType: 'creature'
                    }
                })
            }))
        });
    }
}

IlxidAvenger.id = 'ilxid-avenger';

module.exports = IlxidAvenger;
