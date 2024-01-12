describe('Raider of the Peaks', function () {
    describe("Raider of the Peaks's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['groke', 'raider-of-the-peaks'],
                    discard: ['press-gang']
                },
                player2: {
                    inPlay: ['cpo-zytar', 'flaxia', 'troll'],
                    discard: ['full-moon']
                }
            });
            this.player1.chains = 36;
            this.player2.chains = 36;
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player1.moveCard(this.pressGang, 'deck');
            this.player1.moveCard(this.fullMoon, 'deck');
        });

        it('makes opponent with the highest power creature discard the top of their deck', function () {
            this.player2.endTurn();
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.groke);
            expect(this.player1).not.toBeAbleToSelect(this.raiderOfThePeaks);
            expect(this.player1).not.toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.troll);
            expect(this.pressGang.location).toBe('deck');
            expect(this.fullMoon.location).toBe('discard');
            this.player1.clickPrompt('brobnar');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('makes self with the highest power creature discard the top of their deck', function () {
            this.player2.moveCard(this.troll, 'discard');
            this.player2.endTurn();
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.groke);
            expect(this.player1).not.toBeAbleToSelect(this.raiderOfThePeaks);
            expect(this.player1).not.toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.groke);
            expect(this.pressGang.location).toBe('discard');
            expect(this.fullMoon.location).toBe('deck');
            this.player1.clickPrompt('brobnar');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('allows a choice between highest power on a tie', function () {
            this.player2.moveCard(this.troll, 'discard');
            this.player1.moveCard(this.groke, 'discard');
            this.player2.endTurn();
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.groke);
            expect(this.player1).toBeAbleToSelect(this.raiderOfThePeaks);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.flaxia);
            expect(this.pressGang.location).toBe('deck');
            expect(this.fullMoon.location).toBe('discard');
            this.player1.clickPrompt('brobnar');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
