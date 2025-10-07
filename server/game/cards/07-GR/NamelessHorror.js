import Card from '../../Card.js';

class NamelessHorror extends Card {
    // While you are haunted, Nameless Horror gains elusive and skirmish.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.controller.isHaunted(),
            effect: ability.effects.addKeyword({
                elusive: 1,
                skirmish: 1
            })
        });
    }
}

NamelessHorror.id = 'nameless-horror';

export default NamelessHorror;
