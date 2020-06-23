describe('Horseman of War', function () {
    describe("Horseman of War's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['sequis', 'ember-imp', 'batdrone', 'gorm-of-omm', 'pit-demon'],
                    hand: ['horseman-of-war']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll', 'gauntlet-of-command']
                }
            });
        });

        it('should allow non-sanctum creatures to fight', function () {
            this.player1.play(this.horsemanOfWar);
            this.player1.clickCard(this.emberImp);
            expect(this.player1).toHavePrompt('Ember Imp');
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.emberImp.location).toBe('discard');
            this.player1.clickCard(this.batdrone);
            expect(this.player1).toHavePrompt('Batdrone');
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            this.player1.clickCard(this.sequis);
            expect(this.player1).toHavePrompt('Sequis');
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.sequis.location).toBe('discard');
        });

        it('should not stop use of artifacts', function () {
            this.player1.play(this.horsemanOfWar);
            this.player1.clickCard(this.gormOfOmm);
            expect(this.player1).toHavePrompt('Gorm Of Omm');
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.player1).toHavePrompt('Gorm Of Omm');
        });

        it('should not allow creatures to use actions', function () {
            this.player1.play(this.horsemanOfWar);
            this.player1.clickCard(this.pitDemon);
            expect(this.player1).toHavePrompt('Pit Demon');
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            expect(this.player1).not.toHavePromptButton("Use this card's Action ability");
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(5);
            expect(this.pitDemon.location).toBe('discard');
        });
    });
});
