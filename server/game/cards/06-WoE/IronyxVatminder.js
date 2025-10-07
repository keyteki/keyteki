import Card from '../../Card.js';

class IronyxVatminder extends Card {
    // Play/Destroyed: Make a token creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature()
        });
        this.destroyed({
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

IronyxVatminder.id = 'ironyx-vatminder';

export default IronyxVatminder;
