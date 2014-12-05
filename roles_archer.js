var proto = require('role_prototype');

var archer = function()
{

};

archer.parts = [
	[Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE],
	[Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE, Game.MOVE],
	[Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE, Game.MOVE, Game.MOVE],
	[Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE, Game.MOVE, Game.MOVE, Game.MOVE],
];

archer.prototype = Object.create(proto.prototype);
archer.prototype.performAction = function()
{
	var creep = this.creep;

	var target = this.fightMethods.rangedAttack(creep);

	//If there's not a target near by, let's go search for a target if need be
	if(target === null)
	{
		target = creep.pos.findNearest(Game.HOSTILE_CREEPS);
		if (target)
		{
			creep.moveTo(target);
			return;
		}
	} else if (this.fightMethods.kite(creep, target)) return;

	this.fightMethods.rest(creep);
};

module.exports = archer;