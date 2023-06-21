const Card = require('../../Card.js');

class ScoutChiefKorijir extends Card {
    //Play: Make a token creature. After Fight/After Reap: Make a token creature.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            fight: true,
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

ScoutChiefKorijir.id = 'scout-chief-korijir';

module.exports = ScoutChiefKorijir;
