describe('Freebooter Faye Evil Twin', function () {
    describe("Freebooter Faye Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'shadows',
                    inPlay: ['lamindra'],
                    hand: ['freebooter-faye-evil-twin']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll']
                }
            });
        });

        describe('when played', function () {
            beforeEach(function () {
                this.player1.play(this.freebooterFayeEvilTwin);
            });

            it('should raise the tide', function () {
                expect(this.player1.isTideHigh()).toBe(true);
                expect(this.player1.chains).toBe(0);
            });

            describe('while the tide is high and before fight', function () {
                beforeEach(function () {
                    this.freebooterFayeEvilTwin.ready();
                    this.player1.fightWith(this.freebooterFayeEvilTwin, this.troll);
                });

                it('should steal 1A', function () {
                    expect(this.freebooterFayeEvilTwin.location).toBe('discard');
                    expect(this.player1.amber).toBe(3);
                    expect(this.player2.amber).toBe(1);
                });
            });

            describe('while the tide is not high and before fight', function () {
                beforeEach(function () {
                    this.player1.lowerTide();
                    this.freebooterFayeEvilTwin.ready();
                    this.player1.fightWith(this.freebooterFayeEvilTwin, this.troll);
                });

                it('should not steal 1A', function () {
                    expect(this.freebooterFayeEvilTwin.location).toBe('discard');
                    expect(this.player1.amber).toBe(2);
                    expect(this.player2.amber).toBe(2);
                });
            });
        });
    });
});
