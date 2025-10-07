import Card from '../../Card.js';
import EventRegistrar from '../../eventregistrar.js';

class TheUlfberhtDevice extends Card {
    // Each player cannot choose the same active house they chose on their previous turn.
    setupCardAbilities(ability) {
        this.houseSelected = {};
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onChooseActiveHouse']);

        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.stopHouseChoice((player) => this.houseSelected[player.uuid])
        });
    }

    onChooseActiveHouse(event) {
        this.houseSelected[event.player.uuid] = event.house;
    }
}

TheUlfberhtDevice.id = 'the-ulfberht-device';

export default TheUlfberhtDevice;
