describe('Retrotechnician Le', function () {
    describe("Retrotechnician Le's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['retrotechnician-le', 'stealth-mode'],
                    inPlay: ['medic-ingram'],
                    discard: new Array(8).fill('poke').concat(['flaxia']) // not yet haunted
                },
                player2: {
                    inPlay: ['batdrone'],
                    discard: ['urchin']
                }
            });
            this.player1.chains = 36;
        });

        it('comes in exhausted when not haunted', function () {
            this.player1.playCreature(this.retrotechnicianLe);
            expect(this.retrotechnicianLe.exhausted).toBe(true);
        });

        it('comes in ready when haunted', function () {
            this.player1.play(this.stealthMode);
            this.player1.playCreature(this.retrotechnicianLe);
            expect(this.retrotechnicianLe.exhausted).toBe(false);
        });

        it('plays a creature from discard on reap', function () {
            this.player1.play(this.stealthMode);
            this.player1.playCreature(this.retrotechnicianLe);
            this.player1.reap(this.retrotechnicianLe);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.medicIngram);
            this.player1.clickCard(this.flaxia);
            this.player1.clickPrompt('Right');
            expect(this.player1.amber).toBe(5);
        });

        it('may choose to not play creature from discard on reap', function () {
            this.player1.play(this.stealthMode);
            this.player1.playCreature(this.retrotechnicianLe);
            this.player1.reap(this.retrotechnicianLe);
            this.player1.clickPrompt('Done');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
