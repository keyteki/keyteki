import Card from '../../Card.js';

class CursedTomb extends Card {
    // Each creature with no A on it gains, “Destroyed: Purge this creature.”
    //
    // If there are no creatures in play, purge Cursed Tomb.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.type === 'creature' && card.amber === 0,
            effect: ability.effects.gainAbility('destroyed', {
                gameAction: ability.actions.purge((context) => ({
                    target: context.source
                }))
            })
        });

        this.persistentEffect({
            effect: ability.effects.terminalCondition({
                condition: (context) => context.game.creaturesInPlay.length === 0,
                message: '{0} is destroyed as there are no creatures in play',
                gameAction: ability.actions.purge()
            })
        });
    }
}

CursedTomb.id = 'cursed-tomb';

export default CursedTomb;
