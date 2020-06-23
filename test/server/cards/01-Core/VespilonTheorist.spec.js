describe('Vespilon Theorist', function () {
    describe("Vespilon Theorist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['vespilon-theorist'],
                    discard: ['virtuous-works']
                },
                player2: {
                    inPlay: []
                }
            });
            this.player1.moveCard(this.virtuousWorks, 'deck');
        });

        it('should discard the card if the wrong house is chosen', function () {
            this.player1.reap(this.vespilonTheorist);
            expect(this.player1).toHavePrompt('Vespilon Theorist');
            expect(this.player1.currentButtons).toContain('brobnar');
            expect(this.player1.currentButtons).toContain('dis');
            expect(this.player1.currentButtons).toContain('logos');
            expect(this.player1.currentButtons).toContain('mars');
            expect(this.player1.currentButtons).toContain('sanctum');
            expect(this.player1.currentButtons).toContain('shadows');
            expect(this.player1.currentButtons).toContain('untamed');
            this.player1.clickPrompt('dis');
            expect(this.player1.amber).toBe(1);
            expect(this.virtuousWorks.location).toBe('discard');
        });

        it('should archive the card and gain an amber if the right house is chosen', function () {
            this.player1.reap(this.vespilonTheorist);
            this.player1.clickPrompt('sanctum');
            expect(this.player1.amber).toBe(2);
            expect(this.virtuousWorks.location).toBe('archives');
        });

        it('should have DEF effect on GHI', function () {});
    });
});
