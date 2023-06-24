describe('Chancellor Dexterus', function () {
    describe("Chancellor Dexterus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['bumpsy', 'chancellor-dexterus', 'pelf'],
                    hand: ['stomp', 'questor-jarta']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('exalts and makes right neighbor saurian', function () {
            this.player1.reap(this.chancellorDexterus);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.pelf);
            expect(this.pelf.amber).toBe(1);
            this.player1.reap(this.pelf);
        });

        it('optionally does nothing', function () {
            this.player1.reap(this.chancellorDexterus);
            this.player1.clickPrompt('Done');
            expect(this.pelf.amber).toBe(0);
            this.player1.clickCard(this.pelf);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('does nothing with no right neighbor', function () {
            this.player1.play(this.stomp);
            this.player1.clickCard(this.pelf);
            this.player1.clickCard(this.bumpsy);
            this.player1.reap(this.chancellorDexterus);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('handles more creatures to the right', function () {
            this.player1.playCreature(this.questorJarta);
            this.player1.reap(this.chancellorDexterus);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.questorJarta);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.pelf);
            expect(this.pelf.amber).toBe(1);
            this.player1.reap(this.pelf);
        });
    });
});
