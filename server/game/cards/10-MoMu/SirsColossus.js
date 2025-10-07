import GiganticCard from '../../GiganticCard.js';

class SirsColossus extends GiganticCard {
    // (Play only with the other half of Sirs Colossus.)
    // Play: Capture all your opponent’s A, distributed
    // among any number of friendly creatures.
    // After Fight: Move all A from a friendly creature to the common supply.
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.play({
            effect: "capture all of {1}'s amber onto friendly creatures",
            effectArgs: (context) => [context.player.opponent],
            gameAction: ability.actions.sequentialForEach((context) => ({
                num: context.player.opponent ? context.player.opponent.amber : 0,
                action: ability.actions.capture({
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature to capture 1 amber',
                        cardType: 'creature',
                        controller: 'self'
                    }
                })
            }))
        });

        this.fight({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.removeAmber({ all: true })
            }
        });
    }
}

SirsColossus.id = 'sirs-colossus';

export default SirsColossus;
