describe('Alpha Messages', function () {
    describe('alpha restriction from Wild Wormhole', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['wild-wormhole'],
                    discard: ['eureka']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should log correct message when alpha card cannot be played', function () {
            this.player1.moveCard(this.eureka, 'deck');
            this.player1.play(this.wildWormhole);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Wild Wormhole',
                "player1 uses Wild Wormhole's amber bonus icon to gain 1 amber",
                'player1 uses Wild Wormhole to play Eureka!',
                'player1 is unable to play Eureka! and returns it to deck'
            ]);
        });
    });

    describe('alpha restriction from Mimic Gel copying an alpha creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['batdrone'],
                    hand: ['mimic-gel']
                },
                player2: {
                    inPlay: ['bumblebird', 'troll']
                }
            });
        });

        it('should log correct messages when Mimic Gel copy is alpha-restricted', function () {
            this.player1.reap(this.batdrone);
            this.player1.playCreature(this.mimicGel);
            this.player1.clickCard(this.bumblebird);
            expect(this.mimicGel.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Batdrone to reap with Batdrone',
                'player1 uses Mimic Gel to copy Bumblebird',
                'player1 plays Mimic Gel as Bumblebird',
                'player1 is unable to play Mimic Gel as Bumblebird and returns it to hand'
            ]);
        });
    });
});
