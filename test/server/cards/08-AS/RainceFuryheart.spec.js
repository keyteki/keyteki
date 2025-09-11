describe('Raince Furyheart', function () {
    describe("Raince Furyheart's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['raince-furyheart']
                },
                player2: {
                    inPlay: ['flaxia', 'dust-pixie', 'briar-grubbling']
                }
            });
        });

        it('should exalt the creature it fights', function () {
            this.player1.fightWith(this.rainceFuryheart, this.flaxia);
            expect(this.flaxia.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should exalt the creature it fights if the creature dies', function () {
            this.player1.fightWith(this.rainceFuryheart, this.dustPixie);
            expect(this.player1.amber).toBe(2);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should exalt the creature it fights even if it dies', function () {
            this.player1.fightWith(this.rainceFuryheart, this.briarGrubbling);
            this.player1.clickCard(this.rainceFuryheart);
            expect(this.briarGrubbling.amber).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.rainceFuryheart.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
