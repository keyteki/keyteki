describe('Stratowise', function () {
    describe("Stratowise's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['a-strong-feeling', 'helper-bot'],
                    inPlay: ['stratowise'],
                    discard: new Array(8).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra']
                }
            });
            this.player1.chains = 36;
        });

        it('allows a card discard on reap', function () {
            this.player1.reap(this.stratowise);
            expect(this.player1).toBeAbleToSelect(this.aStrongFeeling);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).not.toBeAbleToSelect(this.stratowise);
            this.player1.clickCard(this.helperBot);
            expect(this.helperBot.location).toBe('discard');
            expect(this.stratowise.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('allows a card discard on fight', function () {
            this.player1.fightWith(this.stratowise, this.lamindra);
            this.player1.clickCard(this.helperBot);
            expect(this.helperBot.location).toBe('discard');
            expect(this.stratowise.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('captures if haunted', function () {
            this.player1.play(this.aStrongFeeling);
            this.player1.reap(this.stratowise);
            this.player1.clickCard(this.helperBot);
            expect(this.helperBot.location).toBe('discard');
            expect(this.stratowise.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
