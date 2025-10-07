import Card from '../../Card.js';

class Molluscaller extends Card {
    // After Reap: For the remainder of the turn, each friendly
    // Strange Shell gets +3 power and loses all abilities.
    setupCardAbilities(ability) {
        this.reap({
            effect:
                'cause all friendly Strange Shells to gain 3 power and lose their abilities for the remainder of the turn',
            gameAction: ability.actions.forRemainderOfTurn({
                match: (card) => card.name === 'Strange Shell',
                effect: [ability.effects.blank(), ability.effects.modifyPower(3)]
            })
        });
    }
}

Molluscaller.id = 'molluscaller';

export default Molluscaller;
