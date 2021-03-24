const Card = require('../../Card.js');

class AlmsmasterEvilTwin extends Card {
    //Deploy.
    //Each of $this's neighbors gains, "Destroyed: Steal 1A."
    //This card has been translated from Polish and is subject to change.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => this.neighbors.includes(card),
            effect: ability.effects.gainAbility('destroyed', {
                gameAction: ability.actions.steal()
            })
        });
    }
}

AlmsmasterEvilTwin.id = 'almsmaster-evil-twin';

module.exports = AlmsmasterEvilTwin;
