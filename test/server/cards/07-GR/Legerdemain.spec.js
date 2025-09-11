describe('Legerdemain', function () {
    describe("Legerdemain's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['legerdemain', 'exchange-program'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });

            this.flaxia.tokens.damage = 1;
            this.krump.tokens.damage = 1;
        });

        it('should return a friendly damaged creture to hand to gain one', function () {
            this.player1.play(this.legerdemain);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.flaxia);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.flaxia.location).toBe('hand');
            expect(this.player1.player.hand).toContain(this.flaxia);
            expect(this.gub.location).toBe('play area');
            expect(this.krump.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should return an enemy damaged creture to hand to gain one', function () {
            this.player1.play(this.legerdemain);
            this.player1.clickCard(this.krump);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.krump.location).toBe('hand');
            expect(this.player2.player.hand).toContain(this.krump);
            expect(this.gub.location).toBe('play area');
            expect(this.flaxia.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should work on swapped creatures', function () {
            this.player1.play(this.exchangeProgram);
            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.krump);
            this.player1.play(this.legerdemain);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.flaxia);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            expect(this.flaxia.location).toBe('hand');
            expect(this.player1.player.hand).toContain(this.flaxia);
            expect(this.gub.location).toBe('play area');
            expect(this.krump.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not grant amber for warded creatures', function () {
            this.krump.tokens.ward = 1;
            this.player1.play(this.legerdemain);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.flaxia.location).toBe('play area');
            expect(this.gub.location).toBe('play area');
            expect(this.krump.location).toBe('play area');
            expect(this.krump.tokens.ward).toBe(undefined);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
