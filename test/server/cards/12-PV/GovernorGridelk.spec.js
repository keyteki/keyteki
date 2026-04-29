describe('Governor Gridelk', function () {
    describe("Governor Gridelk's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    inPlay: ['governor-gridelk']
                },
                player2: {
                    amber: 4,
                    inPlay: ['dust-pixie', 'urchin'],
                    discard: ['anger', 'troll', 'hunting-witch']
                }
            });
        });

        it('should put topmost creature from opponent discard into play', function () {
            this.player1.fightWith(this.governorGridelk, this.urchin);
            this.player1.clickPrompt('Right');
            expect(this.troll.location).toBe('play area');
            expect(this.troll.controller).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should put fought and destroyed creature into play', function () {
            this.player1.fightWith(this.governorGridelk, this.dustPixie);
            this.player1.clickPrompt('Right');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.dustPixie.controller).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should do nothing if opponent discard is empty', function () {
            this.player2.player.discard = [];
            this.player1.fightWith(this.governorGridelk, this.urchin);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
