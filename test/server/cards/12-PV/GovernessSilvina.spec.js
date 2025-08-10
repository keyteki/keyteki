describe('Governess Silvina', function () {
    describe("Governess Silvina's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    hand: ['governess-silvina'],
                    inPlay: ['orator-hissaro', 'umbra']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump', 'dust-pixie', 'culf-the-quiet']
                }
            });
        });

        it('should move amber from friendly creatures to most powerful enemy creature', function () {
            this.oratorHissaro.tokens.amber = 2;
            this.player1.play(this.governessSilvina);
            expect(this.player1).toBeAbleToSelect(this.governessSilvina);
            expect(this.player1).toBeAbleToSelect(this.oratorHissaro);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.culfTheQuiet);
            this.player1.clickCard(this.oratorHissaro);
            expect(this.player1).not.toBeAbleToSelect(this.governessSilvina);
            expect(this.player1).not.toBeAbleToSelect(this.oratorHissaro);
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.culfTheQuiet);
            this.player1.clickCard(this.krump);
            expect(this.oratorHissaro.tokens.amber).toBeUndefined();
            expect(this.krump.tokens.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should stun 2 creatures with no amber on them when scrapped', function () {
            this.oratorHissaro.tokens.amber = 1;
            this.player1.scrap(this.governessSilvina);
            expect(this.player1).not.toBeAbleToSelect(this.oratorHissaro);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.culfTheQuiet);
            this.player1.clickCard(this.culfTheQuiet);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Done');
            expect(this.oratorHissaro.stunned).toBe(false);
            expect(this.umbra.stunned).toBe(false);
            expect(this.krump.stunned).toBe(false);
            expect(this.dustPixie.stunned).toBe(true);
            expect(this.culfTheQuiet.stunned).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should do nothing if there are no enemy creatures', function () {
            this.oratorHissaro.tokens.amber = 2;
            this.player2.moveCard(this.krump, 'discard');
            this.player2.moveCard(this.dustPixie, 'discard');
            this.player2.moveCard(this.culfTheQuiet, 'discard');
            this.player1.playCreature(this.governessSilvina);
            expect(this.oratorHissaro.tokens.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
