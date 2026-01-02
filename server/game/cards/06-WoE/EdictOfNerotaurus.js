const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class EdictOfNerotaurus extends Card {
    // After a creature reaps, the next creature used this turn cannot reap.
    //
    // After a creature fights, the next creature used this turn cannot fight.
    setupCardAbilities(ability) {
        this.nextCreatureUsedCannotReap = false;
        this.nextCreatureUsedCannotFight = false;
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onTurnStart', 'onUseCard']);

        this.persistentEffect({
            location: 'any',
            targetController: 'any',
            match: (card) => card.type === 'creature',
            effect: ability.effects.gainAbility('persistentEffect', {
                targetController: 'any',
                condition: () => this.nextCreatureUsedCannotReap,
                effect: ability.effects.cardCannot('reap')
            })
        });

        this.persistentEffect({
            location: 'any',
            targetController: 'any',
            match: (card) => card.type === 'creature',
            effect: ability.effects.gainAbility('persistentEffect', {
                targetController: 'any',
                condition: () => this.nextCreatureUsedCannotFight,
                effect: ability.effects.cardCannot('fight')
            })
        });
    }

    onUseCard(event) {
        if (event.card.type !== 'creature') {
            return;
        }

        this.nextCreatureUsedCannotReap = false;
        if (event.reapEvent && this.location === 'play area' && !this.isBlank()) {
            this.nextCreatureUsedCannotReap = true;
        }

        this.nextCreatureUsedCannotFight = false;
        if (event.fightEvent && this.location === 'play area' && !this.isBlank()) {
            this.nextCreatureUsedCannotFight = true;
        }

        console.log(
            `EdictOfNerotaurus onUseCard reap=${this.nextCreatureUsedCannotReap} fight=${
                this.nextCreatureUsedCannotFight
            } ${event.card.name} ${event.name} ${event.reapEvent ? event.reapEvent.name : ''} ${
                event.fightEvent ? event.fightEvent.name : ''
            } location=${this.location} isBlank=${this.isBlank()}`
        );
    }

    onTurnStart() {
        this.nextCreatureUsedCannotFight = false;
        this.nextCreatureUsedCannotReap = false;
    }
}

EdictOfNerotaurus.id = 'edict-of-nerotaurus';

module.exports = EdictOfNerotaurus;
