describe('Old Egad Evil Twin', function () {
    describe("Old Egad Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'untamed',
                    inPlay: ['ancient-bear', 'dharna', 'xenos-bloodshadow']
                },
                player2: {
                    amber: 4,
                    inPlay: ['old-egad-evil-twin', 'dextre']
                }
            });
        });

        it('should enrage all enemy creatures when destroyed', function () {
            this.player1.fightWith(this.xenosBloodshadow, this.oldEgadEvilTwin);
            expect(this.oldEgadEvilTwin.location).toBe('discard');
            expect(this.ancientBear.enraged).toBe(true);
            expect(this.dharna.enraged).toBe(true);
            expect(this.xenosBloodshadow.enraged).toBe(true);
            expect(this.dextre.enraged).toBe(false);
        });
    });
});
