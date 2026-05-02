describe('Paralysis Synan', function () {
    describe("Paralysis Synan's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['hemogrith', 'paralysis-synan', 'keenu']
                },
                player2: {
                    inPlay: ['bumpsy', 'troll', 'krump']
                }
            });
        });

        it('stuns, enrages, and exhausts only the chosen enemy creature on reap', function () {
            this.player1.reap(this.paralysisSynan);
            expect(this.player1).toBeAbleToSelect(this.hemogrith);
            expect(this.player1).toBeAbleToSelect(this.paralysisSynan);
            expect(this.player1).toBeAbleToSelect(this.keenu);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.troll);
            expect(this.bumpsy.stunned).toBe(false);
            expect(this.bumpsy.enraged).toBe(false);
            expect(this.bumpsy.exhausted).toBe(false);
            expect(this.troll.stunned).toBe(true);
            expect(this.troll.enraged).toBe(true);
            expect(this.troll.exhausted).toBe(true);
            expect(this.krump.stunned).toBe(false);
            expect(this.krump.enraged).toBe(false);
            expect(this.krump.exhausted).toBe(false);
            expect(this.hemogrith.stunned).toBe(false);
            expect(this.hemogrith.enraged).toBe(false);
            expect(this.hemogrith.exhausted).toBe(false);
            expect(this.paralysisSynan.stunned).toBe(false);
            expect(this.paralysisSynan.enraged).toBe(false);
            expect(this.keenu.stunned).toBe(false);
            expect(this.keenu.enraged).toBe(false);
            expect(this.keenu.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can target a friendly creature, affecting only the chosen creature', function () {
            this.player1.reap(this.paralysisSynan);
            this.player1.clickCard(this.paralysisSynan);
            expect(this.hemogrith.stunned).toBe(false);
            expect(this.hemogrith.enraged).toBe(false);
            expect(this.hemogrith.exhausted).toBe(false);
            expect(this.paralysisSynan.stunned).toBe(true);
            expect(this.paralysisSynan.enraged).toBe(true);
            expect(this.paralysisSynan.exhausted).toBe(true);
            expect(this.keenu.stunned).toBe(false);
            expect(this.keenu.enraged).toBe(false);
            expect(this.keenu.exhausted).toBe(false);
            expect(this.bumpsy.stunned).toBe(false);
            expect(this.bumpsy.enraged).toBe(false);
            expect(this.bumpsy.exhausted).toBe(false);
            expect(this.troll.stunned).toBe(false);
            expect(this.troll.enraged).toBe(false);
            expect(this.troll.exhausted).toBe(false);
            expect(this.krump.stunned).toBe(false);
            expect(this.krump.enraged).toBe(false);
            expect(this.krump.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
