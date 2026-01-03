describe('Aember Storm', function () {
    describe("Aember Storm's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'untamed',
                    hand: ['æmber-storm'],
                    inPlay: ['dust-pixie']
                },
                player2: {
                    inPlay: ['troll', 'umbra']
                }
            });
            this.player1.chains = 36;
        });

        it('allocates damage to enemy creatures', function () {
            this.player1.play(this.æmberStorm);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.umbra);
            this.player1.clickCard(this.umbra);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            this.expectReadyToTakeAction(this.player1);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.umbra.location).toBe('discard');
        });

        it('can over-allocate damage to enemy creatures', function () {
            this.player1.play(this.æmberStorm);
            this.player1.clickCard(this.umbra);
            this.player1.clickCard(this.umbra);
            this.player1.clickCard(this.umbra);
            this.player1.clickCard(this.umbra);
            this.player1.clickCard(this.umbra);
            this.expectReadyToTakeAction(this.player1);
            expect(this.troll.tokens.damage).toBe(undefined);
            expect(this.umbra.location).toBe('discard');
        });
    });
});
