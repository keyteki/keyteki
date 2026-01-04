describe('Mournful Barn-Burner', function () {
    describe("Mournful Barn-Burner's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['mournful-barn-burner'],
                    discard: ['troll', 'stealth-mode']
                },
                player2: {
                    inPlay: ['hunting-witch'],
                    discard: ['flaxia', 'dust-pixie']
                }
            });
            this.player1.moveCard(this.troll, 'deck');
            this.player1.moveCard(this.stealthMode, 'deck');
            this.player2.moveCard(this.flaxia, 'deck');
            this.player2.moveCard(this.dustPixie, 'deck');
            this.player1.chains = 36;
            this.player2.chains = 36;
        });

        describe('on fight', function () {
            beforeEach(function () {
                this.player1.playCreature(this.mournfulBarnBurner);
                this.player1.endTurn();
                this.player2.clickPrompt('untamed');
                this.player2.endTurn();
                this.player1.clickPrompt('brobnar');
                this.player1.fightWith(this.mournfulBarnBurner, this.huntingWitch);
            });

            it('can discard 2 from your deck', function () {
                this.player1.clickPrompt('Mine');
                expect(this.stealthMode.location).toBe('discard');
                expect(this.troll.location).toBe('discard');
                expect(this.flaxia.location).toBe('deck');
                expect(this.dustPixie.location).toBe('deck');
                expect(this.player1).isReadyToTakeAction();
            });

            it('can discard 2 from opponent deck', function () {
                this.player1.clickPrompt("Opponent's");
                expect(this.stealthMode.location).toBe('deck');
                expect(this.troll.location).toBe('deck');
                expect(this.flaxia.location).toBe('discard');
                expect(this.dustPixie.location).toBe('discard');
                expect(this.player1).isReadyToTakeAction();
            });
        });

        it('can discard each players top card on scrap', function () {
            this.player1.clickCard(this.mournfulBarnBurner);
            this.player1.clickPrompt('Discard this card');
            expect(this.stealthMode.location).toBe('discard');
            expect(this.troll.location).toBe('deck');
            expect(this.flaxia.location).toBe('deck');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
