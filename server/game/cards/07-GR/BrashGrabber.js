import Card from '../../Card.js';

class BrashGrabber extends Card {
    // If you are not haunted, Brash Grabber enters play enraged.
    //
    // Omni: Move 1A from an enemy creature to your pool.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => !context.player.isHaunted(),
            effect: [ability.effects.entersPlayEnraged()],
            location: 'any'
        });

        this.omni({
            target: {
                activePromptTitle: 'Choose a captured amber to move to your pool.',
                cardCondition: (card) => card.hasToken('amber'),
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.returnAmber((context) => ({
                    amount: 1,
                    recipient: context.player
                }))
            },
            effect: 'move 1 amber from {0} to their pool'
        });
    }
}

BrashGrabber.id = 'brash-grabber';

export default BrashGrabber;
