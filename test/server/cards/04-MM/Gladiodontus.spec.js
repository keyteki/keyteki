describe('Gladiodontus', function () {
    describe("Gladiodontus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['rocket-boots'],
                    inPlay: ['gladiodontus']
                },
                player2: {
                    amber: 2,
                    inPlay: ['snufflegator']
                }
            });
        });

        describe('when reaping for the first time', function () {
            beforeEach(function () {
                this.player1.reap(this.gladiodontus);
            });

            it('should ready the creature', function () {
                expect(this.gladiodontus.exhausted).toBe(false);
            });

            it('should enrage the creature', function () {
                expect(this.gladiodontus.enraged).toBe(true);
            });

            it('should not allow another reap', function () {
                this.player1.clickCard(this.gladiodontus);

                expect(this.player1).not.toHavePromptButton('Reap with this creature');
            });
        });
    });
});
