const _ = require('underscore');

const cards = require('../../../server/game/cards');
const eventNames = [
    'onCardMoved',
    'onCardBlankToggled',
    'onCardTraitChanged',
    'onCardFactionChanged',
    'onCardMilitarySkillChanged',
    'onCardPoliticalSkillChanged',
    'onCardGloryChanged',
    'onCardAddFate',
    'onCardRemoveFate',
    'onFateTransfered',
    'onBeforeDeckSearch',
    'onBeginRound',
    'onCardEntersPlay',
    'onCardTakenControl',
    'onCardAbilityInitiated',
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
    'onAtEndOfPhase',
    'onReadyAllCards',
    'onReturnRings',
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
    'onHonorTradedAfterBid'
];

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

        for(let i = 0; i < 1; i++) {
            describe('Action ' + i + ' that \'' + cardClass.name + '\' has', function() {
                beforeEach(function() {
                    this.card = new cardClass(this.playerSpy, {});
                    this.action = {
                        title: 'No more actions',
                        handler: () => true,
                        abilityType: 'action',
                        condition: () => true,
                        phase: 'any',
                        abilityIdentifier: 'ability1',
                        maxIdentifier: 'cardnameability1',
                        location: []
                    };
                    if(this.card.abilities.actions.length > i) {
                        _.each(['title', 'handler', 'abilityType', 'phase', 'abilityIdentifier', 'maxIdentifier', 'location'], prop => {
                            this.action[prop] = this.card.abilities.actions[i][prop];
                        });
                        _.each(['condition', 'when'], prop => {
                            if(this.card.abilities.actions[i][prop]) {
                                this.action[prop] = this.card.abilities.actions[i][prop];
                            }
                        });
                    }
                    this.phasePassed = ['any', 'dynasty', 'draw', 'conflict', 'fate', 'regroup'].includes(this.action.phase);
                    this.locationPassed = _.every(this.location, location => ['province 1', 'province 2', 'province 3', 'province 4', 'dynasty discard pile', 'conflict discard pile', 'hand'].includes(location));
                });
                
                it('should have a title', function() {
                    expect(this.action.title).toEqual(jasmine.any(String));
                });

                it('should have a handler', function() {
                    expect(this.action.handler).toEqual(jasmine.any(Function));
                });

                it('should have no condition or its condition should be a function', function() {
                    expect(this.action.condition).toEqual(jasmine.any(Function));
                });

                it('should have \'action\' as its abilityType', function() {
                    expect(this.action.abilityType).toBe('action');
                });

                it('should have a legal phase as its phase', function() {
                    expect(this.phasePassed).toBe(true);
                });

                it('should have an abilityIdentifier', function() {
                    expect(this.action.abilityIdentifier).toEqual(jasmine.any(String));
                });

                it('should have an maxIdentifier', function() {
                    expect(this.action.maxIdentifier).toEqual(jasmine.any(String));
                });

                it('should have a legal location as its location', function() {
                    expect(this.locationPassed).toBe(true);
                });

                it('should not have a when property', function() {
                    expect(this.action.when).toBeUndefined();
                });
            });    

            describe('For each reaction that \'' + cardClass.name + '\' has', function() {
                beforeEach(function() {
                    this.card = new cardClass(this.playerSpy, {});
                    this.reaction = {
                        title: 'No more reactions',
                        handler: () => true,
                        abilityType: 'reaction',
                        when: {},
                        abilityIdentifier: 'ability1',
                        maxIdentifier: 'cardnameability1',
                        location: []
                    };
                    if(this.card.abilities.reactions.length > i) {
                        _.each(['title', 'handler', 'abilityType', 'phase', 'abilityIdentifier', 'maxIdentifier', 'location'], prop => {
                            this.reaction[prop] = this.card.abilities.reactions[i][prop];
                        });
                        _.each(['condition', 'when'], prop => {
                            if(this.card.abilities.reactions[i][prop]) {
                                this.reaction[prop] = this.card.abilities.reactions[i][prop];
                            }
                        });
                    }
                    this.abilityTypePassed = ['cancelinterrupt', 'forcedinterrupt', 'interrupt', 'reaction', 'forcedreaction'].includes(this.reaction.abilityType);
                    this.locationPassed = _.every(this.location, location => ['province 1', 'province 2', 'province 3', 'province 4', 'dynasty discard pile', 'conflict discard pile', 'hand'].includes(location));
                    this.whenPassed = _.reduce(this.reaction.when, (passing, condition, eventName) => {
                        if(passing && eventNames.includes(eventName) && _.isFunction(condition)) {
                            return true;
                        }
                        return false;
                    }, true);
                });
                
                it('should have a title', function() {
                    expect(this.reaction.title).toEqual(jasmine.any(String));
                });

                it('should have a handler', function() {
                    expect(this.reaction.handler).toEqual(jasmine.any(Function));
                });

                it('should have a legal abilityType', function() {
                    expect(this.abilityTypePassed).toBe(true);
                });

                it('should have not have a phase', function() {
                    expect(this.reaction.phase).toBeUndefined();
                });

                it('should have not have a condition', function() {
                    expect(this.reaction.condition).toBeUndefined();
                });

                it('should have a legal when property', function() {
                    expect(this.whenPassed).toBe(true);
                });

                it('should have an abilityIdentifier', function() {
                    expect(this.reaction.abilityIdentifier).toEqual(jasmine.any(String));
                });

                it('should have an maxIdentifier', function() {
                    expect(this.reaction.maxIdentifier).toEqual(jasmine.any(String));
                });

                it('should have a legal location as its location', function() {
                    expect(this.locationPassed).toBe(true);
                });
            });    
        }
    });
});
