import Card from '../../Card.js';

class GeneralZaOrha extends Card {
    // Play: For each forged key your opponent has, make a token creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature((context) => ({
                amount: context.player.opponent ? context.player.opponent.getForgedKeys() : 0
            }))
        });
    }
}

GeneralZaOrha.id = 'general-ză-orhă';

export default GeneralZaOrha;
