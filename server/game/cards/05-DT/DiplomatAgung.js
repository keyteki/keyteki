import Card from '../../Card.js';

class DiplomatAgung extends Card {
    // Play/Fight/Reap: For the remainder of the turn, a friendly creature belongs to the house of your choice in addition to its other houses.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            targets: {
                select: {
                    mode: 'house'
                },
                card: {
                    dependsOn: 'select',
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.cardLastingEffect((context) => ({
                        effect: ability.effects.addHouse(context.houses.select.choice)
                    }))
                }
            },
            effect: 'make {1} belong to house {2} in addition to its other houses',
            effectArgs: (context) => [context.targets.card, context.houses.select.choice]
        });
    }
}

DiplomatAgung.id = 'diplomat-agung';

export default DiplomatAgung;
