/**
 * The Guard hasn't been improved in a while, I've mostly just moved on to archers for now. I'll come back and
 * work on this one later
 * @param creep
 */
var proto = require('role_prototype');

var guard = function()
{

};

guard.prototype = Object.create(proto.prototype);
guard.parts = [Game.TOUGH, Game.MOVE, Game.ATTACK,Game.ATTACK];
guard.prototype.performAction = function(creep)
{
	var targets = creep.room.find(Game.HOSTILE_CREEPS);
	if(targets.length) {
		creep.moveTo(targets[0]);
		creep.attack(targets[0]);
	}
	else
	{
		creep.moveTo(Game.spawns.Spawn1);
	}
}

module.exports = guard;