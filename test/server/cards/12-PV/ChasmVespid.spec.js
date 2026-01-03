describe('Chasm Vespid', function () {
    describe("Chasm Vespid's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['chasm-vespid'],
                    inPlay: ['toad', 'charette', 'ember-imp']
                },
                player2: {
                    amber: 4,
                    inPlay: ['mighty-tiger', 'urchin', 'hunting-witch', 'dust-pixie']
                }
            });
        });

        it('should archive each friendly creature not on a flank when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.chasmVespid);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.reap(this.urchin);
            expect(this.urchin.location).toBe('archives');
            expect(this.huntingWitch.location).toBe('archives');
            expect(this.mightyTiger.location).toBe('play area');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.toad.location).toBe('play area');
            expect(this.charette.location).toBe('play area');
            expect(this.emberImp.location).toBe('play area');
            expect(this.chasmVespid.location).toBe('discard');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
