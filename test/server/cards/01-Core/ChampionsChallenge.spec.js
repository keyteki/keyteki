describe("Champion's Challenge", function () {
    describe("Champion's Challenge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['punch', 'champion-s-challenge', 'troll', 'bumpsy', 'firespitter']
                },
                player2: {
                    amber: 1,
                    inPlay: ['batdrone', 'dextre', 'ganymede-archivist']
                }
            });
        });

        it('should destroy all but one of the enemy creatures if I have none in play', function () {
            this.player1.play(this.championSChallenge);
            expect(this.player1).toHavePrompt('Champion’s Challenge');
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.ganymedeArchivist);
            this.player1.clickCard(this.dextre);
            expect(this.dextre.location).toBe('play area');
            expect(this.batdrone.location).toBe('discard');
            expect(this.ganymedeArchivist.location).toBe('discard');
        });

        it('should fight with my creature and the remaining one if I only have one', function () {
            this.player1.play(this.troll);
            expect(this.troll.exhausted).toBe(true);
            this.player1.play(this.championSChallenge);
            expect(this.player1).toHavePrompt('Champion’s Challenge');
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.ganymedeArchivist);
            this.player1.clickCard(this.dextre);
            expect(this.dextre.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.batdrone.location).toBe('discard');
            expect(this.ganymedeArchivist.location).toBe('discard');
            expect(this.player1).toHavePrompt('Champion’s Challenge');
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            expect(this.player1).toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.dextre);
            expect(this.dextre.location).toBe('deck');
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.troll.exhausted).toBe(true);
        });

        it('should destroy all but one of my creatures and opponents creatures and fight with the remainder', function () {
            this.player1.play(this.bumpsy);
            this.player1.play(this.firespitter);
            this.player1.play(this.championSChallenge);
            this.player1.clickCard(this.ganymedeArchivist);
            this.player1.clickCard(this.firespitter);
            this.player1.clickCard(this.firespitter);
            this.player1.clickCard(this.ganymedeArchivist);
            expect(this.firespitter.location).toBe('play area');
            expect(this.dextre.location).toBe('deck');
            expect(this.batdrone.location).toBe('discard');
            expect(this.ganymedeArchivist.location).toBe('discard');
            expect(this.firespitter.tokens.damage).toBe(2);
        });
    });
    describe("Champion's Challenge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: [
                        'punch',
                        'champion-s-challenge',
                        'troll',
                        'bumpsy',
                        'firespitter',
                        'troll'
                    ]
                },
                player2: {
                    amber: 1
                }
            });
        });

        it("should allow me to reap with the remaning creature I have if my opponent's board is empty", function () {
            this.player1.play(this.troll);
            expect(this.troll.exhausted).toBe(true);
            this.player1.play(this.championSChallenge);
            expect(this.player1).toHavePrompt('Champion’s Challenge');
            this.player1.clickCard(this.troll);
            this.player1.reap(this.troll);
            expect(this.player1.amber).toBe(1);
        });
    });
});
