describe('Relentless Assault', function () {
    describe("Relentless Assault's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['relentless-assault'],
                    inPlay: ['bumpsy', 'troll', 'ganger-chieftain', 'krump']
                },
                player2: {
                    inPlay: ['batdrone', 'mother', 'zorg']
                }
            });
        });

        it('should ready and fight with up to 3 creatures', function () {
            this.bumpsy.exhaust();
            this.troll.exhaust();
            this.player1.play(this.relentlessAssault);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.gangerChieftain);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.mother);
            this.player1.clickCard(this.zorg);
            expect(this.bumpsy.location).toBe('play area');
            expect(this.bumpsy.damage).toBe(2);
            expect(this.bumpsy.exhausted).toBe(true);
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

        it('should allow selecting fewer than 3 creatures', function () {
            this.player1.play(this.relentlessAssault);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
