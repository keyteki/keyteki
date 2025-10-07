import Card from '../../Card.js';

class AlienHorror extends Card {
    // While you are haunted, Alien Horror gets +7 power.
    //
    // After Fight: Each of Alien Horror's neighbors captures 1A.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.controller.isHaunted(),
            effect: ability.effects.modifyPower(7)
        });

        this.fight({
            gameAction: ability.actions.capture((context) => ({
                target: context.source.neighbors
            }))
        });
    }
}

AlienHorror.id = 'alien-horror';

export default AlienHorror;
