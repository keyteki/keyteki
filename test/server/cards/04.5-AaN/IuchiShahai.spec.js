describe('Iuchi Shahai', function() {
    integration(function() {
        describe('Iuchi Shahai\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 1,
                        inPlay: ['iuchi-shahai', 'kudaka'],
                        hand: ['force-of-the-river', 'seal-of-the-unicorn']
                    },
                    player2: {
                        inPlay: []
                    }
                });
            });

            it('should reduce the cost of playing meishodo attachments on herself', function() {
                this.forceOfTheRiver = this.player1.playAttachment('force-of-the-river', 'iuchi-shahai');
                expect(this.forceOfTheRiver.location).toBe('play area');
                expect(this.player1.fate).toBe(1);
            });

            it('should reduce the cost of playing meishodo attachments on a neutral character', function() {
                this.forceOfTheRiver = this.player1.playAttachment('force-of-the-river', 'kudaka');
                expect(this.forceOfTheRiver.location).toBe('play area');
                expect(this.player1.fate).toBe(1);
            });

            it('should not reduce the cost of playing meishodo attachments on a neutral character with a seal', function() {
                this.player1.playAttachment('seal-of-the-unicorn', 'kudaka');
                this.player2.pass();
                this.forceOfTheRiver = this.player1.playAttachment('force-of-the-river', 'kudaka');
                expect(this.forceOfTheRiver.location).toBe('play area');
                expect(this.player1.fate).toBe(0);
            });

            it('should allow players to pay 0 cost attachments with 0 fate', function() {
                this.player1.fate = 0;
                this.forceOfTheRiver = this.player1.playAttachment('force-of-the-river', 'iuchi-shahai');
                expect(this.forceOfTheRiver.location).toBe('play area');
            });
        });
    });
});
