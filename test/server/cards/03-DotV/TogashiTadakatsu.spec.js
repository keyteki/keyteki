fdescribe('Togashi Tadakatsu', function() {
    integration(function() {
        describe('Togashi Tadakatsu\'s ability', function() {
            describe('when a conflict is declared', function() {
                beforeEach(function() {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            fate: 0,
                            inPlay: ['seppun-guardsman']
                        },
                        player2: {
                            inPlay: ['togashi-tadakatsu', 'enlightened-warrior'],
                            hand: ['mantra-of-fire']
                        }
                    });
                    this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
                    this.game.rings.fire.fate = 1;
                    this.noMoreActions();
                });

                it('should prompt the player to declare a conflict or pass', function() {
                    expect(this.player1).toHavePrompt('Declare Conflict');
                });

                it('should move to the next action window if the player passes', function() {
                    this.player1.clickPrompt('Pass conflict opportunity');
                    expect(this.player1).toHavePrompt('Action Window');
                });

                it('should prompt their opponent to choose a ring', function() {
                    this.player1.clickPrompt('Declare a conflict');
                    expect(this.player2).toHavePrompt('Defender chooses conflict ring');
                });

                it('should prompt the attacker to choose attackers, choose the conflict province and change the conflict type', function() {
                    this.player1.clickPrompt('Declare a conflict');
                    this.player2.clickRing('fire');
                    expect(this.player1).toHavePrompt('Military Fire Conflict');
                    expect(this.game.rings.fire.fate).toBe(1);
                    this.player1.clickRing('air');
                    expect(this.game.rings.air.contested).toBe(false);
                    expect(this.game.currentConflict.conflictType).toBe('military');
                    this.player1.clickRing('fire');
                    expect(this.player1).toHavePrompt('Political Fire Conflict');
                    expect(this.game.currentConflict.conflictType).toBe('political');
                    this.player1.clickRing('fire');
                    this.seppunGuardsman = this.player1.clickCard('seppun-guardsman');
                    expect(this.seppunGuardsman.inConflict).toBe(true);
                    this.player1.clickCard(this.shamefulDisplay);
                    expect(this.shamefulDisplay.inConflict).toBe(true);
                });

                it('should trigger reactions correctly', function() {
                    this.player1.clickPrompt('Declare a conflict');
                    this.player2.clickRing('fire');
                    this.seppunGuardsman = this.player1.clickCard('seppun-guardsman');
                    this.player1.clickCard(this.shamefulDisplay);
                    this.player1.clickPrompt('Initiate Conflict');
                    expect(this.game.rings.fire.fate).toBe(0);
                    expect(this.player1.player.fate).toBe(1);
                    expect(this.player2).toHavePrompt('Triggered Abilities');
                    expect(this.player2).toBeAbleToSelect('mantra-of-fire');
                    expect(this.player2).toBeAbleToSelect('enlightened-warrior');
                });
            });
        });
    });
});
