describe('Beyond All Darkness', function () {
    describe("Beyond All Darkness's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    token: 'catena-fiend',
                    inPlay: ['shooler', 'gub', 'ember-imp'],
                    hand: ['beyond-all-darkness'],
                    deck: ['toad', 'toad', 'toad']
                },
                player2: {
                    inPlay: ['dust-pixie', 'umbra']
                }
            });

            this.toad1 = this.player1.deck[0];
            this.toad2 = this.player1.deck[1];
            this.toad3 = this.player1.deck[2];
        });

        it('should cause a token to be made when enemy creatures are destroyed', function () {
            this.player1.play(this.beyondAllDarkness);
            this.player1.fightWith(this.shooler, this.umbra);
            this.player1.clickPrompt('Right');
            expect(this.toad1.location).toBe('play area');
            this.player1.fightWith(this.gub, this.dustPixie);
            this.player1.clickPrompt('Right');
            expect(this.toad2.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should cause a token to be made when friendly creatures are destroyed', function () {
            this.player1.play(this.beyondAllDarkness);
            this.player1.fightWith(this.emberImp, this.umbra);
            this.player1.clickPrompt('Autoresolve');
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            expect(this.toad1.location).toBe('play area');
            expect(this.toad2.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
