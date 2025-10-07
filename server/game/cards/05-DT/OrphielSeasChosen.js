import Card from '../../Card.js';

class OrphielSeasChosen extends Card {
    // (T) While the tide is high, Orphiel, Sea’s Chosen gains skirmish and, “Fight: Gain 2A.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            condition: (context) => context.player.isTideHigh(),
            effect: [
                ability.effects.addKeyword({
                    skirmish: 1
                }),
                ability.effects.gainAbility('fight', {
                    gameAction: ability.actions.gainAmber({ amount: 2 })
                })
            ]
        });
    }
}

OrphielSeasChosen.id = 'orphiel-sea-s-chosen';

export default OrphielSeasChosen;
