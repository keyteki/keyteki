describe('Artisan Academy', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    dynastyDeck: ['artisan-academy'],
                    inPlay: ['doji-whisperer'],
                    hand: ['ornate-fan', 'steward-of-law', 'tattooed-wanderer', 'levy']
                }
            });
            this.artisanAcademy = this.player1.placeCardInProvince('artisan-academy', 'province 1');
        });

        describe('Before activating Artisan Academy', function() {
            it('should have the top card facedown', function() {
                expect(this.player1.player.conflictDeckTopCardHidden).toBe(true);
            });
        });
        
        describe('When activating Artisan Academy', function() {
            it('should turn the top card face up', function() {
                this.player1.clickCard(this.artisanAcademy);
                expect(this.player1.player.conflictDeckTopCardHidden).toBe(false);                
            });

            it('should add a playable location', function() {
                this.player1.clickCard(this.artisanAcademy);
                expect(this.player1.player.playableLocations.length).toBe(6);
            });

            it('should make the top card playable if it\'s an attachment', function() {
                this.ornateFan = this.player1.moveCard('ornate-fan', 'conflict deck');
                expect(this.player1.player.conflictDeck.first()).toBe(this.ornateFan);
                this.player1.clickCard(this.artisanAcademy);
                this.player2.clickPrompt('Pass');
                this.game.conflictTopCardClicked('player1');
                this.game.continue();
                expect(this.player1).toHavePrompt('Choose a card');

                this.dojiWhisperer = this.player1.clickCard('doji-whisperer');
                expect(this.dojiWhisperer.attachments.toArray()).toContain(this.ornateFan);
            });

            it('should make the top card playable if it\'s a character', function() {
                this.steward = this.player1.moveCard('steward-of-law', 'conflict deck');
                this.player1.clickCard(this.artisanAcademy);
                this.player2.clickPrompt('Pass');
                this.game.conflictTopCardClicked('player1');
                this.game.continue();
                expect(this.player1).toHavePrompt('Choose additional fate');

                this.player1.clickPrompt('0');
                expect(this.steward.location).toBe('play area');
            });

        });
    });
});
