describe('Jackie Tar', function () {
    describe('Jackie Tar', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'shadows',
                    inPlay: ['jackie-tar']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll']
                }
            });
        });

        describe('when tide is neutral', function () {
            it('deal 1D to a creature', function () {
                this.player1.reap(this.jackieTar);
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.jackieTar);
                this.player1.clickCard(this.troll);
                expect(this.troll.damage).toBe(1);
            });
        });

        describe('when tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('deal 1D to a creature', function () {
                this.player1.reap(this.jackieTar);
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.jackieTar);
                this.player1.clickCard(this.troll);
                expect(this.troll.damage).toBe(1);
            });
        });

        describe('when tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('deal 6D to a creature', function () {
                this.player1.reap(this.jackieTar);
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.jackieTar);
                this.player1.clickCard(this.troll);
                expect(this.troll.damage).toBe(6);
            });
        });
    });
});
