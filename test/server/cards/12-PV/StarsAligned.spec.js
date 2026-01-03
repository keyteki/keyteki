describe('Stars Aligned', function () {
    describe("Stars Aligned's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    prophecies: [
                        'stars-aligned',
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans'
                    ],
                    hand: ['ember-imp', 'parasitic-arachnoid'],
                    inPlay: ['charette']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll']
                }
            });
        });

        it('should fulfill when both players have the same number of creatures at the start of opponent turn', function () {
            this.player1.activateProphecy(this.starsAligned, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickCard(this.troll);
            expect(this.player2.amber).toBe(2);
            expect(this.troll.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            this.player2.clickPrompt('brobnar');
        });

        it('should not fulfill when players have different number of creatures', function () {
            this.player1.activateProphecy(this.starsAligned, this.parasiticArachnoid);
            this.player1.playCreature(this.emberImp);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.parasiticArachnoid.location).toBe('under');
            this.expectReadyToTakeAction(this.player2);
        });

        it('should fulfill when both players have the same number of creatures at the start of player turn', function () {
            this.player1.activateProphecy(this.starsAligned, this.parasiticArachnoid);
            this.player1.playCreature(this.emberImp);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.emberImp);
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            expect(this.parasiticArachnoid.location).toBe('under');
        });
    });
});
