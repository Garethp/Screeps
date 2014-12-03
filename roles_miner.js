/**
 * This guy just finds a source, and stays near it. His job is just to mine away and let the energy fall on the ground
 * @param creep
 */
module.exports = function(creep)
{
	//Basically, each miner can empty a whole source by themselves. Also, since they're slow, we don't have them
	//moving away from the source when it's empty, it'd regenerate before they got to another one.
	//For this, we assign one miner to one source, and they stay with it
	var source = creep.pos.findNearest(Game.SOURCES, {
		filter: function(source)
		{
			if(Memory.sources[source.id] == undefined || Memory.sources[source.id].miner == undefined || Memory.sources[source.id].miner == creep.id)
				return true

			if(Game.getObjectById(Memory.sources[source.id].miner) == null)
				return true;

			return false;
		}
	});

	if(source == undefined)
		return;

	if(creep.memory.onCreated == undefined)
	{
		var steps = Game.spawns.Spawn1.pos.findPathTo(source).length * 2;
		var creepsNeeded = Math.round((steps * 6) / 50);

		for(var i = 0; i < creepsNeeded; i++)
			Memory.spawnQue.unshift({ type: 'miner_helper', memory: {
				miner: creep.id
			}});

		creep.memory.helpersNeeded = creepsNeeded;
		creep.memory.onCreated = true;
	}

	if(Memory.sources[source.id] == undefined)
		Memory.sources[source.id] = { id: source.id };

	Memory.sources[source.id].miner = creep.id;

	creep.moveTo(source);
	creep.harvest(source);
};