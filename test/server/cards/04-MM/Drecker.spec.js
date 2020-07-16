describe('Drecker', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'dis',
                inPlay: ['snarette', 'drecker', 'umbra'],
                hand: ['ortannu-s-binding']
            },
            player2: {
                amber: 3,
                inPlay: ['troll', 'bad-penny']
            }
        });
    });

    describe("when drecker's neighbor is damaged during a fight", function () {
        beforeEach(function () {
            this.player1.fightWith(this.snarette, this.badPenny);
            this.player1.clickCard(this.badPenny);
        });

        it('should do that damage to drecker too', function () {
            expect(this.snarette.tokens.damage).toBe(1);
            expect(this.drecker.tokens.damage).toBe(1);
        });
    });

    describe("when drecker's neighbor is damaged outside of a fight", function () {
        beforeEach(function () {
            this.player1.play(this.ortannuSBinding);
            this.player1.clickCard(this.snarette);
        });

        it('should not do that damage to drecker too', function () {
            expect(this.snarette.tokens.damage).toBe(2);
            expect(this.drecker.tokens.damage).toBe(undefined);
        });
    });

    describe('when drecker reaps', function () {
        beforeEach(function () {
            this.player1.reap(this.drecker);
        });

        it('should steal 1', function () {
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
        });
    });
});
