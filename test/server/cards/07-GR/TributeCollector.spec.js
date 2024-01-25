describe('Tribute Collector', function () {
    describe("Tribute Collector's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['tribute-collector'],
                    inPlay: ['echofly', 'flaxia']
                },
                player2: {
                    amber: 3,
                    inPlay: ['thing-from-the-deep', 'dust-pixie']
                }
            });
        });

        it('captures 1 A on a friendly creature on play', function () {
            this.player1.playCreature(this.tributeCollector);
            expect(this.player1).toBeAbleToSelect(this.tributeCollector);
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.thingFromTheDeep);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.echofly);
            expect(this.echofly.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('captures 1 A on a friendly creature on fight', function () {
            this.player1.playCreature(this.tributeCollector);
            this.player1.clickCard(this.echofly);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('geistoid');
            this.player1.fightWith(this.tributeCollector, this.dustPixie);
            this.player1.clickCard(this.tributeCollector);
            expect(this.tributeCollector.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
