describe('Void Fist', function() {
    integration(function() {
        describe('Void Fist\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-mitsu'],
                        hand: ['banzai', 'void-fist'],
                        conflictDiscard: ['centipede-tattoo']
                    },
                    player2: {
                        inPlay: ['bayushi-liar'],
                        dynastyDiscard: ['hidden-moon-dojo', 'seeker-initiate'],
                        hand: ['ornate-fan', 'infiltrator', 'banzai']
                    }
                });
                this.bayushiLiar = this.player2.findCardByName('bayushi-liar');
                this.player2.placeCardInProvince('hidden-moon-dojo', 'province 1');
                this.seekerInitiate = this.player2.placeCardInProvince('seeker-initiate', 'province 2');
                this.player1.pass();
                this.player2.player.showBid = 5;
                this.infiltrator = this.player2.playAttachment('infiltrator', this.bayushiLiar);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: ['togashi-mitsu']
                });
                this.player1.clickPrompt('No Target');
                this.player2.clickCard('bayushi-liar');
                this.player2.clickPrompt('Done');
            });

            it('should not trigger unless the player has played two other cards', function() {
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('void-fist');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should trigger if the player has played 2 cards', function() {
                expect(this.bayushiLiar.inConflict).toBe(true);
                this.player2.playAttachment('ornate-fan', 'bayushi-liar');
                this.player1.clickCard('banzai');
                this.togashiMitsu = this.player1.clickCard('togashi-mitsu');
                expect(this.togashiMitsu.militarySkill).toBe(6);
                this.player1.clickPrompt('Done');
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('void-fist');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('togashi-mitsu');
                this.player1.clickCard('centipede-tattoo');
                expect(this.player1).toHavePrompt('Centipede Tattoo');
                this.player1.clickCard('togashi-mitsu');
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('void-fist');
                expect(this.player1).toHavePrompt('Void Fist');
                this.player1.clickCard(this.bayushiLiar);
                expect(this.bayushiLiar.bowed).toBe(true);
                expect(this.bayushiLiar.inConflict).toBe(false);
            });

            it('should not trigger for the opponent if they haven\'t played 2 cards', function() {
                this.player1.moveCard('void-fist', 'conflict deck');
                this.player2.playAttachment('ornate-fan', 'bayushi-liar');
                this.player1.clickCard('banzai');
                this.togashiMitsu = this.player1.clickCard('togashi-mitsu');
                expect(this.togashiMitsu.militarySkill).toBe(6);
                this.player1.clickPrompt('Done');
                this.player2.clickCard(this.infiltrator);
                expect(this.player2).toHavePrompt('Infiltrator');
                expect(this.player2.currentButtons).toContain('Discard this card');
                expect(this.player2.currentButtons).not.toContain('Play this card');
            });

            it('should trigger for the opponent if they have played 2 cards', function() {
                this.togashiMitsu = this.player1.findCardByName('togashi-mitsu');
                this.player1.moveCard('void-fist', 'conflict deck');
                this.player2.clickCard(this.seekerInitiate);
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Conflict');
                this.player1.pass();
                this.player2.clickCard('banzai');
                this.player2.clickCard(this.seekerInitiate);
                this.player2.clickPrompt('Lose 1 honor to resolve this ability again');
                this.player2.clickCard(this.seekerInitiate);
                this.player2.clickPrompt('Done');
                this.player1.pass();
                this.player2.clickCard(this.infiltrator);
                expect(this.player2).toHavePrompt('Infiltrator');
                expect(this.player2.currentButtons).toContain('Discard this card');
                expect(this.player2.currentButtons).toContain('Play this card');
                this.player2.clickPrompt('Play this card');
                expect(this.player2).toHavePrompt('Void Fist');
                this.player2.clickCard(this.togashiMitsu);
                expect(this.togashiMitsu.bowed).toBe(true);
                expect(this.togashiMitsu.inConflict).toBe(false);
            });
        });
    });
});
