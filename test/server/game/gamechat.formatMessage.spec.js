/*global describe, it, beforeEach, expect*/
/* eslint camelcase: 0, no-invalid-this: 0 */

const GameChat = require('../../../server/game/gamechat.js');

describe('GameChat', function() {
    beforeEach(function() {
        this.args = [
            'foo',
            { bar: 'baz' }
        ];
        this.chat = new GameChat();
    });

    describe('formatMessage()', function() {
        describe('when there are no embedded args', function() {
            it('should return an array with just the format', function() {
                var message = this.chat.formatMessage('Hello world', this.args);

                expect(message).toEqual(['Hello world']);
            });
        });

        describe('when there are embedded args', function() {
            it('should split the message text', function() {
                var message = this.chat.formatMessage('Hello {0} world', this.args);
                expect(message.length).toEqual(3);
                expect(message[0]).toEqual('Hello ');
                expect(message[2]).toEqual(' world');
            });

            it('should replace the argument', function() {
                var message = this.chat.formatMessage('Hello {0} world', this.args);
                expect(message[1]).toEqual(this.args[0]);
            });

            it('should allow multiple and repeated arguments', function() {
                var message = this.chat.formatMessage('Hello {1} world {0} !!! {1}', this.args);
                expect(message[1]).toEqual(this.args[1]);
                expect(message[3]).toEqual(this.args[0]);
                expect(message[5]).toEqual(this.args[1]);
            });

            it('should handle argument indices beyond what was passed', function() {
                var message = this.chat.formatMessage('Hello {2} world', this.args);
                expect(message[1]).toEqual('');
            });

            describe('when the arg is an array', function() {
                describe('and it is an empty array', function() {
                    beforeEach(function() {
                        this.args = [
                            'foo',
                            []
                        ];
                    });

                    it('should return an empty string fragment', function() {
                        var message = this.chat.formatMessage('Hello {0} world {1}', this.args);
                        expect(message[3]).toEqual('');
                    });
                });

                describe('and it is a single entry array', function() {
                    beforeEach(function() {
                        this.args = [
                            'foo',
                            ['bar']
                        ];
                    });

                    it('should return a sub-message with no separators', function() {
                        var message = this.chat.formatMessage('Hello {0} world {1}', this.args);
                        expect(message[3]).toEqual({ message: ['', 'bar', ''] });
                    });
                });

                describe('and it is a pair entry array', function() {
                    beforeEach(function() {
                        this.args = [
                            'foo',
                            ['bar', 'baz']
                        ];
                    });

                    it('should return a sub-message with no commas', function() {
                        var message = this.chat.formatMessage('Hello {0} world {1}', this.args);
                        expect(message[3]).toEqual({ message: ['', 'bar', ' and ', 'baz', ''] });
                    });
                });

                describe('and it is a multiple entry array', function() {
                    beforeEach(function() {
                        this.args = [
                            'foo',
                            ['bar', 'baz', 'ball']
                        ];
                    });

                    it('should return a sub-message with separators', function() {
                        var message = this.chat.formatMessage('Hello {0} world {1}', this.args);
                        expect(message[3]).toEqual({ message: ['', 'bar', ', ', 'baz', ', and ', 'ball', ''] });
                    });
                });
            });
        });
    });
});
