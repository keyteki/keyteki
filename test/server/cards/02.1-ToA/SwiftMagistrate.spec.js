describe('Swift Magistrate', function() {
    integration(function() {
        describe('Swift Magistrate\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['swift-magistrate', 'shinjo-outrider'],
                        dynastyDeck: ['swift-magistrate'],
                        hand: ['charge']
                    },
                    player2: {
                        inPlay: ['borderlands-defender', 'vanguard-warrior']
                    }
                });
                this.swiftMagistrate = this.player1.findCardByName('swift-magistrate', 'play area');
                this.swiftMagistrate.modifyFate(1);
                this.swiftMagistrate2 = this.player1.findCardByName('swift-magistrate', ['dynasty deck', 'provinces']);
                this.player1.placeCardInProvince(this.swiftMagistrate2, 'province 1');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['swift-magistrate'],
                    defenders: ['borderlands-defender']
                });
                this.conflict = this.game.currentConflict;
            });

            it('shouldn\'t affect that Swift Magistrate', function() {
                expect(this.conflict.attackerSkill).toBe(2);
            });

            it('should not affect cards with no fate', function() {
                expect(this.conflict.defenderSkill).toBe(3);
            });

            it('should affect cards with fate', function() {
                this.player2.clickCard('vanguard-warrior');
                this.borderlandsDefender = this.player2.clickCard('borderlands-defender');
                expect(this.borderlandsDefender.fate).toBe(1);
                expect(this.conflict.defenderSkill).toBe(0);
            });

            it('should be correctly displayed in chat when there is a state change', function() {
                this.spy = spyOn(this.game, 'addMessage');
                this.player2.clickCard('vanguard-warrior');
                this.borderlandsDefender = this.player2.clickCard('borderlands-defender');
                expect(this.spy).toHaveBeenCalledWith('{0} - Attacker: {1} Defender: {2}', 'Military Air conflict', 2, 0);
            });

            it('should affect other magistrates of the same type', function() {
                this.player2.pass();
                this.player1.clickCard('charge');
                this.player1.clickCard(this.swiftMagistrate2);
                expect(this.conflict.attackerSkill).toBe(2);
                this.player2.clickCard('vanguard-warrior');
                this.player2.clickCard(this.swiftMagistrate2);
                expect(this.conflict.attackerSkill).toBe(0);
            });

            it('should be correctly displayed in chat when a magistrate is added to the conflict', function() {
                this.spy = spyOn(this.game, 'addMessage');
                this.player2.pass();
                this.player1.clickCard('charge');
                this.player1.clickCard(this.swiftMagistrate2);
                expect(this.spy).toHaveBeenCalledWith('{0} - Attacker: {1} Defender: {2}', 'Military Air conflict', 2, 3);
            });
        });
    });
});
