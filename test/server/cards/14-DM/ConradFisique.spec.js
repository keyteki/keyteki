describe('ConradFisique', function () {
    describe("Conrad Fisique's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['conrad-fisique'],
                    inPlay: ['exeldon-yash']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
            this.exeldonYash.powerCounters = 2;
        });

        it('moves all +1 power counters from one creature to another', function () {
            this.player1.play(this.conradFisique);
            this.player1.clickCard(this.conradFisique);
            this.player1.clickCard(this.exeldonYash);
            this.player1.clickCard(this.troll);
            expect(this.exeldonYash.powerCounters).toBe(0);
            expect(this.troll.powerCounters).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('skips effect if player declines', function () {
            this.player1.play(this.conradFisique);
            this.player1.clickPrompt('Done');
            expect(this.exeldonYash.powerCounters).toBe(2);
            expect(this.troll.powerCounters).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Conrad Fisique's simultaneous power counter movement", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['conrad-fisique'],
                    inPlay: ['exeldon-yash', 'urchin', 'phoenix-heart']
                },
                player2: {}
            });
            // Manually attach Phoenix Heart to Exeldon Yash
            this.exeldonYash.upgrades.push(this.phoenixHeart);
            this.phoenixHeart.parent = this.exeldonYash;
            this.game.checkGameState(true);
            this.exeldonYash.powerCounters = 3;
            this.exeldonYash.damage = 5;
        });

        it('moves counters simultaneously so destination survives Phoenix Heart damage', function () {
            this.player1.play(this.conradFisique);
            this.player1.clickCard(this.conradFisique);
            this.player1.clickCard(this.exeldonYash);
            this.player1.clickCard(this.urchin);
            // Exeldon Yash is destroyed by losing its power counters; Phoenix Heart
            // returns it to hand and deals 3 damage to all creatures. Because the
            // counters move to Urchin simultaneously, Urchin has +3 power when the
            // damage is dealt and survives.
            expect(this.exeldonYash.location).toBe('hand');
            expect(this.urchin.location).toBe('play area');
            expect(this.urchin.powerCounters).toBe(3);
            expect(this.urchin.damage).toBe(3);
        });
    });
});
