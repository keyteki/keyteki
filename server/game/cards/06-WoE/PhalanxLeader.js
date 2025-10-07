import Card from '../../Card.js';

class PhalanxLeader extends Card {
    // Play: Make a token creature immediately to Phalanx Leader's left.
    // After Fight/After Reap: Each creature to Phalanx Leader's left gets +2 power for the remainder of the turn.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature((context) => ({
                deployIndex: context.source.controller.cardsInPlay.indexOf(context.source) - 1
            }))
        });

        this.fight({
            reap: true,
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                controller: 'self',
                match: (card) =>
                    context.player.creaturesInPlay.indexOf(card) <
                    context.player.creaturesInPlay.indexOf(context.source),
                effect: ability.effects.modifyPower(2)
            }))
        });
    }
}

PhalanxLeader.id = 'phalanx-leader';

export default PhalanxLeader;
