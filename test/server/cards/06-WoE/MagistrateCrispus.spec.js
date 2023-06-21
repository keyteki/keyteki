describe('Magistrate Crispus', function () {
    describe("Magistrate Crispus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'saurian',
                    inPlay: ['rhetor-gallim', 'antiquities-dealer', 'ikwijĭ-outpost'],
                    hand: ['magistrate-crispus', 'talent-scout']
                },
                player2: {
                    amber: 4,
                    inPlay: ['subtle-maul', 'speed-sigil'],
                    hand: ['hypnobeam', 'harland-mindlock', 'sneklifter', 'borrow', 'urchin']
                }
            });
        });

        it('lets you take control back of a creature', function () {
            this.player1.play(this.magistrateCrispus);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.play(this.hypnobeam);
            this.player2.clickCard(this.rhetorGallim);
            expect(this.player2.player.creaturesInPlay).toContain(this.rhetorGallim);
            this.player2.endTurn();
            this.player1.clickPrompt('saurian');
            this.player1.endTurn();
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay).toContain(this.rhetorGallim);
            this.player2.clickPrompt('mars');
        });

        it('lets you take control back of an artifact', function () {
            this.player1.play(this.magistrateCrispus);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.playCreature(this.sneklifter);
            this.player2.clickCard(this.ikwijĭOutpost);
            expect(this.player2.player.cardsInPlay).toContain(this.ikwijĭOutpost);
            this.player2.endTurn();
            this.player1.clickPrompt('saurian');
            this.player1.endTurn();
            expect(this.player1.player.cardsInPlay).toContain(this.ikwijĭOutpost);
            this.player2.clickPrompt('mars');
        });

        it('lets opponent take back control back', function () {
            this.player1.play(this.magistrateCrispus);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.player1.playCreature(this.talentScout);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Right'); // Urchin
            expect(this.player1.player.creaturesInPlay).toContain(this.urchin);
            expect(this.player2.player.creaturesInPlay).toContain(this.talentScout);
            this.player1.endTurn();
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay).toContain(this.talentScout);
            expect(this.player2.player.creaturesInPlay).toContain(this.urchin);
            this.player2.clickPrompt('mars');
        });

        it('lets you take control back of multiple creatures', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.play(this.hypnobeam);
            this.player2.clickCard(this.rhetorGallim);
            this.player2.endTurn();
            this.player1.clickPrompt('saurian');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.playCreature(this.harlandMindlock);
            this.player2.clickCard(this.antiquitiesDealer);
            this.player2.clickPrompt('Right');
            this.player2.endTurn();
            this.player1.clickPrompt('saurian');
            this.player1.play(this.magistrateCrispus);
            this.player1.endTurn();
            this.player1.clickCard(this.rhetorGallim);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay).toContain(this.rhetorGallim);
            expect(this.player1.player.creaturesInPlay).toContain(this.antiquitiesDealer);
            this.player2.clickPrompt('mars');
        });
    });
});
