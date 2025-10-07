import Card from '../../Card.js';

class PiedViper extends Card {
    // Elusive.
    // After an enemy creature reaps, if there are more enemy creatures than friendly creatures, gain control of that creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onReap: (event, context) =>
                    event.card.type === 'creature' &&
                    event.card.controller !== context.player &&
                    context.player.opponent.creaturesInPlay.length >
                        context.player.creaturesInPlay.length
            },
            effect: 'gain control of {1}',
            effectArgs: (context) => context.event.card,
            gameAction: ability.actions.cardLastingEffect((context) => ({
                duration: 'lastingEffect',
                target: context.event.card,
                effect: ability.effects.takeControl(context.player)
            }))
        });
    }
}

PiedViper.id = 'pied-viper';

export default PiedViper;
