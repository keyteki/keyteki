import _ from 'underscore';
import Card from '../../Card.js';

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

function locationFromContext(context) {
    return context.select === 'My Hand' || context.select === "Opponent's Hand"
        ? 'hand'
        : 'archives';
}

function zoneFromContext(context) {
    return context.select === 'My Hand' || context.select === 'My Archives'
        ? context.select === 'My Hand'
            ? context.player.hand
            : context.player.archives
        : context.select === "Opponent's Hand"
        ? context.player.opponent.hand
        : context.player.opponent
        ? context.player.opponent.archives
        : [];
}

class BarterAndGames extends Card {
    // Play: Each player reveals a random card from their Hand or
    // Archives. Each player gains 1A for each A bonus icon on their
    // revealed card. Destroy each creature that shares a house with
    // at least one of the revealed cards. Discard the revealed cards.
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Where to reveal a card from first?',
                mode: 'select',
                choices: {
                    'My Hand': () => true,
                    'My Archives': () => true,
                    "Opponent's Hand": (context) => !!context.player.opponent,
                    "Opponent's Archives": (context) => !!context.player.opponent
                }
            },
            gameAction: ability.actions.reveal((context) => ({
                location: locationFromContext(context),
                chatMessage: true,
                target: _.shuffle(zoneFromContext(context)).slice(0, 1)
            })),
            effect: 'reveal a card',
            then: (preThenContext) => ({
                alwaysTriggers: true,
                target: {
                    activePromptTitle: 'Where to reveal a card from second?',
                    mode: 'select',
                    choices: {
                        'My Hand': () =>
                            preThenContext.select !== 'My Hand' &&
                            preThenContext.select !== 'My Archives',
                        'My Archives': () =>
                            preThenContext.select !== 'My Hand' &&
                            preThenContext.select !== 'My Archives',
                        "Opponent's Hand": (context) =>
                            context.player.opponent &&
                            preThenContext.select !== "Opponent's Hand" &&
                            preThenContext.select !== "Opponent's Archives",
                        "Opponent's Archives": (context) =>
                            context.player.opponent &&
                            preThenContext.select !== "Opponent's Hand" &&
                            preThenContext.select !== "Opponent's Archives"
                    }
                },
                gameAction: ability.actions.reveal((context) => ({
                    location: locationFromContext(context),
                    chatMessage: true,
                    target: _.shuffle(zoneFromContext(context)).slice(0, 1)
                })),
                then: (preThenContext) => ({
                    alwaysTriggers: true,
                    gameAction: ability.actions.sequential([
                        ability.actions.gainAmber((context) => ({
                            amount: amountForEvents(
                                context.preThenEvents.concat(preThenContext.preThenEvents),
                                context.player
                            )
                        })),
                        ability.actions.gainAmber((context) => ({
                            target: context.player.opponent,
                            amount: amountForEvents(
                                context.preThenEvents.concat(preThenContext.preThenEvents),
                                context.player.opponent
                            )
                        })),
                        ability.actions.destroy((context) => ({
                            target: context.game.creaturesInPlay.filter(
                                (c) =>
                                    hasHouseForEvent(c, context.preThenEvents[0]) ||
                                    hasHouseForEvent(c, preThenContext.preThenEvents[0])
                            )
                        })),
                        ability.actions.discard((context) => ({
                            target: cardForEvent(context.preThenEvents[0]).concat(
                                cardForEvent(preThenContext.preThenEvents[0])
                            )
                        }))
                    ]),
                    message:
                        '{0} uses {1} to gain {3} amber, {4}destroy creatures sharing a house with the revealed cards, and discard the revealed cards',
                    messageArgs: (context) => [
                        amountForEvents(
                            context.preThenEvents.concat(preThenContext.preThenEvents),
                            context.player
                        ),
                        context.player.opponent
                            ? 'cause ' +
                              context.player.opponent.name +
                              ' to gain ' +
                              amountForEvents(
                                  context.preThenEvents.concat(preThenContext.preThenEvents),
                                  context.player.opponent
                              ) +
                              ' amber, '
                            : ''
                    ]
                })
            })
        });
    }
}

BarterAndGames.id = 'barter-and-games';

export default BarterAndGames;
