describe('Niten Master', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['niten-master'],
                    hand: ['fine-katana', 'ancestral-daisho', 'ancestral-daisho']
                },
                player2: {
                    hand: ['fine-katana']
                }
            });
            this.nitenMaster = this.player1.findCardByName('niten-master');
            this.nitenMaster.bowed = true;
        });

        describe('attaching a weapon', function() {
            it('should allow Niten Master to be readied', function() {
                this.fineKatana = this.player1.clickCard('fine-katana');
                this.player1.clickCard(this.nitenMaster);
                expect(this.fineKatana.location).toBe('play area');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.nitenMaster);
                expect(this.nitenMaster.bowed).toBe(false);
            });
        });

        describe('an opponent attaching a weapon', function() {
            it('should not trigger Niten Master\'s reaction', function() {
                this.player1.clickPrompt('Pass');
                this.oppKatana = this.player2.playAttachment('fine-katana', this.nitenMaster);
                expect(this.oppKatana.location).toBe('play area');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.nitenMaster.bowed).toBe(true);
            });
        });
    });
});
