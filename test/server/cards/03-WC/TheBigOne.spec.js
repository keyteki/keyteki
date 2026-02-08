describe('TheBigOne(WC)', function () {
    describe('The Big One fuse tokens', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['nexus', 'spectral-tunneler'],
                    hand: [
                        'the-big-one',
                        'troll',
                        'troll',
                        'troll',
                        'troll',
                        'troll',
                        'troll',
                        'troll',
                        'troll',
                        'troll',
                        'troll'
                    ]
                },
                player2: {
                    inPlay: ['the-sting'],
                    hand: ['urchin']
                }
            });
        });

        it('destroys creatures and artifacts after playing 10 creatures', function () {
            let theBigOne = this.theBigOne;
            this.player1.play(theBigOne);
            for (var i = 0; i < 6; i++) {
                this.player1.playCreature('troll');
            }

            expect(this).toHaveRecentChatMessage(
                'player1 uses The Big One to place 1 fuse on The Big One'
            );
            expect(theBigOne.tokens.fuse).toBe(6);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.urchin);
            this.player2.clickCard(this.urchin);
            expect(theBigOne.tokens.fuse).toBe(7);
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            for (i = 0; i < 2; i++) {
                this.player1.playCreature('troll');
            }

            expect(theBigOne.tokens.fuse).toBe(9);
            expect(theBigOne.location).toBe('play area');
            expect(this.nexus.location).toBe('play area');
            expect(this.spectralTunneler.location).toBe('play area');
            expect(this.theSting.location).toBe('play area');
            expect(this.urchin.location).toBe('play area');
            this.player1.playCreature('troll');
            expect(this).toHaveRecentChatMessage(
                'The Big One has 10 fuse counters and destroys all creatures and artifacts',
                15
            );
            expect(theBigOne.location).toBe('discard');
            expect(this.nexus.location).toBe('discard');
            expect(this.spectralTunneler.location).toBe('discard');
            expect(this.theSting.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
        });
    });

    describe('The Big One and upgrade-creatures', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['explo-rover', 'explo-rover', 'explo-rover', 'explo-rover']
                },
                player2: {
                    inPlay: ['the-big-one']
                }
            });

            this.exploRover1 = this.player1.player.hand[0];
            this.exploRover2 = this.player1.player.hand[1];
            this.exploRover3 = this.player1.player.hand[2];
            this.exploRover4 = this.player1.player.hand[3];
        });

        it('should not add fuse counters for creatures played as upgrades', function () {
            this.player1.playCreature(this.exploRover1);
            this.player1.playUpgrade(this.exploRover2, this.exploRover1);
            this.player1.playUpgrade(this.exploRover3, this.exploRover1);
            this.player1.playUpgrade(this.exploRover4, this.exploRover1);
            expect(this.theBigOne.tokens.fuse).toBe(1);
        });
    });
});
