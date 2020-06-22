describe('Neffru', function () {
    describe("Neffru's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'Brobnar',
                    inPlay: ['krump', 'culf-the-quiet', 'neffru', 'forgemaster-og']
                },
                player2: {
                    amber: 3,
                    inPlay: ['doc-bookton', 'brain-eater', 'dysania', 'helper-bot']
                }
            });
        });

        it('should cause the controller of a destroyed creature (opponent) to gain an amber', function () {
            this.player1.fightWith(this.culfTheQuiet, this.docBookton);
            expect(this.docBookton.location).toBe('discard');
            expect(this.culfTheQuiet.tokens.damage).toBe(5);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
        });
        it('should cause the controller of a destroyed creature (self) to gain an amber', function () {
            this.player1.fightWith(this.forgemasterOg, this.docBookton);
            expect(this.forgemasterOg.location).toBe('discard');
            expect(this.docBookton.tokens.damage).toBe(4);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
        });
        it('should not cause anyone to gain an amber when it attacks and they both die', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.fightWith(this.neffru, this.dysania);
            expect(this.neffru.location).toBe('discard');
            expect(this.dysania.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
            expect(this.player1.amber).toBe(0);
        });
        it('should not cause anyone to gain an amber when it is attacked and they both die', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.fightWith(this.dysania, this.neffru);
            expect(this.neffru.location).toBe('discard');
            expect(this.dysania.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });
        it('should cause the owner of a destroyed creature to gain an amber when it attacks and kills it', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.fightWith(this.neffru, this.helperBot);
            expect(this.neffru.location).toBe('play area');
            expect(this.helperBot.location).toBe('discard');
            expect(this.neffru.tokens.damage).toBe(1);
            expect(this.player2.amber).toBe(4);
            expect(this.player1.amber).toBe(0);
        });
        it('should not cause its owner to gain an amber when it is destroyed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.fightWith(this.brainEater, this.neffru);
            expect(this.neffru.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
            expect(this.player1.amber).toBe(0);
        });
    });
});
