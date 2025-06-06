describe('Crystalline Harvest', function () {
    describe("Crystalline Harvest's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'untamed',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['crystalline-harvest', 'dew-faerie', 'lost-in-the-woods']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump'],
                    hand: ['follow-the-leader', 'troll']
                }
            });
        });

        it('should gain 1 amber when playing an action card', function () {
            this.player1.play(this.crystallineHarvest);
            expect(this.player1.amber).toBe(3);
            this.player1.play(this.lostInTheWoods);
            this.player1.clickPrompt(this.lostInTheWoods.name);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(5);
            this.player1.play(this.dewFaerie);
            expect(this.player1.amber).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should lose 1 amber when playing an action card after fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.crystallineHarvest);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            this.player2.play(this.followTheLeader);
            this.player2.clickPrompt(this.followTheLeader.name);
            expect(this.player2.amber).toBe(4);
            this.player2.play(this.troll);
            expect(this.player2.amber).toBe(4);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
