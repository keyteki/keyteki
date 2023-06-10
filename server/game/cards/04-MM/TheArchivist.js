const Card = require('../../Card.js');

class TheArchivist extends Card {
    // If you archive The Archivist, archive it faceup.
    // While The Archivist is in your archives, instead of picking up all of your archives, you may choose to pick up any number of cards in your archives.
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
