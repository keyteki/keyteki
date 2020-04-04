# Saurian Egg Explained
I learn best by following an example, so after I created the Saurian Egg I decided to create this detailed explanation of how this complex card works. Note, spoilers ahead since the Saurian Egg is a card from the yet to be released Mass Mutation set.

## Card Text

>The Saurian Egg cannot fight or reap.
> Omni: Discard the top 2 cards of your deck. 
> If you discard any Saurian creatures this way, 
> put them into play ready, give them three +1 power 
> counters, and destroy Saurian Egg.

## Card Implementation
```
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
        gameAction: ability.actions.discard(context => ({ target: context.player.deck.slice(0,2) })),
        then: context => ({
            condition: context.preThenEvents &&
                context.preThenEvents.filter(
                    event => !event.cancelled &&
                    event.name === 'onCardDiscarded' &&
                    event.card.type === 'creature' &&
                    event.card.hasHouse('saurian')
                ).length > 0,
            gameAction: ability.actions.sequentialForEach(context => ({

                forEach: context.preThenEvents.filter(
                    event => !event.cancelled &&
                    event.name === 'onCardDiscarded' &&
                    event.card.type === 'creature' &&
                    event.card.hasHouse('saurian')
                ).map(event => event.card),

                action: ability.actions.sequential([
                    ability.actions.putIntoPlay(),
                    ability.actions.ready(),
                    ability.actions.addPowerCounter({ amount: 3 })
                ])
            })),

            then: {
                gameAction: ability.actions.destroy(context => ({
                    target: context.source
                }))
            }
        })
    });
}
```
#### No Fighting / No Reaping
> The Saurian Egg cannot fight or reap.

This part is easy - create two persistent effects that prevent reaping and fighting.
```
        this.persistentEffect({
            match: this,
            effect: ability.effects.cardCannot('reap')
        });
        this.persistentEffect({
            match: this,
            effect: ability.effects.cardCannot('fight')
        });
```
#### Discard

> **Omni: Discard the top 2 cards of your deck.** 
> If you discard any Saurian creatures this way, 
> put them into play ready, give them three +1 power 
> counters, and destroy Saurian Egg.

To make an omni effect, use the omni block.
```
this.omni({});
```

To discard two cards, this game action:
```
gameAction: ability.actions.discard(context => ({ target: context.player.deck.slice(0,2) })),
```

#### If Saurian Creatures Are Discarded

> Omni: Discard the top 2 cards of your deck.
> **If you discard any Saurian creatures this way,**
> put them into play ready, give them three +1 power 
> counters, and destroy Saurian Egg.

For the next part, the card reads "If you discard any Saurian creatures". To make this work, we need to look at the cards that were discarded. It might be tempting to use ```player.discard[0]``` but this has some downsides.
* It makes the code more complex, considering you need to handle 2 cards (what if one of them is not a creature? What if there is only 1 card in the deck?)
* If you take action on a card in the discard, you won't have a reference to it to ready and power it up - because it won't be in the discard pile anymore.

Instead, we should look in the past, and see what cards were discarded. For this we use ```context.preThenEvents```. ```context.preThenEvents``` is a list of events that happened before the current ```then``` block.

```
this.omni({
    gameAction: ability.actions.discard(context => ({ target: context.player.deck.slice(0,2) })),
    then: context => ({
      // context.preThenEvents is populated 
      // with events that happened before this point
    })
});
```
Since context.preThenEvents is a list of all events, we need to filter through them for the events that we care about. In our case, we care about:
* discarded cards
* cards that are saurian
* cards that are creatures

We will use a filter for this to create a list of events that meet our critera.

The way to think about a filter is to imagine if we had an array:
```
list = ["a","bb","aa","c"]
```
If we wanted to fetch each string that was an a, we could do it like this:
```
newlist = [];
for each str in list
  if str contains "a"
     add str to newlist
return newlist
```
A filter allows you to provide a function to encapsulate the ```if str contains "a"``` and remove the other code. For example:
```
newList = list.fitler( if str contains a )
```

In our case, we only want to execute the play action if there was a discarded creature, which is a perfect use of ```condition:```.

