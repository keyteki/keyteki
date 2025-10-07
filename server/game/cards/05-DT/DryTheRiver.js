import Card from '../../Card.js';

class DryTheRiver extends Card {
    // (T) Each creature gains, “While the tide is low, this creature cannot reap.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.type === 'creature',
            effect: ability.effects.gainAbility('persistentEffect', {
                targetController: 'any',
                condition: (context) => context.player.isTideLow(),
                effect: ability.effects.cardCannot('reap')
            })
        });
    }
}

DryTheRiver.id = 'dry-the-river';

export default DryTheRiver;
