describe('Bump in the Night', function () {
    describe("Bump in the Night's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    token: 'minion',
                    hand: ['bump-in-the-night', 'a-strong-feeling'],
                    inPlay: ['touchstone'],
                    deck: new Array(12).fill('toad'),
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['dust-pixie', 'hunting-witch', 'troll']
                }
            });

            this.minion1 = this.player1.player.deck[0];
            this.minion2 = this.player1.player.deck[1];
        });

        it('should deal 2 damage once if not haunted', function () {
            this.player1.play(this.bumpInTheNight);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.touchstone);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should deal 2 damage once to kill a creature and make a token once, if not haunted', function () {
            this.player1.play(this.bumpInTheNight);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.minion1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should deal 2 damage twice if haunted', function () {
            this.player1.scrap(this.aStrongFeeling);
            this.player1.play(this.bumpInTheNight);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.touchstone);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should deal 2 damage to kill a creature and make a token twice, if haunted', function () {
            this.player1.scrap(this.aStrongFeeling);
            this.player1.play(this.bumpInTheNight);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.huntingWitch);
            expect(this.huntingWitch.location).toBe('discard');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay[1]).toBe(this.minion1);
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.minion2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should repeat if haunted, even if no tokens are made', function () {
            this.player1.player.deck = [];
            this.player1.scrap(this.aStrongFeeling);
            this.player1.play(this.bumpInTheNight);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            this.player1.clickCard(this.huntingWitch);
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
