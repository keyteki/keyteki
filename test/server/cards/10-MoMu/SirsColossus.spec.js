describe('Sirs Colossus', function () {
    describe("Sirs Colossus's Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'sanctum',
                    hand: ['sirs-colossus', 'sirs-colossus2'],
                    inPlay: ['raiding-knight', 'scrivener-favian']
                },
                player2: {
                    amber: 6,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should not be able to play with just part 1', function () {
            this.player1.moveCard(this.sirsColossus2, 'discard');
            this.player1.clickCard(this.sirsColossus);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should not be able to play with just part 2', function () {
            this.player1.moveCard(this.sirsColossus, 'discard');
            this.player1.clickCard(this.sirsColossus2);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 1', function () {
            this.player1.clickCard(this.sirsColossus);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 2', function () {
            this.player1.clickCard(this.sirsColossus2);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should capture all amber on creatures on play', function () {
            this.player1.playCreature(this.sirsColossus);
            expect(this.player1).toBeAbleToSelect(this.raidingKnight);
            expect(this.player1).toBeAbleToSelect(this.scrivenerFavian);
            expect(this.player1).toBeAbleToSelect(this.sirsColossus);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.raidingKnight);
            this.player1.clickCard(this.scrivenerFavian);
            this.player1.clickCard(this.sirsColossus);
            this.player1.clickCard(this.sirsColossus);
            this.player1.clickCard(this.sirsColossus);
            this.player1.clickCard(this.sirsColossus);
            expect(this.raidingKnight.amber).toBe(1);
            expect(this.scrivenerFavian.amber).toBe(1);
            expect(this.sirsColossus.amber).toBe(4);
            expect(this.lamindra.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should remove amber from a creature on fight', function () {
            this.player1.playCreature(this.sirsColossus);
            this.player1.clickCard(this.raidingKnight);
            this.player1.clickCard(this.scrivenerFavian);
            this.player1.clickCard(this.sirsColossus);
            this.player1.clickCard(this.sirsColossus);
            this.player1.clickCard(this.sirsColossus);
            this.player1.clickCard(this.sirsColossus);
            this.sirsColossus.exhausted = false;
            this.player1.fightWith(this.sirsColossus, this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.raidingKnight);
            expect(this.player1).toBeAbleToSelect(this.scrivenerFavian);
            expect(this.player1).toBeAbleToSelect(this.sirsColossus);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.sirsColossus);
            expect(this.raidingKnight.amber).toBe(1);
            expect(this.scrivenerFavian.amber).toBe(1);
            expect(this.sirsColossus.amber).toBe(0);
            expect(this.lamindra.amber).toBe(0);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
