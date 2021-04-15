describe('Scyphos', function () {
    describe("Scyphos's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['scyphos']
                },
                player2: {
                    inPlay: ['narp'],
                    discard: []
                }
            });
        });

        it('should not archive itself when it dies if the tide is low', function () {
            this.player1.fightWith(this.scyphos, this.narp);
            expect(this.scyphos.location).toBe('discard');
        });

        it('should archive itself when it dies if the tide is high', function () {
            this.player1.raiseTide();
            this.player1.fightWith(this.scyphos, this.narp);
            expect(this.scyphos.location).toBe('archives');
        });
    });
});
