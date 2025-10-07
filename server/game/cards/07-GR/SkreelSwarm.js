import Card from '../../Card.js';

class SkreelSwarm extends Card {
    // Play: Deal 1D to each enemy creature.
    //
    // Scrap: You may archive Skreel Swarm from your discard pile.
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 1 damage to each enemy creature',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.game.creaturesInPlay.filter(
                    (card) => card.controller !== context.player
                )
            }))
        });

        this.scrap({
            optional: true,
            gameAction: ability.actions.archive((context) => ({
                target: context.source
            }))
        });
    }
}

SkreelSwarm.id = 'skreel-swarm';

export default SkreelSwarm;
