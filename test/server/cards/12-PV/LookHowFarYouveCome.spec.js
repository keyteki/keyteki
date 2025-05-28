describe("Look How Far You've Come", function () {
    describe("Look How Far You've Come's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    prophecies: [
                        'look-how-far-you-ve-come',
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans'
                    ],
                    hand: ['parasitic-arachnoid', 'ember-imp']
                },
                player2: {
                    amber: 4,
                    hand: ['troll', 'gauntlet-of-command'],
                    inPlay: []
                }
            });
        });

        it('should fulfill when opponent plays a creature during their turn', function () {
            this.player1.activateProphecy(this.lookHowFarYouVeCome, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.troll);
            this.player2.clickCard(this.troll);
            expect(this.player2.amber).toBe(2);
            expect(this.troll.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not fulfill when opponent plays a non-creature card', function () {
            this.player1.activateProphecy(this.lookHowFarYouVeCome, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.gauntletOfCommand);
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not fulfill when you play a creature during your turn', function () {
            this.player1.activateProphecy(this.lookHowFarYouVeCome, this.parasiticArachnoid);
            this.player1.play(this.emberImp);
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
