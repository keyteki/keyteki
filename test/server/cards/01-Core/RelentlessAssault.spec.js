describe('Relentless Assault', function () {
    describe("Relentless Assault's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['relentless-assault'],
                    inPlay: ['umbra', 'troll', 'ganger-chieftain', 'krump']
                },
                player2: {
                    inPlay: ['batdrone', 'mother', 'zorg']
                }
            });
        });

        it('should ready and fight with up to 3 creatures', function () {
            this.umbra.exhaust();
            this.troll.exhaust();
            this.player1.play(this.relentlessAssault);

            // Fight 1
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.gangerChieftain);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.umbra);
            this.player1.clickCard(this.batdrone);

            // Fight 2
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.gangerChieftain);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.mother);

            // Fight 3
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.gangerChieftain);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.gangerChieftain);
            this.player1.clickCard(this.zorg);

            expect(this.umbra.location).toBe('play area');
            expect(this.umbra.damage).toBe(0);
            expect(this.umbra.exhausted).toBe(true);
            expect(this.troll.location).toBe('play area');
            expect(this.troll.damage).toBe(5);
            expect(this.troll.exhausted).toBe(true);
            expect(this.gangerChieftain.location).toBe('discard');
            expect(this.batdrone.location).toBe('discard');
            expect(this.mother.location).toBe('discard');
            expect(this.zorg.location).toBe('play area');
            expect(this.zorg.damage).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow fighting with just 2 creatures', function () {
            this.player1.play(this.relentlessAssault);

            // Fight 1
            this.player1.clickCard(this.umbra);
            this.player1.clickCard(this.batdrone);

            // Fight 2
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.mother);

            this.player1.clickPrompt('Done');
            expect(this.batdrone.location).toBe('discard');
            expect(this.mother.location).toBe('discard');
            expect(this.troll.damage).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow fighting with just 1 creature', function () {
            this.player1.play(this.relentlessAssault);

            // Fight 1
            this.player1.clickCard(this.umbra);
            this.player1.clickCard(this.batdrone);

            this.player1.clickPrompt('Done');
            expect(this.batdrone.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow fighting with 0 creatures', function () {
            this.player1.play(this.relentlessAssault);

            this.player1.clickPrompt('Done');
            expect(this.batdrone.location).toBe('play area');
            expect(this.mother.location).toBe('play area');
            expect(this.zorg.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
