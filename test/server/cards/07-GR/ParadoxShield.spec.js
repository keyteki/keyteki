describe('Paradox Shield', function () {
    describe("Paradox Shield's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['photon-blast', 'paradox-shield', 'z-ray-blaster'],
                    inPlay: ['cpo-zytar']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
            this.player1.playUpgrade(this.paradoxShield, this.cpoZytar);
        });

        it('discards cards from deck instead of destroying', function () {
            let deckLen = this.player1.player.deck.length;
            this.player1.fightWith(this.cpoZytar, this.troll);
            expect(this.player1).isReadyToTakeAction();
            expect(this.cpoZytar.location).toBe('play area');
            expect(this.paradoxShield.location).toBe('discard');
            expect(this.troll.damage).toBe(4);
            expect(this.cpoZytar.damage).toBe(0);
            expect(this.player1.player.deck.length).toBe(deckLen - 4);
            expect(this.player1.player.discard.length).toBe(5);
        });

        it('heals', function () {
            this.player1.play(this.photonBlast);
            this.player1.clickCard(this.cpoZytar);
            expect(this.cpoZytar.damage).toBe(1);
            let deckLen = this.player1.player.deck.length;
            this.player1.fightWith(this.cpoZytar, this.troll);
            expect(this.player1).isReadyToTakeAction();
            expect(this.cpoZytar.location).toBe('play area');
            expect(this.paradoxShield.location).toBe('discard');
            expect(this.troll.damage).toBe(4);
            expect(this.cpoZytar.damage).toBe(0);
            expect(this.player1.player.deck.length).toBe(deckLen - 4);
            expect(this.player1.player.discard.length).toBe(6);
        });

        it('takes full power into consideration', function () {
            this.player1.playUpgrade(this.zRayBlaster, this.cpoZytar);
            let deckLen = this.player1.player.deck.length;
            this.player1.fightWith(this.cpoZytar, this.troll);
            expect(this.player1).isReadyToTakeAction();
            expect(this.cpoZytar.location).toBe('play area');
            expect(this.paradoxShield.location).toBe('discard');
            expect(this.troll.damage).toBe(7);
            expect(this.cpoZytar.damage).toBe(0);
            expect(this.player1.player.deck.length).toBe(deckLen - 7);
            expect(this.player1.player.discard.length).toBe(8);
        });

        it('does nothing if not enough cards in deck', function () {
            this.player1.player.deck = this.player1.player.deck.slice(0, 3);
            this.player1.fightWith(this.cpoZytar, this.troll);
            expect(this.player1).isReadyToTakeAction();
            expect(this.cpoZytar.location).toBe('discard');
            expect(this.paradoxShield.location).toBe('discard');
            expect(this.troll.damage).toBe(4);
            expect(this.player1.player.discard.length).toBe(3 + 2);
        });
    });
});
