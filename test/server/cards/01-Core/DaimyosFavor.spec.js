describe('Daimyo\'s Favor', function() {
    integration(function() {
        describe('Daimyo\'s Favor\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doomed-shugenja', 'togashi-initiate'],
                        hand: ['daimyo-s-favor', 'fine-katana', 'tattooed-wanderer', 'ancestral-daisho']
                    }
                });
                this.doomedShugenja = this.player1.findCardByName('doomed-shugenja');
                this.togashiInitiate = this.player1.findCardByName('togashi-initiate');
                this.daimyosFavor = this.player1.playAttachment('daimyo-s-favor', this.doomedShugenja);
                this.player2.pass();
                this.player1.clickCard(this.daimyosFavor);
                this.player2.pass();
                this.fate = this.player1.fate;
            });

            it('should reduce the cost of attachments played on the attached character', function() {
                expect(this.daimyosFavor.bowed).toBe(true);
                this.ancestralDaisho = this.player1.playAttachment('ancestral-daisho', this.doomedShugenja);
                expect(this.doomedShugenja.attachments.toArray()).toContain(this.ancestralDaisho);
                expect(this.player1.fate).toBe(this.fate);
            });

            it('should not reduce the cost of attachments played on another character', function() {
                expect(this.daimyosFavor.bowed).toBe(true);
                this.ancestralDaisho = this.player1.playAttachment('ancestral-daisho', this.togashiInitiate);
                expect(this.togashiInitiate.attachments.toArray()).toContain(this.ancestralDaisho);
                expect(this.player1.fate).toBe(this.fate - 1);
            });

            it('should not save the reduction if the player plays a 0 cost attachment first', function() {
                expect(this.daimyosFavor.bowed).toBe(true);
                this.player1.playAttachment('fine-katana', this.doomedShugenja);
                this.player2.pass();
                this.ancestralDaisho = this.player1.playAttachment('ancestral-daisho', this.doomedShugenja);
                expect(this.doomedShugenja.attachments.toArray()).toContain(this.ancestralDaisho);
                expect(this.player1.fate).toBe(this.fate - 1);
            });

            it('should not save the reduction if the player plays a 0 cost attachment on a different character', function() {
                expect(this.daimyosFavor.bowed).toBe(true);
                this.player1.playAttachment('fine-katana', this.togashiInitiate);
                this.player2.pass();
                this.ancestralDaisho = this.player1.playAttachment('ancestral-daisho', this.doomedShugenja);
                expect(this.doomedShugenja.attachments.toArray()).toContain(this.ancestralDaisho);
                expect(this.player1.fate).toBe(this.fate);
            });

            it('should give a discount for playing an attachmonk', function() {
                expect(this.daimyosFavor.bowed).toBe(true);
                this.tattooedWanderer = this.player1.clickCard('tattooed-wanderer');
                this.player1.clickPrompt('Play Tattooed Wanderer as an attachment');
                this.player1.clickCard(this.doomedShugenja);
                expect(this.doomedShugenja.attachments.toArray()).toContain(this.tattooedWanderer);
                expect(this.player1.fate).toBe(this.fate);
            });
        });
    });
});
