describe('Breaker Hill', function() {
    integration(function() {
        describe('Breaker Hill\'s gained ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'brobnar',
                        inPlay: ['krump', 'breaker-hill', 'troll', 'lamindra']
                    },
                    player2: {
                        amber: 3,
                        inPlay: ['gub', 'spyyyder', 'streke']
                    }
                });
            });

            xit('Opponent cannot reap for one turn', function() {
                this.player1.clickCard(this.krump);

                // TODO fix this
                this.player1.reap(this.krump);
            });
        });
    });
});
