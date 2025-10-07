import Card from '../../Card.js';

class MarshalEwer extends Card {
    // (T) Play/Fight: Raise the tide.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            gameAction: ability.actions.raiseTide()
        });
    }
}

MarshalEwer.id = 'marshal-ewer';

export default MarshalEwer;
