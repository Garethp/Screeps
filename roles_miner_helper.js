/**
 * This guys does the other half of energy collection. The miner gets it from the source, and the helper does the
 * transportation. We don't want them just going for the nearest source, as that means that if we have more than one
 * miner, all the helpers will only go for the first miner. To counter this, we assign them to a miner the same way
 * we assign a miner to a source
 */

var helper = {
	parts: [
		[Game.MOVE, Game.CARRY, Game.MOVE, Game.CARRY],
		[Game.MOVE, Game.CARRY, Game.MOVE, Game.CARRY, Game.MOVE, Game.CARRY]
	],

	assignMiner: function () {
		var creep = this.creep;

		var miner = creep.pos.findNearest(Game.MY_CREEPS, {
			filter: function (miner) {
				if (miner.memory.role == 'miner' && miner.memory.helpers.length < miner.memory.helpersNeeded)
					return true;

				return false;
			}
		});

		if (miner == undefined)
			return;

		creep.memory.miner = miner.id;
		miner.memory.helpers.push(creep.id);
	},

	/**
	 * @TODO: Make helpers smarter about avoiding miners, instead of just waiting till they're 5 tiles away
	 * @TODO: When spawns are at .25, and extensions have >= 200, help builders before filling shit up
	 */
	action: function () {
		var creep = this.creep;

		if (creep.memory.courier !== undefined && creep.memory.courier == true) {
			creep.memory.courier = false;
			return;
		}

		//If this helper isn't assigned to a miner, find one and assign him to it. If it is assigned to a miner,
		//then find that miner by his id
		if (creep.memory.miner == undefined)
			this.assignMiner();

		var miner = Game.getObjectById(creep.memory.miner);

		if (miner == null) {
			creep.suicide();
			return;
		}

		//If we can still pick up energy, let's do that
		if (creep.energy < creep.energyCapacity) {
			if (creep.pos.isNearTo(miner)) {
				var energy = creep.pos.findInRange(Game.DROPPED_ENERGY, 1)[0];
				creep.pickup(energy);
			}
			else {
				if (miner.memory.isNearSource)
					creep.moveTo(miner);
			}

			return;
		}

		var target = null;

		//Okay, everything below is for dropping energy off

		if (!target) {
			var spawn = creep.pos.findNearest(Game.MY_SPAWNS);

			//If we found it, set it as our target
			if (spawn)
				target = spawn;
		}

		//Let's get the direction we want to go in
		var targetDirection = creep.pos.findPathTo(target, { ignoreCreeps: true })[0].direction;

		//Let's look for a courier in that direction. We'll check on making sure they're the right
		//role, if they can hold any energy, if they're in range and if they're in the same direction
		var leftDir = targetDirection - 1;
		var rightDir = targetDirection + 1;

		if (leftDir < 1)
			leftDir += 8;
		if (leftDir > 8)
			leftDir -= 8;

		if (rightDir < 1)
			rightDir += 8;
		if (rightDir > 8)
			rightDir -= 8;

		var courier = creep.pos.findNearest(Game.MY_CREEPS, {
			filter: function (possibleTarget) {
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
		if (courier !== null && !creep.pos.isNearTo(target)) {
			target = courier;
			target.memory.courier = true;
		}

		//If we're near to the target, either give it our energy or drop it
		if (creep.pos.isNearTo(target)) {
			if (target.energy < target.energyCapacity) {
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
};

module.exports = helper;