describe('Be Our Geist', function () {
    describe("Be Our Geist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['a-strong-feeling', 'be-our-geist'],
                    inPlay: ['miss-chievous'],
                    discard: new Array(7).fill('poke').concat(['charette', 'library-of-babble']) // not yet haunted
                },
                player2: {
                    amber: 4,
                    inPlay: ['dust-pixie'],
                    discard: new Array(8).fill('poke').concat(['bot-bookton']) // not yet haunted
                }
            });
        });

        it('does nothing when neither play is not haunted', function () {
            this.player1.play(this.beOurGeist);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('can play a friendly creature from discard when haunted', function () {
            this.player1.play(this.aStrongFeeling);
            this.player1.play(this.beOurGeist);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.libraryOfBabble);
            expect(this.player1).not.toBeAbleToSelect(this.poke);
            expect(this.player1).not.toBeAbleToSelect(this.botBookton);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.missChievous);
            this.player1.clickCard(this.charette);
            this.player1.clickPrompt('Right');
            expect(this.charette.location).toBe('play area');
            expect(this.charette.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.player.creaturesInPlay).toContain(this.charette);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('can play a creature from either discard when both players are haunted', function () {
            this.player1.play(this.aStrongFeeling);
            this.player1.fightWith(this.missChievous, this.dustPixie);
            this.player1.play(this.beOurGeist);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.libraryOfBabble);
            expect(this.player1).not.toBeAbleToSelect(this.poke);
            expect(this.player1).toBeAbleToSelect(this.botBookton);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.missChievous);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Right');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.player1.amber).toBe(4);
            expect(this.player1.player.creaturesInPlay).toContain(this.dustPixie);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
