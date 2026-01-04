describe('Heads, I Win', function () {
    describe("Heads, I Win's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    prophecies: [
                        'heads-i-win',
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans'
                    ],
                    hand: ['ancient-bear', 'parasitic-arachnoid'],
                    inPlay: ['mushroom-man']
                },
                player2: {
                    amber: 5,
                    hand: ['troll', 'dust-pixie', 'spoo-key-charge'],
                    inPlay: ['umbra', 'haunting-witch']
                }
            });
        });

        it('should fulfill when opponent plays a creature adjacent to a creature of the same house', function () {
            this.player1.activateProphecy(this.headsIWin, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('untamed');
            this.player2.playCreature(this.dustPixie);
            expect(this.player2).toBeAbleToSelect(this.dustPixie);
            expect(this.player2).toBeAbleToSelect(this.hauntingWitch);
            expect(this.player2).toBeAbleToSelect(this.umbra);
            expect(this.player2).not.toBeAbleToSelect(this.mushroomMan);
            this.player2.clickCard(this.dustPixie);
            expect(this.dustPixie.amber).toBe(2);
            expect(this.player2.amber).toBe(5);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not fulfill when opponent plays a creature not adjacent to a creature of the same house', function () {
            this.player1.activateProphecy(this.headsIWin, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('brobnar');
            this.player2.playCreature(this.troll);
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not fulfill when you play a creature adjacent to a creature of the same house', function () {
            this.player1.activateProphecy(this.headsIWin, this.parasiticArachnoid);
            this.player1.playCreature(this.ancientBear);
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not fulfill when opponent plays a non-creature card', function () {
            this.player1.activateProphecy(this.headsIWin, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('untamed');
            this.player2.play(this.spooKeyCharge);
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should be able to flip at the end of your turn', function () {
            this.player1.activateProphecy(this.headsIWin, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player1.clickCard(this.headsIWin);
            expect(this.headsIWin.activeProphecy).toBe(false);
            expect(this.expectTheUnexpected.activeProphecy).toBe(true);
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.parasiticArachnoid.parent).toBe(this.expectTheUnexpected);
            this.player2.clickPrompt('untamed');
        });
    });
});
