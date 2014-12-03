module.exports = function(creep)
{
	//If out of energy, go to spawn and recharge
	if(creep.energy == 0) {
		creep.moveTo(Game.spawns.Spawn1);
		Game.spawns.Spawn1.transferEnergy(creep);
	}
	else {
		//First, we're going to check for damaged ramparts. We're using ramparts as the first line of defense
		//and we want them nicely maintained. This is especially important when under attack. The builder will
		//repair the most damaged ramparts first
		var structures = creep.room.find(Game.STRUCTURES);
		var damagedRamparts = [ ];

		for(var index in structures)
		{
			var structure = structures[index];
			if(structure.structureType == 'rampart' && structure.hits < (structure.hitsMax - 20))
				damagedRamparts.push(structure);
		}

		damagedRamparts.sort(function(a, b)
		{
			return(a.hits - b.hits);
		});

		if(damagedRamparts.length)
		{
			creep.moveTo(damagedRamparts[0], { withinRampartsOnly: true });
			creep.repair(damagedRamparts[0]);

			return;
		}

		//Next we're going to look for general buildings that have less than 50% health, and we'll go to repair those.
		//We set it at 50%, because we don't want builders abandoning their duty every time a road gets walked on
		var halfBroken = creep.room.find(Game.STRUCTURES);
		var toRepair = [ ];
		for(var index in halfBroken)
			if((halfBroken[index].hits / halfBroken[index].hitsMax) < 0.5)
				toRepair.push(halfBroken[index]);

		if(toRepair.length)
		{
			var structure = toRepair[0];
			creep.moveTo(structure);
			creep.repair(structure);

			return;
		}

		//If no repairs are needed, we're just going to go find some structures to build
		var targets = creep.pos.findNearest(Game.CONSTRUCTION_SITES);
		if(targets !== undefined) {

			creep.moveTo(targets);
			creep.build(targets);
			return;
		}

		//If we have nothing to do, let's just go and regroup at the spawn point
		creep.moveTo(Game.spawns.Spawn1, { withinRampartsOnly: true });
	}
};