describe('Xanthyx Harvester', function () {
    describe("Xanthyx Harvester's reap and cannot-use restriction", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['xanthyx-harvester', 'storm-crawler']
                },
                player2: {}
            });
        });

        it('gains 1A on reap when neighbors are all Mars', function () {
            this.player1.reap(this.xanthyxHarvester);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Xanthyx Harvester with a non-Mars neighbor', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['xanthyx-harvester', 'troll']
                },
                player2: {}
            });
        });

        it('cannot be used while it has a non-Mars neighbor', function () {
            this.player1.clickCard(this.xanthyxHarvester);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Xanthyx Harvester with one Mars and one non-Mars neighbor', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['storm-crawler', 'xanthyx-harvester', 'troll']
                },
                player2: {}
            });
        });

        it('cannot be used while it has any non-Mars neighbor, even if the other neighbor is Mars', function () {
            this.player1.clickCard(this.xanthyxHarvester);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Xanthyx Harvester alone in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['xanthyx-harvester']
                },
                player2: {}
            });
        });

        it('can reap when it has no neighbors', function () {
            this.player1.reap(this.xanthyxHarvester);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
