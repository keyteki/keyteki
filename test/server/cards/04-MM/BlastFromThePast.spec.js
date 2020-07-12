describe('Blast from the past', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'saurian',
                hand: ['blast-from-the-past'],
                discard: ['bad-penny', 'citizen-shrix'],
                inPlay: ['æmberheart', 'bulwark', 'bull-wark']
            },
            player2: {
                inPlay: ['troll']
            }
        });
    });

    describe('when played', function () {
        beforeEach(function () {
            this.player1.play(this.blastFromThePast);
        });

        it('prompt to exalt a creature', function () {
            expect(this.player1).toBeAbleToSelect(this.bulwark);
        });

        describe('and the creature is selected', function () {
            beforeEach(function () {
                this.player1.clickCard(this.bulwark);
            });

            it('should exalt the creature', function () {
                expect(this.bulwark.tokens.amber).toBe(1);
            });

            it('should prompt to archive a creature', function () {
                expect(this.player1).toHavePrompt('Choose a creature');
                expect(this.player1).not.toBeAbleToSelect(this.badPenny);
                expect(this.player1).toBeAbleToSelect(this.citizenShrix);
            });

            describe('and a creature is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.citizenShrix);
                });

                it('should archive the creature and prompt for an enemy creature', function () {
                    expect(this.citizenShrix.location).toBe('archives');
                    expect(this.player1).toHavePrompt('Choose a creature');
                    expect(this.player1).not.toBeAbleToSelect(this.bulwark);
                    expect(this.player1).toBeAbleToSelect(this.troll);
                });

                describe('and a creature is selected', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.troll);
                    });

                    it('should do damage to the selected card', function () {
                        expect(this.troll.tokens.damage).toBe(3);
                    });
                });
            });
        });
    });
});
