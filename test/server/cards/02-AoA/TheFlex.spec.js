describe('The Flex', function () {
    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll', 'cowfyne', 'bingle-bangbang'],
                    hand: ['the-flex']
                },
                player2: {
                    inPlay: ['nexus', 'troll', 'dodger']
                }
            });

            this.bingleBangbang.exhausted = true;
            this.player1.play(this.theFlex);
        });

        describe('and a non exausted even powered creature is selected', function () {
            beforeEach(function () {
                this.player1.clickCard(this.troll);
            });

            it('should gain exhaust the target', function () {
                expect(this.troll.exhausted).toBe(true);
            });

            it('should give amber equal to half the power', function () {
                expect(this.player1.amber).toBe(4);
            });
        });

        describe('and a non exausted odd powered creature is selected', function () {
            beforeEach(function () {
                this.player1.clickCard(this.cowfyne);
            });

            it('should gain exhaust the target', function () {
                expect(this.cowfyne.exhausted).toBe(true);
            });

            it('should give amber equal to half the power rounded down', function () {
                expect(this.player1.amber).toBe(2);
            });
        });

        it('should not be able to select an exausted creature', function () {
            expect(this.player1).not.toBeAbleToSelect(this.bingleBangbang);
        });
    });
});
