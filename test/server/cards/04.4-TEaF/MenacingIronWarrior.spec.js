describe('Menacing Iron Warrior', function() {
    integration(function() {
        describe('Menacing Iron Warrior\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asahina-artisan', 'doji-challenger', 'kakita-yoshi', 'young-harrier'],
                        hand: ['young-harrier'],
                        provinces: ['public-forum']
                    },
                    player2: {
                        inPlay: ['menacing-iron-warrior', 'kakita-kaezin', 'doji-whisperer']
                    }
                });

                this.asahinaArtisan = this.player1.findCardByName('asahina-artisan');
                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.kakitaYoshi = this.player1.findCardByName('kakita-yoshi');
                this.youngHarrier = this.player1.findCardByName('young-harrier');
                this.kakitaYoshi.honor();
                this.player1.player.imperialFavor = 'political';

                this.menacingIronWarrior = this.player2.findCardByName('menacing-iron-warrior');
                this.kakitaKaezin = this.player2.findCardByName('kakita-kaezin');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
            });

            describe('When not in a conflict', function() {
                it('should not be available to activate', function() {
                    this.player1.pass();
                    this.player2.clickCard(this.menacingIronWarrior);
                    expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                });
            });

            describe('When in a political conflict', function() {
                let originalDojiChallenderPolSkill;
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'political',
                        attackers: [this.asahinaArtisan, this.dojiChallenger, this.kakitaYoshi],
                        defenders: [this.menacingIronWarrior, this.kakitaKaezin]
                    });
                    originalDojiChallenderPolSkill = this.dojiChallenger.getPoliticalSkill();
                });
                it('should not be available to activate', function() {
                    this.player2.clickCard(this.menacingIronWarrior);
                    expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                    this.player2.pass();
                    this.player1.clickCard(this.asahinaArtisan);
                    expect(this.player1).toHavePrompt('Asahina Artisan');
                    expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                    this.player1.clickCard(this.dojiChallenger);
                    expect(this.dojiChallenger.getPoliticalSkill()).toBe(originalDojiChallenderPolSkill + 3);
                });
            });

            describe('When in a military conflict', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.asahinaArtisan, this.dojiChallenger, this.kakitaYoshi],
                        defenders: [this.menacingIronWarrior, this.kakitaKaezin]
                    });
                    this.player2.clickCard(this.menacingIronWarrior);
                });
                it('should prevent lower military skill chars from triggering abilities', function() {
                    expect(this.player2).toHavePrompt('Waiting for opponent to take an action or pass');
                    this.player1.clickCard(this.asahinaArtisan);
                    expect(this.player1).not.toHavePrompt('Asahina Artisan');
                    expect(this.player1).not.toBeAbleToSelect(this.dojiChallenger);
                });
                it('should prevent equal military skill chars from triggering abilities', function() {
                    expect(this.player2).toHavePrompt('Waiting for opponent to take an action or pass');
                    this.player1.clickCard(this.dojiChallenger);
                    expect(this.player1).not.toHavePrompt('Doji Challenger');
                    expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);
                });
                it('should not prevent higher military skill chars from triggering abilities', function() {
                    const originalHandSize = this.player1.player.hand.size();
                    expect(this.player2).toHavePrompt('Waiting for opponent to take an action or pass');
                    this.player1.clickCard(this.kakitaYoshi);
                    expect(this.player1.player.imperialFavor).toBe('');
                    expect(this.player1.player.hand.size()).toBe(originalHandSize + 3);
                });
                it('should not prevent own chars from triggering abilities', function() {
                    this.player1.pass();
                    this.player2.clickCard(this.kakitaKaezin);
                    expect(this.player2).toHavePrompt('Waiting for opponent to use Kakita Kaezin');
                });
                it('should not prevent characters at home from triggering abilities', function() {
                    expect(this.youngHarrier.isDishonored).toBe(false);
                    this.player1.clickCard(this.youngHarrier);
                    expect(this.youngHarrier.isDishonored).toBe(true);
                });
                it('should not prevent characters added to the conflict after activation from triggering abilities', function() {
                    this.youngHarrier2 = this.player1.playCharacterFromHand('young-harrier');
                    this.player1.clickPrompt('Conflict');
                    this.player2.pass();
                    expect(this.youngHarrier2.isDishonored).toBe(false);
                    this.player1.clickCard(this.youngHarrier2);
                    expect(this.youngHarrier2.isDishonored).toBe(true);
                });
                it('should not prevent characters in future conflicts from triggering abilities', function() {
                    this.player1.pass();
                    this.player2.pass();
                    this.player1.clickPrompt('No');
                    this.player1.clickPrompt('Take 1 honor from opponent');
                    this.kakitaKaezin.ready();
                    this.kakitaYoshi.ready();
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        ring: 'fire',
                        province: this.player1.findCardByName('public-forum'),
                        attackers: [this.kakitaKaezin],
                        defenders: [this.kakitaYoshi]
                    });
                    const originalHandSize = this.player1.player.hand.size();
                    this.player1.clickCard(this.kakitaYoshi);
                    expect(this.player1.player.imperialFavor).toBe('');
                    expect(this.player1.player.hand.size()).toBe(originalHandSize + 3);
                });
            });
        });
    });
});
