describe('Arise!', function () {
    describe("Arise!'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['arise'],
                    discard: ['pit-demon', 'pitlord', 'ancient-bear']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'snufflegator', 'inka-the-spider']
                }
            });
        });

        it('should prompt to choose a house', function () {
            this.player1.play(this.arise);
            expect(this.player1).toHavePrompt('Arise!');
            expect(this.player1.currentButtons).toContain('brobnar');
            expect(this.player1.currentButtons).toContain('dis');
            expect(this.player1.currentButtons).toContain('logos');
            expect(this.player1.currentButtons).toContain('mars');
            expect(this.player1.currentButtons).toContain('sanctum');
            expect(this.player1.currentButtons).toContain('shadows');
            expect(this.player1.currentButtons).toContain('untamed');
        });

        it('should return dis creatures if the player chooses dis', function () {
            this.player1.play(this.arise);
            this.player1.clickPrompt('dis');
            expect(this.pitDemon.location).toBe('hand');
            expect(this.pitlord.location).toBe('hand');
            expect(this.ancientBear.location).toBe('discard');
        });

        it('should give the player a chain', function () {
            this.player1.play(this.arise);
            this.player1.clickPrompt('untamed');
            expect(this.pitDemon.location).toBe('discard');
            expect(this.pitlord.location).toBe('discard');
            expect(this.ancientBear.location).toBe('hand');
            expect(this.player1.player.chains).toBe(1);
            this.player1.endTurn();
            expect(this.player1.hand.length).toBe(5);
            expect(this.player1.player.chains).toBe(0);
        });
    });
});
