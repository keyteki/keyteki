describe('mad-prophet-gizelhart', function () {
    describe("Mad Prophet Gizelhart's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'sanctum',
                    inPlay: ['sequis', 'mad-prophet-gizelhart', 'troll']
                },
                player2: {
                    amber: 1,
                    inPlay: ['dodger', 'hapsis']
                }
            });
            this.troll.tokens['damage'] = 1;
            this.dodger.tokens['damage'] = 1;
            this.hapsis.tokens['damage'] = 1;
        });

        describe('Actions while in center', function () {
            beforeEach(function () {
                this.player1.useAction(this.madProphetGizelhart);
            });

            it('heal non-mutants and gain 1 amber', function () {
                expect(this.troll.tokens.damage).toBe(undefined);
                expect(this.dodger.tokens.damage).toBe(undefined);
                expect(this.hapsis.tokens.damage).toBe(1);
                expect(this.player1.amber).toBe(2);
            });
        });
    });
});
