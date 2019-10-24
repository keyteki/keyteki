fdescribe('Malison', function() {
    integration(function() {
        describe('the fight ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'dis',
                        amber: 1,
                        inPlay: ['troll', 'malison']
                    },
                    player2: {
                        inPlay: ['shadow-self', 'troll', 'tezmal', 'silver-key-imp']
                    }
                });
            });

            describe('when fighting a creature', function() {
                beforeEach(function() {
                    console.info('fighting');
                    this.player1.fightWith(this.malison, this.tezmal);
                });

                it('should prompt to move an enemy creature', function() {
                    expect(this.player1).not.toBeAbleToSelect(this.troll);
                    expect(this.player1).toBeAbleToSelect(this.shadowSelf);
                });

                describe('when an enemy creature is selected', function() {
                    beforeEach(function() {
                        console.info('clicking troll');
                        this.player1.clickCard(this.troll);
                    });

                    fit('should prompt for a creature to move next to', function() {
                        expect(this.player1).toHavePrompt('foo');
                    });
                });
            });
        });
    });
});
