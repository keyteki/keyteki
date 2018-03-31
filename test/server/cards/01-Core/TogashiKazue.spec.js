describe('Togashi Kazue', function() {
    integration(function() {
        describe('Togashi Kazue\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 12,
                        inPlay: ['ikoma-prodigy'],
                        hand: ['togashi-kazue']
                    },
                    player2: {
                        fate: 0,
                        inPlay: ['adept-of-the-waves'],
                        hand: ['embrace-the-void']
                    }
                });
                this.adeptOfTheWaves = this.player2.findCardByName('adept-of-the-waves', 'play area');
                this.adeptOfTheWaves.modifyFate(1);
                this.togashiKazue = this.player1.clickCard('togashi-kazue');
                this.player1.clickPrompt('Play Togashi Kazue as an attachment');
                this.ikomaProdigy = this.player1.clickCard('ikoma-prodigy');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ikomaProdigy],
                    defenders: [this.adeptOfTheWaves]
                });
            });

            it('should remove a fate from the target and add it to the character Kazue is attached to', function() {
                this.player2.pass();
                this.player1.clickCard(this.togashiKazue);
                this.player1.clickCard(this.adeptOfTheWaves);
                expect(this.ikomaProdigy.fate).toBe(1);
                expect(this.adeptOfTheWaves.fate).toBe(0);
            });

            it('should trigger reactions', function() {
                this.player2.pass();
                this.player1.clickCard(this.togashiKazue);
                this.player1.clickCard(this.adeptOfTheWaves);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ikomaProdigy);
                this.player1.clickCard(this.ikomaProdigy);
                expect(this.player1.honor).toBe(13);
            });

            it('should be prevented by Embrace the Void', function() {
                this.embraceTheVoid = this.player2.playAttachment('embrace-the-void', this.adeptOfTheWaves);
                this.player1.clickCard(this.togashiKazue);
                this.player1.clickCard(this.adeptOfTheWaves);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.embraceTheVoid);
                this.player2.clickCard(this.embraceTheVoid);
                expect(this.ikomaProdigy.fate).toBe(0);
                expect(this.adeptOfTheWaves.fate).toBe(0);
                expect(this.player2.player.fate).toBe(1);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
