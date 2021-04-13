describe('Spartasaur', function () {
    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['spartasaur', 'dextre', 'troll', 'legatus-raptor', 'rhetor-gallim']
                },
                player2: {
                    inPlay: ['bad-penny', 'brain-eater']
                }
            });
        });

        describe('and fighting', function () {
            beforeEach(function () {
                this.player1.fightWith(this.spartasaur, this.badPenny);
            });

            it('should gain 2 amber', function () {
                expect(this.player1.amber).toBe(2);
            });
        });

        describe('and another friendly creature is destroyed', function () {
            beforeEach(function () {
                this.player1.fightWith(this.rhetorGallim, this.brainEater);
                this.player1.clickCard(this.spartasaur);
                this.player1.clickCard(this.dextre);
            });

            it('should destroy each non dinosaur creature', function () {
                expect(this.badPenny.location).toBe('hand');
                expect(this.troll.location).toBe('discard');
                expect(this.legatusRaptor.location).toBe('play area');
            });
        });
    });
});
