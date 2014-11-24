module.exports = function(type)
{
	//Get the current room, then find all creeps in that room by their role
	var room = null;
	for(var i in Game.spawns)
	{
		room = Game.spawns[i].room;
	}

	return room.find(Game.MY_CREEPS, {
		filter: function(creep)
		{
			if(creep.memory.role == type)
				return true;

			return false;
		}
	}).length;
};