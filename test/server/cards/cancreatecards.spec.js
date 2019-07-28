const _ = require('underscore');

const cards = require('../../../server/game/cards');
const AbilityDsl = require('../../../server/game/abilitydsl');

const card = { hasHouse: () => true, neighbors: [], childCards: [], hasTrait: () => false };
card.neighbors.push(card);
card.neighbors.push(card);
card.childCards.push(card);
const player = { deck: [card], hand: [card], archives: [card], discard: [card], creaturesInPlay: [card], cardsInPlay: [card], activeHouse: 'brobnar', checkRestrictions: () => true };
player.opponent = player;
card.controller = player;
const mockContext = {
    event: { card: card },
    game: {
        cardsUsed: [],
        cardsPlayed: [],
        activePlayer: player,
        getFrameworkContext: () => {}
    },
    house: {},
    source: card,
    target: card,
    targets: {
        reveal: [card],
        two: [card]
    },
    player: player
};
mockContext.event.context = mockContext;

describe('All Cards:', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener', 'addPower', 'addMessage', 'addEffect', 'getPlayers']);
        this.gameSpy.getPlayers.and.returnValue([]);
        this.playerSpy = jasmine.createSpyObj('player', ['registerAbilityMax']);
        this.playerSpy.game = this.gameSpy;
    });

    _.each(cards, cardClass => {
        it('should be able to create \'' + cardClass.name + '\' and set it up', function() {
            // No explicit assertion - if this throws an exception it will fail
            // and give us a better stacktrace than the expect().not.toThrow()
            // assertion.
            new cardClass(this.playerSpy, {});
        });

        describe('Actions for \'' + cardClass.name + '\'', function() {
            beforeEach(function() {
                this.card = new cardClass(this.playerSpy, {});
                this.actionSpy = spyOn(this.card, 'action');
                this.card.setupCardAbilities(AbilityDsl);
                this.calls = _.flatten(this.actionSpy.calls.allArgs());
            });

            it('should have an string effect or a gameAction (either on the ability or one of its targets', function() {
                expect(_.all(this.calls, args => {
                    if(!_.isUndefined(args.effect)) {
                        return _.isString(args.effect);
                    } else if(args.gameAction) {
                        return true;
                    } else if(args.target) {
                        if(args.target.gameAction) {
                            return true;
                        }
                        return args.target.mode && args.target.mode === 'select' && Object.values(args.target.choices).every(choice => !_.isFunction(choice));
                    }
                    return args.targets && Object.values(args.targets).some(target => target.gameAction || (
                        target.mode && target.mode === 'select' && Object.values(target.choices).every(choice => !_.isFunction(choice))
                    ));
                })).toBe(true);
            });

            it('should have an effectArgs which matches effect', function() {
                expect(_.all(this.calls, args => {
                    if(_.isUndefined(args.effect)) {
                        return true;
                    }
                    let argCount = 0;
                    let effectArgs = args.effectArgs;
                    if(_.isFunction(effectArgs)) {
                        effectArgs = effectArgs(mockContext);
                    }
                    for(let i = 1; i < 10; i++) {
                        if(args.effect.includes('{' + i.toString() + '}')) {
                            argCount = i;
                        }
                    }
                    if(argCount === 0) {
                        return true;
                    } else if(argCount === 1 && !Array.isArray(effectArgs)) {
                        return true;
                    }
                    return argCount === effectArgs.length;
                })).toBe(true);
            });

            it('should have no condition or its condition should be a function', function() {
                expect(_.all(this.calls, args => _.isUndefined(args.condition) || _.isFunction(args.condition))).toBe(true);
            });

            it('should not have a when property', function() {
                expect(_.all(this.calls, args => _.isUndefined(args.when))).toBe(true);
            });
        });

        describe('Reactions and Interrupts for \'' + cardClass.name + '\'', function() {
            beforeEach(function() {
                this.card = new cardClass(this.playerSpy, {});
                //this.forcedReactionSpy = spyOn(this.card, 'forcedReaction');
                this.reactionSpy = spyOn(this.card, 'reaction');
                //this.forcedInterruptSpy = spyOn(this.card, 'forcedInterrupt');
                this.interruptSpy = spyOn(this.card, 'interrupt');
                this.card.setupCardAbilities(AbilityDsl);
                //this.calls = this.forcedReactionSpy.calls.allArgs();
                this.calls = this.reactionSpy.calls.allArgs();
                this.calls = this.calls.concat(this.interruptSpy.calls.allArgs());
                this.calls = _.flatten(this.calls);
            });

            it('should have an string effect or a gameAction (either on the ability or one of its targets', function() {
                expect(_.all(this.calls, args => {
                    if(!_.isUndefined(args.effect)) {
                        return _.isString(args.effect);
                    } else if(args.gameAction) {
                        return true;
                    } else if(args.target) {
                        if(args.target.gameAction) {
                            return true;
                        }
                        return args.target.mode && args.target.mode === 'select' && Object.values(args.target.choices).every(choice => !_.isFunction(choice));
                    }
                    return args.targets && Object.values(args.targets).some(target => target.gameAction || (
                        target.mode && target.mode === 'select' && Object.values(target.choices).every(choice => !_.isFunction(choice))
                    ));
                })).toBe(true);
            });

            it('should have an effectArgs which matches effect', function() {
                expect(_.all(this.calls, args => {
                    if(_.isUndefined(args.effect)) {
                        return true;
                    }
                    let argCount = 0;
                    let effectArgs = args.effectArgs;
                    if(_.isFunction(effectArgs)) {
                        effectArgs = effectArgs(mockContext);
                    }
                    for(let i = 1; i < 10; i++) {
                        if(args.effect.includes('{' + i.toString() + '}')) {
                            argCount = i;
                        }
                    }
                    if(argCount === 0) {
                        return true;
                    } else if(argCount === 1 && !Array.isArray(effectArgs)) {
                        return true;
                    }
                    return argCount === effectArgs.length;
                })).toBe(true);
            });

            it('should have at least one when property', function() {
                expect(_.all(this.calls, args => _.keys(args.when).length > 0)).toBe(true);
            });

            it('should have a function as the value for its when properties', function() {
                expect(_.all(this.calls, args => _.all(args.when, when => _.isFunction(when)))).toBe(true);
            });
        });
    });
});
