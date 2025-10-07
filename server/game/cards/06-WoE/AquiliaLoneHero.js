import Card from '../../Card.js';

class AquiliaLoneHero extends Card {
    // Omni: Capture 1A if there are more enemy creatures than friendly creatures.
    setupCardAbilities(ability) {
        this.omni({
            condition: (context) =>
                context.player.opponent &&
                context.player.cardsInPlay.filter((card) => card.type === 'creature').length <
                    context.player.opponent.cardsInPlay.filter((card) => card.type === 'creature')
                        .length,
            gameAction: ability.actions.capture()
        });
    }
}

AquiliaLoneHero.id = 'aquilia-lone-hero';

export default AquiliaLoneHero;
