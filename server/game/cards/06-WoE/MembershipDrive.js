import Card from '../../Card.js';

class MembershipDrive extends Card {
    // Play: Make a token creature. Gain 1A for each friendly token creature
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.makeTokenCreature(),
                ability.actions.gainAmber((context) => ({
                    amount: context.player.creaturesInPlay.filter((c) => c.isToken()).length
                }))
            ]),
            effect: 'make a token creature',
            then: {
                message:
                    '{0} uses {1} to gain 1 amber for each friendly token creature, gaining a total of {3} amber',
                messageArgs: (context) => [
                    context.player.creaturesInPlay.filter((c) => c.isToken()).length
                ]
            }
        });
    }
}

MembershipDrive.id = 'membership-drive';

export default MembershipDrive;
