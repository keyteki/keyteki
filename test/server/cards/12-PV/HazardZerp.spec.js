describe('Hazard Zerp', function () {
    describe("Hazard Zerp's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['hazard-zerp', 'flaxia'],
                    inPlay: ['helper-bot']
                },
                player2: {
                    amber: 3,
                    inPlay: ['krump', 'troll']
                }
            });
        });

        it('should deal 3 damage to a creature when played', function () {
            this.player1.playCreature(this.hazardZerp);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.hazardZerp);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(3);
            expect(this.player1.hand.length).toBe(1); // Only the card from start
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should draw a card if the damaged creature is destroyed', function () {
            this.player1.play(this.hazardZerp);
            this.player1.clickCard(this.helperBot);
            expect(this.helperBot.location).toBe('discard');
            expect(this.player1.hand.length).toBe(2); // 1 from start + 1 from draw
        });

        it('should discard a card and deal 3 damage when scrapped', function () {
            this.player1.scrap(this.hazardZerp);
            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(3);
            expect(this.flaxia.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should fire scrap even when no card is discarded', function () {
            this.player1.moveCard(this.flaxia, 'discard');
            this.player1.scrap(this.hazardZerp);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
