describe('Keyfrog', function () {
    describe("Keyfrog's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['keyfrog']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should not forge a key if not enough amber', function () {
            this.player1.player.keys = { red: true, blue: false, yellow: false };
            this.player1.fightWith(this.keyfrog, this.troll);
            expect(this.keyfrog.location).toBe('discard');
            expect(this.player1).not.toHavePrompt('Which key would you like to forge?');
        });

        it('should forge a key after being destroyed', function () {
            this.player1.player.amber = 6;
            this.player1.player.keys = { red: true, blue: false, yellow: false };
            this.player1.fightWith(this.keyfrog, this.troll);

            expect(this.player1).toHavePrompt('Which key would you like to forge?');
            expect(this.player1).toHavePromptButton('Blue');
            expect(this.player1).toHavePromptButton('Yellow');
            expect(this.player1).not.toHavePromptButton('Red');
            this.player1.forgeKey('blue');

            expect(this.player1.player.getForgedKeys()).toBe(2);

            expect(this.keyfrog.location).toBe('discard');
        });

        it('should not forge a key if not enough amber, when destroyed by opponent', function () {
            this.player1.player.keys = { red: true, blue: false, yellow: false };
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.keyfrog);
            expect(this.keyfrog.location).toBe('discard');
            expect(this.player2).not.toHavePrompt('Which key would you like to forge?');
        });

        it("should choose opponent's key color", function () {
            this.player1.player.amber = 6;
            this.player1.player.keys = { red: true, blue: false, yellow: false };
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.keyfrog);

            expect(this.player1).not.toHavePrompt('Which key would you like to forge?');
            expect(this.player2).toHavePrompt('Which key would you like to forge?');
            expect(this.player2).toHavePromptButton('Blue');
            expect(this.player2).toHavePromptButton('Yellow');
            expect(this.player2).not.toHavePromptButton('Red');
            this.player2.forgeKey('blue');

            expect(this.player1.player.getForgedKeys()).toBe(2);
            expect(this.player2.player.getForgedKeys()).toBe(0);

            expect(this.keyfrog.location).toBe('discard');
        });
    });
});
