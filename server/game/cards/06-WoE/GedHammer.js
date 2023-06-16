const Card = require('../../Card.js');

class GedHammer extends Card {
    //Destroyed: Ready and enrage each other friendly Brobnar creature.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.sequential([
                ability.actions.ready((context) => ({
                    target: context.player.creaturesInPlay.filter(
                        (card) =>
                            card !== context.source &&
                            card.hasHouse('brobnar') &&
                            card.controller === context.source.controller &&
                            card.type === 'creature'
                    )
                })),
                ability.actions.enrage((context) => ({
                    target: context.player.creaturesInPlay.filter(
                        (card) =>
                            card !== context.source &&
                            card.hasHouse('brobnar') &&
                            card.controller === context.source.controller &&
                            card.type === 'creature'
                    )
                }))
            ])
        });
    }
}

GedHammer.id = 'ged-hammer';

module.exports = GedHammer;
