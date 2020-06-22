describe('Dysania', function () {
    describe("Dysania's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['dysania'],
                    inPlay: ['troll']
                },
                player2: {
                    hand: ['sample-collection'],
                    archives: ['dextre', 'labwork', 'ganymede-archivist']
                }
            });
        });

        it("should discard opponent's archives and gain amber", function () {
            this.player1.play(this.dysania);

            expect(this.dextre.location).toBe('discard');
            expect(this.labwork.location).toBe('discard');
            expect(this.ganymedeArchivist.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
        });

        it("should not consider own card in opponent's archives to gain amber", function () {
            this.player1.player.keys = { red: true, blue: false, yellow: false };
            this.player1.endTurn();

            // Capture an opponent's card first
            this.player2.clickPrompt('mars');
            expect(this.player2).toHavePrompt(
                'Do you wish to take all the cards in archives into your hand?'
            );
            this.player2.clickPrompt('No');
            this.player2.play(this.sampleCollection);
            expect(this.player2).toHavePrompt('Sample Collection');
            expect(this.player2).toBeAbleToSelect(this.troll);
            this.player2.clickCard(this.troll);
            expect(this.troll.location).toBe('archives');
            this.player2.endTurn();

            this.player1.clickPrompt('logos');
            this.player1.play(this.dysania);
            this.player1.endTurn();

            expect(this.dextre.location).toBe('discard');
            expect(this.labwork.location).toBe('discard');
            expect(this.ganymedeArchivist.location).toBe('discard');
            expect(this.troll.location).toBe('hand');
            expect(this.player1.amber).toBe(3); // and not 4
        });
    });
});
