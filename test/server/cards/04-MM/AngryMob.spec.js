xdescribe('Angry Mob', function () {
    describe("Angry Mob's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['angry-mob'],
                    hand: ['angry-mob'],
                    discard: ['angry-mob', 'sequis', 'krump', 'brabble']
                },
                player2: {
                    inPlay: ['gamgee']
                }
            });

            this.angryMob2 = this.player1.findCardByName('angry-mob', 'discard');
            this.angryMob3 = this.player1.findCardByName('angry-mob', 'hand');
            this.player1.moveCard(this.angryMob2, 'deck');
        });

        it('should be optional', function () {
            expect(this.angryMob.location).toBe('play area');
            this.player1.fightWith(this.angryMob, this.gamgee);
            expect(this.player1).toHavePrompt('Any reactions?');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.angryMob2.location).toBe('deck');
        });

        it('should find an angry mob', function () {
            this.player1.fightWith(this.angryMob, this.gamgee);
            expect(this.player1).toHavePrompt('Any reactions?');
            this.player1.clickCard(this.angryMob);
            expect(this.angryMob2.location).toBe('hand');
        });

        it('should find an angry mob further into the deck', function () {
            this.player1.moveCard(this.sequis, 'deck');
            this.player1.moveCard(this.krump, 'deck');
            this.player1.moveCard(this.brabble, 'deck');

            this.player1.fightWith(this.angryMob, this.gamgee);
            expect(this.player1).toHavePrompt('Any reactions?');
            this.player1.clickCard(this.angryMob);
            expect(this.angryMob2.location).toBe('hand');
            expect(this.sequis.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.brabble.location).toBe('discard');
        });

        it('should only find the first angry mob', function () {
            this.player1.clickCard(this.angryMob3);
            this.player1.clickPrompt('Discard this card');

            this.player1.moveCard(this.sequis, 'deck');
            this.player1.moveCard(this.angryMob3, 'deck');
            this.player1.moveCard(this.krump, 'deck');
            this.player1.moveCard(this.brabble, 'deck');

            this.player1.fightWith(this.angryMob, this.gamgee);
            expect(this.player1).toHavePrompt('Any reactions?');
            this.player1.clickCard(this.angryMob);

            expect(this.angryMob2.location).toBe('deck');
            expect(this.sequis.location).toBe('deck');
            expect(this.angryMob3.location).toBe('hand');
            expect(this.krump.location).toBe('discard');
            expect(this.brabble.location).toBe('discard');
        });
    });
});
