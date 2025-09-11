describe('Improvised Aviation', function () {
    describe("Improvised Aviation's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['improvised-aviation', 'troll', 'krump', 'anger'],
                    inPlay: ['the-warchest', 'ganger-chieftain', 'shock-herder']
                },
                player2: {
                    inPlay: [
                        'lamindra',
                        'dew-faerie',
                        'urchin',
                        'harmonia',
                        'seeker-needle',
                        'special-delivery'
                    ]
                }
            });
        });

        it('should allow next creature to enter play ready', function () {
            this.player1.play(this.improvisedAviation);
            this.player1.playCreature(this.troll);
            expect(this.troll.exhausted).toBe(false);
            this.player1.playCreature(this.krump);
            expect(this.krump.exhausted).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('gives a fight ability to shuffle an artifact', function () {
            let shuffled = null;
            this.player2.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));

            this.player1.play(this.improvisedAviation);

            // No fight effect until a creature is played.
            this.player1.fightWith(this.gangerChieftain, this.urchin);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

            this.player1.playCreature(this.troll);
            this.player1.fightWith(this.troll, this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.theWarchest);
            expect(this.player1).toBeAbleToSelect(this.seekerNeedle);
            expect(this.player1).toBeAbleToSelect(this.specialDelivery);
            this.player1.clickCard(this.seekerNeedle);
            expect(this.seekerNeedle.location).toBe('deck');
            expect(this.player2.player.deck).toContain(this.seekerNeedle);
            expect(shuffled).toBe(this.player2.player);

            // Second fight in the same turn should do the same thing.
            this.player1.play(this.anger);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.dewFaerie);
            expect(this.player1).toBeAbleToSelect(this.theWarchest);
            expect(this.player1).toBeAbleToSelect(this.specialDelivery);
            this.player1.clickCard(this.theWarchest);
            expect(this.theWarchest.location).toBe('deck');
            expect(this.player1.player.deck).toContain(this.theWarchest);
            expect(shuffled).toBe(this.player1.player);

            // No fight effects for other creatures after it's played..
            this.player1.fightWith(this.shockHerder, this.harmonia);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');

            // No more fight effect.
            this.player1.fightWith(this.troll, this.lamindra);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
