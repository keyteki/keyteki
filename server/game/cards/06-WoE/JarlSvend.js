import Card from '../../Card.js';

class JarlSvend extends Card {
    // After an enemy creature is destroyed fighting Jarl Svend, make
    // a token creature. (Jarl Svend must survive the fight.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.destroyedFighting &&
                    event.card.location === 'discard' &&
                    event.damageEvent.damageSource === context.source
            },
            gameAction: ability.actions.makeTokenCreature(),
            effect: 'make a token creature'
        });
    }
}

JarlSvend.id = 'jarl-svend';

export default JarlSvend;
