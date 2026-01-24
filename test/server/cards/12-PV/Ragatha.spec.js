describe('Ragatha', function () {
    describe("Ragatha's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'redemption',
                    hand: ['ragatha'],
                    inPlay: ['corrosive-monk']
                },
                player2: {
                    hand: ['dust-pixie'],
                    inPlay: ['research-smoko', 'ancient-bear']
                }
            });
        });

        it('should give enemy creatures an after reap ability to deal 3 damage to Ragatha neighbors', function () {
            this.player1.playCreature(this.ragatha);
            expect(this.player2.player.creaturesInPlay).toContain(this.ragatha);
            this.player2.moveCard(this.dustPixie, 'play area');
            this.player1.reap(this.corrosiveMonk);
            expect(this.ancientBear.damage).toBe(3);
            expect(this.researchSmoko.damage).toBe(0);
            expect(this.researchSmoko.location).toBe('play area');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
