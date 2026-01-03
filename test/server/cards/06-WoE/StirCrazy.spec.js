describe('Stir-Crazy', function () {
    describe("Stir-Crazy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 4,
                    hand: ['stir-crazy'],
                    inPlay: ['seabringer-kekoa', 'nexus']
                },
                player2: {
                    amber: 6,
                    inPlay: ['batdrone', 'mother', 'zorg', 'helper-bot']
                }
            });
            this.nexus.exhausted = true;
            this.mother.exhausted = true;
        });

        it('should cause ready creatures to capture 1', function () {
            this.player1.play(this.stirCrazy);
            expect(this.seabringerKekoa.amber).toBe(1);
            expect(this.batdrone.amber).toBe(1);
            expect(this.zorg.amber).toBe(1);
            expect(this.helperBot.amber).toBe(1);
            expect(this.nexus.amber).toBe(0);
            expect(this.mother.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should prompt the player to pick creatures when there is insufficient amber', function () {
            this.player1.amber = 1;
            this.player2.amber = 0;
            this.player1.play(this.stirCrazy);
            expect(this.player1).toHavePrompt('Stir-Crazy');
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).not.toBeAbleToSelect(this.seabringerKekoa);
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            expect(this.player1).not.toBeAbleToSelect(this.mother);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.helperBot);
            this.player1.clickPrompt('Done');
            expect(this.batdrone.tokens.amber).toBe(1);
            expect(this.helperBot.tokens.amber).toBe(1);
            expect(this.seabringerKekoa.amber).toBe(0);
            expect(this.nexus.amber).toBe(0);
            expect(this.mother.amber).toBe(0);
            expect(this.zorg.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
