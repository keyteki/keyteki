describe('Sneklifter', function () {
    describe("Sneklifter's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'shadows',
                    hand: ['sneklifter', 'troll', 'dominator-bauble', 'hock', 'relentless-whispers']
                },
                player2: {
                    amber: 12,
                    inPlay: [
                        'urchin',
                        'seeker-needle',
                        'mighty-javelin',
                        'library-of-babble',
                        'the-sting'
                    ]
                }
            });
        });

        it('should take control of a shadows artifact', function () {
            this.player1.play(this.sneklifter);
            expect(this.player1).toHavePrompt('Sneklifter');
            expect(this.player1).toBeAbleToSelect(this.seekerNeedle);
            expect(this.player1).toBeAbleToSelect(this.mightyJavelin);
            expect(this.player1).toBeAbleToSelect(this.libraryOfBabble);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.dominatorBauble);
            this.player1.clickCard(this.seekerNeedle);
            expect(this.player1.player.cardsInPlay).toContain(this.seekerNeedle);
            expect(this.seekerNeedle.controller).toBe(this.player1.player);
            this.player1.useAction(this.seekerNeedle);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
        });

        it('should not change the house of an artifact which is of a house that player has in their deck', function () {
            this.player1.play(this.sneklifter);
            this.player1.clickCard(this.mightyJavelin);
            expect(this.player1.player.cardsInPlay).toContain(this.mightyJavelin);
            expect(this.mightyJavelin.controller).toBe(this.player1.player);
            expect(this.mightyJavelin.hasHouse('shadows')).toBe(false);
            expect(this.mightyJavelin.hasHouse('brobnar')).toBe(true);
        });

        it('should change the house of an artifact which is not of a house that player has in their deck', function () {
            this.player1.play(this.sneklifter);
            this.player1.clickCard(this.libraryOfBabble);
            expect(this.player1.player.cardsInPlay).toContain(this.libraryOfBabble);
            expect(this.libraryOfBabble.controller).toBe(this.player1.player);
            expect(this.libraryOfBabble.hasHouse('shadows')).toBe(true);
            expect(this.libraryOfBabble.hasHouse('logos')).toBe(false);
            this.player1.useAction(this.libraryOfBabble);
            expect(this.player1.hand.length).toBe(5);
        });

        it('should change the house back to original when leaves play', function () {
            this.player1.play(this.sneklifter);
            this.player1.clickCard(this.libraryOfBabble);
            expect(this.libraryOfBabble.hasHouse('shadows')).toBe(true);
            expect(this.libraryOfBabble.hasHouse('logos')).toBe(false);
            this.player1.play(this.hock);
            this.player1.clickCard(this.libraryOfBabble);
            expect(this.libraryOfBabble.location).toBe('discard');
            expect(this.libraryOfBabble.hasHouse('shadows')).toBe(false);
            expect(this.libraryOfBabble.hasHouse('logos')).toBe(true);
        });

        it('should not change the house back to original when Sneklifter leaves play', function () {
            this.player1.play(this.sneklifter);
            this.player1.clickCard(this.libraryOfBabble);
            expect(this.libraryOfBabble.hasHouse('shadows')).toBe(true);
            expect(this.libraryOfBabble.hasHouse('logos')).toBe(false);
            this.player1.play(this.relentlessWhispers);
            this.player1.clickCard(this.sneklifter);
            expect(this.sneklifter.location).toBe('discard');
            expect(this.libraryOfBabble.location).toBe('play area');
            expect(this.libraryOfBabble.hasHouse('shadows')).toBe(true);
            expect(this.libraryOfBabble.hasHouse('logos')).toBe(false);
        });

        it('should cause The Sting to work correctly', function () {
            this.player1.play(this.sneklifter);
            this.player1.clickCard(this.theSting);
            expect(this.player1.player.cardsInPlay).toContain(this.theSting);
            expect(this.theSting.controller).toBe(this.player1.player);
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player1.amber).toBe(9);
            expect(this.player2.amber).toBe(6);
        });
    });
});
