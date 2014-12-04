var proto = require('role_prototype');

var scavenger = function()
{

};

scavenger.prototype = Object.create(proto.prototype);
scavenger.parts = [
	[Game.CARRY, Game.CARRY, Game.MOVE, Game.MOVE]
];
scavenger.prototype.performAction = function(creep)
{
	var droppedEnergy = creep.pos.findNearest(Game.DROPPED_ENERGY, {
		filter: function(en) {
			var pickup = true;
			var tile = creep.room.lookAt(en);
			for(var i in tile)
			{
				if(tile[i].type == "creep" && tile[i].creep.memory.role == "miner")
					pickup = false;
			}

			if(pickup)
				console.log(tile);

			return pickup;
		}
	});

	if(droppedEnergy == null || creep.energy == creep.energyCapacity)
	{
		creep.moveTo(Game.spawns.Spawn1);
		creep.transferEnergy(Game.spawns.Spawn1);
	}
	else
	{
		creep.moveTo(droppedEnergy);
		creep.pickup(droppedEnergy);
	}
};

module.exports = scavenger;