const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class EdictOfNerotaurus extends Card {
    // After a creature reaps, the next creature used this turn cannot reap.
    //
    // After a creature fights, the next creature used this turn cannot fight.
    setupCardAbilities(ability) {
        this.lastCreatureReaped = false;
        this.lastCreatureFought = false;
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onTurnStart', 'onUseCard']);

        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.type === 'creature',
            effect: ability.effects.gainAbility('persistentEffect', {
                targetController: 'any',
                condition: () => this.lastCreatureReaped,
                effect: ability.effects.cardCannot('reap')
            })
        });

        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.type === 'creature',
            effect: ability.effects.gainAbility('persistentEffect', {
                targetController: 'any',
                condition: () => this.lastCreatureFought,
                effect: ability.effects.cardCannot('fight')
            })
        });

        this.play(() => {
            (this.lastCreatureReaped = false), (this.lastCreatureFought = false);
        });
    }

    onUseCard(event) {
        if (event.card.type !== 'creature') {
            return;
        }
        if (event.reapEvent) {
            this.lastCreatureReaped = true;
        } else {
            this.lastCreatureReaped = false;
        }
        if (event.fightEvent) {
            this.lastCreatureFought = true;
        } else {
            this.lastCreatureFought = false;
        }
    }

    onTurnStart() {
        this.lastCreatureReaped = false;
        this.lastCreatureFought = false;
    }
}

EdictOfNerotaurus.id = 'edict-of-nerotaurus';

module.exports = EdictOfNerotaurus;
