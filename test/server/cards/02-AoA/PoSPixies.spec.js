describe("Po's Pixies", function () {
    describe("Po's Pixies", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 1,
                    inPlay: ['skeleton-key', 'umbra'],
                    hand: ['camouflage']
                },
                player2: {
                    amber: 1,
                    inPlay: ['po-s-pixies', 'batdrone'],
                    hand: ['dextre']
                }
            });
        });

        it('should steal from common supply', function () {
            this.player1.fightWith(this.umbra, this.poSPixies);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
        });

        it('should capture from common supply', function () {
            this.player1.useAction(this.skeletonKey);
            this.player1.clickCard(this.umbra);
            expect(this.player1.amber).toBe(1);
            expect(this.umbra.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });

        it('should not steal from common supply if opponent has no amber', function () {
            this.player2.amber = 0;
            this.player1.fightWith(this.umbra, this.poSPixies);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
        });

        it('should not from common supply if opponent has no amber', function () {
            this.player2.amber = 0;
            this.player1.useAction(this.skeletonKey);
            this.player1.clickCard(this.umbra);
            expect(this.player1.amber).toBe(1);
            expect(this.umbra.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
        });

        it('should apply only to opponent when stealing', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.fightWith(this.batdrone, this.umbra);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
        });

        it('should apply only to opponent when capturing', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.dextre);
            expect(this.player1.amber).toBe(0);
            expect(this.dextre.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });
    });

    describe("Po's Pixies and Gargantodon interaction", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 1,
                    inPlay: ['skeleton-key', 'umbra', 'gargantodon'],
                    hand: ['camouflage']
                },
                player2: {
                    amber: 1,
                    inPlay: ['po-s-pixies']
                }
            });
        });

        it('should capture from common supply instead of stealing', function () {
            this.player1.fightWith(this.umbra, this.poSPixies);
            this.player1.clickCard(this.gargantodon);
            expect(this.player1.amber).toBe(1);
            expect(this.gargantodon.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });
    });

    describe("Po's Pixies and Ether Spider interaction", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 1,
                    inPlay: ['skeleton-key', 'umbra'],
                    hand: ['camouflage']
                },
                player2: {
                    amber: 1,
                    inPlay: ['po-s-pixies', 'ether-spider']
                }
            });
        });

        it('should place amber on ether spider', function () {
            this.player1.fightWith(this.umbra, this.poSPixies);
            expect(this.player1.amber).toBe(1);
            expect(this.etherSpider.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });
    });

    describe("Po's Pixies, Gargantodon and Ether Spider interaction", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 1,
                    inPlay: ['skeleton-key', 'umbra', 'gargantodon'],
                    hand: ['camouflage']
                },
                player2: {
                    amber: 1,
                    inPlay: ['po-s-pixies', 'ether-spider']
                }
            });
        });

        it('should capture from common supply instead of stealing', function () {
            this.player1.fightWith(this.umbra, this.poSPixies);
            this.player1.clickCard(this.gargantodon);
            expect(this.player1.amber).toBe(1);
            expect(this.gargantodon.amber).toBe(1);
            expect(this.etherSpider.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
        });
    });
});
