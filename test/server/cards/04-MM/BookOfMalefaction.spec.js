describe('Book of Malefaction', function () {
    describe("Book of Malefaction's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'logos',
                    inPlay: ['book-of-malefaction', 'font-of-the-eye', 'dysania']
                },
                player2: {
                    amber: 3,
                    inPlay: ['silvertooth'],
                    hand: ['urchin', 'swindle', 'tentacus']
                }
            });
        });

        it('should not do anything when used with no counters', function () {
            this.player1.clickCard(this.bookOfMalefaction);
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should add warrant counters on steal, and remove one on use', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.swindle);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(5);
            this.player1.clickPrompt('sanctum');

            expect(this.bookOfMalefaction.tokens.warrant).toBe(2);

            this.player1.clickCard(this.bookOfMalefaction);
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.dysania);
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            this.player1.clickCard(this.silvertooth);
            expect(this.silvertooth.location).toBe('purged');

            expect(this.bookOfMalefaction.tokens.warrant).toBe(1);
        });

        it('should not add warrant counters on giving amber', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.tentacus);
            this.player2.endTurn();
            this.player1.clickPrompt('sanctum');

            this.player1.clickCard(this.fontOfTheEye);
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
            expect(this.bookOfMalefaction.tokens.warrant).toBeUndefined();
        });
    });
});
