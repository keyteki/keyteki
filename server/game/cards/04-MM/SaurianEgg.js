const Card = require('../../Card.js');



class SaurianEgg extends Card {
	
    setupCardAbilities(ability) {
		
        this.persistentEffect({
            match: this,
            effect: ability.effects.cardCannot('reap')
        });
        this.persistentEffect({
            match: this,
            effect: ability.effects.cardCannot('fight')
        });
		

        this.omni({

            gameAction: ability.actions.discard( context => ({ target: context.player.deck.slice(0,2) } )),
            
            then: context => ({
                condition: context.preThenEvents && 
					context.preThenEvents.filter( 
	                    event => !event.cancelled && 
	                    event.name === 'onCardDiscarded'  && 
	                    event.card.type === 'creature' && 
	                    event.card.hasHouse('saurian') 
	                ).length > 0,
                gameAction: ability.actions.sequentialForEach( context => ({
					
					
                    forEach: context.preThenEvents.filter( 
						event => !event.cancelled && 
                        event.name === 'onCardDiscarded'  && 
                        event.card.type === 'creature' && 
                        event.card.hasHouse('saurian') 
                    ).map( event => event.card ),
                    
				    action: ability.actions.sequential([
						ability.actions.putIntoPlay(),
						ability.actions.ready(),
						ability.actions.addPowerCounter({ amount: 3 })
						
					]) 
				
                })),
				
				then: context => ({
					gameAction: ability.actions.destroy(context => ({
						target: context.source
					}))
				})
            })
        });
		

    }
}

SaurianEgg.id = 'saurian-egg';

module.exports = SaurianEgg;

/*

        this.omni({

            gameAction: ability.actions.discard( context => ({ target: context.player.deck.slice(0,2) } )),
            
            then: context => ({
                condition: context.preThenEvents && 
					context.preThenEvents.filter( 
	                    event => !event.cancelled && 
	                    event.name === 'onCardDiscarded'  && 
	                    event.card.type === 'creature' && 
	                    event.card.hasHouse('saurian') 
	                ).length > 0,
                gameAction: ability.actions.sequentialForEach( context => ({
					
					
                    forEach: context.preThenEvents.filter( 
						event => !event.cancelled && 
                        event.name === 'onCardDiscarded'  && 
                        event.card.type === 'creature' && 
                        event.card.hasHouse('saurian') 
                    ).map( event => event.card ),
                    
				    action: ability.actions.sequential([
						ability.actions.putIntoPlay(),
						ability.actions.ready(),
						ability.actions.addPowerCounter({ amount: 3 })
						
					]) 
				
                }))
            })
        });

*/
