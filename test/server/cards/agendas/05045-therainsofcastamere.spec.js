/* global describe, it, expect, beforeEach, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');

const TheRainsOfCastamere = require('../../../../server/game/cards/agendas/therainsofcastamere.js');
const RevealPlots = require('../../../../server/game/gamesteps/revealplots.js');

describe('The Rains of Castamere', function() {
    function createPlotSpy(uuid, hasTrait) {
        var plot = jasmine.createSpyObj('plot', ['hasTrait', 'moveTo']);
        plot.uuid = uuid;
        plot.hasTrait.and.callFake(hasTrait);
        return plot;
    }

    function plot(uuid) {
        return createPlotSpy(uuid, () => false);
    }

    function scheme(uuid) {
        return createPlotSpy(uuid, (trait) => trait === 'Scheme');
    }

    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'registerAbility', 'addMessage', 'queueStep', 'raiseEvent']);

        this.plot1 = plot('1111');
        this.plot2 = plot('2222');
        this.scheme1 = scheme('3333');
        this.scheme2 = scheme('4444');

        this.player = jasmine.createSpyObj('player', ['createAdditionalPile', 'flipPlotFaceup', 'removeActivePlot', 'kneelCard', 'moveCard']);
        this.player.game = this.gameSpy;
        this.player.faction = {};

        this.agenda = new TheRainsOfCastamere(this.player, {});
    });

    describe('onDecksPrepared()', function() {
        beforeEach(function() {
            this.player.plotDeck = _([this.plot1, this.scheme1, this.plot2, this.scheme2]);

            this.agenda.onDecksPrepared();
        });

        it('should create the schemes plot pile', function() {
            expect(this.player.createAdditionalPile).toHaveBeenCalledWith('scheme plots', { title: jasmine.any(String), area: 'plots', isPrivate: true });
        });

        it('should remove the schemes from the players plot deck', function() {
            expect(this.player.plotDeck.toArray()).toEqual([this.plot1, this.plot2]);
        });

        it('should save the schemes for later use', function() {
            expect(this.agenda.schemes).toEqual([this.scheme1, this.scheme2]);
        });
    });

    describe('onPlotFlip()', function() {
        describe('when there is no active plot', function() {
            beforeEach(function() {
                this.player.activePlot = undefined;
            });

            it('should not crash', function() {
                expect(() => {
                    this.agenda.onPlotFlip();
                }).not.toThrow();
            });
        });

        describe('when the active plot is not a scheme', function() {
            beforeEach(function() {
                this.player.activePlot = this.plot1;

                this.agenda.onPlotFlip();
            });

            it('should not remove the plot directly', function() {
                expect(this.player.activePlot).toBe(this.plot1);
            });

            it('should not make the plot leave play directly', function() {
                expect(this.player.removeActivePlot).not.toHaveBeenCalled();
            });
        });

        describe('when the active plot is a scheme', function() {
            beforeEach(function() {
                this.player.activePlot = this.scheme1;

                this.agenda.onPlotFlip();
            });

            it('should remove the active plot from the game', function() {
                expect(this.player.removeActivePlot).toHaveBeenCalledWith('out of game');
            });
        });
    });

    describe('afterChallenge()', function() {
        beforeEach(function() {
            this.event = {};
            this.challenge = { challengeType: 'intrigue', winner: this.player, strengthDifference: 5 };
            this.reaction = this.agenda.abilities.reactions[0];
        });

        describe('when the challenge type is not intrigue', function() {
            beforeEach(function() {
                this.challenge.challengeType = 'power';
            });

            it('should not trigger', function() {
                expect(this.reaction.when.afterChallenge(this.event, this.challenge)).toBe(false);
            });
        });

        describe('when the challenge winner is not the Castamere player', function() {
            beforeEach(function() {
                this.challenge.winner = {};
            });

            it('should not trigger', function() {
                expect(this.reaction.when.afterChallenge(this.event, this.challenge)).toBe(false);
            });
        });

        describe('when the strength difference is less than 5', function() {
            beforeEach(function() {
                this.challenge.strengthDifference = 4;
            });

            it('should not trigger', function() {
                expect(this.reaction.when.afterChallenge(this.event, this.challenge)).toBe(false);
            });
        });

        describe('when the player faction card is already knelt', function() {
            beforeEach(function() {
                this.player.faction.kneeled = true;
            });

            it('should not trigger', function() {
                expect(this.reaction.when.afterChallenge(this.event, this.challenge)).toBe(false);
            });
        });

        describe('when all triggering criteria are met', function() {
            it('should trigger', function() {
                expect(this.reaction.when.afterChallenge(this.event, this.challenge)).toBe(true);
            });

            it('should register the ability', function() {
                this.reaction.executeReaction({});
                expect(this.gameSpy.registerAbility).toHaveBeenCalledWith(this.reaction, jasmine.any(Object));
            });
        });
    });

    describe('revealScheme()', function() {
        beforeEach(function() {
            this.agenda.schemes = [this.scheme1, this.scheme2];
        });

        describe('when the argument is not one of the schemes', function() {
            beforeEach(function() {
                this.result = this.agenda.revealScheme(this.player, 'notfound');
            });

            it('should not flip a plot', function() {
                expect(this.player.flipPlotFaceup).not.toHaveBeenCalled();
            });

            it('should not reveal a plot', function() {
                expect(this.gameSpy.queueStep).not.toHaveBeenCalledWith(jasmine.any(RevealPlots));
            });

            it('should return false', function() {
                expect(this.result).toBe(false);
            });

            it('should not kneel the player faction card', function() {
                expect(this.player.faction.kneeled).toBeFalsy();
            });
        });

        describe('when the argument is a scheme', function() {
            describe('and there is no active plot', function() {
                beforeEach(function() {
                    this.player.activePlot = undefined;

                    this.result = this.agenda.revealScheme(this.player, this.scheme1.uuid);
                });

                it('should remove the revealed scheme from the choices list', function() {
                    expect(this.agenda.schemes).not.toContain(this.scheme1);
                });

                it('should flip the plot face up', function() {
                    expect(this.player.flipPlotFaceup).toHaveBeenCalled();
                });

                it('should reveal the plot', function() {
                    expect(this.gameSpy.queueStep).toHaveBeenCalledWith(jasmine.any(RevealPlots));
                });

                it('should return true', function() {
                    expect(this.result).toBe(true);
                });

                it('should kneel the player faction card', function() {
                    expect(this.player.kneelCard).toHaveBeenCalledWith(this.player.faction);
                });
            });

            describe('and the active plot is not a scheme', function() {
                beforeEach(function() {
                    this.player.activePlot = this.plot1;

                    this.result = this.agenda.revealScheme(this.player, this.scheme1.uuid);
                });

                it('should remove the revealed scheme from the choices list', function() {
                    expect(this.agenda.schemes).not.toContain(this.scheme1);
                });

                it('should flip the plot face up', function() {
                    expect(this.player.flipPlotFaceup).toHaveBeenCalled();
                });

                it('should reveal the plot', function() {
                    expect(this.gameSpy.queueStep).toHaveBeenCalledWith(jasmine.any(RevealPlots));
                });

                it('should return true', function() {
                    expect(this.result).toBe(true);
                });

                it('should kneel the player faction card', function() {
                    expect(this.player.kneelCard).toHaveBeenCalledWith(this.player.faction);
                });
            });

            describe('when the active plot is a scheme', function() {
                beforeEach(function() {
                    this.player.activePlot = this.scheme2;

                    this.result = this.agenda.revealScheme(this.player, this.scheme1.uuid);
                });

                it('should remove the current plot from play', function() {
                    expect(this.player.removeActivePlot).toHaveBeenCalled();
                });

                it('should remove the revealed scheme from the choices list', function() {
                    expect(this.agenda.schemes).not.toContain(this.scheme1);
                });

                it('should flip the plot face up', function() {
                    expect(this.player.flipPlotFaceup).toHaveBeenCalled();
                });

                it('should reveal the plot', function() {
                    expect(this.gameSpy.queueStep).toHaveBeenCalledWith(jasmine.any(RevealPlots));
                });

                it('should return true', function() {
                    expect(this.result).toBe(true);
                });

                it('should kneel the player faction card', function() {
                    expect(this.player.kneelCard).toHaveBeenCalledWith(this.player.faction);
                });
            });
        });
    });
});
