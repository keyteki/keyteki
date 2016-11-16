/*global describe, it, beforeEach, expect*/

const Game = require('../../../server/game/game.js');

describe('the Game', () => {
    var game = {};
    var args = [
        'foo',
        { bar: 'baz' }
    ];

    beforeEach(() => {
        game = new Game('1', 'Test Game');
    });

    describe('formatMessage function', () => {
        describe('when there are no embedded args', () => {
            it('should return an array with just the format', () => {
                var message = game.formatMessage('Hello world', args);

                expect(message).toEqual(['Hello world']);
            });
        });

        describe('when there are embedded args', () => {
            it('should split the message text', () => {
                var message = game.formatMessage('Hello {0} world', args);
                expect(message.length).toEqual(3);
                expect(message[0]).toEqual('Hello ');
                expect(message[2]).toEqual(' world');
            });

            it('should replace the argument', () => {
                var message = game.formatMessage('Hello {0} world', args);
                expect(message[1]).toEqual(args[0]);
            });

            it('should allow multiple and repeated arguments', () => {
                var message = game.formatMessage('Hello {1} world {0} !!! {1}', args);
                expect(message[1]).toEqual(args[1]);
                expect(message[3]).toEqual(args[0]);
                expect(message[5]).toEqual(args[1]);
            });

            it('should handle argument indices beyond what was passed', () => {
                var message = game.formatMessage('Hello {2} world', args);
                expect(message[1]).toEqual('');
            });
        });
    });
});
