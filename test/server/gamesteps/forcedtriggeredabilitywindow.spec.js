/*global describe, it, beforeEach, expect, jasmine*/
/* eslint no-invalid-this: 0 */

const _ = require('underscore');

const ForcedTriggeredAbilityWindow = require('../../../server/game/gamesteps/forcedtriggeredabilitywindow.js');

describe('ForcedTriggeredAbilityWindow', function() {
    beforeEach(function() {
        this.player1Spy = jasmine.createSpyObj('player', ['setPrompt', 'cancelPrompt']);
        this.player1Spy.name = 'player1';
        this.player2Spy = jasmine.createSpyObj('player', ['setPrompt', 'cancelPrompt']);
        this.player2Spy.name = 'player2';

        this.gameSpy = jasmine.createSpyObj('game', ['getFirstPlayer', 'promptWithMenu', 'resolveAbility']);
        this.gameSpy.getFirstPlayer.and.returnValue(this.player1Spy);

        this.event = { name: 'onFoo', params: [] };

        this.window = new ForcedTriggeredAbilityWindow(this.gameSpy, {
            event: this.event,
            abilityType: 'forcedinterrupt'
        });

        this.setupWindowChoices = () => {
            function createCard(properties) {
                let cardSpy = jasmine.createSpyObj('card', ['getSummary']);
                _.extend(cardSpy, properties);
                return cardSpy;
            }

            this.abilityCard1 = createCard({ card: 1, name: 'The Card', controller: this.player1Spy });
            this.ability1Spy = jasmine.createSpyObj('ability', ['meetsRequirements']);
            this.ability1Spy.meetsRequirements.and.returnValue(true);
            this.context1 = { context: 1 };

            this.abilityCard2 = createCard({ card: 2, name: 'The Card 2', controller: this.player1Spy });
            this.ability2Spy = jasmine.createSpyObj('ability', ['meetsRequirements']);
            this.ability2Spy.meetsRequirements.and.returnValue(true);
            this.context2 = { context: 2 };

            this.abilityCard3 = createCard({ card: 3, name: 'Their Card', controller: this.player2Spy });
            this.ability3Spy = jasmine.createSpyObj('ability', ['meetsRequirements']);
            this.ability3Spy.meetsRequirements.and.returnValue(true);
            this.context3 = { context: 3 };

            this.window.abilityChoices = [
                { id: '1', ability: this.ability1Spy, card: this.abilityCard1, context: this.context1, player: this.player1Spy },
                { id: '2', ability: this.ability2Spy, card: this.abilityCard2, context: this.context2, player: this.player1Spy },
                { id: '3', ability: this.ability3Spy, card: this.abilityCard3, context: this.context3, player: this.player2Spy }
            ];
        };

    });

    describe('registerAbility()', function() {
        beforeEach(function() {
            this.context = { context: 1 };
            this.abilityCard = { card: 1, name: 'The Card', controller: this.player1Spy };
            this.abilitySpy = jasmine.createSpyObj('ability', ['createContext']);
            this.abilitySpy.createContext.and.returnValue(this.context);
            this.abilitySpy.card = this.abilityCard;


            this.window.registerAbility(this.abilitySpy);
        });

        it('should add the ability to the list of choices', function() {
            expect(this.window.abilityChoices.length).toBe(1);
            expect(this.window.abilityChoices).toContain(jasmine.objectContaining({
                ability: this.abilitySpy,
                card: this.abilityCard,
                context: this.context,
                player: this.player1Spy
            }));
        });
    });

    describe('continue()', function() {
        beforeEach(function() {
            this.setupWindowChoices();
        });

        describe('when there are no remaining choices', function() {
            beforeEach(function() {
                this.window.abilityChoices = [];
                this.result = this.window.continue();
            });

            it('should not prompt', function() {
                expect(this.gameSpy.promptWithMenu).not.toHaveBeenCalled();
            });

            it('should complete the prompt', function() {
                expect(this.result).toBe(true);
            });
        });

        describe('when there is only 1 choice', function() {
            beforeEach(function() {
                this.window.abilityChoices = [_.first(this.window.abilityChoices)];
                this.result = this.window.continue();
            });

            it('should resolve the ability', function() {
                expect(this.gameSpy.resolveAbility).toHaveBeenCalledWith(this.ability1Spy, this.context1);
            });

            it('should not prompt', function() {
                expect(this.gameSpy.promptWithMenu).not.toHaveBeenCalled();
            });

            it('should complete the prompt', function() {
                expect(this.result).toBe(true);
            });
        });

        describe('when there are multiple choices', function() {
            describe('and all ability requirements have been met', function() {
                beforeEach(function() {
                    this.result = this.window.continue();
                });

                it('should prompt the first player', function() {
                    expect(this.gameSpy.promptWithMenu).toHaveBeenCalledWith(this.player1Spy, this.window, jasmine.objectContaining({
                        activePrompt: {
                            menuTitle: jasmine.any(String),
                            buttons: [
                                jasmine.objectContaining({ text: 'player1 - The Card', arg: '1', method: 'chooseAbility' }),
                                jasmine.objectContaining({ text: 'player1 - The Card 2', arg: '2', method: 'chooseAbility' }),
                                jasmine.objectContaining({ text: 'player2 - Their Card', arg: '3', method: 'chooseAbility' })
                            ]
                        }
                    }));
                });

                it('should continue to prompt', function() {
                    expect(this.result).toBe(false);
                });
            });

            describe('and an ability requirement has not been met', function() {
                beforeEach(function() {
                    this.ability1Spy.meetsRequirements.and.returnValue(false);
                    this.window.continue();
                });

                it('should filter out that ability', function() {
                    expect(this.gameSpy.promptWithMenu).toHaveBeenCalledWith(this.player1Spy, this.window, jasmine.objectContaining({
                        activePrompt: {
                            menuTitle: jasmine.any(String),
                            buttons: [
                                jasmine.objectContaining({ text: 'player1 - The Card 2', arg: '2', method: 'chooseAbility' }),
                                jasmine.objectContaining({ text: 'player2 - Their Card', arg: '3', method: 'chooseAbility' })
                            ]
                        }
                    }));
                });
            });

            describe('and all abilities are not eligible', function() {
                beforeEach(function() {
                    this.ability1Spy.meetsRequirements.and.returnValue(false);
                    this.ability2Spy.meetsRequirements.and.returnValue(false);
                    this.ability3Spy.meetsRequirements.and.returnValue(false);
                    this.result = this.window.continue();
                });

                it('should not prompt', function() {
                    expect(this.gameSpy.promptWithMenu).not.toHaveBeenCalled();
                });

                it('should complete the prompt', function() {
                    expect(this.result).toBe(true);
                });
            });
        });
    });

    describe('chooseAbility()', function() {
        beforeEach(function() {
            this.setupWindowChoices();
        });

        describe('when the player select a non-existent choice', function() {
            beforeEach(function() {
                this.window.chooseAbility(this.player1Spy, 'foo');
            });

            it('should not resolve an ability', function() {
                expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
            });
        });

        describe('when the player selects a valid choice', function() {
            beforeEach(function() {
                this.window.chooseAbility(this.player1Spy, '1');
            });

            it('should resolve the ability', function() {
                expect(this.gameSpy.resolveAbility).toHaveBeenCalledWith(this.ability1Spy, this.context1);
            });

            it('should remove all choices for that card', function() {
                let remainingIds = _.pluck(this.window.abilityChoices, 'id');
                expect(remainingIds).toEqual(['2', '3']);
            });
        });
    });
});
