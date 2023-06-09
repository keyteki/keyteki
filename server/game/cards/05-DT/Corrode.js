const Card = require('../../Card.js');

class Corrode extends Card {
    // Play: Choose one:
    //  Destroy an artifact.
    //  Destroy an upgrade.
    //  Destroy a creature with armor.
    reduceTargets(context) {
        let targets = context.targets
            ? Object.values(context.targets).reduce((acc, target) => acc.concat(target), [])
            : [];
        return targets.length === 0 ? 'nothing' : targets;
    }

    // Play: Choose one:
    // • Destroy an artifact.
    // • Destroy an upgrade.
    // • Destroy a creature with armor.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.game.cardsInPlay.some(
                    (card) =>
                        card.type === 'upgrade' ||
                        card.type === 'artifact' ||
                        (card.type === 'creature' && card.armor > 0)
                ),
            effect: 'destroy {1}',
            effectArgs: (context) => [this.reduceTargets(context)],
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Destroy an artifact': () => true,
                        'Destroy an upgrade': () => true,
                        'Destroy a creature with armor': () => true
                    }
                },
                'Destroy an artifact': {
                    dependsOn: 'action',
                    activePromptTitle: 'Choose an artifact',
                    cardType: ['artifact'],
                    controller: 'any',
                    gameAction: ability.actions.destroy()
                },
                'Destroy an upgrade': {
                    dependsOn: 'action',
                    activePromptTitle: 'Choose an upgrade',
                    cardType: ['upgrade'],
                    controller: 'any',
                    gameAction: ability.actions.destroy()
                },
                'Destroy a creature with armor': {
                    dependsOn: 'action',
                    activePromptTitle: 'Choose a creature with armor',
                    cardCondition: (card) => card.type === 'creature' && card.armor > 0,
                    controller: 'any',
                    gameAction: ability.actions.destroy()
                }
            }
        });
    }
}

Corrode.id = 'corrode';

module.exports = Corrode;
