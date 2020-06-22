describe('Defense Initiative', function () {
    describe("Defense Initiative's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['legatus-raptor', 'senator-shrix', 'draco-praeco'],
                    hand: ['defense-initiative']
                },
                player2: {
                    amber: 3,
                    inPlay: ['gub']
                }
            });
        });

        it('should be able to ward a creature', function () {
            this.player1.play(this.defenseInitiative);
            expect(this.player1).toBeAbleToSelect(this.legatusRaptor);
            expect(this.player1).toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).toBeAbleToSelect(this.dracoPraeco);
            expect(this.player1).toBeAbleToSelect(this.gub);
            this.player1.clickCard(this.senatorShrix);
            expect(this.senatorShrix.tokens.ward).toBe(1);
        });

        it('should be able to decline exalting the selected creature', function () {
            this.player1.play(this.defenseInitiative);
            this.player1.clickCard(this.senatorShrix);
            expect(this.senatorShrix.tokens.ward).toBe(1);
            expect(this.player1).toHavePrompt('Do you wish to exalt this creature?');
            expect(this.player1).toHavePromptButton('Yes');
            expect(this.player1).toHavePromptButton('No');
            this.player1.clickPrompt('No');
            expect(this.senatorShrix.amber).toBe(0);
            expect(this.legatusRaptor.tokens.ward).toBeUndefined();
            expect(this.dracoPraeco.tokens.ward).toBeUndefined();
        });

        it('should be able to exalt the selected creature', function () {
            this.player1.play(this.defenseInitiative);
            this.player1.clickCard(this.senatorShrix);
            expect(this.senatorShrix.tokens.ward).toBe(1);
            this.player1.clickPrompt('Yes');
            expect(this.senatorShrix.amber).toBe(1);
            expect(this.legatusRaptor.tokens.ward).toBe(1);
            expect(this.dracoPraeco.tokens.ward).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be able to ward exalt an enemy creature', function () {
            this.player1.play(this.defenseInitiative);
            this.player1.clickCard(this.gub);
            expect(this.gub.tokens.ward).toBe(1);
            this.player1.clickPrompt('Yes');
            expect(this.gub.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
