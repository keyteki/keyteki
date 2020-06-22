describe('saurian-egg', function () {
    describe("Saurian Egg's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: [
                        'saurian-egg',
                        'tantadlin',
                        'gargantodon',
                        'paraguardian',
                        'imperial-road'
                    ],
                    hand: [
                        'questor-jarta',
                        'rhetor-gallim',
                        'senator-shrix',
                        'troll',
                        'alaka',
                        'bumblebird',
                        'deusillus',
                        'deusillus2'
                    ]
                },
                player2: {
                    amber: 1,
                    inPlay: ['tantadlin'],
                    hand: ['ember-imp']
                }
            });
        });

        it('should have a omni menu, but not reap or fight', function () {
            this.player1.clickCard(this.saurianEgg);
            expect(this.player1).not.toHavePromptButton('Fight with this creature');
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton("Use this card's Omni ability");
        });

        it('should discard 2 cards that are not saurian creatures and not be destoryed.', function () {
            this.player1.player.deck = [];
            this.player1.moveCard(this.troll, 'deck');
            this.player1.moveCard(this.tantadlin, 'deck');
            this.player1.useAction(this.saurianEgg, true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

            expect(this.tantadlin.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.saurianEgg.location).toBe('play area');
        });

        it('should discard 2 cards where the first is saurian and it goes into play', function () {
            this.player1.player.deck = [];
            this.player1.moveCard(this.tantadlin, 'deck');
            this.player1.moveCard(this.gargantodon, 'deck');
            this.player1.useAction(this.saurianEgg, true);
            this.player1.clickPrompt('Left');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

            expect(this.tantadlin.location).toBe('discard');

            expect(this.gargantodon.location).toBe('play area');
            expect(this.player1.player.cardsInPlay[0]).toBe(this.gargantodon);
            expect(this.gargantodon.exhausted).toBe(false);
            expect(this.gargantodon.power).toBe(19);

            expect(this.saurianEgg.location).toBe('discard');
        });

        it('should discard only 1 card and not be destoryed, when only 1 non-saurian card in the deck.', function () {
            this.player1.player.deck = [];
            this.player1.moveCard(this.troll, 'deck');
            this.player1.useAction(this.saurianEgg, true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

            expect(this.troll.location).toBe('discard');
            expect(this.saurianEgg.location).toBe('play area');
        });

        it('should do nothing when no cards in deck', function () {
            this.player1.player.deck = [];
            this.player1.useAction(this.saurianEgg, true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

            expect(this.saurianEgg.location).toBe('play area');
        });

        it('when only 1 saurian creature in deck that only has 1 card it should be destroyed', function () {
            this.player1.player.deck = [];
            this.player1.moveCard(this.gargantodon, 'deck');
            this.player1.useAction(this.saurianEgg, true);
            this.player1.clickPrompt('Left');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

            expect(this.saurianEgg.location).toBe('discard');
        });

        it('when 2 saurian creatures in deck it should put both into play', function () {
            this.player1.player.deck = [];
            this.player1.moveCard(this.gargantodon, 'deck');
            this.player1.moveCard(this.paraguardian, 'deck');
            this.player1.useAction(this.saurianEgg, true);
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

            expect(this.gargantodon.location).toBe('play area');
            expect(this.gargantodon.exhausted).toBe(false);
            expect(this.gargantodon.power).toBe(19);

            expect(this.paraguardian.location).toBe('play area');
            expect(this.paraguardian.exhausted).toBe(false);
            expect(this.paraguardian.power).toBe(9);

            expect(this.saurianEgg.location).toBe('discard');
        });

        it('when 2 saurian creature in deck it should not be destroyed if it was warded', function () {
            this.player1.player.deck = [];
            this.player1.moveCard(this.gargantodon, 'deck');
            this.player1.moveCard(this.paraguardian, 'deck');
            this.saurianEgg.tokens.ward = 1;
            expect(this.saurianEgg.warded).toBe(true);
            this.player1.useAction(this.saurianEgg, true);
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

            expect(this.saurianEgg.location).toBe('play area');
        });

        it('when only 1 gigantic part is discarded and other card is saurian, should be destroyed, and gigantic part should be discarded', function () {
            this.player1.player.deck = [];
            this.player1.moveCard(this.gargantodon, 'deck');
            this.player1.moveCard(this.deusillus, 'deck');
            this.player1.useAction(this.saurianEgg, true);
            this.player1.clickPrompt('Left');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

            expect(this.gargantodon.location).toBe('play area');
            expect(this.gargantodon.exhausted).toBe(false);
            expect(this.gargantodon.power).toBe(19);

            expect(this.deusillus.location).toBe('discard');
            expect(this.saurianEgg.location).toBe('discard');
        });

        it('when only 1 gigantic part is discarded and other card is not saurian, should not be destroyed, and gigantic part should be discarded', function () {
            this.player1.player.deck = [];
            this.player1.moveCard(this.tantadlin, 'deck');
            this.player1.moveCard(this.deusillus, 'deck');
            this.player1.useAction(this.saurianEgg, true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

            expect(this.deusillus.location).toBe('discard');
            expect(this.tantadlin.location).toBe('discard');
            expect(this.saurianEgg.location).toBe('play area');
        });

        it('when only 2 gigantic parts are discarded should be destroyed, and gigantic part put into play', function () {
            this.player1.player.deck = [];
            this.player1.moveCard(this.deusillus, 'deck');
            this.player1.moveCard(this.deusillus2, 'deck');
            this.player1.useAction(this.saurianEgg, true);
            this.player1.clickPrompt('Left');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

            expect(this.deusillus2.location).toBe('play area');
            expect(this.deusillus2.exhausted).toBe(false);
            expect(this.deusillus2.power).toBe(23);

            expect(this.saurianEgg.location).toBe('discard');
        });
    });
});
