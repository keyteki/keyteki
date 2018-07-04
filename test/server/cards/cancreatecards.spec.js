const _ = require('underscore');

const cards = require('../../../server/game/cards');
const AbilityDsl = require('../../../server/game/abilitydsl');
const eventNames = [
    'onMoveFate',
    'onBeginRound',
    'onCharacterEntersPlay',
    'onCardTakenControl',
    'onCardAbilityInitiated',
    'onCardAbilityTriggered',
    'onSelectRingWithFate',
    'onConflictDeclared',
    'onProvinceRevealed',
    'onDefendersDeclared',
    'afterConflict',
    'onBreakProvince',
    'onResolveRingEffects',
    'onClaimRing',
    'onReturnHome',
    'onParticipantsReturnHome',
    'onConflictFinished',
    'onConflictPass',
    'onDetermineImperialFavor',
    'onFavorGloryTied',
    'onPlaceFateOnUnclaimedRings',
    'onHonorDialsRevealed',
    'onPhaseStarted',
    'onPhaseEnded',
    'onReadyAllCards',
    'onReturnRing',
    'onPassFirstPlayer',
    'onRoundEnded',
    'onDecksPrepared',
    'onCardsDrawn',
    'onIncomeCollected',
    'onCardAttached',
    'onCardSacrificed',
    'onCardPlaced',
    'onCardHonored',
    'onCardDishonored',
    'onCardBowed',
    'onCardReadied',
    'onDiscardFromHand',
    'onCardsDiscardedFromHand',
    'onCardLeavesPlay',
    'onMoveToConflict',
    'onMoveCharactersToConflict',
    'onSendHome',
    'onSendCharactersHome',
    'onCardPlayed',
    'onDeckShuffled',
    'onDuelResolution',
    'onDynastyCardTurnedFaceup',
    'onTransferHonor',
    'onPassDuringDynasty',
    'onModifyHonor',
    'onAbilityResolved'
];

const actionNames = [
    'attach',
    'bow',
    'break',
    'discard',
    'loseFavor',
    'discardFromHand',
    'discardFromPlay',
    'discardStatus',
    'dishonor',
    'draw',
    'duel',
    'fireRingEffect',
    'reveal',
    'gainHonor',
    'honor',
    'loseHonor',
    'gainFate',
    'moveToConflict',
    'placeFate',
    'putIntoPlay',
    'putIntoConflict',
    'ready',
    'removeFate',
    'resolveRing',
    'returnToDeck',
    'returnToHand',
    'sacrifice',
    'sendHome',
    'takeFate',
    'takeHonor'
];

const effectDurations = [
    'untilEndOfConflict',
    'untilEndOfPhase',
    'untilEndOfRound',
    'lastingEffect',
    'delayedEffect'
];

const checkGameAction = function(gameAction) {
    if(Array.isArray(gameAction)) {
        return gameAction.every(action => actionNames.includes(action.name));
    }
    return actionNames.includes(gameAction.name);
};

const mockContext = {
    game: {},
    player: {
        cardsInPlay: [],
        getNumberOfHoldingsInPlay: () => 1,
        opponent: {
            cardsInPlay: [],
            hand: {
                size: () => 1,
                sortBy: () => true
            }
        }
    },
    source: {},
    ability: {},
    event: {
        conflict: { attackingPlayer: {} }
    },
    targetAbility: {},
    select: { toLowerCase: () => 'abc' },
    costs: {
        discardCard: { getCost: () => 1 }
    },
    targets: { cardToShuffle: {} },
    target: {
        attachments: { size: () => 1 }
    }
};

