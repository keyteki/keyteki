const _ = require('underscore');

const Effect = require('../../server/game/effect.js');
const Player = require('../../server/game/player.js');

function createTarget(properties = {}) {
    let card = jasmine.createSpyObj('card', ['allowEffectFrom']);
    card.allowEffectFrom.and.returnValue(true);
    _.extend(card, properties);
    return card;
}

describe('Effect', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['']);
        this.sourceSpy = jasmine.createSpyObj('source', ['getType', 'isBlank']);
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
            this.matchingCard = createTarget({ good: true, location: 'play area' });
            this.nonMatchingCard = createTarget({ bad: true, location: 'play area' });

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
                    this.existingTarget = { target: 1 };
                    this.effect.targets = [this.existingTarget];
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

            it('should not add the matching cards to the target list', function() {
                expect(this.effect.targets).not.toContain(this.matchingCard);
            });

            it('should not apply the effect to the matching card', function() {
                expect(this.properties.effect.apply).not.toHaveBeenCalledWith(this.matchingCard, jasmine.any(Object));
            });
        });

        describe('when the target is already applied', function() {
            beforeEach(function() {
                this.effect.targets.push(this.matchingCard);
                this.effect.addTargets([this.matchingCard]);
            });

            it('should not add the target again', function() {
                expect(this.effect.targets).toEqual([this.matchingCard]);
            });
        });

        describe('when the effect target type is card', function() {
            beforeEach(function() {
                this.effect.active = true;
                this.player = {};
                this.anotherPlayer = {};
                this.sourceSpy.controller = this.player;
                this.matchingCard.controller = this.player;
            });

            describe('when the source cannot apply an effect to the target', function() {
                beforeEach(function() {
                    this.matchingCard.allowEffectFrom.and.returnValue(false);
                });

                it('should reject the target', function() {
                    this.effect.addTargets([this.matchingCard]);
                    expect(this.effect.targets).not.toContain(this.matchingCard);
                });
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

            describe('when the target location is play area', function() {
                beforeEach(function() {
                    this.effect.targetLocation = 'play area';
                });

                it('should add targets from play area', function() {
                    this.matchingCard.location = 'play area';
                    this.effect.addTargets([this.matchingCard]);
                    expect(this.effect.targets).toContain(this.matchingCard);
                });

                it('should reject targets from province', function() {
                    this.matchingCard.location = 'province 1';
                    this.effect.addTargets([this.matchingCard]);
                    expect(this.effect.targets).not.toContain(this.matchingCard);
                });

                it('should reject targets from hand', function() {
                    this.matchingCard.location = 'hand';
                    this.effect.addTargets([this.matchingCard]);
                    expect(this.effect.targets).not.toContain(this.matchingCard);
                });
            });

            describe('when the target location is hand', function() {
                beforeEach(function() {
                    this.effect.targetLocation = 'hand';
                });

                it('should reject targets from play area', function() {
                    this.matchingCard.location = 'play area';
                    this.effect.addTargets([this.matchingCard]);
                    expect(this.effect.targets).not.toContain(this.matchingCard);
                });

                it('should reject targets from province', function() {
                    this.matchingCard.location = 'province 1';
                    this.effect.addTargets([this.matchingCard]);
                    expect(this.effect.targets).not.toContain(this.matchingCard);
                });

                it('should add targets from hand', function() {
                    this.matchingCard.location = 'hand';
                    this.effect.addTargets([this.matchingCard]);
                    expect(this.effect.targets).toContain(this.matchingCard);
                });
            });

            describe('when the match is a specific card', function() {
                beforeEach(function() {
                    this.effect.match = this.matchingCard;
                });

                describe('when the target location is play area', function() {
                    beforeEach(function() {
                        this.effect.targetLocation = 'play area';
                    });

                    it('should add targets from play area', function() {
                        this.matchingCard.location = 'play area';
                        this.effect.addTargets([this.matchingCard]);
                        expect(this.effect.targets).toContain(this.matchingCard);
                    });

                    it('should add targets from province', function() {
                        this.matchingCard.location = 'province 1';
                        this.effect.addTargets([this.matchingCard]);
                        expect(this.effect.targets).not.toContain(this.matchingCard);
                    });

                    it('should reject targets from hand', function() {
                        this.matchingCard.location = 'hand';
                        this.effect.addTargets([this.matchingCard]);
                        expect(this.effect.targets).not.toContain(this.matchingCard);
                    });
                });

                describe('when the target location is hand', function() {
                    beforeEach(function() {
                        this.effect.targetLocation = 'hand';
                    });

                    it('should reject targets from play area', function() {
                        this.matchingCard.location = 'play area';
                        this.effect.addTargets([this.matchingCard]);
                        expect(this.effect.targets).not.toContain(this.matchingCard);
                    });

                    it('should reject targets from province', function() {
                        this.matchingCard.location = 'province 1';
                        this.effect.addTargets([this.matchingCard]);
                        expect(this.effect.targets).not.toContain(this.matchingCard);
                    });

                    it('should add targets from hand', function() {
                        this.matchingCard.location = 'hand';
                        this.effect.addTargets([this.matchingCard]);
                        expect(this.effect.targets).toContain(this.matchingCard);
                    });
                });
            });
        });

        describe('when the effect target type is player', function() {
            beforeEach(function() {
                this.properties.match.and.returnValue(true);
                this.effect.targetType = 'player';
                this.effect.active = true;
                this.player = new Player(1, { settings: {} }, true, {});
                this.anotherPlayer = new Player(2, { settings: {} }, false, {});
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
            this.target = createTarget({ good: true, location: 'play area' });

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

        describe('when the card is an existing target', function() {
            beforeEach(function() {
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
            this.target = createTarget({ target: 1, location: 'play area' });
            this.newTarget = createTarget({ target: 2, location: 'play area' });
        });

        describe('when the effect is active', function() {
            beforeEach(function() {
                this.effect.active = true;
                this.effect.targets = [this.target];
            });

            describe('and is set to inactive', function() {
                beforeEach(function() {
                    this.effect.setActive(false, [this.newTarget]);
                });

                it('should unapply the effect from existing targets', function() {
                    expect(this.properties.effect.unapply).toHaveBeenCalledWith(this.target, { game: this.gameSpy, source: this.sourceSpy });
                });

                it('should not apply the effect to anything', function() {
                    expect(this.properties.effect.apply).not.toHaveBeenCalled();
                });

                it('should remove all old targets', function() {
                    expect(this.effect.targets).not.toContain(this.target);
                });

                it('should not add new targets', function() {
                    expect(this.effect.targets).not.toContain(this.newTarget);
                });
            });

            describe('and is set to active', function() {
                beforeEach(function() {
                    this.effect.setActive(true, [this.newTarget]);
                });

                it('should not unapply the effect from existing targets', function() {
                    expect(this.properties.effect.unapply).not.toHaveBeenCalled();
                });

                it('should not apply the effect to anything', function() {
                    expect(this.properties.effect.apply).not.toHaveBeenCalled();
                });

                it('should not modify existing targets', function() {
                    expect(this.effect.targets).toContain(this.target);
                });

                it('should not add new targets', function() {
                    expect(this.effect.targets).not.toContain(this.newTarget);
                });
            });
        });

        describe('when the effect is inactive', function() {
            beforeEach(function() {
                this.effect.active = false;
                this.effect.targets = [];
            });

            describe('and is set to inactive', function() {
                beforeEach(function() {
                    this.effect.setActive(false, [this.newTarget]);
                });

                it('should not unapply the effect', function() {
                    expect(this.properties.effect.unapply).not.toHaveBeenCalled();
                });

                it('should not apply the effect', function() {
                    expect(this.properties.effect.apply).not.toHaveBeenCalled();
                });

                it('should not add new targets', function() {
                    expect(this.effect.targets).not.toContain(this.newTarget);
                });
            });

            describe('and is set to active', function() {
                beforeEach(function() {
                    this.effect.setActive(true, [this.newTarget]);
                });

                it('should not unapply the effect', function() {
                    expect(this.properties.effect.unapply).not.toHaveBeenCalled();
                });

                it('should apply the effect to new targets', function() {
                    expect(this.properties.effect.apply).toHaveBeenCalledWith(this.newTarget, { game: this.gameSpy, source: this.sourceSpy });
                });

                it('should add new targets', function() {
                    expect(this.effect.targets).toContain(this.newTarget);
                });
            });
        });
    });

    describe('cancel()', function() {
        beforeEach(function() {
            this.target = {};
            this.effect.targets = [this.target];
            this.effect.cancel();
        });

        it('should unapply the effect from existing targets', function() {
            expect(this.properties.effect.unapply).toHaveBeenCalledWith(this.target, { game: this.gameSpy, source: this.sourceSpy });
        });

        it('should remove all targets', function() {
            expect(this.effect.targets.length).toBe(0);
        });
    });

    describe('reapply()', function() {
        beforeEach(function() {
            this.target = createTarget({ target: 1, location: 'play area' });
            this.newTarget = createTarget({ target: 2, location: 'play area' });
            this.effect.targets = [this.target];
            this.newTargets = [this.target, this.newTarget];
        });

        describe('when the effect is neither state dependent nor conditional', function() {
            beforeEach(function() {
                this.effect.isConditional = false;
                this.properties.effect.isStateDependent = false;
            });

            describe('when the effect is inactive', function() {
                beforeEach(function() {
                    this.effect.active = false;

                    this.effect.reapply(this.newTargets);
                });

                it('should not unapply the effect from existing targets', function() {
                    expect(this.properties.effect.unapply).not.toHaveBeenCalled();
                });

                it('should not apply the effect for new or existing targets', function() {
                    expect(this.properties.effect.apply).not.toHaveBeenCalled();
                });
            });

            describe('when the effect is active', function() {
                beforeEach(function() {
                    this.effect.active = true;

                    this.effect.reapply(this.newTargets);
                });

                it('should not unapply the effect from existing targets', function() {
                    expect(this.properties.effect.unapply).not.toHaveBeenCalled();
                });

                it('should not apply the effect for new or existing targets', function() {
                    expect(this.properties.effect.apply).not.toHaveBeenCalled();
                });
            });
        });

        describe('when the effect is state dependent but not conditional', function() {
            beforeEach(function() {
                this.effect.isConditional = false;
                this.properties.effect.isStateDependent = true;
            });

            describe('when the effect is inactive', function() {
                beforeEach(function() {
                    this.effect.active = false;

                    this.effect.reapply(this.newTargets);
                });

                it('should not unapply the effect from existing targets', function() {
                    expect(this.properties.effect.unapply).not.toHaveBeenCalled();
                });

                it('should not apply the effect for new or existing targets', function() {
                    expect(this.properties.effect.apply).not.toHaveBeenCalled();
                });
            });

            describe('when the effect is active', function() {
                beforeEach(function() {
                    this.effect.active = true;
                });

                describe('and the effect has a reapply method', function() {
                    beforeEach(function() {
                        this.properties.effect.reapply = jasmine.createSpy('reapply');
                        this.effect.reapply(this.newTargets);
                    });

                    it('should reapply the effect for existing targets', function() {
                        expect(this.properties.effect.reapply).toHaveBeenCalledWith(this.target, jasmine.any(Object));
                    });

                    it('should not unapply the effect for existing targets', function() {
                        expect(this.properties.effect.unapply).not.toHaveBeenCalledWith(this.target, jasmine.any(Object));
                    });

                    it('should not apply the effect for existing targets', function() {
                        expect(this.properties.effect.apply).not.toHaveBeenCalledWith(this.target, jasmine.any(Object));
                    });

                    it('should not apply the effect to new targets', function() {
                        expect(this.properties.effect.apply).not.toHaveBeenCalledWith(this.newTarget, jasmine.any(Object));
                    });
                });

                describe('and the effect does not have a reapply method', function() {
                    beforeEach(function() {
                        this.effect.reapply(this.newTargets);
                    });

                    it('should unapply the effect for existing targets', function() {
                        expect(this.properties.effect.unapply).toHaveBeenCalledWith(this.target, jasmine.any(Object));
                    });

                    it('should apply the effect for existing targets', function() {
                        expect(this.properties.effect.apply).toHaveBeenCalledWith(this.target, jasmine.any(Object));
                    });

                    it('should not apply the effect to new targets', function() {
                        expect(this.properties.effect.apply).not.toHaveBeenCalledWith(this.newTarget, jasmine.any(Object));
                    });
                });
            });
        });

        describe('when the effect is conditional', function() {
            beforeEach(function() {
                this.effect.isConditional = true;
                this.effect.condition = jasmine.createSpy('condition');
            });

            describe('when the effect is inactive', function() {
                beforeEach(function() {
                    this.effect.active = false;

                    this.effect.reapply(this.newTargets);
                });

                it('should not unapply the effect from existing targets', function() {
                    expect(this.properties.effect.unapply).not.toHaveBeenCalled();
                });

                it('should not apply the effect from existing targets', function() {
                    expect(this.properties.effect.apply).not.toHaveBeenCalled();
                });
            });

            describe('when the condition is true', function() {
                beforeEach(function() {
                    this.matchingTarget = createTarget({ target: 3, location: 'play area' });
                    this.effect.targets = [this.target, this.matchingTarget];
                    this.effect.active = true;
                    this.effect.condition.and.returnValue(true);
                    this.properties.match.and.callFake(card => card !== this.target);
                    this.effect.reapply(this.newTargets);
                });

                it('should apply the effect to new targets', function() {
                    expect(this.properties.effect.apply).toHaveBeenCalledWith(this.newTarget, jasmine.any(Object));
                });

                it('should not unapply the effect from targets that still match', function() {
                    expect(this.properties.effect.unapply).not.toHaveBeenCalledWith(this.matchingTarget, jasmine.any(Object));
                });

                it('should unapply the effect from targets that no longer match', function() {
                    expect(this.properties.effect.unapply).toHaveBeenCalledWith(this.target, jasmine.any(Object));
                });

                it('should update the target list', function() {
                    expect(this.effect.targets).toEqual([this.matchingTarget, this.newTarget]);
                });
            });

            describe('when the condition is false', function() {
                beforeEach(function() {
                    this.effect.targets = [this.target];
                    this.effect.active = true;
                    this.effect.condition.and.returnValue(false);
                    this.effect.reapply(this.newTargets);
                });

                it('should unapply the effect from existing targets', function() {
                    expect(this.properties.effect.unapply).toHaveBeenCalledWith(this.target, jasmine.any(Object));
                });

                it('should not apply the effect to new targets', function() {
                    expect(this.properties.effect.apply).not.toHaveBeenCalled();
                });

                it('should clear the target list', function() {
                    expect(this.effect.targets).toEqual([]);
                });
            });
        });
    });
});
