describe('Banshee Suit', function () {
    describe("Banshee Suit's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['banshee-suit'],
                    inPlay: ['echofly'],
                    discard: ['dust-pixie', 'hunting-witch', 'winds-of-death']
                },
                player2: {
                    inPlay: ['troll']
                }
            });

            this.player1.playUpgrade(this.bansheeSuit, this.echofly);
        });

        it('archives the creature and 2 discard cards on destroy', function () {
            this.player1.fightWith(this.echofly, this.troll);
            expect(this.echofly.location).toBe('archives');
            expect(this.dustPixie.location).toBe('archives');
            expect(this.huntingWitch.location).toBe('archives');
            expect(this.windsOfDeath.location).toBe('discard');
            expect(this.bansheeSuit.location).toBe('discard');
            expect(this.player1.player.archives.length).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('archives the creature and 2 discard cards when opponent destroys it', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.echofly);
            expect(this.echofly.location).toBe('archives');
            expect(this.dustPixie.location).toBe('archives');
            expect(this.huntingWitch.location).toBe('archives');
            expect(this.windsOfDeath.location).toBe('discard');
            expect(this.bansheeSuit.location).toBe('discard');
            expect(this.player1.player.archives.length).toBe(3);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
