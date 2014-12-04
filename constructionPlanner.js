module.exports = {
	buildRoads: function(from, to)
	{
		var path = Game.getRoom('1-1').findPath(from, to, { ignoreCreeps: true });
		for(var i in path)
		{
			var result = Game.getRoom('1-1').createConstructionSite(path[i].x, path[i].y, Game.STRUCTURE_ROAD);
		}
	},

	buildRoadToAllSources: function()
	{
		var sources = Game.spawns.Spawn1.room.find(Game.SOURCES);

		for(var i in sources)
		{
			this.buildRoads(Game.spawns.Spawn1.pos, sources[i].pos);
		}
	},

	expandRampartsOutwards: function()
	{
		var ramparts = Game.getRoom('1-1').find(Game.MY_STRUCTURES, {
			filter: function(struct)
			{
				return struct.structureType == Game.STRUCTURE_RAMPART
			}
		});

		for(var i in ramparts)
		{
			var rampart = ramparts[i];

			var positions = [
				[rampart.pos.x - 1, rampart.pos.y],
				[rampart.pos.x, rampart.pos.y - 1],
				[rampart.pos.x, rampart.pos.y - 1],
				[rampart.pos.x, rampart.pos.y + 1],
				[rampart.pos.x - 1, rampart.pos.y - 1],
				[rampart.pos.x + 1, rampart.pos.y - 1],
				[rampart.pos.x - 1, rampart.pos.y + 1],
				[rampart.pos.x - 1, rampart.pos.y - 1]
			];

			for(var i in positions)
			{
				var pos = positions[i];
				var tile = Game.getRoom('1-1').lookAt(pos[0], pos[1]);
				var build = true;
				for(var tilei in tile)
				{
					var thing = tile[tilei];
					if(thing.type == 'structure' && thing.structure.structureType == Game.STRUCTURE_RAMPART)
						build = false;
					if(thing.type == 'constructionSite')
						build = false;
				}

				if(build)
					Game.getRoom('1-1').createConstructionSite(pos[0], pos[1], Game.STRUCTURE_RAMPART);
			}
		}
	}
};