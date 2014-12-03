/**
 * This was basically the first version of the miner_helper. It goes to pick up any dropped energy, not ones from miner
 * This could be used to get energy from the battle field, if given some AI for running away
 * @param creep
 */
var proto = require('role_prototype');

var scavenger = function()
{

};

scavenger.prototype = Object.create(proto.prototype);
scavenger.performAction = function (creep) {
	if(creep.energy < creep.energyCapacity) {
		var sources = creep.pos.findNearest(Game.DROPPED_ENERGY);
		creep.moveTo(sources);
		creep.pickup(sources);
	}
	else {
		var target = creep.pos.findNearest(Game.MY_SPAWNS);

		creep.moveTo(target);
		creep.transferEnergy(target);
	}
};

module.exports = scavenger;