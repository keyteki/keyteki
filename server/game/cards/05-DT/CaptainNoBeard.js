import Card from '../../Card.js';

class CaptainNoBeard extends Card {
    // Each of Captain No-Beard’s neighbors gains taunt.
    // Reap: Capture 1A.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card, context) =>
                card.type === 'creature' && context.source.neighbors.includes(card),
            effect: ability.effects.addKeyword({
                taunt: 1
            })
        });
        this.reap({
            gameAction: ability.actions.capture()
        });
    }
}

CaptainNoBeard.id = 'captain-no-beard';

export default CaptainNoBeard;
