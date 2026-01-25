describe('Katerina the Summoner', function () {
    describe("Katerina the Summoner's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    token: 'disciple',
                    amber: 2,
                    inPlay: ['armsmaster-molina'],
                    hand: ['katerina-the-summoner']
                },
                player2: {
                    amber: 7,
                    inPlay: ['gub', 'flaxia']
                }
            });
        });

        it('should capture one amber on play or reap', function () {
            this.player1.play(this.katerinaTheSummoner);
            expect(this.katerinaTheSummoner.amber).toBe(1);
            expect(this.player2.amber).toBe(6);
            this.katerinaTheSummoner.ready();
            this.player1.reap(this.katerinaTheSummoner);
            expect(this.katerinaTheSummoner.amber).toBe(2);
            expect(this.player2.amber).toBe(5);
            this.player1.endTurn();
        });

        it('should make a token for each amber on it when destroyed', function () {
            this.player1.play(this.katerinaTheSummoner);
            this.katerinaTheSummoner.ready();
            this.player1.reap(this.katerinaTheSummoner);
            this.katerinaTheSummoner.ready();
            this.player1.fightWith(this.katerinaTheSummoner, this.flaxia);
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player1.player.creaturesInPlay[0].name).toBe('Disciple');
            expect(this.player1.player.creaturesInPlay[1].name).toBe('Disciple');
            this.player1.endTurn();
        });
    });
});
