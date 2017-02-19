/*global describe, it, beforeEach, expect, jasmine*/
/* eslint no-invalid-this: 0 */

const AbilityResolver = require('../../../server/game/gamesteps/abilityresolver.js');

describe('AbilityResolver', function() {
    beforeEach(function() {
        this.game = jasmine.createSpyObj('game', ['']);
        this.ability = jasmine.createSpyObj('ability', ['resolveCosts', 'payCosts', 'executeHandler']);
        this.context = { foo: 'bar' };
        this.resolver = new AbilityResolver(this.game, this.ability, this.context);
    });

    describe('continue()', function() {
        describe('when all costs can be paid', function() {
            beforeEach(function() {
                this.ability.resolveCosts.and.returnValue([{ resolved: true, value: true }, { resolved: true, value: true }]);
                this.resolver.continue();
            });

            it('should pay the costs', function() {
                expect(this.ability.payCosts).toHaveBeenCalledWith(this.context);
            });

            it('should execute the handler', function() {
                expect(this.ability.executeHandler).toHaveBeenCalledWith(this.context);
            });
        });

        describe('when not all costs can be paid', function() {
            beforeEach(function() {
                this.ability.resolveCosts.and.returnValue([{ resolved: true, value: true }, { resolved: true, value: false }]);
                this.resolver.continue();
            });

            it('should not pay the costs', function() {
                expect(this.ability.payCosts).not.toHaveBeenCalled();
            });

            it('should not execute the handler', function() {
                expect(this.ability.executeHandler).not.toHaveBeenCalled();
            });
        });

        describe('when a cost cannot be immediately resolved', function() {
            beforeEach(function() {
                this.canPayResult = { resolved: false };
                this.ability.resolveCosts.and.returnValue([this.canPayResult]);
                this.resolver.continue();
            });

            it('should not pay the costs', function() {
                expect(this.ability.payCosts).not.toHaveBeenCalled();
            });

            it('should not execute the handler', function() {
                expect(this.ability.executeHandler).not.toHaveBeenCalled();
            });

            describe('when the costs have resolved', function() {
                beforeEach(function() {
                    this.canPayResult.resolved = true;
                });

                describe('and the cost could be paid', function() {
                    beforeEach(function() {
                        this.canPayResult.value = true;
                        this.resolver.continue();
                    });

                    it('should pay the costs', function() {
                        expect(this.ability.payCosts).toHaveBeenCalledWith(this.context);
                    });

                    it('should execute the handler', function() {
                        expect(this.ability.executeHandler).toHaveBeenCalledWith(this.context);
                    });
                });

                describe('and the cost could not be paid', function() {
                    beforeEach(function() {
                        this.canPayResult.value = false;
                        this.resolver.continue();
                    });

                    it('should not pay the costs', function() {
                        expect(this.ability.payCosts).not.toHaveBeenCalled();
                    });

                    it('should not execute the handler', function() {
                        expect(this.ability.executeHandler).not.toHaveBeenCalled();
                    });
                });
            });
        });
    });
});
