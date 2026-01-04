describe('Laurel Wreath', function () {
    describe("Laurel Wreath's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['laurel-wreath', 'spoils-of-battle'],
                    inPlay: ['charette']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should exalt the creature when played', function () {
            this.player1.playUpgrade(this.laurelWreath, this.charette);
            expect(this.charette.tokens.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should give +1 power for each amber on the creature', function () {
            this.player1.playUpgrade(this.laurelWreath, this.charette);
            expect(this.charette.power).toBe(5);
        });

        it('should not affect other creatures', function () {
            this.player1.playUpgrade(this.laurelWreath, this.charette);
            this.player1.play(this.spoilsOfBattle);
            this.player1.clickCard(this.charette);
            expect(this.charette.power).toBe(7);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
