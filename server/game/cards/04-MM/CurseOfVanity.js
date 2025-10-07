import Card from '../../Card.js';

class CurseOfVanity extends Card {
    // Play: Exalt a friendly creature and an enemy creature.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                friendly: {
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.exalt()
                },
                enemy: {
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.exalt()
                }
            },
            effect: 'exalt {1}',
            effectArgs: (context) => [Object.values(context.targets)]
        });
    }
}

CurseOfVanity.id = 'curse-of-vanity';

export default CurseOfVanity;
