describe('Giltspine Netcaster Evil Twin', function () {
    describe("Giltspine Netcaster  Evil Twin's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    inPlay: [
                        'giltspine-netcaster',
                        'giltspine-netcaster-evil-twin',
                        'flaxia',
                        'dew-faerie'
                    ]
                },
                player2: {
                    amber: 4,
                    inPlay: ['gub', 'krump']
                }
            });

            this.player1.reap(this.giltspineNetcasterEvilTwin);
        });

        it('should be able to select non-Aquan friendly creatures', function () {
            expect(this.player1).not.toBeAbleToSelect(this.giltspineNetcaster);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.dewFaerie);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
        });

        describe('and a creature is selected', function () {
            beforeEach(function () {
                this.player1.clickCard(this.dewFaerie);
            });

            it('should be able to use it', function () {
                expect(this.player1).toHavePromptButton('Reap with this creature');
                expect(this.player1).toHavePromptButton('Fight with this creature');
            });

            describe('and choose to reap', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Reap with this creature');
                });

                it('should gain amber', function () {
                    expect(this.player1.amber).toBe(4);
                });
            });

            describe('and choose to fight', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Fight with this creature');
                });

                it('should select opponent creature', function () {
                    this.player1.clickCard(this.gub);
                    expect(this.dewFaerie.damage).toBe(1);
                    expect(this.gub.location).toBe('discard');
                });
            });
        });
    });
});
