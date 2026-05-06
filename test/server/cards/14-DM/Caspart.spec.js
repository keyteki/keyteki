describe('Caspart', function () {
    describe("Caspart's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    inPlay: ['caspart', 'noxious-ionox']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy']
                }
            });
        });

        it('exhausts 2 other creatures at end of turn if exhausted', function () {
            this.caspart.exhaust();
            this.player1.endTurn();
            // Ready phase prompts to ready entrenched creatures
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose 2 creatures');
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickPrompt('Done');
            expect(this.troll.exhausted).toBe(true);
            expect(this.bumpsy.exhausted).toBe(true);
            expect(this.noxiousIonox.exhausted).toBe(false);
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not allow exhausting fewer than 2 other creatures', function () {
            this.caspart.exhaust();
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(false);
            expect(this.player1).toHavePrompt('Choose 2 creatures');
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.bumpsy);
            this.player1.clickPrompt('Done');
            expect(this.troll.exhausted).toBe(true);
            expect(this.bumpsy.exhausted).toBe(true);
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });

        it('does nothing if not exhausted at end of turn', function () {
            this.player1.endTurn();
            expect(this.troll.exhausted).toBe(false);
            expect(this.bumpsy.exhausted).toBe(false);
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
