/**
 * This guys does the other half of energy collection. The miner gets it from the source, and the helper does the
 * transportation. We don't want them just going for the nearest source, as that means that if we have more than one
 * miner, all the helpers will only go for the first miner. To counter this, we assign them to a miner the same way
 * we assign a miner to a source
 */

var helper = {
	parts: [
		[Game.MOVE, Game.CARRY, Game.MOVE, Game.CARRY]
	],

	/**
	 * @TODO: Sometimes in their eagerness to get to their miner, they'll block the miners path to the source. Fix this. (EG: Map 1, Bottom Left Source)
	 * @TODO: Sometimes when passing energy to the courier, the courier doesn't know they got energy, so they'll continue on to the miner. This is ridiculous
	 */
	action: function()
	{
		var creep = this.creep;

		//If this helper isn't assigned to a miner, find one and assign him to it. If it is assigned to a miner,
		//then find that miner by his id
		if(creep.memory.miner == undefined)
		{
			var miner = creep.pos.findNearest(Game.MY_CREEPS, {
				filter: function(miner)
				{
					if(miner.memory.role == 'miner' && (miner.memory.helpers == undefined || miner.memory.helpers.length < 2))
						return true;

					return false;
				}
			});

			if(miner == undefined)
				return;

			creep.memory.miner = miner.id;
			if(miner.memory.helpers == undefined)
				miner.memory.helpers = [ ];

			miner.memory.helpers.push(creep.id);
		}
		else
		{
			var miner = Game.getObjectById(creep.memory.miner);

			if(miner == null)
			{
				creep.suicide();
				return;
			}
		}

		//If we have too much energy, go drop it off. Otherwise, move to assigned miner and pick up any dropped energy
		if(creep.energy < creep.energyCapacity) {
			if(creep.pos.isNearTo(miner))
			{
				var energy = creep.pos.findInRange(Game.DROPPED_ENERGY, 1)[0];
				creep.pickup(energy);
			}
			else
			{
				creep.moveTo(miner);
			}
		}
		//Time to go deposit some energy somewhere
		else {
			//Get the nearest Spawn
			var target = creep.pos.findNearest(Game.MY_SPAWNS, { ignoreCreeps: true });

			//If the spawn has >50% energy, let's look for an extension
			if(target !== null && target.energy / target.energyCapacity >= .5)
			{
				//Look for the nearest extension that can take energy
				var extension = creep.pos.findNearest(Game.MY_STRUCTURES, {
					filter: function(structure)
					{
						return (structure.structureType == Game.STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity);
					},
					ignoreCreeps: true
				});

				//If we found it, set it as our target
				if(extension != undefined)
					target = extension;
			}

			//Let's get the direction we want to go in
			var targetDirection = creep.pos.findPathTo(target, { ignoreCreeps: true })[0].direction;

			//Let's look for a courier in that direction. We'll check on making sure they're the right
			//role, if they can hold any energy, if they're in range and if they're in the same direction
			var leftDir = targetDirection - 1;
			var rightDir = targetDirection + 1;

			if(leftDir < 1)
				leftDir += 8;
			if(leftDir > 8)
				leftDir -= 8;

			if(rightDir < 1)
				rightDir += 8;
			if(rightDir > 8)
				rightDir -= 8;

			var courier = creep.pos.findNearest(Game.MY_CREEPS, {
				filter: function(possibleTarget)
				{
					return (
						possibleTarget.memory.role == creep.memory.role
//					&& possibleTarget.memory.miner == creep.memory.miner
						&& possibleTarget.energy < possibleTarget.energyCapacity
						&& creep.pos.inRangeTo(possibleTarget, 1)
						&& (
						creep.pos.getDirectionTo(possibleTarget) == targetDirection
						|| creep.pos.getDirectionTo(possibleTarget) == leftDir
						|| creep.pos.getDirectionTo(possibleTarget) == rightDir
						)
						);
				}
			});

			//If we found a courier, make that courier our new target
			if(courier !== null) {
				target = courier;
			}

			//If our target is full (Extensions and Spawns), then let's find a builder to put it in.
			//If there is such a builder, let's make him our new target
			if(target.energy == target.energyCapacity)
			{
				var builder = creep.pos.findNearest(Game.MY_CREEPS, {
					filter: function(targetCreep)
					{
						return targetCreep.memory.role == 'builder'
							&& targetCreep.energy < targetCreep.energyCapacity;
					}
				});

				if(builder != null)
					target = builder;
			}

			//Now we're going to get the direction we need to go in to reach our target
			var targetDirection = creep.pos.findPathTo(target, { ignoreCreeps: true })[0].direction;

			//If we're near to the target, either give it our energy or drop it
			if(creep.pos.isNearTo(target)) {
				if(target.energy < target.energyCapacity) {
					creep.transferEnergy(target);
				}
				else
					creep.dropEnergy();
			}
			//Let's do the moving
			else {
				creep.moveTo(target);
			}
		}
	}
};

module.exports = helper;