```
condition: context.preThenEvents && // if there are events
    context.preThenEvents.filter( // filter the events
        event => !event.cancelled && // make the event is not canceled
        event.name === 'onCardDiscarded' && // the event is a discard event
        event.card.type === 'creature' && // the card is a creature
        event.card.hasHouse('saurian') // the card is Saurian
    ).length > 0, // the return from filter is a list, so check if there are more than 0 events
```

#### Put Them Into Play

> Omni: Discard the top 2 cards of your deck.
> If you discard any Saurian creatures this way,
> **put them into play ready, give them three +1 power 
> counters,** and destroy Saurian Egg.

So, right now our code is discarding, then checking if any were saurian cards. 
```
this.omni({
    gameAction: ability.actions.discard(context => ({ target: context.player.deck.slice(0,2) })),

    then: context => ({
        condition: context.preThenEvents &&
            context.preThenEvents.filter(
                event => !event.cancelled &&
                event.name === 'onCardDiscarded' &&
                event.card.type === 'creature' &&
                event.card.hasHouse('saurian')
            ).length > 0,

    })
});
```

At this point we want to put into play each Saurian creature that we found. To do that we will use ```sequentialForEach``` to iterate over the matching cards.

```sequentialForEach``` needs the following:
* ```forEach``` this is the card list you want to iterate over
* ```action``` this is the action you want to execute

Note that when action is executed the game engine will create a new context object using the card object that it found in the card list. This means that ```forEach``` block should be a list of cards. To get the list of cards we can use our filter from before, and combine it with a map.

Back to our earlier example, imagine if we had this list:
```
list = ["a","bb","aa","c"]
```
If we wanted modify each element so that it is uppercased we could do:
```
newlist = [];
for each str in list
    add toUpperCase(str) to newList
return newlist
```
A map allows you to provide a function to encapsulate the ```toUpperCase(str)``` and remove the other code. For example:
```
newList = list.map(toUpperCase(str) )
```

In our case, we want a list of cards, but we have a list of events. So a simple map fucntion ```map(event => event.card)``` will work.

Putting this together with our filter works because the output of the fitler is a list. These are the steps we will take:
1. Start with all events.
2. Find all events are discarded Saurian Creatures, remove the rest from the list.
3. Build a new list of cards, by calling event.card on each result from step 2.


Here is the code:
```
forEach: context.preThenEvents.filter(
    event => !event.cancelled &&
    event.name === 'onCardDiscarded' &&
    event.card.type === 'creature' &&
    event.card.hasHouse('saurian')
).map(event => event.card),
```

Next, we want to perform 3 actions on the creature card, play it, ready it, and power it up. For this, we will use ```sequential```. Because a new context object is created for action, we don't need to provide any parameters to the actions. The context created will target the current card from the foreach list.

```
action: ability.actions.sequential([
    ability.actions.putIntoPlay(),
    ability.actions.ready(),
    ability.actions.addPowerCounter({ amount: 3 })
])
```
Putting it together:

```
this.omni({
    gameAction: ability.actions.discard(context => ({ target: context.player.deck.slice(0,2) })),
    then: context => ({
        condition: context.preThenEvents &&
            context.preThenEvents.filter(
                event => !event.cancelled &&
                event.name === 'onCardDiscarded' &&
                event.card.type === 'creature' &&
                event.card.hasHouse('saurian')
            ).length > 0,
        gameAction: ability.actions.sequentialForEach(context => ({

            forEach: context.preThenEvents.filter(
                event => !event.cancelled &&
                event.name === 'onCardDiscarded' &&
                event.card.type === 'creature' &&
                event.card.hasHouse('saurian')
            ).map(event => event.card),

            action: ability.actions.sequential([
                ability.actions.putIntoPlay(),
                ability.actions.ready(),
                ability.actions.addPowerCounter({ amount: 3 })
            ])
        }))
    })
});
```

#### Destroy Egg

> Omni: Discard the top 2 cards of your deck.
> If you discard any Saurian creatures this way,
> put them into play ready, give them three +1 power 
> counters, **and destroy Saurian Egg.**

The last bit is pretty easy. If we played any creatures, then we should destroy the egg. ```then``` is great for this.
```
then: {
    gameAction: ability.actions.destroy(context => ({
        target: context.source
    }))
}
```



