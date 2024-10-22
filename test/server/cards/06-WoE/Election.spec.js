describe('Election', function () {
    describe("Election's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: [
                        'election',
                        'city-gates',
                        'scylla',
                        'brutodon-auxiliary',
                        'cornicen-octavia',
                        'censor-philo',
                        'brachiaditus',
                        'charybdis'
                    ]
                },
                player2: {
                    inPlay: ['special-delivery', 'umbra', 'dodger', 'mack-the-knife']
                }
            });
        });

        it('should destroy all creatures and itself with 6 Yea votes', function () {
            this.player1.reap(this.scylla);
            this.player1.clickPrompt('Yea');
            this.player1.reap(this.brutodonAuxiliary);
            this.player1.clickPrompt('Yea');
            this.player1.reap(this.cornicenOctavia);
            this.player1.clickPrompt('Yea');
            this.player1.reap(this.censorPhilo);
            this.player1.clickPrompt('Yea');
            this.player1.reap(this.brachiaditus);
            this.player1.clickPrompt('Yea');
            this.player1.reap(this.charybdis);
            this.player1.clickPrompt('Yea');
            expect(this.player1.player.creaturesInPlay.length).toBe(0);
            expect(this.player2.player.creaturesInPlay.length).toBe(0);
            expect(this.cityGates.location).toBe('play area');
            expect(this.specialDelivery.location).toBe('play area');
            expect(this.election.location).toBe('discard');
        });

        it('should destroy artifacts with 6 Nay votes', function () {
            this.player1.reap(this.scylla);
            this.player1.clickPrompt('Nay');
            this.player1.reap(this.brutodonAuxiliary);
            this.player1.clickPrompt('Nay');
            this.player1.reap(this.cornicenOctavia);
            this.player1.clickPrompt('Nay');
            this.player1.reap(this.censorPhilo);
            this.player1.clickPrompt('Nay');
            this.player1.reap(this.brachiaditus);
            this.player1.clickPrompt('Nay');
            this.player1.reap(this.charybdis);
            this.player1.clickPrompt('Nay');
            expect(this.player1.player.creaturesInPlay.length).toBe(6);
            expect(this.player2.player.creaturesInPlay.length).toBe(3);
            expect(this.cityGates.location).toBe('discard');
            expect(this.specialDelivery.location).toBe('discard');
            expect(this.election.location).toBe('discard');
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.reap(this.umbra);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should work on opponents turn too', function () {
            this.player1.reap(this.scylla);
            this.player1.clickPrompt('Yea');
            this.player1.reap(this.brutodonAuxiliary);
            this.player1.clickPrompt('Yea');
            this.player1.reap(this.cornicenOctavia);
            this.player1.clickPrompt('Yea');
            this.player1.reap(this.censorPhilo);
            this.player1.clickPrompt('Yea');
            this.player1.reap(this.brachiaditus);
            this.player1.clickPrompt('Nay');
            this.player1.reap(this.charybdis);
            this.player1.clickPrompt('Yea');
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.reap(this.umbra);
            this.player2.clickPrompt('Election');
            this.player2.clickPrompt('Yea');
            expect(this.player1.player.creaturesInPlay.length).toBe(0);
            expect(this.player2.player.creaturesInPlay.length).toBe(0);
            expect(this.cityGates.location).toBe('play area');
            expect(this.specialDelivery.location).toBe('play area');
            expect(this.election.location).toBe('discard');
        });

        it('should not destroy warded creatures with 6 Yea votes', function () {
            this.scylla.ward();
            this.player1.reap(this.scylla);
            this.player1.clickPrompt('Yea');
            this.player1.reap(this.brutodonAuxiliary);
            this.player1.clickPrompt('Yea');
            this.player1.reap(this.cornicenOctavia);
            this.player1.clickPrompt('Yea');
            this.player1.reap(this.censorPhilo);
            this.player1.clickPrompt('Yea');
            this.player1.reap(this.brachiaditus);
            this.player1.clickPrompt('Yea');
            this.player1.reap(this.charybdis);
            this.player1.clickPrompt('Yea');
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.player2.player.creaturesInPlay.length).toBe(0);
            expect(this.cityGates.location).toBe('play area');
            expect(this.specialDelivery.location).toBe('play area');
            expect(this.election.location).toBe('discard');
        });
    });
});
