const Card = require('../../Card.js');

class OblivionKnight extends Card {
    // After Fight: Purge the creature Oblivion Knight fights.
    // Fate: Purge the most powerful friendly creature.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.purge((context) => ({
                target: context.event.card.location === 'play area' ? context.event.card : []
            }))
        });

        this.fate({
            target: {
                controller: 'opponent',
                cardType: 'creature',
                mode: 'mostStat',
                numCards: 1,
                cardStat: (card) => card.power,
                gameAction: ability.actions.purge()
            }
        });
    }
}

OblivionKnight.id = 'oblivion-knight';

module.exports = OblivionKnight;
