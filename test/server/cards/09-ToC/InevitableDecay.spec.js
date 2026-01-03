describe('Inevitable Decay', function () {
    describe("Inevitable Decay's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    token: 'minion',
                    hand: ['inevitable-decay', 'singing-scythe'],
                    inPlay: ['wretched-doll', 'touchstone'],
                    deck: new Array(12).fill('toad')
                },
                player2: {
                    inPlay: ['library-of-babble', 'troll']
                }
            });

            this.minion1 = this.player1.player.deck[0];
            this.minion2 = this.player1.player.deck[1];
            this.minion3 = this.player1.player.deck[2];
        });

        it('should destroy each artifact and upgrade and make a token creature for each one destroyed', function () {
            this.player1.playUpgrade(this.singingScythe, this.troll);
            this.player1.play(this.inevitableDecay);
            expect(this.singingScythe.location).toBe('discard');
            expect(this.wretchedDoll.location).toBe('discard');
            expect(this.libraryOfBabble.location).toBe('discard');
            expect(this.touchstone.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.minion3);
            expect(this.player1.player.creaturesInPlay[1]).toBe(this.minion2);
            expect(this.player1.player.creaturesInPlay[2]).toBe(this.minion1);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
