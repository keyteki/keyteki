describe('Ghosthawk', function () {
    describe("Ghostform's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['troll', 'dew-faerie'],
                    hand: ['ghosthawk']
                },
                player2: {
                    inPlay: ['snufflegator', 'inka-the-spider']
                }
            });

            this.troll.tokens.damage = 4;

            this.player1.play(this.ghosthawk, true, true);
            this.player1.clickCard(this.dewFaerie);
        });

        it('should prompt to reap with both cards', function () {
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.dewFaerie);
        });

        describe('when clicking the left side', function () {
            beforeEach(function () {
                this.player1.clickCard(this.troll);
            });

            it('should reap with the card', function () {
                expect(this.player1.amber).toBe(1);
            });

            it('should trigger the reap effect', function () {
                expect(this.troll.tokens.damage).toBe(1);
            });
        });

        describe('when clicking the right side', function () {
            beforeEach(function () {
                this.player1.clickCard(this.dewFaerie);
            });

            it('shoudl trigger the reap effect and reap', function () {
                expect(this.player1.amber).toBe(2);
            });
        });
    });
});
