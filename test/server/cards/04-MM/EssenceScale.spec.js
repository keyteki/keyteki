describe('Essence Scale', function () {
    describe('Action ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['dodger', 'umbra', 'troll', 'essence-scale']
                },
                player2: {
                    inPlay: ['helper-bot']
                }
            });
            this.player1.useAction(this.essenceScale);
        });

        it('should be able to select all friendly creatures', function () {
            expect(this.player1).toBeAbleToSelect(this.dodger);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.helperBot);
        });

        describe('select a card to destroy that shares houses', function () {
            beforeEach(function () {
                this.player1.clickCard(this.dodger);
            });

            it('selected card in discard and able to select card of the same house', function () {
                expect(this.dodger.location).toBe('discard');
                expect(this.player1).toBeAbleToSelect(this.umbra);
                expect(this.player1).not.toBeAbleToSelect(this.troll);
                expect(this.player1).not.toBeAbleToSelect(this.helperBot);
            });
        });
        describe('select a card to destroy that shares no houses with other cards in play', function () {
            beforeEach(function () {
                this.player1.clickCard(this.troll);
            });

            it('selected card in discard and able to select card of the same house', function () {
                expect(this.troll.location).toBe('discard');
                expect(this.player1).not.toBeAbleToSelect(this.umbra);
                expect(this.player1).not.toBeAbleToSelect(this.helperBot);
            });
        });
    });

    describe('Lod Invidius interaction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['lord-invidius', 'essence-scale']
                },
                player2: {
                    inPlay: ['silvertooth', 'umbra']
                }
            });
        });

        it('should take control of Silvertooth, then allow destroying it to ready Invidius', function () {
            this.player1.reap(this.lordInvidius);
            expect(this.lordInvidius.exhausted).toBe(true);
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            this.player1.clickCard(this.silvertooth);
            expect(this.player1).toHavePrompt('Silvertooth');
            this.player1.clickPrompt('Left');
            expect(this.silvertooth.controller).toBe(this.player1.player);
            expect(this.silvertooth.getHouses()).toContain('dis');
            expect(this.silvertooth.getHouses()).not.toContain('shadows');
            this.player1.useAction(this.essenceScale);
            expect(this.player1).toHavePrompt('Essence Scale');
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            this.player1.clickCard(this.silvertooth);
            expect(this.silvertooth.location).toBe('discard');
            expect(this.player1).toHavePrompt('Essence Scale');
            expect(this.player1).toBeAbleToSelect(this.lordInvidius);
            this.player1.clickCard(this.lordInvidius);
            expect(this.player1).toHavePrompt('Lord Invidius');
        });
    });
});
