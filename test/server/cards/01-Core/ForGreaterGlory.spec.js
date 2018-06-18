describe('For Greater Glory', function() {
    integration(function() {
        describe('For Greater Glory', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-altansarnai', 'moto-juro'],
                        hand: ['for-greater-glory', 'captive-audience']
                    },
                    player2: {
                        inPlay: ['adept-of-the-waves'],
                        provinces: ['shameful-display', 'public-forum', 'endless-plains']
                    }
                });
                this.shinjoAltansarnai = this.player1.findCardByName('shinjo-altansarnai');
                this.motoJuro = this.player1.findCardByName('moto-juro');
                this.forGreaterGlory = this.player1.findCardByName('for-greater-glory');
                this.adeptOfTheWaves = this.player2.findCardByName('adept-of-the-waves', 'play area');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
                this.publicForum = this.player2.findCardByName('public-forum');
                this.endlessPlains = this.player2.findCardByName('endless-plains');
                this.noMoreActions();
            });

            it('should trigger on breaking a province during a military conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    province: this.shamefulDisplay,
                    attackers: [this.shinjoAltansarnai],
                    defenders: [],
                    jumpTo: 'afterConflict'
                });
                this.player1.clickPrompt('No');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.forGreaterGlory);
                expect(this.player1).toBeAbleToSelect(this.shinjoAltansarnai);
                this.player1.clickCard(this.forGreaterGlory);
                expect(this.shinjoAltansarnai.fate).toBe(1);
            });

            it('should not trigger on breaking a province during a political conflict', function() {
                this.initiateConflict({
                    type: 'political',
                    province: this.shamefulDisplay,
                    attackers: [this.shinjoAltansarnai],
                    defenders: [],
                    jumpTo: 'afterConflict'
                });
                this.player1.clickPrompt('No');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should trigger when Endless Plains fires', function() {
                this.initiateConflict({
                    type: 'military',
                    province: this.endlessPlains,
                    attackers: [this.shinjoAltansarnai]
                });
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.endlessPlains);
                this.player2.clickCard(this.endlessPlains);
                this.player1.clickPrompt('No');
                expect(this.endlessPlains.isBroken).toBe(true);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.forGreaterGlory);
                expect(this.player1).toBeAbleToSelect(this.shinjoAltansarnai);
                this.player1.clickCard(this.shinjoAltansarnai);
                expect(this.player2).toHavePrompt('Shinjo Altansarnai');
                this.player2.clickCard(this.adeptOfTheWaves);
                expect(this.adeptOfTheWaves.location).toBe('dynasty discard pile');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.forGreaterGlory);
                this.player1.clickCard(this.forGreaterGlory);
                expect(this.shinjoAltansarnai.fate).toBe(1);
                expect(this.player1).toHavePrompt('Endless Plains');
                this.player1.clickCard(this.shinjoAltansarnai);
                expect(this.shinjoAltansarnai.location).toBe('dynasty discard pile');
            });

            it('should not trigger when Public Forum is triggered', function() {
                this.initiateConflict({
                    type: 'military',
                    province: this.publicForum,
                    attackers: [this.shinjoAltansarnai],
                    defenders: [],
                    jumpTo: 'afterConflict'
                });
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.publicForum);
                this.player2.clickCard(this.publicForum);
                expect(this.player1).toHavePrompt('Air Ring');
            });

            it('should trigger when Public Forum is broken', function() {
                this.initiateConflict({
                    type: 'military',
                    province: this.publicForum,
                    attackers: [this.shinjoAltansarnai],
                    defenders: [],
                    jumpTo: 'afterConflict'
                });
                this.player2.clickCard(this.publicForum);
                this.player1.clickPrompt('Gain 2 honor');
                this.noMoreActions();
                this.player2.clickPrompt('Pass Conflict');
                this.player2.clickPrompt('Yes');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'fire',
                    province: this.publicForum,
                    attackers: [this.motoJuro],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('captive-audience');
                this.noMoreActions();
                this.player1.clickPrompt('No');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.forGreaterGlory);
                this.player1.clickCard(this.forGreaterGlory);
                expect(this.motoJuro.fate).toBe(1);
            });
        });
    });
});
