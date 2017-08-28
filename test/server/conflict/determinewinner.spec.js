const Conflict = require('../../../server/game/conflict.js');
const Player = require('../../../server/game/player.js');
const DrawCard = require('../../../server/game/drawcard.js');

describe('Conflict', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['applyGameAction', 'on', 'raiseEvent']);
        this.gameSpy.applyGameAction.and.callFake((type, card, handler) => {
            handler(card);
        });

        this.attackingPlayer = new Player('1', 'Player 1', true, this.gameSpy);
        spyOn(this.attackingPlayer, 'winConflict');
        spyOn(this.attackingPlayer, 'loseConflict');
        this.defendingPlayer = new Player('2', 'Player 2', true, this.gameSpy);
        spyOn(this.defendingPlayer, 'winConflict');
        spyOn(this.defendingPlayer, 'loseConflict');

        this.attackerCard = new DrawCard(this.attackingPlayer, {});
        this.defenderCard = new DrawCard(this.defendingPlayer, {});

        this.conflict = new Conflict(this.gameSpy, this.attackingPlayer, this.defendingPlayer, 'military');
    });

    describe('determineWinner()', function() {
        describe('when the attacker has higher skill', function() {
            beforeEach(function() {
                spyOn(this.attackerCard, 'getSkill').and.returnValue(5);
                spyOn(this.defenderCard, 'getSkill').and.returnValue(4);
                this.conflict.addAttackers([this.attackerCard]);
                this.conflict.addDefenders([this.defenderCard]);
                this.conflict.determineWinner();
            });

            it('should have the attacking player be the winner', function() {
                expect(this.conflict.winner).toBe(this.attackingPlayer);
            });

            it('should mark the win for the attacking player', function() {
                expect(this.attackingPlayer.winConflict).toHaveBeenCalledWith('military', true);
            });

            it('should have the defending player be the loser', function() {
                expect(this.conflict.loser).toBe(this.defendingPlayer);
            });

            it('should mark the loss for the defending player', function() {
                expect(this.defendingPlayer.loseConflict).toHaveBeenCalledWith('military', false);
            });
        });


        describe('when the attacker and defender have equal skill', function() {
            beforeEach(function() {
                spyOn(this.attackerCard, 'getSkill').and.returnValue(5);
                spyOn(this.defenderCard, 'getSkill').and.returnValue(5);
                this.conflict.addAttackers([this.attackerCard]);
                this.conflict.addDefenders([this.defenderCard]);
                this.conflict.determineWinner();
            });

            it('should have the attacking player be the winner', function() {
                expect(this.conflict.winner).toBe(this.attackingPlayer);
            });

            it('should mark the win for the attacking player', function() {
                expect(this.attackingPlayer.winConflict).toHaveBeenCalledWith('military', true);
            });

            it('should have the defending player be the loser', function() {
                expect(this.conflict.loser).toBe(this.defendingPlayer);
            });

            it('should mark the loss for the defending player', function() {
                expect(this.defendingPlayer.loseConflict).toHaveBeenCalledWith('military', false);
            });
        });

        describe('when the defender has higher skill', function() {
            beforeEach(function() {
                spyOn(this.attackerCard, 'getSkill').and.returnValue(4);
                spyOn(this.defenderCard, 'getSkill').and.returnValue(5);
                this.conflict.addAttackers([this.attackerCard]);
                this.conflict.addDefenders([this.defenderCard]);
                this.conflict.determineWinner();
            });

            it('should have the defending player be the winner', function() {
                expect(this.conflict.winner).toBe(this.defendingPlayer);
            });

            it('should mark the win for the defending player', function() {
                expect(this.defendingPlayer.winConflict).toHaveBeenCalledWith('military', false);
            });

            it('should have the attacking player be the loser', function() {
                expect(this.conflict.loser).toBe(this.attackingPlayer);
            });

            it('should mark the loss for the attacking player', function() {
                expect(this.attackingPlayer.loseConflict).toHaveBeenCalledWith('military', true);
            });
        });
    });
});
