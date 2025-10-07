import Card from '../../Card.js';

class EclecticAmbrosiusEvilTwin extends Card {
    // Reap: Put an ignorance counter on an enemy creature. As long as that creature has an ignorance counter, its text box is considered blank (except for traits).
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.addIgnoranceCounter()
            }
        });

        this.persistentEffect({
            location: 'any',
            targetController: 'any',
            match: (card) => card.type === 'creature' && card.hasToken('ignorance'),
            effect: ability.effects.blank()
        });
    }
}

EclecticAmbrosiusEvilTwin.id = 'eclectic-ambrosius-evil-twin';

export default EclecticAmbrosiusEvilTwin;
