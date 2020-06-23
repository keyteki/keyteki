describe('Shadow of Dis', function () {
    describe("Shadow of Dis' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['autocannon', 'hunting-witch', 'hideaway-hole', 'kindrith-longshot'],
                    hand: [
                        'bumpsy',
                        'valdr',
                        'dew-faerie',
                        'halacor',
                        'snufflegator',
                        'inka-the-spider',
                        'tantadlin'
                    ]
                },
                player2: {
                    inPlay: ['tezmal'],
                    hand: ['shadow-of-dis', 'dust-imp', 'shooler', 'spyyyder']
                }
            });
        });
        it('should not blank artifacts', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.shadowOfDis);
            this.player2.play(this.dustImp);
            expect(this.dustImp.tokens.damage).toBe(1);
        });

        it('test blanking hunting witch', function () {
            this.player1.play(this.dewFaerie);
            this.player1.clickCard(this.huntingWitch);
            expect(this.player1.amber).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.shadowOfDis);
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.play(this.valdr); // should not gain amber due to Hunting witch
            expect(this.valdr.tokens.damage).toBe(1);
            expect(this.player1.amber).toBe(1);
        });

        it('test printed skirmish is ignored', function () {
            this.player1.moveCard(this.autocannon, 'discard');
            this.player1.play(this.snufflegator);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.spyyyder);
            this.player2.play(this.shadowOfDis);
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.fightWith(this.snufflegator, this.spyyyder);
            expect(this.spyyyder.location).toBe('discard');
            expect(this.snufflegator.tokens.damage).toBe(2); // 2 from spyyyder ignoring snufflegator's skirmish
        });

        it('test halacor skirmish is ignored', function () {
            this.player1.moveCard(this.autocannon, 'discard');
            this.player1.play(this.halacor);
            this.player1.play(this.tantadlin);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.spyyyder);
            this.player2.play(this.shadowOfDis);
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.fightWith(this.tantadlin, this.spyyyder);
            expect(this.spyyyder.location).toBe('discard');
            expect(this.tantadlin.tokens.damage).toBe(2); // 2 from spyyyder ignoring halacor's skirmish
        });

        it('test kindrith-longshot elusive is ignored', function () {
            this.player1.moveCard(this.autocannon, 'discard');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.shadowOfDis);
            this.player2.fightWith(this.tezmal, this.kindrithLongshot);
            expect(this.tezmal.location).toBe('discard');
            expect(this.kindrithLongshot.tokens.damage).toBe(2); // 2 from tezmal ignoring kindrith's elusive
        });

        it("test hideway-hole artifact's elusive still works", function () {
            this.player1.moveCard(this.autocannon, 'discard');
            this.player1.clickCard(this.hideawayHole);
            this.player1.clickPrompt("Use this card's Omni ability");
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.shadowOfDis);
            this.player2.fightWith(this.tezmal, this.kindrithLongshot);
            expect(this.tezmal.hasToken('damage')).toBe(false);
            expect(this.kindrithLongshot.hasToken('damage')).toBe(false);
        });

        it("should wear off after the opponent's turn", function () {
            this.player1.play(this.dewFaerie);
            this.player1.clickCard(this.huntingWitch);
            expect(this.player1.amber).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.shadowOfDis);
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.play(this.valdr);
            expect(this.valdr.tokens.damage).toBe(1);
            expect(this.player1.amber).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.play(this.bumpsy);
            this.player1.clickCard(this.huntingWitch);
            expect(this.player1.amber).toBe(2);
        });
    });
});
