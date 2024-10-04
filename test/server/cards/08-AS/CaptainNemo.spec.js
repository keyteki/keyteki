describe('Captain Nemo', function () {
    describe("Captain Nemo's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['captain-nemo', 'seismo-entangler', 'helper-bot']
                },
                player2: {
                    inPlay: ['dust-pixie', 'ritual-of-balance', 'lamindra']
                }
            });
        });

        it('should destroy an artifact and a creature simultaneously on fight', function () {
            this.player1.fightWith(this.captainNemo, this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.seismoEntangler);
            expect(this.player1).toBeAbleToSelect(this.ritualOfBalance);
            expect(this.player1).not.toBeAbleToSelect(this.captainNemo);
            expect(this.player1).not.toBeAbleToSelect(this.helperBot);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.ritualOfBalance);
            expect(this.ritualOfBalance.location).toBe('play area');
            expect(this.player1).not.toBeAbleToSelect(this.seismoEntangler);
            expect(this.player1).not.toBeAbleToSelect(this.ritualOfBalance);
            expect(this.player1).toBeAbleToSelect(this.captainNemo);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.dustPixie);
            expect(this.ritualOfBalance.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should destroy a creature on fight even if no artifacts', function () {
            this.player1.moveCard(this.seismoEntangler, 'discard');
            this.player2.moveCard(this.ritualOfBalance, 'discard');
            this.player1.fightWith(this.captainNemo, this.lamindra);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
