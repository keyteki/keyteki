describe('Mantis Tenkinja', function() {
    integration(function() {
        describe('Mantis Tenkinja\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 4,
                        inPlay: ['mantis-tenkinja'],
                        dynastyDiscard: ['mantis-tenkinja', 'awakened-tsukumogami'],
                        hand: ['consumed-by-five-fires', 'charge']
                    },
                    player2: {
                        inPlay: ['agasha-swordsmith']
                    }
                });
                this.agashaSwordsmith = this.player2.findCardByName('agasha-swordsmith');
                this.mantisTenkinja = this.player1.findCardByName('mantis-tenkinja', 'play area');
                this.mantisTenkinja2 = this.player1.findCardByName('mantis-tenkinja', 'dynasty discard pile');
                this.player1.placeCardInProvince(this.mantisTenkinja2);
                this.awakenedTsukumogami = this.player1.placeCardInProvince('awakened-tsukumogami', 'province 2');
                this.agashaSwordsmith.fate = 4;
                this.game.rings.fire.fate = 2;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['mantis-tenkinja'],
                    defenders: []
                });
                this.player2.pass();
            });

            it('should trigger when the player has enough fate', function() {
                this.player1.clickCard('charge');
                this.player1.clickCard(this.awakenedTsukumogami);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.mantisTenkinja);
                this.player1.clickCard(this.mantisTenkinja);
                expect(this.awakenedTsukumogami.location).toBe('play area');
                expect(this.player1.fate).toBe(4);
            });

            it('should trigger when the player doesn\'t have enough fate but can pay costs', function() {
                this.player1.fate = 0;
                this.player1.clickCard('charge');
                this.player1.clickCard(this.awakenedTsukumogami);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.mantisTenkinja);
                this.player1.clickCard(this.mantisTenkinja);
                expect(this.awakenedTsukumogami.location).toBe('play area');
                expect(this.player1.fate).toBe(0);
            });

            it('should not trigger when the player cannot pay costs', function() {
                this.player1.fate = 0;
                this.player1.clickCard('consumed-by-five-fires');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should work in multiples', function() {
                this.player1.clickCard('charge');
                this.player1.clickCard(this.mantisTenkinja2);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.mantisTenkinja);
                this.player1.pass();
                expect(this.mantisTenkinja2.location).toBe('play area');
                expect(this.player1.fate).toBe(3);
                this.player2.pass();
                this.player1.clickCard('consumed-by-five-fires');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.mantisTenkinja);
                expect(this.player1).toBeAbleToSelect(this.mantisTenkinja2);
                this.player1.clickCard(this.mantisTenkinja);
                this.player1.clickCard(this.mantisTenkinja2);
                expect(this.player1.fate).toBe(0);
                expect(this.player1).toHavePrompt('Consumed By Five Fires');
            });

            it('should work correctly with Awakened Tsukumogami', function() {
                this.player1.clickCard('charge');
                this.player1.clickCard(this.awakenedTsukumogami);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.mantisTenkinja);
                this.player1.pass();
                expect(this.awakenedTsukumogami.location).toBe('play area');
                expect(this.player1.fate).toBe(3);
                this.player2.pass();
                this.player1.clickCard('consumed-by-five-fires');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.mantisTenkinja);
                this.player1.clickCard(this.mantisTenkinja);
                expect(this.player1).toHavePrompt('Choose amount of fate to spend from the Fire ring');
                expect(this.player1.currentButtons.length).toBe(2);
                expect(this.player1.currentButtons).toContain('1');
                expect(this.player1.currentButtons).toContain('2');
                this.player1.clickPrompt('2');
                expect(this.player1.fate).toBe(1);
                expect(this.game.rings.fire.fate).toBe(0);
                expect(this.player1).toHavePrompt('Consumed By Five Fires');
            });
        });
    });
});
