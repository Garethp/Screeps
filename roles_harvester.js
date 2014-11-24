/**
 * These are simple creatures, they just find an active source and harvest it
 * @param creep
 */
module.exports = function (creep) {
	if(creep.energy < creep.energyCapacity) {
		var sources = creep.pos.findNearest(Game.SOURCES);
		creep.moveTo(sources);
		creep.harvest(sources);
	}
	else {
		var target = creep.pos.findNearest(Game.MY_SPAWNS);

		creep.moveTo(target);
		creep.transferEnergy(target);
	}
}