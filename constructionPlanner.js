module.exports = {
	buildRoads: function(from, to)
	{
		var path = Game.getRoom('1-1').findPath(from, to, { ignoreCreeps: true });
		for(var i in path)
		{
			var result = Game.getRoom('1-1').createConstructionSite(path[i].x, path[i].y, Game.STRUCTURE_ROAD);
			console.log(result);
		}
	},

	buildRoadToAllSources: function()
	{
		var sources = Game.spawns.Spawn1.room.find(Game.SOURCES);

		for(var i in sources)
		{
			this.buildRoads(Game.spawns.Spawn1.pos, sources[i].pos);
		}
	}
};