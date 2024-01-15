describe('Rorag Screamer', function () {
    describe("Rorag Screamer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['rorag-screamer'],
                    inPlay: ['cpo-zytar', 'alaka']
                },
                player2: {
                    inPlay: ['dew-faerie', 'cornicen-octavia']
                }
            });
        });

        it('readies after fighting', function () {
            this.player1.playCreature(this.roragScreamer);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.fightWith(this.roragScreamer, this.dewFaerie);
            expect(this.roragScreamer.exhausted).toBe(false);
            this.player1.fightWith(this.roragScreamer, this.dewFaerie);
            expect(this.roragScreamer.exhausted).toBe(false);
            this.player1.fightWith(this.roragScreamer, this.cornicenOctavia);
            expect(this.roragScreamer.location).toBe('discard');
        });

        it('can make a creature lose elusive for the turn', function () {
            this.player1.clickCard(this.roragScreamer);
            this.player1.clickPrompt('Discard this card');
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.alaka);
            expect(this.player1).toBeAbleToSelect(this.dewFaerie);
            expect(this.player1).toBeAbleToSelect(this.cornicenOctavia);
            this.player1.clickCard(this.dewFaerie);
            this.player1.fightWith(this.alaka, this.dewFaerie);
            expect(this.alaka.tokens.damage).toBe(2);
            expect(this.dewFaerie.location).toBe('discard');
        });

        it('can make a creature lose armor for the turn', function () {
            this.player1.scrap(this.roragScreamer);
            this.player1.clickCard(this.cornicenOctavia);
            this.player1.fightWith(this.alaka, this.cornicenOctavia);
            expect(this.cornicenOctavia.tokens.damage).toBe(4);
        });
    });
});
