import Card from '../../Card.js';

class AutoAutopsy21 extends Card {
    // Play: Make a token creature.
    // Omni: Destroy a friendly creature. If you do, gain 1A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature()
        });

        this.omni({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            then: {
                gameAction: ability.actions.gainAmber(),
                message: '{0} uses {1} to gain 1 amber'
            }
        });
    }
}

AutoAutopsy21.id = 'auto-autopsy-21';

export default AutoAutopsy21;
