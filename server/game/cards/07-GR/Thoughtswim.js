import Card from '../../Card.js';

class Thoughtswim extends Card {
    // This creature gains, “While your opponent is haunted, this
    // creature cannot be dealt damage.”
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: (context) =>
                !!context.player.opponent && context.player.opponent.isHaunted(),
            effect: ability.effects.cardCannot('damage')
        });
    }
}

Thoughtswim.id = 'thoughtswim';

export default Thoughtswim;
