describe('Pestering Blow', function () {
    describe("Pestering Blow's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 1,
                    inPlay: ['flaxia', 'troll'],
                    hand: ['pestering-blow']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra', 'krump']
                }
            });

            this.flaxia.tokens['amber'] = 2;
            this.krump.tokens['amber'] = 1;
        });

        it('Deal 1 damage and enrage a friendly creature', function () {
            this.player1.play(this.pesteringBlow);

            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);

            this.player1.clickCard(this.flaxia);

            expect(this.flaxia.tokens.enrage).toBe(1);
            expect(this.flaxia.tokens.damage).toBe(1);
        });

        it('Deal 1 damage and enrage an enemy creature', function () {
            this.player1.play(this.pesteringBlow);

            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.krump);

            this.player1.clickCard(this.krump);

            expect(this.krump.tokens.enrage).toBe(1);
            expect(this.krump.tokens.damage).toBe(1);
        });
    });
});
