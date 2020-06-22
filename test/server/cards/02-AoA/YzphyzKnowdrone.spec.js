describe('Yzphyz Knowdrone', function () {
    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    amber: 0,
                    inPlay: ['wretched-doll', 'zorg'],
                    archives: ['ember-imp'],
                    hand: ['yzphyz-knowdrone', 'harbinger-of-doom', 'key-to-dis']
                },
                player2: {
                    amber: 0,
                    inPlay: ['mighty-tiger', 'hunting-witch'],
                    archives: ['troll']
                }
            });

            this.player2.moveCard(this.zorg, 'archives');
            this.player1.play(this.yzphyzKnowdrone);
        });

        it('should allow a card to be archived', function () {
            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).toBeAbleToSelect(this.keyToDis);
            expect(this.player1).not.toBeAbleToSelect(this.wretchedDoll);
        });

        describe('and a card is selected', function () {
            beforeEach(function () {
                this.player1.clickCard(this.keyToDis);
            });

            it('should archive the card', function () {
                expect(this.keyToDis.location).toBe('archives');
            });

            it('should offer to purge an archived card', function () {
                expect(this.player1).toHavePrompt('Choose which card to purge');
            });

            it('should allow selecting a friendly archived card', function () {
                expect(this.player1).toBeAbleToSelect(this.keyToDis);
                expect(this.player1).toBeAbleToSelect(this.emberImp);
            });

            it("should allow selecting an opponent's archived card", function () {
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.zorg);
            });

            describe('and a friendly card is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.keyToDis);
                });

                it('should purge that card', function () {
                    expect(this.keyToDis.location).toBe('purged');
                });

                it('should allow a creature to be stunned', function () {
                    expect(this.player1).toHavePrompt('Choose a creature to stun');
                });
            });

            describe('and an opponent card is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.troll);
                });

                it('should purge that card', function () {
                    expect(this.troll.location).toBe('purged');
                });

                it('should allow a creature to be stunned', function () {
                    expect(this.player1).toHavePrompt('Choose a creature to stun');
                });
            });

            describe('and a card belong to us in opponent archives is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.zorg);
                });

                it('should return that card to our archives', function () {
                    expect(this.zorg.location).toBe('hand');
                });

                xit('should not allow a creature to be stunned', function () {
                    expect(this.player1).not.toHavePrompt('Choose a creature to stun');
                });
            });
        });
    });
});
