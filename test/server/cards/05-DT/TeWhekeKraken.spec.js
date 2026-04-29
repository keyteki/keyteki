describe('Te-Wheke Kraken', function () {
    describe("Te-Wheke Kraken's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['te-wheke-kraken'],
                    inPlay: ['horrid-synan', 'keyfrog', 'kaupe', 'llack-gaboon']
                },
                player2: {
                    inPlay: ['bot-bookton', 'brain-eater', 'dextre', 'doc-bookton']
                }
            });
        });

        it('should exhaust 2 creatures', function () {
            this.player1.play(this.teWhekeKraken);
            expect(this.player1).toBeAbleToSelect(this.horridSynan);
            expect(this.player1).toBeAbleToSelect(this.kaupe);
            expect(this.player1).toBeAbleToSelect(this.llackGaboon);
            expect(this.player1).not.toBeAbleToSelect(this.keyfrog);
            this.player1.clickCard(this.kaupe);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.llackGaboon);
            this.player1.clickPrompt('Done');

            expect(this.kaupe.exhausted).toBe(true);
            expect(this.llackGaboon.exhausted).toBe(true);
            expect(this.teWhekeKraken.location).toBe('play area');
        });

        it('should die if not exhausting 2 creatures', function () {
            this.player1.play(this.teWhekeKraken);
            this.kaupe.exhaust();
            expect(this.player1).toBeAbleToSelect(this.horridSynan);
            expect(this.player1).toBeAbleToSelect(this.kaupe);
            expect(this.player1).toBeAbleToSelect(this.llackGaboon);
            expect(this.player1).not.toBeAbleToSelect(this.keyfrog);
            this.player1.clickCard(this.kaupe);
            this.player1.clickCard(this.llackGaboon);
            this.player1.clickPrompt('Done');

            expect(this.kaupe.exhausted).toBe(true);
            expect(this.llackGaboon.exhausted).toBe(true);
            expect(this.teWhekeKraken.location).toBe('discard');
        });
    });

    describe("Te-Wheke Kraken's fight/reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: [],
                    inPlay: ['te-wheke-kraken', 'horrid-synan', 'keyfrog', 'kaupe', 'llack-gaboon']
                },
                player2: {
                    inPlay: ['bot-bookton', 'brain-eater', 'dextre', 'doc-bookton']
                }
            });
        });

        it('should deal damage when reaping', function () {
            this.player1.reap(this.teWhekeKraken);
            expect(this.player1).toBeAbleToSelect(this.horridSynan);
            expect(this.player1).toBeAbleToSelect(this.kaupe);
            expect(this.player1).toBeAbleToSelect(this.llackGaboon);
            expect(this.player1).toBeAbleToSelect(this.keyfrog);
            expect(this.player1).toBeAbleToSelect(this.teWhekeKraken);
            expect(this.player1).toBeAbleToSelect(this.botBookton);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.brainEater);
            expect(this.player1).toBeAbleToSelect(this.docBookton);
            this.player1.clickCard(this.dextre);

            expect(this.brainEater.damage).toBe(2);
            expect(this.dextre.damage).toBe(2);
            expect(this.docBookton.damage).toBe(2);
            expect(this.botBookton.damage).toBe(0);
        });

        it('should die if not exhausting 2 creatures', function () {
            this.player1.fightWith(this.teWhekeKraken, this.botBookton);
            expect(this.player1).toBeAbleToSelect(this.horridSynan);
            expect(this.player1).toBeAbleToSelect(this.kaupe);
            expect(this.player1).toBeAbleToSelect(this.llackGaboon);
            expect(this.player1).toBeAbleToSelect(this.keyfrog);
            expect(this.player1).toBeAbleToSelect(this.teWhekeKraken);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.brainEater);
            expect(this.player1).toBeAbleToSelect(this.docBookton);
            this.player1.clickCard(this.dextre);

            expect(this.brainEater.damage).toBe(2);
            expect(this.dextre.damage).toBe(2);
            expect(this.docBookton.damage).toBe(2);
        });
    });
});
