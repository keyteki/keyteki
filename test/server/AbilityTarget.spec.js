const AbilityTarget = require('../../server/game/AbilityTarget.js');

const _ = require('underscore');

describe('AbilityTarget', function () {
    beforeEach(function () {
        this.cardCondition = jasmine.createSpy('cardCondition');
        this.properties = {
            target: 1,
            cardCondition: this.cardCondition
        };
        this.target = new AbilityTarget('foo', this.properties);
    });

    describe('canResolve()', function() {
        beforeEach(function() {
            this.card1 = jasmine.createSpyObj('card', ['allowGameAction', 'getType']);
            this.card1.allowGameAction.and.returnValue(true);
            this.card1.getType.and.returnValue('character');
            this.card2 = jasmine.createSpyObj('card', ['allowGameAction', 'getType']);
            this.card2.allowGameAction.and.returnValue(true);
            this.card2.getType.and.returnValue('holding');
            let game = { allCards: _([this.card1, this.card2]) };
            this.context = { game: game };
        });

        describe('when there is a non-draw card', function() {
            beforeEach(function() {
                this.card1.getType.and.returnValue('plot');

                this.target.canResolve(this.context);
            });

            it('should not call card condition on that card', function() {
                expect(this.cardCondition).not.toHaveBeenCalledWith(this.card1, this.context);
                expect(this.cardCondition).toHaveBeenCalledWith(this.card2, this.context);
            });
        });

        describe('when there is at least 1 matching card', function() {
            beforeEach(function() {
                this.cardCondition.and.callFake(card => card === this.card2);
            });

            it('should return true', function() {
                expect(this.target.canResolve(this.context)).toBe(true);
            });
        });

        describe('when there are no matching cards', function() {
            beforeEach(function() {
                this.cardCondition.and.returnValue(false);
            });

            it('should return false', function() {
                expect(this.target.canResolve(this.context)).toBe(false);
            });
        });
    });

    describe('resolve()', function() {
        beforeEach(function() {
            this.gameSpy = jasmine.createSpyObj('game', ['promptForSelect']);
            this.player = { player: 1 };
            this.source = { source: 1 };

            this.context = { game: this.gameSpy, player: this.player, source: this.source };
        });

        it('should return a pending target result', function() {
            expect(this.target.resolve(this.context)).toEqual({ resolved: false, name: 'foo', value: null });
        });

        it('should prompt the player to select the target', function() {
            this.target.resolve(this.context);
            expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(this.player, { source: this.source, target: 1, onSelect: jasmine.any(Function), onCancel: jasmine.any(Function), selector: jasmine.any(Object), context: this.context });
        });

        describe('the select prompt', function() {
            beforeEach(function() {
                this.result = this.target.resolve(this.context);
                let call = this.gameSpy.promptForSelect.calls.mostRecent();
                this.lastPromptProperties = call.args[1];
            });

            describe('when a card is selected', function() {
                beforeEach(function() {
                    this.lastPromptProperties.onSelect(this.player, 'foo');
                });

                it('should resolve the result', function() {
                    expect(this.result.resolved).toBe(true);
                });

                it('should set the result value', function() {
                    expect(this.result.value).toBe('foo');
                });
            });

            describe('when the prompt is cancelled', function() {
                beforeEach(function() {
                    this.lastPromptProperties.onCancel();
                });

                it('should resolve the result', function() {
                    expect(this.result.resolved).toBe(true);
                });

                it('should not set the result value', function() {
                    expect(this.result.value).toBeFalsy();
                });
            });
        });
    });
});
