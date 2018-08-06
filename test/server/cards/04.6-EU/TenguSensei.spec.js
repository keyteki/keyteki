describe('Tengu Sensei', function() {
    integration(function() {
        describe('Tengu Sensei\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['tengu-sensei']
                    },
                    player2: {
                        inPlay: ['agasha-swordsmith'],
                        hand: ['finger-of-jade']
                    }
                });
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
                this.agashaSwordsmith = this.player2.findCardByName('agasha-swordsmith');
                this.player1.pass();
            });

            it('should trigger when Tengu sensei uses covert', function() {
                this.player2.pass();
                this.player1.clickRing('air');
                this.player1.clickRing('air');
                this.player1.clickCard(this.shamefulDisplay);
                this.tenguSensei = this.player1.clickCard('tengu-sensei');
                this.player1.clickPrompt('Initiate Conflict');
                expect(this.player1).toHavePrompt('Choose covert target for Tengu Sensei');
                this.player1.clickCard(this.agashaSwordsmith);
                expect(this.agashaSwordsmith.covert).toBe(true);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.tenguSensei);
                this.player1.clickCard(this.tenguSensei);
                expect(this.player2).toHavePrompt('Choose Defenders');
                expect(this.player2).not.toBeAbleToSelect(this.agashaSwordsmith);
                this.player2.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Air Ring');
                this.player1.clickPrompt('Gain 2 honor');
                expect(this.player1).toHavePrompt('Action Window');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should trigger even when cancelled by Finger of Jade', function() {
                this.fingerOfJade = this.player2.playAttachment('finger-of-jade', this.agashaSwordsmith);
                this.noMoreActions();
                this.player1.clickRing('air');
                this.player1.clickRing('air');
                this.player1.clickCard(this.shamefulDisplay);
                this.tenguSensei = this.player1.clickCard('tengu-sensei');
                this.player1.clickPrompt('Initiate Conflict');
                expect(this.player1).toHavePrompt('Choose covert target for Tengu Sensei');
                this.player1.clickCard(this.agashaSwordsmith);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.fingerOfJade);
                this.player2.clickCard(this.fingerOfJade);
                expect(this.agashaSwordsmith.covert).toBe(false);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.tenguSensei);
            });
        });
    });
});
