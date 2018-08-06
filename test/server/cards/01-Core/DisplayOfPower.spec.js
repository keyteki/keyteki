describe('Display of Power', function() {
    integration(function() {
        describe('Display of Power\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDeck: ['akodo-toturi'],
                        inPlay: ['tattooed-wanderer'],
                        hand: ['seeker-of-knowledge', 'fine-katana', 'charge']
                    },
                    player2: {
                        role: 'keeper-of-water',
                        provinces: ['pilgrimage', 'kuroi-mori'],
                        inPlay: ['shinjo-outrider'],
                        hand: ['display-of-power', 'display-of-power', 'talisman-of-the-sun'],
                        dynastyDeck: ['keeper-initiate']
                    }
                });
                this.akodoToturi = this.player1.placeCardInProvince('akodo-toturi');
                this.keeperInitiate = this.player2.placeCardInProvince('keeper-initiate');
                this.noMoreActions();
                this.initiateConflict({
                    province: 'kuroi-mori',
                    ring: 'earth',
                    type: 'military',
                    attackers: ['tattooed-wanderer'],
                    defenders: []
                });
            });

            it('should trigger in 3.2.3', function() {
                this.player2.pass();
                this.player1.playAttachment('fine-katana', 'tattooed-wanderer');
                this.noMoreActions();

                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('display-of-power');
            });

            it('should not trigger unless the conflict is unopposed', function() {
                this.player2.clickCard('shinjo-outrider');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Earth Ring');
            });

            it('should resolve the ring effect and claim the ring for the defending player', function() {
                this.noMoreActions();

                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('display-of-power');
                this.player2.clickCard('display-of-power');
                this.player2.pass();
                expect(this.player2).toHavePrompt('Earth Ring');
                this.player2.clickPrompt('Draw a card and opponent discards');
                expect(this.game.rings.earth.claimedBy).toBe(this.player2.player.name);
            });

            it('when 2 DoP are played the second shouldn\'t do anything', function() {
                this.spy = spyOn(this.game, 'addMessage');
                this.noMoreActions();
                this.player2.clickCard('display-of-power');
                this.player2.clickCard('display-of-power', 'hand');
                expect(this.player2).toHavePrompt('Earth Ring');
                this.player2.clickPrompt('Draw a card and opponent discards');
                expect(this.game.rings.earth.claimedBy).toBe(this.player2.player.name);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should allow the defender to choose a ring effect when the conflict ring has multiple elements', function() {
                this.player2.pass();
                this.player1.playCharacterFromHand('seeker-of-knowledge');
                this.player1.clickPrompt('Conflict');
                this.noMoreActions();
                this.player2.clickCard('display-of-power');
                this.player2.pass();
                expect(this.player2).toHavePrompt('Resolve Ring Effect');
                this.player2.clickRing('air');
                expect(this.player2).toHavePrompt('Air Ring');
            });

            it('should allow any reactions to claiming the ring to trigger', function() {
                this.player2.clickCard('kuroi-mori');
                this.player2.clickPrompt('Switch the contested ring');
                this.player2.clickRing('water');
                this.noMoreActions();
                this.player2.clickCard('display-of-power');
                this.player2.pass();
                expect(this.player2).toHavePrompt('Water Ring');
                this.player2.clickPrompt('Don\'t resolve');
                expect(this.game.rings.water.claimedBy).toBe(this.player2.player.name);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.keeperInitiate);
                this.player2.clickCard(this.keeperInitiate);
                expect(this.keeperInitiate.location).toBe('play area');
            });

            it('shouldn\'t allow the opponent to trigger reactions to claiming the ring', function() {
                this.player2.pass();
                this.player1.clickCard('charge');
                this.player1.clickCard(this.akodoToturi);
                this.noMoreActions();
                this.player2.clickCard('display-of-power');
                this.player2.pass();
                this.player1.clickPrompt('No');
                this.player2.clickPrompt('Draw a card and opponent discards');
                expect(this.game.rings.earth.claimedBy).toBe(this.player2.player.name);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should claim the ring at Pilgrimage, but DoPs ring effect should be cancelled', function() {
                this.talisman = this.player2.playAttachment('talisman-of-the-sun', 'shinjo-outrider');
                this.player1.pass();
                this.player2.clickCard(this.talisman);
                this.player2.clickCard('pilgrimage');
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('display-of-power');
                this.player2.clickCard('display-of-power');
                this.player2.pass();
                expect(this.game.rings.earth.claimedBy).toBe(this.player2.player.name);
                expect(this.player1).toHavePrompt('Action Window');
            });
        });
    });
});
