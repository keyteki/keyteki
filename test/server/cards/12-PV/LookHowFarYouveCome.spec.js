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
                    hand: ['troll', 'gauntlet-of-command', 'chota-hazri'],
                    inPlay: []
                }
            });
        });

        it('should fulfill when opponent plays a creature during their turn', function () {
            this.player1.activateProphecy(this.lookHowFarYouVeCome, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.playCreature(this.troll);
            this.player2.clickCard(this.troll);
            expect(this.player2.amber).toBe(2);
            expect(this.troll.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            this.expectReadyToTakeAction(this.player2);
        });

        it('should not fulfill when opponent plays a non-creature card', function () {
            this.player1.activateProphecy(this.lookHowFarYouVeCome, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.gauntletOfCommand);
            expect(this.parasiticArachnoid.location).toBe('under');
            this.expectReadyToTakeAction(this.player2);
        });

        it('should not fulfill when you play a creature during your turn', function () {
            this.player1.activateProphecy(this.lookHowFarYouVeCome, this.parasiticArachnoid);
            this.player1.playCreature(this.emberImp);
            expect(this.parasiticArachnoid.location).toBe('under');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should allow active player to choose order of play effect', function () {
            this.player1.activateProphecy(this.lookHowFarYouVeCome, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.amber = 8;
            this.player2.clickPrompt('untamed');
            this.player2.playCreature(this.chotaHazri);
            expect(this.player2).toHavePromptCardButton(this.chotaHazri);
            expect(this.player2).toHavePromptCardButton(this.lookHowFarYouVeCome);
            this.player2.clickPrompt(this.chotaHazri.name);
            this.player2.clickPrompt('Yes');
            this.player2.forgeKey('red');
            this.player2.clickCard(this.chotaHazri);
            expect(this.player2.amber).toBe(0);
            expect(this.chotaHazri.amber).toBe(1);
            expect(this.parasiticArachnoid.location).toBe('discard');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
