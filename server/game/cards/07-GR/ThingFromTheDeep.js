import Card from '../../Card.js';

class ThingFromTheDeep extends Card {
    // Thing from the Deep cannot be played unless Open the Seal is in
    // your discard pile.
    //
    // After Fight: Steal 2.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.cardCannot(
                'play',
                (context) =>
                    context.player.discard.filter((card) => card.name === 'Open the Seal')
                        .length === 0
            )
        });

        this.fight({
            gameAction: ability.actions.steal({ amount: 2 })
        });
    }
}

ThingFromTheDeep.id = 'thing-from-the-deep';

export default ThingFromTheDeep;
