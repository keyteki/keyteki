describe('Inspiring Oration', function () {
    describe("Inspiring Oration's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    token: 'grumpus',
                    hand: ['inspiring-oration'],
                    inPlay: ['questor-jarta']
                },
                player2: {
                    inPlay: ['umbra']
                }
            });
        });

        it('exalts a friendly creature and makes a token creature', function () {
            this.player1.play(this.inspiringOration);
            expect(this.player1).toBeAbleToSelect(this.questorJarta);
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            this.player1.clickCard(this.questorJarta);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player1.player.creaturesInPlay[1].name).toBe('Grumpus');
            this.expectReadyToTakeAction(this.player1);
        });

        it('makes a token creature for each amber', function () {
            this.player1.reap(this.questorJarta);
            this.player1.clickCard(this.questorJarta);
            this.player1.play(this.inspiringOration);
            this.player1.clickCard(this.questorJarta);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player1.player.creaturesInPlay[1].name).toBe('Grumpus');
            expect(this.player1.player.creaturesInPlay[2].name).toBe('Grumpus');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
