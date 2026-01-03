describe('Stasis Nexus', function () {
    describe("Stasis Nexus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['stasis-nexus'],
                    amber: 10
                },
                player2: {
                    inPlay: ['troll', 'dust-pixie', 'krump']
                }
            });
        });

        it('should purge itself and offer to forge a key', function () {
            this.player1.useAction(this.stasisNexus);
            expect(this.stasisNexus.location).toBe('purged');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should forge a key at +6 cost when no creatures are stunned', function () {
            this.player1.amber = 12;
            this.player1.useAction(this.stasisNexus);
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('red');
            expect(this.player1.player.keys.red).toBe(true);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should reduce key cost by 1 for each stunned creature', function () {
            this.troll.stun();
            this.dustPixie.stun();
            this.player1.useAction(this.stasisNexus);
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('red');
            expect(this.player1.amber).toBe(0);
            expect(this.player1.player.keys.red).toBe(true);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not forge a key if player chooses no', function () {
            this.player1.amber = 12;
            this.player1.useAction(this.stasisNexus);
            this.player1.clickPrompt('No');
            expect(this.player1.amber).toBe(12); // No amber spent
            expect(this.player1.player.getForgedKeys()).toBe(0);
            expect(this.stasisNexus.location).toBe('purged');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
