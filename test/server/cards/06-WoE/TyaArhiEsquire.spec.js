describe('Tya Arhi Esquire', function () {
    describe("Tya Arhi Esquire's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    token: 'grunt',
                    inPlay: ['antiquities-dealer', 'grunt:sandhopper', 'tya-arhĭ-esquire'],
                    hand: ['mass-buyout']
                },
                player2: {
                    token: 'raider',
                    inPlay: ['raider:batdrone', 'bumpsy']
                }
            });
        });

        it('gives all friendly non-token creatures a destroyed effect', function () {
            this.player1.fightWith(this.antiquitiesDealer, this.bumpsy);
            this.player1.clickPrompt('Right');
            expect(this.antiquitiesDealer.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);

            this.player1.fightWith(this.tyaArhĭEsquire, this.bumpsy);
            this.player1.clickPrompt('Right');
            expect(this.tyaArhĭEsquire.location).toBe('discard');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player2.player.creaturesInPlay.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('makes token creatures after a board wipe', function () {
            this.player1.play(this.massBuyout);
            this.player1.clickPrompt('Autoresolve');
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            expect(this.antiquitiesDealer.location).toBe('discard');
            expect(this.grunt.location).toBe('discard');
            expect(this.tyaArhĭEsquire.location).toBe('discard');
            expect(this.raider.location).toBe('discard');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player2.player.creaturesInPlay.length).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
