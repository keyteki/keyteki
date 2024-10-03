describe('Infinity Strop', function () {
    describe("Infinity Strop's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    hand: ['infinity-strop'],
                    inPlay: ['mushroom-man', 'ember-imp']
                },
                player2: {
                    hand: ['badge-of-unity'],
                    inPlay: ['troll', 'flaxia', 'dust-pixie', 'sensor-chief-garcia']
                }
            });
        });

        it('should deal 2 damage to a creature', function () {
            this.player1.play(this.infinityStrop);
            expect(this.player1).toBeAbleToSelect(this.mushroomMan);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.sensorChiefGarcia);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.tokens.damage).toBe(2);
            expect(this.flaxia.location).toBe('play area');
            expect(this.dustPixie.tokens.damage).toBe(undefined);
            expect(this.dustPixie.location).toBe('play area');
        });

        it('should deal 4 damage to other creatures that share a house if target dies', function () {
            this.player1.play(this.infinityStrop);
            this.player1.clickCard(this.dustPixie);
            expect(this.flaxia.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.mushroomMan.tokens.damage).toBe(4);
            expect(this.emberImp.tokens.damage).toBe(undefined);
            expect(this.emberImp.location).toBe('play area');
            expect(this.troll.tokens.damage).toBe(undefined);
            expect(this.troll.location).toBe('play area');
            expect(this.sensorChiefGarcia.tokens.damage).toBe(undefined);
            expect(this.sensorChiefGarcia.location).toBe('play area');
        });

        it('should not deal 4 extra damage if creature was warded', function () {
            this.dustPixie.ward();
            this.player1.play(this.infinityStrop);
            this.player1.clickCard(this.dustPixie);
            expect(this.flaxia.location).toBe('play area');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.mushroomMan.tokens.damage).toBe(undefined);
            expect(this.emberImp.tokens.damage).toBe(undefined);
            expect(this.emberImp.location).toBe('play area');
            expect(this.troll.tokens.damage).toBe(undefined);
            expect(this.troll.location).toBe('play area');
            expect(this.sensorChiefGarcia.tokens.damage).toBe(undefined);
            expect(this.sensorChiefGarcia.location).toBe('play area');
        });

        it('should deal 4 damage to other creatures that share a house of target before it died', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.playUpgrade(this.badgeOfUnity, this.dustPixie);
            this.player2.endTurn();
            this.player1.clickPrompt('dis');

            this.player1.play(this.infinityStrop);
            this.player1.clickCard(this.dustPixie);
            expect(this.flaxia.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.mushroomMan.tokens.damage).toBe(4);
            expect(this.emberImp.tokens.damage).toBe(undefined);
            expect(this.emberImp.location).toBe('play area');
            expect(this.troll.tokens.damage).toBe(undefined);
            expect(this.troll.location).toBe('play area');
            expect(this.sensorChiefGarcia.location).toBe('discard');
        });
    });
});
