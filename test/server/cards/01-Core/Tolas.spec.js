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
                        'obsidian-forge',
                        'alaka'
                    ],
                    hand: ['barn-razing']
                },
                player2: {
                    amber: 3,
                    inPlay: [
                        'doc-bookton',
                        'brain-eater',
                        'niffle-ape',
                        'helper-bot',
                        'brend-the-fanatic',
                        'titan-mechanic'
                    ],
                    hand: ['scowly-caper']
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
            expect(this.player1).isReadyToTakeAction();
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
            expect(this.player1).isReadyToTakeAction();
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });

        it('should happen before an after fight effect', function () {
            this.player2.amber = 0;
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.play(this.barnRazing);
            this.player1.fightWith(this.alaka, this.titanMechanic);
            expect(this.titanMechanic.location).toBe('play area');
            expect(this.alaka.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
        });

        it('should happen after destroyed effects', function () {
            this.player1.fightWith(this.ancientYurk, this.brendTheFanatic);
            expect(this.player1).isReadyToTakeAction();
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
        });

        it('should not trigger if creature is warded', function () {
            this.docBookton.ward();
            this.player1.fightWith(this.ancientYurk, this.docBookton);
            expect(this.docBookton.location).toBe('play area');
            expect(this.ancientYurk.tokens.damage).toBe(5);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });
    });

    describe("Tolas's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['tolas'],
                    hand: ['infiltrator', 'boo', 'all-hands-on-deck']
                },
                player2: {}
            });

            this.tolas.tokens.power = 2;
        });

        it('correctly handle treachery', function () {
            this.player1.play(this.infiltrator);
            this.player1.play(this.boo);
            this.player1.clickPrompt('Mine');
            this.player1.play(this.allHandsOnDeck);
            this.player1.clickCard(this.infiltrator);
            expect(this.infiltrator.location).toBe('discard');
            expect(this.player1.amber).toBe(2); // Tolas and Boo
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
