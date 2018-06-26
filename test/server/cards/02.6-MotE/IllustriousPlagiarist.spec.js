describe('Illustrious Plagiarist', function() {
    integration(function() {
        describe('When copying A Fate Worse Than Death', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 0,
                        inPlay: ['bayushi-shoju', 'illustrious-plagiarist']
                    },
                    player2: {
                        inPlay: ['doji-challenger'],
                        hand: ['a-fate-worse-than-death']
                    }
                });
                this.bayushiShoju = this.player1.findCardByName('bayushi-shoju');
                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.bayushiShoju],
                    defenders: [this.dojiChallenger]
                });
                this.aFateWorseThanDeath = this.player2.clickCard('a-fate-worse-than-death');
                this.player2.clickCard(this.bayushiShoju);
            });

            it('should allow plagiarist to copy AFWTD', function() {
                expect(this.bayushiShoju.isDishonored).toBe(true);
                expect(this.bayushiShoju.bowed).toBe(true);
                this.illustriousPlagiarist = this.player1.clickCard('illustrious-plagiarist');
                this.player1.clickCard(this.aFateWorseThanDeath);
                this.player2.pass();
                this.player1.clickCard(this.illustriousPlagiarist);
                expect(this.player1).toHavePrompt('Illustrious Plagiarist');
                expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                this.player1.clickCard(this.dojiChallenger);
                expect(this.dojiChallenger.isDishonored).toBe(true);
                expect(this.dojiChallenger.bowed).toBe(true);
            });
        });

        describe('When copying Assassinate', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 1,
                        honor: 10,
                        inPlay: ['bayushi-liar', 'illustrious-plagiarist'],
                        hand: ['cloud-the-mind']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        hand: ['assassination', 'banzai']
                    }
                });
                this.bayushiLiar = this.player1.findCardByName('bayushi-liar');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.bayushiLiar],
                    defenders: [this.dojiWhisperer]
                });
                this.assassination = this.player2.clickCard('assassination');
                this.player2.clickCard(this.bayushiLiar);
            });

            it('should allow plagiarist to copy Assassinate', function() {
                expect(this.bayushiLiar.location).toBe('dynasty discard pile');
                this.player1.playAttachment('cloud-the-mind', this.dojiWhisperer);
                this.player2.pass();
                this.illustriousPlagiarist = this.player1.clickCard('illustrious-plagiarist');
                this.player1.clickCard(this.assassination);
                this.player2.clickCard('banzai');
                this.player2.clickCard(this.dojiWhisperer);
                this.player2.clickPrompt('Done');
                this.player1.clickCard(this.illustriousPlagiarist);
                expect(this.player1).toHavePrompt('Illustrious Plagiarist');
                expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.dojiWhisperer.location).toBe('dynasty discard pile');
                expect(this.player1.honor).toBe(7);
            });
        });
    });
});
