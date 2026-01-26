describe('The Amasser', function () {
    describe("The Amasser's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    token: 'catena-fiend',
                    inPlay: ['the-amasser', 'gub', 'shooler'],
                    hand: ['fear', 'belligerent-guard'],
                    deck: new Array(12).fill('toad')
                },
                player2: {
                    inPlay: ['dust-pixie', 'titan-guardian', 'umbra'],
                    hand: new Array(5).fill('toad')
                }
            });

            this.player1.makeMaverick(this.belligerentGuard, 'dis');

            this.toad1 = this.player1.deck[0];
            this.toad2 = this.player1.deck[1];
            this.toad3 = this.player1.deck[2];

            this.player1.chains = 36;
        });

        it('should cause a token to be made on the right when we make opponent draw a card', function () {
            this.player1.playCreature(this.belligerentGuard);
            expect(this.toad1.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay[4]).toBe(this.toad1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should cause a token to be made on the right when we make opponent return a card to hand', function () {
            this.player1.play(this.fear);
            this.player1.clickCard(this.umbra);
            expect(this.toad1.location).toBe('deck');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should cause a token to be made on the right when opponent draws cards during our turn', function () {
            this.player1.fightWith(this.gub, this.titanGuardian);
            expect(this.toad1.location).toBe('play area');
            expect(this.toad2.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay[3]).toBe(this.toad1);
            expect(this.player1.player.creaturesInPlay[4]).toBe(this.toad2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should cause a token to be made on the right when opponent draws cards during their turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.fightWith(this.titanGuardian, this.gub);
            expect(this.toad1.location).toBe('play area');
            expect(this.toad2.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay[3]).toBe(this.toad1);
            expect(this.player1.player.creaturesInPlay[4]).toBe(this.toad2);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should cause a token to be made on the right when opponent draws cards at end of turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            expect(this.toad1.location).toBe('play area');
            this.player1.clickPrompt('dis');
        });
    });
});
