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
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not fulfill when players have different number of creatures', function () {
            this.player1.activateProphecy(this.starsAligned, this.parasiticArachnoid);
            this.player1.playCreature(this.emberImp);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player2).isReadyToTakeAction();
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
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Stars Aligned's ability with Ask Again Later", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    prophecies: [
                        'stars-aligned',
                        'expect-the-unexpected',
                        'ask-again-later',
                        'fate-laughs-at-your-plans'
                    ],
                    hand: ['parasitic-arachnoid', 'sedimentary-nap', 'ember-imp'],
                    inPlay: ['charette']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll', 'bumpsy']
                }
            });
        });

        it('should allow ordering Ask Again Later then Stars Aligned even if conditions are not met', function () {
            this.player1.activateProphecy(this.starsAligned, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.activateProphecy(this.askAgainLater, this.sedimentaryNap);
            this.player1.moveCard(this.emberImp, 'deck');
            this.player1.endTurn();
            expect(this.player2).toBeAbleToSelect(this.askAgainLater);
            expect(this.player2).toBeAbleToSelect(this.starsAligned);
            this.player2.clickCard(this.askAgainLater);
            this.player2.clickPrompt('untamed');
            this.player2.clickCard(this.troll);
            this.player2.clickCard(this.bumpsy);
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2.amber).toBe(2);
            expect(this.bumpsy.amber).toBe(2);
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should allow ordering Stars Aligned then Ask Again Later even if conditions are not met', function () {
            this.player1.activateProphecy(this.starsAligned, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.activateProphecy(this.askAgainLater, this.sedimentaryNap);
            this.player1.moveCard(this.emberImp, 'deck');
            this.player1.endTurn();
            expect(this.player2).toBeAbleToSelect(this.askAgainLater);
            expect(this.player2).toBeAbleToSelect(this.starsAligned);
            this.player2.clickCard(this.starsAligned);
            this.player2.clickPrompt('untamed');
            this.player2.clickCard(this.troll);
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player2.amber).toBe(4);
            expect(this.bumpsy.amber).toBe(0);
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should allow ordering Ask Again Later then Stars Aligned when conditions are met', function () {
            this.player1.activateProphecy(this.starsAligned, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.activateProphecy(this.askAgainLater, this.sedimentaryNap);
            this.player1.moveCard(this.emberImp, 'deck');
            this.player2.moveCard(this.bumpsy, 'discard');
            this.player1.endTurn();
            expect(this.player2).toBeAbleToSelect(this.askAgainLater);
            expect(this.player2).toBeAbleToSelect(this.starsAligned);
            this.player2.clickCard(this.askAgainLater);
            this.player2.clickPrompt('untamed');
            this.player2.clickCard(this.troll);
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player2.amber).toBe(4);
            expect(this.troll.amber).toBe(0);
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should allow ordering Stars Aligned then Ask Again Later when conditions are met', function () {
            this.player1.activateProphecy(this.starsAligned, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.activateProphecy(this.askAgainLater, this.sedimentaryNap);
            this.player1.moveCard(this.emberImp, 'deck');
            this.player2.moveCard(this.bumpsy, 'deck');
            this.player1.endTurn();
            expect(this.player2).toBeAbleToSelect(this.askAgainLater);
            expect(this.player2).toBeAbleToSelect(this.starsAligned);
            this.player2.clickCard(this.starsAligned);
            this.player2.clickCard(this.troll);
            expect(this.parasiticArachnoid.location).toBe('discard');
            this.player2.clickPrompt('untamed');
            this.player2.clickCard(this.troll);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.troll.location).toBe('deck');
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
