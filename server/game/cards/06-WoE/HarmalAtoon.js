import Card from '../../Card.js';

class HarmalAtoon extends Card {
    // Each other friendly Brobnar creature gains "Destroyed: Return this creature to its owner's hand"
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card !== context.source && card.type === 'creature' && card.hasHouse('brobnar'),
            effect: ability.effects.gainAbility('destroyed', {
                gameAction: ability.actions.returnToHand()
            })
        });
    }
}

HarmalAtoon.id = 'harmal-atoon';

export default HarmalAtoon;
