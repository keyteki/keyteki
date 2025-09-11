describe('Levy of Souls', function () {
    describe("Levy of Soul's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    token: 'catena-fiend',
                    inPlay: ['levy-of-souls', 'catena-fiend:toad', 'shooler'],
                    deck: new Array(12).fill('toad')
                },
                player2: {
                    amber: 6,
                    inPlay: ['keyfrog', 'lupo-the-scarred', 'mushroom-man'],
                    hand: ['dust-pixie']
                }
            });

            this.toad1 = this.player1.player.creaturesInPlay[0];
            this.toad2 = this.player1.player.deck[0];

            this.player1.useAction(this.levyOfSouls);
            this.player1.clickPrompt('Left');
        });

        it('should make a token on action', function () {
            expect(this.toad1.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.toad2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should increase key costs next turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.playCreature(this.dustPixie);
            this.player2.fightWith(this.keyfrog, this.toad1);
            this.player2.forgeKey('blue');
            expect(this.player2.amber).toBe(0);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should increase key costs dynamically during turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.playCreature(this.dustPixie);
            this.player2.fightWith(this.lupoTheScarred, this.toad1);
            this.player2.fightWith(this.mushroomMan, this.toad2);
            this.player2.fightWith(this.keyfrog, this.shooler);
            this.player2.forgeKey('blue');
            expect(this.player2.amber).toBe(2);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
