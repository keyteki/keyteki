const _ = require('underscore');
const Card = require('../../Card.js');

function amountForEvents(events, controller) {
    return events.reduce(
        (acc, event) =>
            acc +
            (event.card && event.card.controller === controller
                ? event.card.bonusIcons.filter((icon) => icon === 'amber').length
                : 0),
        0
    );
}

function hasHouseForEvent(card, event) {
    return event && event.card ? event.card.getHouses().some((h) => card.hasHouse(h)) : false;
}

function cardForEvent(event) {
    return event ? [event.card] : [];
}

class BarterAndGames extends Card {
    // Play: Each player reveals a random card from their hand or
    // archives. Each player gains 1A for each A bonus icon on their
    // revealed card. Destroy each creature that shares a house with
    // at least one of the revealed cards. Discard the revealed cards.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                self: {
                    activePromptTitle: 'Where to reveal a random card for you?',
                    mode: 'select',
                    choices: {
                        Hand: () => true,
                        Archives: () => true
                    }
                },
                opponent: {
                    activePromptTitle: 'Where to reveal a random card for opponent?',
                    mode: 'select',
                    choices: {
                        Hand: () => true,
                        Archives: () => true
                    }
                }
            },
            gameAction: [
                ability.actions.reveal((context) => ({
                    location:
                        context.selects.self && context.selects.self.choice === 'Hand'
                            ? 'hand'
                            : 'archives',
                    chatMessage: false,
                    target: _.shuffle(
                        context.selects.self && context.selects.self.choice === 'Hand'
                            ? context.player.hand
                            : context.player.archives
                    ).slice(0, 1)
                })),
                ability.actions.reveal((context) => ({
                    location:
                        context.selects.opponent && context.selects.opponent.choice === 'Hand'
                            ? 'hand'
                            : 'archives',
                    chatMessage: false,
                    target: _.shuffle(
                        context.player.opponent
                            ? context.selects.opponent && context.selects.opponent.choice === 'Hand'
                                ? context.player.opponent.hand
                                : context.player.opponent.archives
                            : []
                    ).slice(0, 1)
                }))
            ],
            effect: 'reveal cards from both players',
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.sequential([
                    ability.actions.gainAmber((context) => ({
                        amount: amountForEvents(context.preThenEvents, context.player)
                    })),
                    ability.actions.gainAmber((context) => ({
                        target: context.player.opponent,
                        amount: amountForEvents(context.preThenEvents, context.player.opponent)
                    })),
                    ability.actions.destroy((context) => ({
                        target: context.game.creaturesInPlay.filter(
                            (c) =>
                                hasHouseForEvent(c, context.preThenEvents[0]) ||
                                hasHouseForEvent(c, context.preThenEvents[1])
                        )
                    })),
                    ability.actions.discard((context) => ({
                        target: cardForEvent(context.preThenEvents[0]).concat(
                            cardForEvent(context.preThenEvents[1])
                        )
                    }))
                ]),
                message:
                    '{0} uses {1} to reveal {3}, gain {4} amber, {5}destroy creatures sharing a house with the revealed cards, and discard the revealed cards',
                messageArgs: (context) => [
                    context.preThenEvents.map((e) => e.card),
                    amountForEvents(context.preThenEvents, context.player),
                    context.player.opponent
                        ? 'cause ' +
                          context.player.opponent.name +
                          ' to gain ' +
                          amountForEvents(context.preThenEvents, context.player.opponent) +
                          ' amber, '
                        : ''
                ]
            }
        });
    }
}

BarterAndGames.id = 'barter-and-games';

module.exports = BarterAndGames;
