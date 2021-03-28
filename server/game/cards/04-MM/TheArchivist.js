const Card = require('../../Card.js');

class TheArchivist extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.visbileIn('archives')
        });
        this.persistentEffect({
            condition: (context) =>
                context.player === context.source.controller &&
                context.source.location === 'archives',
            location: 'any',
            effect: ability.effects.chooseCardsFromArchives(this)
        });
    }
}

TheArchivist.id = 'the-archivist';

module.exports = TheArchivist;
