const Card = require('../../Card.js');

class SelectivePreservation extends Card {
    //Play: Choose a creature of each power value. Destroy each creature not chosen.
    //
    //Play: Choose a creature of each house. Destroy each creature not chosen.
    /*
    buildTargetsToDestroy(ability) {

        let allCreatures = this.game.creaturesInPlay;
        let unqiuePowersMap = [];
        let unqiuePowers = [];

        console.log(this.game.creaturesInPlay);

        for ( let i = 0; i < allCreatures.length; i++) {
            let creaturePower = allCreatures[i].getPower(false);
            if (!unqiuePowersMap[creaturePower]) {
                unqiuePowersMap[creaturePower] = 1;
                unqiuePowers.push(creaturePower);
            }
        } 
        unqiuePowers.sort((a, b) => (a > b) ? 1 : -1);
        
        let targets = [];
        for (let i = 0; i < unqiuePowers.length; i++) {
            let power = unqiuePowers[i];
            let targetKey = 'power' + power;
            targets[targetKey] = {
                activePromptTitle: {
                    text: 'Choose a {{power}} creature to not destroy',
                    values: { house: power }
                },
                cardType: 'creature',
                numCards: 1,
                cardCondition: (card) => card.getPower(false) === power,
                gameAction: ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay.filter(
                        (card) => context.targets[targetKey] !== card && card.getPower(false) === power
                    )
                }))
            };
        }

        return targets;
    }
    */
    /*
    setupCardAbilities(ability) {
        this.play({
                target: {
                    activePromptTitle: 'Choose a creature of each power value to not destroy',
                    multiSelect: true,
                    cardType: 'creature',
                    // get the number of unique powered cretures that exist
                    numCards: (context) => { let r = new Set(
                        context.game.creaturesInPlay.map( 
                            (card) => card.getPower(false) 
                        )    
                    ).size; console.log(r); return r; },

                    // only exit when the number power creatures selected is equal to the number selected (no duplicates)
                    condition: (context) => 
                    context.target &&
                        new Set(
                            context.target.map( 
                                (card) => card.getPower(false)
                            )
                        ).size === context.target.length, 

                    gameAction: ability.actions.destroy((context) => ({
                        target: context.game.creaturesInPlay.filter(
                            (card) => context.target && !context.target.includes(card)
                        )
                    }))
                }
            }
        );
    }
    */
}

SelectivePreservation.id = 'selective-preservation';

module.exports = SelectivePreservation;
