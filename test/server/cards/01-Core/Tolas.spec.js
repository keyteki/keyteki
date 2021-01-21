describe('Tolas', function () {
    describe("Tolas's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: [
                        'ancient-yurk',
                        'tolas',
                        'ember-imp',
                        'harbinger-of-doom',
                        'obsidian-forge'
                    ]
                },
                player2: {
                    amber: 3,
                    inPlay: ['doc-bookton', 'brain-eater', 'niffle-ape', 'helper-bot']
                }
            });

            this.tolas.tokens.power = 2;
        });

        it('should cause the opponent of a destroyed creature (self) to gain an amber', function () {
            this.player1.fightWith(this.ancientYurk, this.docBookton);
            expect(this.docBookton.location).toBe('discard');
            expect(this.ancientYurk.tokens.damage).toBe(5);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
        });

        it('should cause the opponent of a destroyed creature (opponent) to gain an amber', function () {
            this.player1.fightWith(this.emberImp, this.docBookton);
            expect(this.emberImp.location).toBe('discard');
            expect(this.docBookton.tokens.damage).toBe(2);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
        });

        it('should not cause anyone to gain an amber when it attacks and they both die', function () {
            this.player1.fightWith(this.tolas, this.niffleApe);
            expect(this.tolas.location).toBe('discard');
            expect(this.niffleApe.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });

        it('should not cause anyone to gain an amber when it is attacked and they both die', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.niffleApe, this.tolas);
            expect(this.tolas.location).toBe('discard');
            expect(this.niffleApe.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });

        it('should cause the opponent of a destroyed creature to gain an amber when it attacks and kills it', function () {
            this.player1.fightWith(this.tolas, this.helperBot);
            expect(this.tolas.location).toBe('play area');
            expect(this.helperBot.location).toBe('discard');
            expect(this.tolas.tokens.damage).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
        });

        it('should not cause its opponent to gain an amber when it is destroyed', function () {
            this.niffleApe.tokens.power = 2;
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.niffleApe, this.tolas);
            expect(this.tolas.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });

        it('should not trigger on a board wipe', function () {
            this.player1.useAction(this.obsidianForge);
            this.player1.clickCard(this.harbingerOfDoom);
            this.player1.clickPrompt('Done');
            expect(this.tolas.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });

        it('should not trigger on a board wipe with harbinger', function () {
            this.tolas.ward();
            this.player1.useAction(this.obsidianForge);
            this.player1.clickCard(this.tolas);
            this.player1.clickCard(this.harbingerOfDoom);
            this.player1.clickPrompt('Done');
            expect(this.tolas.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });
    });
});
