describe('saurian-egg', function() {
    integration(function() {
        describe('Saurian Egg\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'saurian',
                        inPlay: ['saurian-egg','tantadlin','gargantodon','paraguardian','imperial-road'],
                        hand: ['questor-jarta','rhetor-gallim','senator-shrix','troll','alaka','bumblebird']
                    },
                    player2: {
                        amber: 1,
                        inPlay: ['tantadlin'],
                        hand: ['ember-imp']
                    }
                });
            });

            it('should discard 2 cards that are not saurian creatures and not be destoryed.', function() {
                this.player1.player.deck = [];
                this.player1.moveCard(this.troll, 'deck');
                this.player1.moveCard(this.tantadlin, 'deck');
                this.player1.clickCard(this.saurianEgg);
                this.player1.clickPrompt('Use this card\'s Omni ability');
                expect(this.tantadlin.location).toBe('discard');
                expect(this.troll.location).toBe('discard');
                expect(this.saurianEgg.location).toBe('play area');
            });

            it('should discard 2 cards where the first is saurian and it goes into play', function() {
                this.player1.player.deck = [];
                this.player1.moveCard(this.tantadlin, 'deck');
                this.player1.moveCard(this.gargantodon, 'deck');
                this.player1.clickCard(this.saurianEgg);
                this.player1.clickPrompt('Use this card\'s Omni ability');

                expect(this.player1).toHavePromptButton('Left');
                this.player1.clickPrompt('Left');
                expect(this.gargantodon.location).toBe('play area');

                expect(this.tantadlin.location).toBe('discard');
                expect(this.gargantodon.location).toBe('play area');
                expect(this.player1.player.cardsInPlay[0]).toBe(this.gargantodon);
                expect(this.gargantodon.exhausted).toBe(false);
                expect(this.gargantodon.power).toBe(19);

                expect(this.saurianEgg.location).toBe('discard');
            });

            it('should have a omni menu, but not reap or fight', function() {
                this.player1.clickCard(this.saurianEgg);
                expect(this.player1).not.toHavePromptButton('Fight with this creature');
                expect(this.player1).not.toHavePromptButton('Reap with this creature');
                expect(this.player1).toHavePromptButton('Use this card\'s Omni ability');
            });

            it('should discard only 1 cards that and not be destoryed, when only 1 non-saurian card in the deck.', function() {
                this.player1.player.deck = [];
                this.player1.moveCard(this.troll, 'deck');
                this.player1.clickCard(this.saurianEgg);
                this.player1.clickPrompt('Use this card\'s Omni ability');
                expect(this.troll.location).toBe('discard');
                expect(this.saurianEgg.location).toBe('play area');
            });

            it('should do nothing when no cards in deck', function() {
                this.player1.player.deck = [];
                this.player1.clickCard(this.saurianEgg);
                this.player1.clickPrompt('Use this card\'s Omni ability');
                expect(this.player1).not.toHavePromptButton('Left');
                expect(this.saurianEgg.location).toBe('play area');
            });

            it('when only 1 saurian creature in deck that only has 1 card it should be destroyed', function() {
                this.player1.player.deck = [];
                this.player1.moveCard(this.gargantodon, 'deck');
                this.player1.clickCard(this.saurianEgg);
                this.player1.clickPrompt('Use this card\'s Omni ability');
                expect(this.player1).toHavePromptButton('Left');
                this.player1.clickPrompt('Left');
                expect(this.saurianEgg.location).toBe('discard');
            });

            it('when 2 saurian creatures in deck it should put both into play', function() {
                this.player1.player.deck = [];
                this.player1.moveCard(this.gargantodon, 'deck');
                this.player1.moveCard(this.paraguardian, 'deck');

                this.player1.clickCard(this.saurianEgg);
                this.player1.clickPrompt('Use this card\'s Omni ability');
                expect(this.player1).toHavePromptButton('Left');
                this.player1.clickPrompt('Left');
                expect(this.player1).toHavePromptButton('Left');
                this.player1.clickPrompt('Left');

                expect(this.gargantodon.location).toBe('play area');
                expect(this.gargantodon.exhausted).toBe(false);
                expect(this.gargantodon.power).toBe(19);

                expect(this.paraguardian.location).toBe('play area');
                expect(this.paraguardian.exhausted).toBe(false);
                expect(this.paraguardian.power).toBe(9);

                expect(this.saurianEgg.location).toBe('discard');
            });

            it('when 2 saurian creature in deck it should not be destroyed if it was warded', function() {
                this.player1.player.deck = [];
                this.player1.moveCard(this.gargantodon, 'deck');
                this.player1.moveCard(this.paraguardian, 'deck');
                this.saurianEgg.tokens.ward = 1;
                expect(this.saurianEgg.warded).toBe(true);
                this.player1.clickCard(this.saurianEgg);
                this.player1.clickPrompt('Use this card\'s Omni ability');
                expect(this.player1).toHavePromptButton('Left');
                this.player1.clickPrompt('Left');
                expect(this.player1).toHavePromptButton('Left');
                this.player1.clickPrompt('Left');
                expect(this.saurianEgg.location).toBe('play area');
            });
        });
    });
});
