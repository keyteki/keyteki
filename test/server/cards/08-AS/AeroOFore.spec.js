describe("Aero O'Fore", function () {
    describe("Aero O'Fore's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['gub', 'charette', 'aero-o-fore', 'troll', 'krump']
                },
                player2: {
                    amber: 6
                }
            });
        });

        it('should do nothing if not in center', function () {
            this.player2.moveCard(this.troll, 'discard');
            this.player1.reap(this.aeroOFore);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should rearrange battleline and capture onto flank creatures when in center', function () {
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.gub);
            expect(this.player1.player.creaturesInPlay[3]).toBe(this.troll);
            this.player1.reap(this.aeroOFore);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).toBeAbleToSelect(this.aeroOFore);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.gub);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.troll);
            expect(this.player1.player.creaturesInPlay[3]).toBe(this.gub);
            this.player1.clickPrompt('Done');
            expect(this.troll.amber).toBe(2);
            expect(this.krump.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be able to rearrange itself to flank and capture', function () {
            this.player1.reap(this.aeroOFore);
            this.player1.clickCard(this.gub);
            this.player1.clickCard(this.aeroOFore);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Done');
            expect(this.aeroOFore.amber).toBe(2);
            expect(this.krump.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be able to distribute less than 4 amber between flank creatures', function () {
            this.player2.amber = 3;
            this.player1.reap(this.aeroOFore);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.gub);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Done');
            expect(this.gub.amber).toBe(2);
            expect(this.krump.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
