describe('regroup phase', function() {
    integration(function() {
        // Action window opens
        describe('Regroup Action Phase', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'regroup',
                    player1: {
                        inPlay: ['adept-of-the-waves'],
                        hand: ['against-the-waves']
                    },
                    player2: {
                        hand: ['levy']
                    }
                });
            });

            it('should open an action window', function() {
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should pass priority', function() {
                this.player1.clickCard('against-the-waves');
                this.adeptOfTheWaves = this.player1.clickCard('adept-of-the-waves');
                expect(this.adeptOfTheWaves.bowed).toBe(true);
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should close the window when both players pass', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Discard Dynasty Cards');
            });
        });

        // Check characters and attachments are both readied
        describe('Readying characters, attachments, and strongholds', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'regroup',
                    player1: {
                        honor: 10,
                        stronghold: 'city-of-the-open-hand',
                        inPlay: ['adept-of-the-waves', 'shiba-tsukune'],
                        hand: ['jade-masterpiece']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['doomed-shugenja'],
                        hand: ['daimyo-s-favor']
                    }
                });
                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                this.shibaTsukune = this.player1.findCardByName('shiba-tsukune');
                this.shibaTsukune.bowed = true;
                this.jadeMasterpiece = this.player1.playAttachment('jade-masterpiece', this.shibaTsukune);
                this.doomedShugenja = this.player2.findCardByName('doomed-shugenja');
                this.doomedShugenja.bowed = true;
                this.daimyosFavor = this.player2.playAttachment('daimyo-s-favor', this.doomedShugenja);
                this.player1.clickCard(this.jadeMasterpiece);
                this.player1.clickRing('air');
                this.player1.clickRing('void');
                this.player2.clickCard(this.daimyosFavor);
                this.cityOfTheOpenHand = this.player1.clickCard('city-of-the-open-hand');
            });

            it('should ready characters', function() {
                this.noMoreActions();
                expect(this.shibaTsukune.bowed).toBe(false);
                expect(this.doomedShugenja.bowed).toBe(false);
                expect(this.adeptOfTheWaves.bowed).toBe(false);
            });

            it('should ready attachments', function() {
                expect(this.jadeMasterpiece.bowed).toBe(true);
                expect(this.daimyosFavor.bowed).toBe(true);
                this.noMoreActions();
                expect(this.jadeMasterpiece.bowed).toBe(false);
                expect(this.daimyosFavor.bowed).toBe(false);
            });

            it('should ready strongholds', function() {
                expect(this.cityOfTheOpenHand.bowed).toBe(true);
                this.noMoreActions();
                expect(this.cityOfTheOpenHand.bowed).toBe(false);
            });
        });

        // Check that faceup cards on provinces are automatically discarded

        // Check that faceup cards on provinces have the option to be discarded

        // Check Rings are returned

        // Check first player token is moved

    });
});
