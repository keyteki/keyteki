describe('Appealing to the Fortunes', function() {
    integration(function() {
        describe('Appealing to the Fortunes\'s ability', function() {

            describe('when controlling player has a void role', function() {
                beforeEach(function() {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            inPlay: ['borderlands-defender'],
                            hand: ['fine-katana']
                        },
                        player2: {
                            role: 'keeper-of-void',
                            hand: ['bayushi-kachiko'],
                            dynastyDeck: ['fawning-diplomat', 'shosuro-actress'],
                            provinces: ['appealing-to-the-fortunes']
                        }
                    });
                    this.borderlandsDefender = this.player1.findCardByName('borderlands-defender');
                    this.player1.playAttachment('fine-katana', this.borderlandsDefender);

                    this.appealingToTheFortunes = this.player2.findCardByName('appealing-to-the-fortunes');
                    this.bayushiKachiko = this.player2.findCardByName('bayushi-kachiko');
                    this.fawningDiplomat = this.player2.placeCardInProvince('fawning-diplomat', 'province 1');
                    this.shosuroActress = this.player2.placeCardInProvince('shosuro-actress', 'province 2');

                    this.noMoreActions();
                });

                it('province strength should be 5', function() {
                    this.appealingToTheFortunes.facedown = false;
                    this.game.checkGameState(true);
                    expect(this.appealingToTheFortunes.getStrength()).toBe(5);
                });

                it('should trigger when province is broken', function() {
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.borderlandsDefender],
                        province: this.appealingToTheFortunes,
                        defenders: []
                    });
                    expect(this.borderlandsDefender.militarySkill).toBe(5);
                    this.player2.pass();
                    this.player1.pass();
                    expect(this.player2).toHavePrompt('Triggered Abilities');
                    expect(this.player2).toBeAbleToSelect(this.appealingToTheFortunes);
                });

                it('should allow a character to be player from hand or from a province', function() {
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.borderlandsDefender],
                        province: this.appealingToTheFortunes,
                        defenders: []
                    });
                    expect(this.borderlandsDefender.militarySkill).toBe(5);
                    this.player2.pass();
                    this.player1.pass();
                    expect(this.player2).toHavePrompt('Triggered Abilities');
                    expect(this.player2).toBeAbleToSelect(this.appealingToTheFortunes);
                    this.player2.clickCard(this.appealingToTheFortunes);
                    expect(this.player2).toHavePrompt('Choose a character');
                    expect(this.player2).toBeAbleToSelect(this.bayushiKachiko);
                    expect(this.player2).toBeAbleToSelect(this.shosuroActress);
                    this.player2.clickCard(this.bayushiKachiko);
                    expect(this.bayushiKachiko.location).toBe('play area');
                });
            });

            describe('when controlling player does not have a void role', function() {
                beforeEach(function() {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            inPlay: ['borderlands-defender']
                        },
                        player2: {
                            role: 'seeker-of-air',
                            hand: ['political-rival'],
                            dynastyDeck: ['doji-shizue', 'guest-of-honor'],
                            provinces: ['appealing-to-the-fortunes']
                        }
                    });
                    this.borderlandsDefender = this.player1.findCardByName('borderlands-defender');

                    this.appealingToTheFortunes = this.player2.findCardByName('appealing-to-the-fortunes');
                    this.politicalRival = this.player2.findCardByName('political-rival');
                    this.dojiShizue = this.player2.placeCardInProvince('doji-shizue', 'province 1');
                    this.guestOfHonor = this.player2.placeCardInProvince('guest-of-honor', 'province 2');

                    this.noMoreActions();
                });

                it('province strength should be 3', function() {
                    this.appealingToTheFortunes.facedown = false;
                    this.game.checkGameState(true);
                    expect(this.appealingToTheFortunes.getStrength()).toBe(3);
                });

                it('should trigger when province is broken', function() {
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.borderlandsDefender],
                        province: this.appealingToTheFortunes,
                        defenders: []
                    });
                    this.player2.pass();
                    this.player1.pass();
                    expect(this.player2).toHavePrompt('Triggered Abilities');
                    expect(this.player2).toBeAbleToSelect(this.appealingToTheFortunes);
                });

                it('should allow a character to be player from hand or from a province', function() {
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.borderlandsDefender],
                        province: this.appealingToTheFortunes,
                        defenders: []
                    });
                    expect(this.borderlandsDefender.militarySkill).toBe(3);
                    this.player2.pass();
                    this.player1.pass();
                    expect(this.player2).toHavePrompt('Triggered Abilities');
                    expect(this.player2).toBeAbleToSelect(this.appealingToTheFortunes);
                    this.player2.clickCard(this.appealingToTheFortunes);
                    expect(this.player2).toHavePrompt('Choose a character');
                    expect(this.player2).toBeAbleToSelect(this.politicalRival);
                    expect(this.player2).toBeAbleToSelect(this.guestOfHonor);
                    this.player2.clickCard(this.guestOfHonor);
                    expect(this.guestOfHonor.location).toBe('play area');
                });
            });
        });
    });
});
