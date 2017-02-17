/*global describe, it, beforeEach, expect, spyOn, jasmine*/
/* eslint camelcase: 0, no-invalid-this: 0 */

const Game = require('../../../server/game/game.js');

describe('Game', function() {
    beforeEach(function() {
        this.gameRepository = jasmine.createSpyObj('gameRepository', ['save']);
        this.game = new Game('1', { spectators: true }, { gameRepository: this.gameRepository });
    });

    describe('join()', function() {
        describe('when the game has not started and there are not enough players', function() {
            beforeEach(function() {
                this.result = this.game.join('1', { username: 'foo' });
            });

            it('should add the player', function() {
                expect(this.game.playersAndSpectators['foo']).toBeDefined();
                expect(this.game.playersAndSpectators['foo'].id).toBe('1');
            });

            it('should return true', function() {
                expect(this.result).toBe(true);
            });
        });

        describe('when the game has started', function() {
            beforeEach(function() {
                this.game.started = true;
                this.result = this.game.join('1', { username: 'foo' });
            });

            it('should not add the player', function() {
                expect(this.game.playersAndSpectators['foo']).toBeUndefined();
            });

            it('should return false', function() {
                expect(this.result).toBe(false);
            });
        });

        describe('when the game already has two players', function() {
            beforeEach(function() {
                this.game.join('1', { username: 'foo' });
                this.game.join('2', { username: 'bar' });
                this.result = this.game.join('3', { username: 'baz' });
            });

            it('should not add the player', function() {
                expect(this.game.playersAndSpectators['baz']).toBeUndefined();
            });

            it('should return false', function() {
                expect(this.result).toBe(false);
            });
        });
    });

    describe('watch()', function() {
        describe('when spectators are allowed', function() {
            beforeEach(function() {
                this.game.allowSpectators = true;
                this.result = this.game.watch('1', { username: 'foo' });
            });

            it('should add the spectator', function() {
                expect(this.game.playersAndSpectators['foo']).toBeDefined();
                expect(this.game.playersAndSpectators['foo'].id).toBe('1');
                expect(this.game.playersAndSpectators['foo'].constructor.name).toBe('Spectator');
            });

            it('should return true', function() {
                expect(this.result).toBe(true);
            });
        });

        describe('when spectators are forbidden', function() {
            beforeEach(function() {
                this.game.allowSpectators = false;
                this.result = this.game.watch('1', { username: 'foo' });
            });

            it('should not add the spectator', function() {
                expect(this.game.playersAndSpectators['foo']).toBeUndefined();
            });

            it('should return false', function() {
                expect(this.result).toBe(false);
            });
        });
    });

    describe('leave()', function() {
        beforeEach(function() {
            spyOn(this.game, 'saveGame');
        });

        describe('when the user is not part of the game', function() {
            it('should not crash', function() {
                expect(() => this.game.leave('nothere')).not.toThrow();
            });
        });

        describe('when the user is a player', function() {
            beforeEach(function() {
                this.game.join('1', { username: 'foo' });
            });

            describe('when the game has not started', function() {
                it('should delete the player', function() {
                    this.game.leave('foo');
                    expect(this.game.playersAndSpectators['foo']).toBeUndefined();
                });
            });

            describe('when the game has started', function() {
                beforeEach(function() {
                    this.game.started = true;
                });

                describe('and the game has not finished', function() {
                    beforeEach(function() {
                        this.game.finishedAt = undefined;
                        this.game.leave('foo');
                    });

                    it('should mark the player as left', function() {
                        this.game.leave('foo');
                        expect(this.game.playersAndSpectators['foo'].left).toBe(true);
                    });

                    it('should save the game', function() {
                        expect(this.game.saveGame).toHaveBeenCalled();
                    });

                    it('should set the finishedAt property', function() {
                        expect(this.game.finishedAt).toBeDefined();
                    });
                });

                describe('and the game has previously finished', function() {
                    beforeEach(function() {
                        this.game.finishedAt = new Date();
                        this.game.leave('foo');
                    });

                    it('should not save the game', function() {
                        expect(this.game.saveGame).not.toHaveBeenCalled();
                    });
                });
            });
        });

        describe('when the user is a spectator', function() {
            beforeEach(function() {
                this.game.watch('1', { username: 'foo' });
                this.game.leave('foo');
            });

            it('should delete the spectator', function() {
                expect(this.game.playersAndSpectators['foo']).toBeUndefined();
            });

            it('should not save the game', function() {
                expect(this.game.saveGame).not.toHaveBeenCalled();
            });
        });
    });

    describe('disconnect()', function() {
        describe('when the user is not part of the game', function() {
            it('should not crash', function() {
                expect(() => this.game.disconnect('nothere')).not.toThrow();
            });
        });

        describe('when the user is a player', function() {
            beforeEach(function() {
                this.game.join('1', { username: 'foo' });
            });

            it('should mark the player as disconnected', function() {
                this.game.disconnect('foo');
                expect(this.game.playersAndSpectators['foo'].disconnected).toBe(true);
            });
        });

        describe('when the user is a spectator', function() {
            beforeEach(function() {
                this.game.watch('1', { username: 'foo' });
                this.game.disconnect('foo');
            });

            it('should delete the spectator', function() {
                expect(this.game.playersAndSpectators['foo']).toBeUndefined();
            });
        });
    });

    describe('reconnect()', function() {
        beforeEach(function() {
            this.game.join('1', { username: 'foo' });
            this.game.disconnect('foo');
            this.game.reconnect('2', 'foo');
        });

        it('should not crash when the user is not part of the game', function() {
            expect(() => this.game.reconnect('nothere')).not.toThrow();
        });

        it('should set the new socket ID on the player', function() {
            expect(this.game.playersAndSpectators['foo'].id).toBe('2');
        });

        it('should mark the player as no longer disconnected', function() {
            expect(this.game.playersAndSpectators['foo'].disconnected).toBe(false);
        });
    });

    describe('isEmpty()', function() {
        describe('when there are no players', function() {
            it('should return true', function() {
                expect(this.game.isEmpty()).toBe(true);
            });
        });

        describe('when there are players and spectators', function() {
            beforeEach(function() {
                this.game.join('1', { username: 'foo' });
                this.game.join('2', { username: 'bar' });
                this.game.watch('3', { username: 'baz' });
            });

            it('should return false', function() {
                expect(this.game.isEmpty()).toBe(false);
            });

            it('should return false if there is at least one player', function () {
                this.game.disconnect('foo');
                this.game.leave('baz');
                expect(this.game.isEmpty()).toBe(false);
            });

            it('should return false if there is at least one spectator', function() {
                this.game.leave('foo');
                this.game.disconnect('bar');
                expect(this.game.isEmpty()).toBe(false);
            });

            it('should return true if everyone has left or disconnected', function() {
                this.game.leave('foo');
                this.game.leave('bar');
                this.game.leave('baz');
                expect(this.game.isEmpty()).toBe(true);
            });
        });
    });

    describe('hasActivePlayer()', function() {
        beforeEach(function() {
            this.game.join('1', { username: 'foo' });
        });

        it('should return falsy if the player is not in the game', function() {
            expect(this.game.hasActivePlayer('nothere')).toBeFalsy();
        });

        it('should return true if the player is active', function() {
            expect(this.game.hasActivePlayer('foo')).toBe(true);
        });

        it('should return true if the player is active but disconnected', function() {
            this.game.disconnect('foo');
            expect(this.game.hasActivePlayer('foo')).toBe(true);
        });

        it('should return falsy if the player has left', function() {
            this.game.leave('foo');
            expect(this.game.hasActivePlayer('foo')).toBeFalsy();
        });
    });
});
