describe('The Promised Blade', function () {
    describe("The Promised Blade's ability", function () {
        describe('when players have a different amount of creatures', function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'sanctum',
                        inPlay: [
                            'baldric-the-bold',
                            'pandulf-the-provoker',
                            'challe-the-safeguard',
                            'the-promised-blade'
                        ]
                    },
                    player2: {
                        amber: 1,
                        inPlay: ['tyxl-beambuckler'],
                        hand: ['myx-the-tallminded', 'xanthyx-harvester']
                    }
                });
            });

            it('should automatically move to the player with the fewest number of creatures at the start of each turn', function () {
                this.player1.endTurn();
                this.player2.clickPrompt('mars');
                expect(this.thePromisedBlade.controller).toBe(this.player2.player);
            });

            it('has an omni to capture 1', function () {
                this.player1.useOmni(this.thePromisedBlade);
                this.player1.clickCard(this.baldricTheBold);
                expect(this.baldricTheBold.amber).toBe(1);
                expect(this.player2.amber).toBe(0);
            });
        });

        describe('when players have the same number of creatures', function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'sanctum',
                        inPlay: [
                            'baldric-the-bold',
                            'pandulf-the-provoker',
                            'challe-the-safeguard',
                            'the-promised-blade'
                        ]
                    },
                    player2: {
                        inPlay: [
                            'tyxl-beambuckler',
                            'myx-the-tallminded',
                            'xanthyx-harvester',
                            'sv3-lander'
                        ],
                        hand: ['animating-force']
                    }
                });
            });

            it("should give a prompt to select between players if there's a tie for fewest creatures", function () {
                this.player1.endTurn();
                expect(this.thePromisedBlade.controller).toBe(this.player1.player);
                expect(this.player2).toHavePrompt('The Promised Blade');
                this.player2.clickPrompt('Me');
                expect(this.thePromisedBlade.controller).toBe(this.player2.player);
                expect(this.player2).toHavePrompt(
                    'Choose which house you want to activate this turn'
                );
            });

            it("should not trigger twice if it's a creature", function () {
                this.player1.endTurn();
                this.player2.clickPrompt('Me');
                this.player2.clickPrompt('geistoid');
                this.player2.playUpgrade(this.animatingForce, this.thePromisedBlade);
                this.player2.clickPrompt('Left');
                this.player2.moveCard(this.myxTheTallminded, 'discard');
                this.player2.endTurn();
                this.player1.clickPrompt('Me');
                this.player1.clickPrompt('Left');
                expect(this.thePromisedBlade.controller).toBe(this.player1.player);
                expect(this.player1).toHavePrompt(
                    'Choose which house you want to activate this turn'
                );
            });
        });

        describe('interaction with Haunted House', function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'sanctum',
                        inPlay: [
                            'tyxl-beambuckler',
                            'myx-the-tallminded',
                            'xanthyx-harvester',
                            'the-promised-blade'
                        ]
                    },
                    player2: {
                        house: 'geistoid',
                        inPlay: ['haunted-house'],
                        deck: new Array(10).fill('poke'),
                        discard: new Array(9).fill('poke')
                    }
                });
            });

            it('should allow taking control of The Promised Blade after triggering Haunted House', function () {
                expect(this.thePromisedBlade.controller).toBe(this.player1.player);
                this.player1.endTurn();
                expect(this.player2).toHavePrompt('Any reactions?');
                expect(this.player2).toBeAbleToSelect(this.thePromisedBlade);
                expect(this.player2).toBeAbleToSelect(this.hauntedHouse);
                this.player2.clickCard(this.hauntedHouse);
                this.player2.clickPrompt('geistoid');
                expect(this.player2).isReadyToTakeAction();
                expect(this.player2.discard.length).toBe(10);
                expect(this.thePromisedBlade.controller).toBe(this.player2.player);
            });

            it('should allow taking control of The Promised Blade before triggering Haunted House', function () {
                expect(this.thePromisedBlade.controller).toBe(this.player1.player);
                this.player1.endTurn();
                expect(this.player2).toHavePrompt('Any reactions?');
                expect(this.player2).toBeAbleToSelect(this.thePromisedBlade);
                expect(this.player2).toBeAbleToSelect(this.hauntedHouse);
                this.player2.clickCard(this.thePromisedBlade);
                this.player2.clickPrompt('geistoid');
                expect(this.player2).isReadyToTakeAction();
                expect(this.player2.discard.length).toBe(10);
                expect(this.thePromisedBlade.controller).toBe(this.player2.player);
            });
        });
    });
});
