import Card from '../../Card.js';

class DreadstarrTheLone extends Card {
    // If there are no other friendly Brobnar creatures in play,
    // Dreadstarr the Lone gains versatile.
    // After Fight: Your opponent loses 1A.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                !context.source.controller.creaturesInPlay.some(
                    (c) => c !== context.source && c.hasHouse('brobnar')
                ),
            targetController: 'current',
            effect: ability.effects.addKeyword({ versatile: 1 })
        });

        this.fight({
            gameAction: ability.actions.loseAmber()
        });
    }
}

DreadstarrTheLone.id = 'dreadstarr-the-lone';

export default DreadstarrTheLone;
