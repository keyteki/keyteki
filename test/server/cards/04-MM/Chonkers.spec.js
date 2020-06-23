describe('Chonkers', function () {
    describe("Chonkers' play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['questor-jarta'],
                    hand: ['thero-centurion', 'chonkers']
                },
                player2: {
                    amber: 3,
                    inPlay: ['groke', 'grovekeeper']
                }
            });
        });

        it('should have 1 power counter after play', function () {
            this.player1.playCreature(this.chonkers);
            expect(this.chonkers.tokens.power).toBe(1);
        });
    });

    describe("Chonkers' fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['questor-jarta', 'chonkers']
                },
                player2: {
                    amber: 3,
                    inPlay: ['groke', 'grovekeeper']
                }
            });
        });

        it('should double chonkers power counters when attacking', function () {
            this.chonkers.tokens.power = 3;
            this.player1.fightWith(this.chonkers, this.grovekeeper);
            expect(this.chonkers.tokens.power).toBe(6);
        });

        it('should double chonkers power counters when defending', function () {
            this.chonkers.tokens.power = 3;
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.grovekeeper, this.chonkers);
            expect(this.chonkers.tokens.power).toBe(6);
        });
    });
});
