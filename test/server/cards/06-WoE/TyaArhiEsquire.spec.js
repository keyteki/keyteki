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
            expect(this.player1).isReadyToTakeAction();
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
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with Prospectors, an empty deck, and Mass Buyout', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    token: 'prospector',
                    inPlay: [
                        'tya-arhĭ-esquire',
                        'antiquities-dealer',
                        'prospector:flaxia',
                        'prospector:bumpsy'
                    ],
                    hand: ['mass-buyout'],
                    discard: ['pen-pal', 'change-agent']
                },
                player2: {}
            });

            const prospectors = this.player1.player.creaturesInPlay.filter(
                (c) => c.name === 'Prospector'
            );
            this.prospector1 = prospectors[0];
            this.prospector2 = prospectors[1];
            this.player1.deck = [];
        });

        it('lets the player order make-token and prospector draw triggers even with an empty deck', function () {
            this.player1.play(this.massBuyout);
            const handSize = this.player1.player.hand.length;
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.tyaArhĭEsquire);
            expect(this.player1).toBeAbleToSelect(this.antiquitiesDealer);
            expect(this.player1).toBeAbleToSelect(this.prospector1);
            expect(this.player1).toBeAbleToSelect(this.prospector2);

            // Tya Arhi fails to make a token
            this.player1.clickCard(this.tyaArhĭEsquire);
            expect(this.player1).toHavePrompt('Triggered Abilities');

            // Prospector draws and flips the discard
            this.player1.clickCard(this.prospector1);
            expect(this.player1.deck.length).toBeGreaterThan(0);
            expect(this.player1).toHavePrompt('Triggered Abilities');

            // Antiquities Dealer makes a token
            this.player1.clickCard(this.antiquitiesDealer);
            this.player1.clickPrompt('Right');

            // Prospector draws a card

            // After all destroyed triggers resolve, the cards move to discard.
            expect(this.tyaArhĭEsquire.location).toBe('discard');
            expect(this.antiquitiesDealer.location).toBe('discard');
            expect(this.prospector1.location).toBe('discard');
            expect(this.prospector2.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.player1.amber).toBe(2);
            expect(this.player1.player.hand.length).toBe(handSize + 1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
