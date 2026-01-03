describe('Dark Heart of the Forest', function () {
    describe("Dark Heart of the Forest's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'untamed',
                    hand: ['fertility-chant', 'poke', 'poke', 'poke', 'poke', 'poke', 'poke'],
                    inPlay: ['dark-heart-of-the-forest'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 7,
                    hand: ['key-charge'],
                    discard: new Array(10).fill('poke') // already haunted
                }
            });
        });

        it('skips forge a key step for haunted opponent', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.expectReadyToTakeAction(this.player2);
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
        });

        it('skips forge a key step for haunted controller', function () {
            this.player1.play(this.fertilityChant); // become haunted
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.expectReadyToTakeAction(this.player1);
            expect(this.player1.player.keys.red).toBe(false);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
        });

        it('allows non-haunted controller to forge', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.forgeKey('red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
        });

        it('allows haunted opponent to forge with a key cheat', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.keyCharge);
            this.player2.clickPrompt('Yes');
            this.player2.forgeKey('red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
        });
    });
});
