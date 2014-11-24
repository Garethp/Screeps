var countType = require('countType');
var spawner = require('spawner');

module.exports = function()
{
	if(Memory.sources == undefined)
		Memory.sources = { };

	//These creeps will be generated in this order, and if one of them dies or expires, they'll be rebuilt
	var requiredScreeps = [
		'miner',
		'miner_helper',
		'miner_helper',
		'miner',
		'miner_helper',
		'miner_helper',
	]

	var gatheredScreeps = { };
	for(var index in requiredScreeps)
	{
		var type = requiredScreeps[index];
		if(Game.spawns.Spawn1.spawning != undefined)
		{
			break;
		}

		if(gatheredScreeps[type] == undefined)
			gatheredScreeps[type] = 0;

		var neededToSkip = gatheredScreeps[type] + 1;

		if(neededToSkip > countType(type))
		{
			spawner.spawn(type);
			break;
		}

		gatheredScreeps[type]++;
	}
}