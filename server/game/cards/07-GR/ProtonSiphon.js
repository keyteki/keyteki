import Card from '../../Card.js';

class ProtonSiphon extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: (context) => context.player.isHaunted(),
            effect: ability.effects.addKeyword({ 'splash-attack': 5 })
        });
    }
}

ProtonSiphon.id = 'proton-siphon';

export default ProtonSiphon;
