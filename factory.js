var countType = require('countType');

module.exports ={
	init: function()
	{
		if(Memory.factoryInit != undefined)
			return;

		Memory.factoryInit = true;
		this.memory();
	},

	run: function()
	{
		this.spawnRequiredScreeps();
	},

	memory: function() {
		if(Memory.spawnQue == undefined)
			Memory.spawnQue = [ ];

		if(Memory.sources == undefined)
			Memory.sources = { };

		if(Memory.requiredScreeps == undefined)
		{
			Memory.requiredScreeps = [
				//Survival
				'miner', //1
				'archer', //1
				'miner', //2
				'archer', //2
				'healer', //1
				'archer', //3
				'miner', //3
				'builder',
				'transporter',
				'transporter',
				'archer', //4
				'healer', //2
				'archer', //5
				'archer', //6
				'miner', //4
				'archer', //7
				'archer', //8
				'archer', //9
				'healer', //3
				'miner', //5
				'builder',
				'transporter',
				'transporter',
				'archer', //10
				'archer', //11
				'healer' //4

				//Tutorial
//				'miner',
//				'miner',
//				'miner',
//				'miner',
//				'miner',
			];
		}
	},

	spawnRequiredScreeps: function()
	{
		var requiredScreeps = Memory.requiredScreeps;

		var gatheredScreeps = { };
		for(var index in requiredScreeps)
		{
			var type = requiredScreeps[index];
			if(gatheredScreeps[type] == undefined)
				gatheredScreeps[type] = 0;

			var neededToSkip = gatheredScreeps[type] + 1;

			var found = countType(type, true);
			if(neededToSkip > countType(type, true))
			{
				Memory.spawnQue.push(type);
			}

			gatheredScreeps[type]++;
		}
	},

	buildArmyWhileIdle: function()
	{
		for(var i in Game.spawns)
		{
			var spawn = Game.spawns[i];
			if(!spawn.spawning && Memory.spawnQue.length == 0 && spawn.energy / spawn.energyCapacity >= .6) {
				var archers = countType('archer', true);
				var healers = countType('healer', true);

				if(healers / archers < .25)
					require('spawner').spawn('healer', { }, spawn);
				else
					require('spawner').spawn('archer', { }, spawn);
			}
		}
	}
};