import Card from '../../Card.js';

class YanthiGhostfin extends Card {
    //After Reap: Purge a creature from a discard pile. If you do, make a token creature.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                location: 'discard',
                gameAction: ability.actions.purge()
            },
            then: {
                gameAction: ability.actions.makeTokenCreature()
            }
        });
    }
}

YanthiGhostfin.id = 'yanthi-ghostfin';

export default YanthiGhostfin;