describe('All Cards:', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener', 'addPower', 'addMessage', 'addEffect']);
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

            it('should have a title which is a string', function() {
                expect(_.all(this.calls, args => _.isString(args.title))).toBe(true);
            });

            it('should have a handler and effect or a gameAction', function() {
                expect(_.all(this.calls, args => {
                    if(args.handler && _.isFunction(args.handler) && args.effect) {
                        return true;
                    } else if(args.gameAction || Object.keys(args).some(key => effectDurations.includes(key))) {
                        return true;
                    } else if(args.target) {
                        return args.target.gameAction || args.target.mode && args.target.mode === 'select' && (
                            Object.values(args.target.choices).some(choice => !_.isFunction(choice) && checkGameAction(choice))
                        );
                    } else if(args.targets) {
                        return Object.values(args.targets).some(props => props.gameAction || props.mode && props.mode === 'select' && (
                            Object.values(props.choices).some(choice => !_.isFunction(choice) && checkGameAction(choice))
                        ));
                    }
                    return false;
                })).toBe(true);
            });
            /*
            it('should have a legal gameAction where one is attached directly to the ability', function() {
                expect(this.calls.every(args => !args.gameAction || checkGameAction(args.gameAction))).toBe(true);
            });

            it('should have a legal gameAction where one is included in target', function() {
                expect(this.calls.every(args => {
                    if(!args.target) {
                        return true;
                    } else if(args.target.mode & args.target.mode === 'select') {
                        return Object.values(args.target.choices).every(choice => {
                            if(typeof choice === 'function') {
                                return true;
                            }
                            return checkGameAction(choice);
                        });
                    } else if(args.target.gameAction) {
                        return checkGameAction(args.target.gameAction);
                    }
                    return true;
                })).toBe(true);
            });

            it('should have legal gameActions where included for abilities with multiple targets', function() {
                expect(this.calls.every(args => !args.targets || Object.values(args.targets).every(props => {
                    if(props.mode & props.mode === 'select') {
                        return Object.values(props.choices).every(choice => {
                            if(typeof choice === 'function') {
                                return true;
                            }
                            return checkGameAction(choice);
                        });
                    } else if(props.gameAction) {
                        return checkGameAction(props.gameAction);
                    }
                    return true;
                }))).toBe(true);
            });
            */
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

            it('should have no phase or a legal phase as its phase', function() {
                expect(_.all(this.calls, args => _.isUndefined(args.phase) || ['any', 'dynasty', 'draw', 'conflict', 'fate', 'regroup'].includes(args.phase))).toBe(true);
            });

            it('should have a legal location as its location', function() {
                expect(_.all(this.calls, args => (
                    _.isUndefined(args.location) ||
                    ['province 1', 'province 2', 'province 3', 'province 4', 'dynasty discard pile', 'conflict discard pile', 'hand'].includes(args.location) ||
                    _.every(args.location, location => ['province 1', 'province 2', 'province 3', 'province 4', 'dynasty discard pile', 'conflict discard pile', 'hand'].includes(location))
                ))).toBe(true);
            });

            it('should not have a when property', function() {
                expect(_.all(this.calls, args => _.isUndefined(args.when))).toBe(true);
            });
        });

        describe('Reactions and Interrupts for \'' + cardClass.name + '\'', function() {
            beforeEach(function() {
                this.card = new cardClass(this.playerSpy, {});
                this.forcedReactionSpy = spyOn(this.card, 'forcedReaction');
                this.reactionSpy = spyOn(this.card, 'reaction');
                this.forcedInterruptSpy = spyOn(this.card, 'forcedInterrupt');
                this.interruptSpy = spyOn(this.card, 'interrupt');
                this.card.setupCardAbilities(AbilityDsl);
                this.calls = this.forcedReactionSpy.calls.allArgs();
                this.calls = this.calls.concat(this.reactionSpy.calls.allArgs());
                this.calls = this.calls.concat(this.forcedInterruptSpy.calls.allArgs());
                this.calls = this.calls.concat(this.interruptSpy.calls.allArgs());
                this.calls = _.flatten(this.calls);
            });

            it('should have a title which is a string', function() {
                expect(_.all(this.calls, args => _.isString(args.title))).toBe(true);
            });

            it('should have a handler or a gameAction', function() {
                expect(_.all(this.calls, args => {
                    if(args.handler && _.isFunction(args.handler)) {
                        return true;
                    } else if(args.gameAction || Object.keys(args).some(key => effectDurations.includes(key))) {
                        return true;
                    } else if(args.target) {
                        return args.target.gameAction || args.target.mode && args.target.mode === 'select' && (
                            Object.values(args.target.choices).some(choice => !_.isFunction(choice) && checkGameAction(choice))
                        );
                    } else if(args.targets) {
                        return Object.values(args.targets).some(props => props.gameAction || props.mode && props.mode === 'select' && (
                            Object.values(props.choices).some(choice => !_.isFunction(choice) && checkGameAction(choice))
                        ));
                    }
                    return false;
                })).toBe(true);
            });
            /*
            it('should have a legal gameAction where one is attached directly to the ability', function() {
                expect(this.calls.every(args => !args.gameAction || checkGameAction(args.gameAction))).toBe(true);
            });

            it('should have a legal gameAction where one is included in target', function() {
                expect(this.calls.every(args => {
                    if(!args.target) {
                        return true;
                    } else if(args.target.mode & args.target.mode === 'select') {
                        return Object.values(args.target.choices).every(choice => {
                            if(typeof choice === 'function') {
                                return true;
                            }
                            return checkGameAction(choice);
                        });
                    } else if(args.target.gameAction) {
                        return checkGameAction(args.target.gameAction);
                    }
                    return true;
                })).toBe(true);
            });

            it('should have legal gameActions where included for abilities with multiple targets', function() {
                expect(this.calls.every(args => !args.targets || Object.values(args.targets).every(props => {
                    if(props.mode & props.mode === 'select') {
                        return Object.values(props.choices).every(choice => {
                            if(typeof choice === 'function') {
                                return true;
                            }
                            return checkGameAction(choice);
                        });
                    } else if(props.gameAction) {
                        return checkGameAction(props.gameAction);
                    }
                    return true;
                }))).toBe(true);
            });
            */
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

            it('should have not have a phase', function() {
                expect(_.all(this.calls, args => _.isUndefined(args.phase))).toBe(true);
            });

            it('should have not have a condition', function() {
                expect(_.all(this.calls, args => _.isUndefined(args.condition))).toBe(true);
            });

            it('should have at least one when property', function() {
                expect(_.all(this.calls, args => _.keys(args.when).length > 0)).toBe(true);
            });

            it('should have a legal events as keys in its when properties', function() {
                expect(_.all(this.calls, args => _.difference(_.keys(args.when), eventNames).length === 0)).toBe(true);
            });

            it('should have a function as the value for its when properties', function() {
                expect(_.all(this.calls, args => _.all(args.when, when => _.isFunction(when)))).toBe(true);
            });

            it('should have a legal location as its location', function() {
                expect(_.all(this.calls, args => (
                    _.isUndefined(args.location) ||
                    ['province', 'dynasty discard pile', 'conflict discard pile', 'hand'].includes(args.location) ||
                    _.every(args.location, location => ['province', 'dynasty discard pile', 'conflict discard pile', 'hand'].includes(location))
                ))).toBe(true);
            });
        });
    });
});
