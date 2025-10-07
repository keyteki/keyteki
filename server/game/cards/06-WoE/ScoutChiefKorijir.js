import Card from '../../Card.js';

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

export default ScoutChiefKorijir;
