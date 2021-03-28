describe('Lord Invidius', function () {
    describe('while is it not in the centre of the battle line', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['lord-invidius', 'troll', 'shooler']
                },
                player2: {
                    inPlay: [
                        'urchin',
                        'seeker-needle',
                        'mighty-javelin',
                        'library-of-babble',
                        'the-sting'
                    ]
                }
            });
        });

        it('should not gain a reap ability', function () {
            this.player1.reap(this.lordInvidius);

            expect(this.player1).not.toHavePromptButton('Choose a creature');
        });
    });

    describe('while it is in the centre of the battle line', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['troll', 'lord-invidius', 'shooler']
                },
                player2: {
                    inPlay: ['urchin', 'bad-penny', 'knoxx']
                }
            });
        });

        describe('and then reaping with it', function () {
            beforeEach(function () {
                this.player1.reap(this.lordInvidius);
            });

            it('should gain a reap ability', function () {
                expect(this.player1).toHavePrompt('Choose a creature');
            });

            it('should be able to select enemy flank creature', function () {
                expect(this.player1).toBeAbleToSelect(this.urchin);
                expect(this.player1).toBeAbleToSelect(this.knoxx);
                expect(this.player1).not.toBeAbleToSelect(this.badPenny);
                expect(this.player1).not.toBeAbleToSelect(this.shooler);
            });

            describe('and then selecting a flank creature', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.urchin);
                    this.player1.clickPrompt('Left');
                });

                it('should take control of the creature', function () {
                    expect(this.urchin.controller).toBe(this.player1.player);
                });

                it('should change the house of the controller creature to dis', function () {
                    expect(this.urchin.getHouses().includes('dis')).toBe(true);
                });

                it('should exhaust the creature', function () {
                    expect(this.urchin.exhausted).toBe(true);
                });
            });
        });

        describe('and reaping with another creature', function () {
            beforeEach(function () {
                this.player1.reap(this.shooler);
            });

            it('should not grant the reap ability', function () {
                expect(this.player1).not.toHavePrompt('Choose a creature');
            });
        });
    });
});
