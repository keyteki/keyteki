/*global describe, it, beforeEach, expect, jasmine */
/*eslint camelcase: 0, no-invalid-this: 0 */

const Effect = require('../../server/game/effect.js');
const Player = require('../../server/game/player.js');

describe('Effect', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', ['']);
        this.sourceSpy = jasmine.createSpyObj('source', ['isBlank']);
        this.properties = {
            match: jasmine.createSpy('match'),
            duration: 'persistent',
            effect: {
                apply: jasmine.createSpy('apply'),
                unapply: jasmine.createSpy('unapply')
            }
        };

        this.properties.match.and.returnValue(true);

        this.effect = new Effect(this.gameSpy, this.sourceSpy, this.properties);
    });

    describe('addTargets()', function() {
        beforeEach(function() {
            this.matchingCard = { good: true };
            this.nonMatchingCard = { bad: true };

            this.properties.match.and.callFake((card) => card === this.matchingCard);
        });

        describe('when the effect has a condition', function() {
            beforeEach(function() {
                this.effect.active = true;
                this.properties.condition = jasmine.createSpy('condition');
                this.effect = new Effect(this.gameSpy, this.sourceSpy, this.properties);
            });

            describe('and the condition returns true', function() {
                beforeEach(function() {
                    this.properties.condition.and.returnValue(true);
                    this.effect.addTargets([this.nonMatchingCard, this.matchingCard]);
                });

                it('should add the matching cards to the target list', function() {
                    expect(this.effect.targets).toContain(this.matchingCard);
                    expect(this.effect.targets).not.toContain(this.nonMatchingCard);
                });

                it('should apply the effect to the matching card', function() {
                    expect(this.properties.effect.apply).toHaveBeenCalledWith(this.matchingCard, { game: this.gameSpy, source: this.sourceSpy });
                    expect(this.properties.effect.apply).not.toHaveBeenCalledWith(this.nonMatchingCard, jasmine.any(Object));
                });
            });

            describe('and the condition returns false', function() {
                beforeEach(function() {
                    this.properties.condition.and.returnValue(false);
                    this.effect.addTargets([this.nonMatchingCard, this.matchingCard]);
                });

                it('should not add the matching cards to the target list', function() {
                    expect(this.effect.targets).not.toContain(this.matchingCard);
                    expect(this.effect.targets).not.toContain(this.nonMatchingCard);
                });

                it('should not apply the effect to the matching card', function() {
                    expect(this.properties.effect.apply).not.toHaveBeenCalledWith(this.matchingCard, jasmine.any(Object));
                    expect(this.properties.effect.apply).not.toHaveBeenCalledWith(this.nonMatchingCard, jasmine.any(Object));
                });
            });
        });

        describe('when the effect is active', function() {
            beforeEach(function() {
                this.effect.active = true;
                this.effect.addTargets([this.nonMatchingCard, this.matchingCard]);
            });

            it('should add the matching cards to the target list', function() {
                expect(this.effect.targets).toContain(this.matchingCard);
                expect(this.effect.targets).not.toContain(this.nonMatchingCard);
            });

            it('should apply the effect to the matching card', function() {
                expect(this.properties.effect.apply).toHaveBeenCalledWith(this.matchingCard, { game: this.gameSpy, source: this.sourceSpy });
                expect(this.properties.effect.apply).not.toHaveBeenCalledWith(this.nonMatchingCard, jasmine.any(Object));
            });
        });

        describe('when the effect is inactive', function() {
            beforeEach(function() {
                this.effect.active = false;
                this.effect.addTargets([this.nonMatchingCard, this.matchingCard]);
            });

            it('should add the matching cards to the target list', function() {
                expect(this.effect.targets).toContain(this.matchingCard);
            });

            it('should not apply the effect to the matching card', function() {
                expect(this.properties.effect.apply).not.toHaveBeenCalledWith(this.matchingCard, jasmine.any(Object));
            });
        });

        describe('when the effect target type is card', function() {
            beforeEach(function() {
                this.effect.active = true;
                this.player = {};
                this.anotherPlayer = {};
                this.sourceSpy.controller = this.player;
            });

            describe('when the target controller is current', function() {
                beforeEach(function() {
                    this.effect.targetController = 'current';
                });

                it('should add targets controlled by source card controller', function() {
                    this.matchingCard.controller = this.player;
                    this.effect.addTargets([this.matchingCard]);
                    expect(this.effect.targets).toContain(this.matchingCard);
                });

                it('should reject targets controlled by an opponent', function() {
                    this.matchingCard.controller = this.anotherPlayer;
                    this.effect.addTargets([this.matchingCard]);
                    expect(this.effect.targets).not.toContain(this.matchingCard);
                });
            });

            describe('when the target controller is opponent', function() {
                beforeEach(function() {
                    this.effect.targetController = 'opponent';
                });

                it('should reject targets controlled by source card controller', function() {
                    this.matchingCard.controller = this.player;
                    this.effect.addTargets([this.matchingCard]);
                    expect(this.effect.targets).not.toContain(this.matchingCard);
                });

                it('should add targets controlled by a different controller', function() {
                    this.matchingCard.controller = this.anotherPlayer;
                    this.effect.addTargets([this.matchingCard]);
                    expect(this.effect.targets).toContain(this.matchingCard);
                });
            });

            describe('when the target controller is any', function() {
                beforeEach(function() {
                    this.effect.targetController = 'any';
                });

                it('should add targets controlled by source card controller', function() {
                    this.matchingCard.controller = this.player;
                    this.effect.addTargets([this.matchingCard]);
                    expect(this.effect.targets).toContain(this.matchingCard);
                });

                it('should add targets controlled by a different controller', function() {
                    this.matchingCard.controller = this.anotherPlayer;
                    this.effect.addTargets([this.matchingCard]);
                    expect(this.effect.targets).toContain(this.matchingCard);
                });
            });
        });

        describe('when the effect target type is player', function() {
            beforeEach(function() {
                this.properties.match.and.returnValue(true);
                this.effect.targetType = 'player';
                this.effect.active = true;
                this.player = new Player(1, {}, true, {});
                this.anotherPlayer = new Player(2, {}, false, {});
                this.sourceSpy.controller = this.player;
            });

            describe('when the target controller is current', function() {
                beforeEach(function() {
                    this.effect.targetController = 'current';
                });

                it('should add the current player as a target', function() {
                    this.effect.addTargets([this.player]);
                    expect(this.effect.targets).toContain(this.player);
                });

                it('should reject opponents as a target', function() {
                    this.effect.addTargets([this.anotherPlayer]);
                    expect(this.effect.targets).not.toContain(this.anotherPlayer);
                });
            });

            describe('when the target controller is opponent', function() {
                beforeEach(function() {
                    this.effect.targetController = 'opponent';
                });

                it('should reject the current player as a target', function() {
                    this.effect.addTargets([this.player]);
                    expect(this.effect.targets).not.toContain(this.player);
                });

                it('should add opponents as a target', function() {
                    this.effect.addTargets([this.anotherPlayer]);
                    expect(this.effect.targets).toContain(this.anotherPlayer);
                });
            });

            describe('when the target controller is any', function() {
                beforeEach(function() {
                    this.effect.targetController = 'any';
                });

                it('should add the current player as a target', function() {
                    this.effect.addTargets([this.player]);
                    expect(this.effect.targets).toContain(this.player);
                });

                it('should add opponents as a target', function() {
                    this.effect.addTargets([this.anotherPlayer]);
                    expect(this.effect.targets).toContain(this.anotherPlayer);
                });
            });
        });
    });

    describe('removeTarget()', function() {
        beforeEach(function() {
            this.target = { good: true };

            this.effect.addTargets([this.target]);
        });

        describe('when the card is not an existing target', function() {
            beforeEach(function() {
                this.effect.removeTarget({});
            });

            it('should not unapply the effect', function() {
                expect(this.properties.effect.unapply).not.toHaveBeenCalled();
            });
        });

        describe('when the effect is inactive', function() {
            beforeEach(function() {
                this.effect.active = false;
                this.effect.removeTarget(this.target);
            });

            it('should remove the card from the target list', function() {
                expect(this.effect.targets).not.toContain(this.target);
            });

            it('should not unapply the effect', function() {
                expect(this.properties.effect.unapply).not.toHaveBeenCalledWith(this.target, jasmine.any(Object));
            });
        });

        describe('when the effect is active', function() {
            beforeEach(function() {
                this.effect.setActive(true);
                this.effect.removeTarget(this.target);
            });

            it('should remove the card from the target list', function() {
                expect(this.effect.targets).not.toContain(this.target);
            });

            it('should unapply the effect', function() {
                expect(this.properties.effect.unapply).toHaveBeenCalledWith(this.target, { game: this.gameSpy, source: this.sourceSpy });
            });
        });
    });

    describe('setActive()', function() {
        beforeEach(function() {
            this.target = {};
            this.effect.targets =[this.target];
        });

        describe('when the effect is active', function() {
            beforeEach(function() {
                this.effect.active = true;
            });

            describe('and is set to inactive', function() {
                beforeEach(function() {
                    this.effect.setActive(false);
                });

                it('should unapply the effect from existing targets', function() {
                    expect(this.properties.effect.unapply).toHaveBeenCalledWith(this.target, { game: this.gameSpy, source: this.sourceSpy });
                });

                it('should not apply the effect to anything', function() {
                    expect(this.properties.effect.apply).not.toHaveBeenCalled();
                });
            });

            describe('and is set to active', function() {
                beforeEach(function() {
                    this.effect.setActive(true);
                });

                it('should not unapply the effect from existing targets', function() {
                    expect(this.properties.effect.unapply).not.toHaveBeenCalled();
                });

                it('should not apply the effect to anything', function() {
                    expect(this.properties.effect.apply).not.toHaveBeenCalled();
                });
            });
        });

        describe('when the effect is inactive', function() {
            beforeEach(function() {
                this.effect.active = false;
            });

            describe('and is set to inactive', function() {
                beforeEach(function() {
                    this.effect.setActive(false);
                });

                it('should not unapply the effect', function() {
                    expect(this.properties.effect.unapply).not.toHaveBeenCalled();
                });

                it('should not apply the effect', function() {
                    expect(this.properties.effect.apply).not.toHaveBeenCalled();
                });
            });

            describe('and is set to active', function() {
                beforeEach(function() {
                    this.effect.setActive(true);
                });

                it('should not unapply the effect', function() {
                    expect(this.properties.effect.unapply).not.toHaveBeenCalled();
                });

                it('should apply the effect to existing targets', function() {
                    expect(this.properties.effect.apply).toHaveBeenCalledWith(this.target, { game: this.gameSpy, source: this.sourceSpy });
                });
            });
        });
    });

    describe('cancel()', function() {
        beforeEach(function() {
            this.target = {};
            this.effect.targets = [this.target];
        });

        describe('when the effect is active', function() {
            beforeEach(function() {
                this.effect.active = true;
                this.effect.cancel();
            });

            it('should unapply the effect from existing targets', function() {
                expect(this.properties.effect.unapply).toHaveBeenCalledWith(this.target, { game: this.gameSpy, source: this.sourceSpy });
            });

            it('should remove all targets', function() {
                expect(this.effect.targets.length).toBe(0);
            });
        });

        describe('when the effect is inactive', function() {
            beforeEach(function() {
                this.effect.active = false;
                this.effect.cancel();
            });

            it('should not unapply the effect from existing targets', function() {
                expect(this.properties.effect.unapply).not.toHaveBeenCalled();
            });

            it('should remove all targets', function() {
                expect(this.effect.targets.length).toBe(0);
            });
        });
    });
});
