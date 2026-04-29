describe('Conscription', function () {
    describe("Conscription's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    token: 'grumpus',
                    hand: ['conscription', 'questor-jarta', 'rhetor-gallim', 'brutodon-auxiliary'],
                    inPlay: ['pelf']
                },
                player2: {
                    inPlay: ['umbra', 'bumpsy', 'dust-pixie', 'ancient-bear']
                }
            });
        });

        it('should make tokens up to difference with opponent', function () {
            this.player1.play(this.conscription);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(
                this.player2.player.creaturesInPlay.length
            );
            expect(this.player1).isReadyToTakeAction();
        });

        it('should make no tokens when equal', function () {
            this.player1.play(this.questorJarta);
            this.player1.play(this.rhetorGallim);
            this.player1.play(this.brutodonAuxiliary);
            this.player1.play(this.conscription);
            expect(this.player1.player.creaturesInPlay.length).toBe(
                this.player2.player.creaturesInPlay.length
            );
            expect(this.player1).isReadyToTakeAction();
        });

        it('should make a single token when one less creature', function () {
            this.player1.play(this.questorJarta);
            this.player1.play(this.rhetorGallim);
            this.player1.play(this.conscription);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(
                this.player2.player.creaturesInPlay.length
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
