describe('Infomancer', function () {
    describe("Infomancer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['krump', 'groggins'],
                    hand: ['infomancer', 'troll', 'autocannon']
                },
                player2: {
                    inPlay: ['panpaca-anga', 'flaxia', 'tantadlin', 'bigtwig']
                }
            });
        });

        it('should not graft anything if no action in hand', function () {
            this.player1.play(this.infomancer);
            expect(this.player1).not.toHavePrompt('Infomancer');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Infomancer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['krump', 'groggins'],
                    hand: [
                        'infomancer',
                        'pound',
                        'troll',
                        'anger',
                        'lava-ball',
                        'virtuous-works',
                        'autocannon'
                    ]
                },
                player2: {
                    inPlay: ['panpaca-anga', 'flaxia', 'tantadlin', 'bigtwig']
                }
            });
        });

        it('should allow grafting an action card', function () {
            this.player1.play(this.infomancer);
            expect(this.player1).toHavePrompt('Infomancer');
            expect(this.player1).toBeAbleToSelect(this.pound);
            expect(this.player1).toBeAbleToSelect(this.anger);
            expect(this.player1).toBeAbleToSelect(this.lavaBall);
            expect(this.player1).toBeAbleToSelect(this.virtuousWorks);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.autocannon);
            this.player1.clickCard(this.lavaBall);
            expect(this.lavaBall.facedown).toBe(false);
            expect(this.lavaBall.parent).toBe(this.infomancer);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should activate the play effect of a grafted card', function () {
            this.player1.play(this.infomancer);
            this.player1.clickCard(this.pound);
            expect(this.pound.facedown).toBe(false);
            expect(this.pound.parent).toBe(this.infomancer);
            this.infomancer.ready();
            this.player1.reap(this.infomancer);
            expect(this.player1).toHavePrompt('Infomancer');
            expect(this.player1).toBeAbleToSelect(this.pound);
            expect(this.player1).not.toBeAbleToSelect(this.anger);
            expect(this.player1).not.toBeAbleToSelect(this.lavaBall);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.autocannon);
            expect(this.player1).not.toBeAbleToSelect(this.virtuousWorks);
            this.player1.clickCard(this.pound);
            expect(this.pound.facedown).toBe(false);
            expect(this.pound.parent).toBe(this.infomancer);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.tantadlin);
            expect(this.tantadlin.damage).toBe(2);
            expect(this.bigtwig.damage).toBe(1);
            expect(this.flaxia.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
