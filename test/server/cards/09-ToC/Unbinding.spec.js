describe('Unbinding', function () {
    describe("Unbinding's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    token: 'catena-fiend',
                    hand: ['unbinding'],
                    inPlay: ['shooler', 'spyyyder'],
                    deck: new Array(12).fill('toad')
                },
                player2: {
                    amber: 6,
                    inPlay: ['troll']
                }
            });

            this.toad1 = this.player1.player.deck[0];
        });

        it('should make a token on play', function () {
            this.player1.play(this.unbinding);
            this.player1.clickPrompt('Left');
            expect(this.toad1.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.toad1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should archive if a friendly creature was destroyed', function () {
            this.player1.fightWith(this.shooler, this.troll);
            this.player1.play(this.unbinding);
            this.player1.clickPrompt('Right');
            expect(this.unbinding.location).toBe('archives');
            expect(this.player1.player.archives.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not archive if just an enemy creature was destroyed', function () {
            this.player1.fightWith(this.spyyyder, this.troll);
            this.player1.play(this.unbinding);
            this.player1.clickPrompt('Right');
            expect(this.unbinding.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
