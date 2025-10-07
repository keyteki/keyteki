import Card from '../../Card.js';

class AwfulAtoll extends Card {
    // While a player is haunted, their creatures get -2 power.
    //
    // If there are no creatures in play, destroy Awful Atoll.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.type === 'creature' && card.controller.isHaunted(),
            effect: ability.effects.modifyPower(-2)
        });

        this.persistentEffect({
            effect: ability.effects.terminalCondition({
                condition: (context) => context.game.creaturesInPlay.length === 0,
                message: '{0} is destroyed as there are no creatures in play',
                gameAction: ability.actions.destroy()
            })
        });
    }
}

AwfulAtoll.id = 'awful-atoll';

export default AwfulAtoll;
