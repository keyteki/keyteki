/*global describe, it, beforeEach, expect, jasmine */
/*eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');

const EffectEngine = require('../../server/game/effectengine.js');

describe('EffectEngine', function () {
    beforeEach(function () {
        this.playAreaCard = { location: 'play area' };
        this.handCard = { location: 'hand' };
        this.discardedCard = { location: 'discard pile' };

        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener', 'getPlayers']);
        this.gameSpy.getPlayers.and.returnValue([]);
        this.gameSpy.allCards = _([this.handCard, this.playAreaCard, this.discardedCard]);

        this.effectSpy = jasmine.createSpyObj('effect', ['addTargets', 'reapply', 'removeTarget', 'cancel', 'setActive']);
        this.effectSpy.targetLocation = 'play area';

        this.engine = new EffectEngine(this.gameSpy);
    });

    describe('add()', function() {
        beforeEach(function() {
            this.engine.add(this.effectSpy);
        });

        it('should adds the effect to the list', function() {
            expect(this.engine.effects).toContain(this.effectSpy);
        });

        it('should add existing valid targets to the effect', function() {
            expect(this.effectSpy.addTargets).toHaveBeenCalledWith([this.handCard, this.playAreaCard]);
        });
    });

    describe('getTargets()', function() {
        beforeEach(function() {
            this.player = {};
            this.gameSpy.getPlayers.and.returnValue([this.player]);
        });

        it('should return all play area cards and players', function() {
            expect(this.engine.getTargets()).toEqual([this.handCard, this.playAreaCard, this.player]);
        });
    });

    describe('reapplyStateDependentEffects()', function() {
        beforeEach(function() {
            this.engine.effects = [this.effectSpy];
        });

        describe('when an effect is state dependent', function() {
            beforeEach(function() {
                this.effectSpy.isStateDependent = true;
                this.engine.reapplyStateDependentEffects();
            });

            it('should reapply valid targets', function() {
                expect(this.effectSpy.reapply).toHaveBeenCalledWith([this.handCard, this.playAreaCard]);
            });
        });

        describe('when an effect is not state dependent', function() {
            beforeEach(function() {
                this.effectSpy.isStateDependent = false;
                this.engine.reapplyStateDependentEffects();
            });

            it('should not reapply valid targets', function() {
                expect(this.effectSpy.reapply).not.toHaveBeenCalled();
            });
        });
    });

    describe('onCardEntersPlay()', function() {
        beforeEach(function() {
            this.engine.effects = [this.effectSpy];
        });

        describe('when an effect has persistent duration', function() {
            beforeEach(function() {
                this.effectSpy.duration = 'persistent';
                this.cardEnteringPlay = { location: 'play area' };
                this.engine.onCardEntersPlay({ card: this.cardEnteringPlay });
            });

            it('should add the card entering play as a target', function() {
                expect(this.effectSpy.addTargets).toHaveBeenCalledWith([this.cardEnteringPlay]);
            });
        });

        describe('when an effect has a non-persistent duration', function() {
            beforeEach(function() {
                this.effectSpy.duration = 'untilEndOfChallenge';
                this.cardEnteringPlay = { location: 'play area' };
                this.engine.onCardEntersPlay({ card: this.cardEnteringPlay });
            });

            it('should not add the card entering play as a target', function() {
                expect(this.effectSpy.addTargets).not.toHaveBeenCalled();
            });
        });
    });

    describe('onCardLeftPlay()', function() {
        beforeEach(function() {
            this.engine.effects = [this.effectSpy];
            this.cardLeavingPlay = { location: 'play area' };
        });

        describe('when an effect has persistent duration', function() {
            beforeEach(function() {
                this.effectSpy.duration = 'persistent';
            });

            describe('and the card leaving play is the source for an effect', function() {
                beforeEach(function() {
                    this.effectSpy.source = this.cardLeavingPlay;
                    this.engine.onCardLeftPlay({ card: this.cardLeavingPlay });
                });

                it('should remove the target from all effects', function() {
                    expect(this.effectSpy.removeTarget).toHaveBeenCalledWith(this.cardLeavingPlay);
                });

                it('should cancel the effect', function() {
                    expect(this.effectSpy.cancel).toHaveBeenCalled();
                });

                it('should remove the effect from the list', function() {
                    expect(this.engine.effects).not.toContain(this.effectSpy);
                });
            });

            describe('and the card leaving play is not the source for an effect', function() {
                beforeEach(function() {
                    this.effectSpy.source = {};
                    this.engine.onCardLeftPlay({ card: this.cardLeavingPlay });
                });

                it('should remove the target from all effects', function() {
                    expect(this.effectSpy.removeTarget).toHaveBeenCalledWith(this.cardLeavingPlay);
                });

                it('should not cancel the effect', function() {
                    expect(this.effectSpy.cancel).not.toHaveBeenCalled();
                });

                it('should not remove the effect from the list', function() {
                    expect(this.engine.effects).toContain(this.effectSpy);
                });
            });
        });

        describe('when an effect has a non-persistent duration', function() {
            beforeEach(function() {
                this.effectSpy.duration = 'untilEndOfChallenge';
            });

            describe('and the card leaving play is the source for an effect', function() {
                beforeEach(function() {
                    this.effectSpy.source = this.cardLeavingPlay;
                    this.engine.onCardLeftPlay({ card: this.cardLeavingPlay });
                });

                it('should remove the target from all effects', function() {
                    expect(this.effectSpy.removeTarget).toHaveBeenCalledWith(this.cardLeavingPlay);
                });

                it('should not cancel the effect', function() {
                    expect(this.effectSpy.cancel).not.toHaveBeenCalled();
                });

                it('should not remove the effect from the list', function() {
                    expect(this.engine.effects).toContain(this.effectSpy);
                });
            });

            describe('and the card leaving play is not the source for an effect', function() {
                beforeEach(function() {
                    this.effectSpy.source = {};
                    this.engine.onCardLeftPlay({ card: this.cardLeavingPlay });
                });

                it('should remove the target from all effects', function() {
                    expect(this.effectSpy.removeTarget).toHaveBeenCalledWith(this.cardLeavingPlay);
                });

                it('should not cancel the effect', function() {
                    expect(this.effectSpy.cancel).not.toHaveBeenCalled();
                });

                it('should not remove the effect from the list', function() {
                    expect(this.engine.effects).toContain(this.effectSpy);
                });
            });
        });
    });

    describe('onCardBlankToggled()', function() {
        beforeEach(function() {
            this.engine.effects = [this.effectSpy];
            this.cardBeingToggled = {};
        });

        describe('when an effect has persistent duration', function() {
            beforeEach(function() {
                this.effectSpy.duration = 'persistent';
            });

            describe('and the card being blanked is the source for an effect', function() {
                beforeEach(function() {
                    this.effectSpy.source = this.cardBeingToggled;
                    this.engine.onCardBlankToggled({}, this.cardBeingToggled, false);
                });

                it('should set the active value for the effect along with cards to target', function() {
                    expect(this.effectSpy.setActive).toHaveBeenCalledWith(true, [this.handCard, this.playAreaCard]);
                });
            });

            describe('and the card being blanked is not the source for an effect', function() {
                beforeEach(function() {
                    this.effectSpy.source = {};
                    this.engine.onCardBlankToggled({}, this.cardBeingToggled, false);
                });

                it('should not set the active value for the effect', function() {
                    expect(this.effectSpy.setActive).not.toHaveBeenCalled();
                });
            });
        });

        describe('when an effect has a non-persistent duration', function() {
            beforeEach(function() {
                this.effectSpy.duration = 'untilEndOfChallenge';
            });

            describe('and the card being blanked is the source for an effect', function() {
                beforeEach(function() {
                    this.effectSpy.source = this.cardBeingToggled;
                    this.engine.onCardBlankToggled({}, this.cardBeingToggled, false);
                });

                it('should not set the active value for the effect', function() {
                    expect(this.effectSpy.setActive).not.toHaveBeenCalled();
                });
            });

            describe('and the card being blanked is not the source for an effect', function() {
                beforeEach(function() {
                    this.effectSpy.source = {};
                    this.engine.onCardBlankToggled({}, this.cardBeingToggled, false);
                });

                it('should not set the active value for the effect', function() {
                    expect(this.effectSpy.setActive).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('onChallengeFinished()', function() {
        beforeEach(function() {
            this.engine.effects = [this.effectSpy];
        });

        describe('when an effect has untilEndOfChallenge duration', function() {
            beforeEach(function() {
                this.effectSpy.duration = 'untilEndOfChallenge';
                this.engine.onChallengeFinished({}, {});
            });

            it('should cancel the effect', function() {
                expect(this.effectSpy.cancel).toHaveBeenCalled();
            });

            it('should remove the effect from the list', function() {
                expect(this.engine.effects).not.toContain(this.effectSpy);
            });
        });


        describe('when an effect has a non-untilEndOfChallenge duration', function() {
            beforeEach(function() {
                this.effectSpy.duration = 'persistent';
                this.engine.onChallengeFinished({}, {});
            });

            it('should not cancel the effect', function() {
                expect(this.effectSpy.cancel).not.toHaveBeenCalled();
            });

            it('should not remove the effect from the list', function() {
                expect(this.engine.effects).toContain(this.effectSpy);
            });
        });
    });

    describe('onPhaseEnded()', function() {
        beforeEach(function() {
            this.engine.effects = [this.effectSpy];
        });

        describe('when an effect has untilEndOfPhase duration', function() {
            beforeEach(function() {
                this.effectSpy.duration = 'untilEndOfPhase';
                this.engine.onPhaseEnded({ phase: 'marshal' });
            });

            it('should cancel the effect', function() {
                expect(this.effectSpy.cancel).toHaveBeenCalled();
            });

            it('should remove the effect from the list', function() {
                expect(this.engine.effects).not.toContain(this.effectSpy);
            });
        });


        describe('when an effect has a non-untilEndOfPhase duration', function() {
            beforeEach(function() {
                this.effectSpy.duration = 'persistent';
                this.engine.onPhaseEnded({ phase: 'marshal' });
            });

            it('should not cancel the effect', function() {
                expect(this.effectSpy.cancel).not.toHaveBeenCalled();
            });

            it('should not remove the effect from the list', function() {
                expect(this.engine.effects).toContain(this.effectSpy);
            });
        });
    });

    describe('onAtEndOfPhase()', function() {
        beforeEach(function() {
            this.engine.effects = [this.effectSpy];
        });

        describe('when an effect has atEndOfPhase duration', function() {
            beforeEach(function() {
                this.effectSpy.duration = 'atEndOfPhase';
                this.engine.onAtEndOfPhase({});
            });

            it('should cancel the effect', function() {
                expect(this.effectSpy.cancel).toHaveBeenCalled();
            });

            it('should remove the effect from the list', function() {
                expect(this.engine.effects).not.toContain(this.effectSpy);
            });
        });


        describe('when an effect has a non-atEndOfPhase duration', function() {
            beforeEach(function() {
                this.effectSpy.duration = 'persistent';
                this.engine.onAtEndOfPhase({});
            });

            it('should not cancel the effect', function() {
                expect(this.effectSpy.cancel).not.toHaveBeenCalled();
            });

            it('should not remove the effect from the list', function() {
                expect(this.engine.effects).toContain(this.effectSpy);
            });
        });
    });

    describe('onRoundEnded()', function() {
        beforeEach(function() {
            this.engine.effects = [this.effectSpy];
        });

        describe('when an effect has untilEndOfRound duration', function() {
            beforeEach(function() {
                this.effectSpy.duration = 'untilEndOfRound';
                this.engine.onRoundEnded({});
            });

            it('should cancel the effect', function() {
                expect(this.effectSpy.cancel).toHaveBeenCalled();
            });

            it('should remove the effect from the list', function() {
                expect(this.engine.effects).not.toContain(this.effectSpy);
            });
        });


        describe('when an effect has a non-untilEndOfRound duration', function() {
            beforeEach(function() {
                this.effectSpy.duration = 'persistent';
                this.engine.onRoundEnded({});
            });

            it('should not cancel the effect', function() {
                expect(this.effectSpy.cancel).not.toHaveBeenCalled();
            });

            it('should not remove the effect from the list', function() {
                expect(this.engine.effects).toContain(this.effectSpy);
            });
        });
    });
});
