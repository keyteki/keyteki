import GiganticCard from '../../GiganticCard.js';

class Deusillus extends GiganticCard {
    // (Play only with the other half of Deusillus.)
    // Play: Capture all of your opponents A. Deal 5D to an enemy creature.
    // Fight/Reap: Move 1A from Deusillus to the common supply. Deal 2D to each enemy creature.
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        this.oppAmber = 0;
        super.setupCardAbilities(ability);

        this.play({
            preferActionPromptMessage: true,
            gameAction: ability.actions.sequential([
                ability.actions.capture((context) => {
                    this.oppAmber = context.player.opponent ? context.player.opponent.amber : 0;
                    return {
                        amount: this.oppAmber
                    };
                }),
                ability.actions.dealDamage((context) => ({
                    amount: 5,
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature',
                        cardType: 'creature',
                        controller: 'opponent',
                        message:
                            '{0} uses {1} to capture all {2} amber from {3} and deal 5 damage to {4}',
                        messageArgs: (card) => [
                            context.player,
                            context.source,
                            this.oppAmber,
                            context.player.opponent,
                            card
                        ]
                    }
                }))
            ])
        });

        this.fight({
            reap: true,
            message:
                "{0} uses {1} to remove {2} amber from {1} and deal 2 damage to all of {3}'s creatures",
            messageArgs: (context) => [
                context.player,
                context.source,
                Math.min(1, context.source.amber),
                context.player.opponent
            ],
            gameAction: ability.actions.sequential([
                ability.actions.removeAmber(),
                ability.actions.dealDamage((context) => ({
                    amount: 2,
                    target: context.player.opponent && context.player.opponent.creaturesInPlay
                }))
            ])
        });
    }
}

Deusillus.id = 'deusillus';

export default Deusillus;
