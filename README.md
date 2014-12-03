Overview
=======
This library includes a number of things, the main two of which are the are the **roles** functionality and the **spawner**.
The spawner mainly uses what is known as a role to make human readable aliases to spawn off of, as well as containing some
methods to help managing the spawner. The roles are a set of classes that are made to be sharable between projects, so if
you want to share your particular body parts config, or the ai, for a role with someone else, it should be easy to simply
plug and play.

Spawner
=======
The spawner module has 4 methods for use. These are

 - spawn(role, memory)
 - canSpawn(spawnPoint, role)
 - spawnCost(role)
 - killAll()
 
The **role** argument here refers to a human readable name for the list of body parts and AI for a creep. The role directly 
relates to the AI for that role in the file roles_{roleName}. So if you spawn a creep with the role
of "miner" it's AI code will be located in roles_miner.js

Roles
=====
To make things simple, I've split each role up into it's own file, containing it's list of parts (and sometimes a list an
array of these lists). This means that it should be relatively easy to simply add a new role without making your code for 
running a turn any more complicated, as the rest of the code will simply take the new role into account.

Each role in this codebase extends from the role_prototype.js code, for some shared functionality. This functionality includes
some events which you can handle. So far the code supports handling the following events:

 - onSpawn() *This is called when the spawner has started spawning*
 - onSpawnStart() *This is called when the spawner has started spawning*
 - onSpawnEnd() *This is called when the creep has finished spawning*
 - beforeAge *This is called when the creep has one tick left*
 
And the main AI code should go into the

 - performAction(creep)
 
method.

Levels
======
I believe one of the important features for late game screeps will be having different units depending on how much energy
and how many extensions you have. What units you can build with only 5 parts won't really be all competitive when put
up against what you can do with, say, 12 parts instead. For this reason, this framework supports the ability to have roles
automatically adjust their body parts to take in to account what you're able to build. At the moment, this is implemented 
by creating an array of body parts. For example, a simple list of body parts for a creep might look like:

```javascript
[Game.TOUGH, Game.TOUGH, Game.MOVE, Game.ATTACK, Game.ATTACK]
```

For a simple warrior. It contains 5 parts, the maximum you can build without any extensions. However, if you wanted to 
have your warriors to be built tougher if you have the extensions, you might define your parts list as such

```javascript
[
	[Game.TOUGH, Game.TOUGH, Game.MOVE, Game.ATTACK, Game.ATTACK],
	[Game.TOUGH, Game.TOUGH, Game.MOVE, Game.ATTACK, Game.ATTACK, Game.RANGED_ATTACK],
	[Game.TOUGH, Game.TOUGH, Game.MOVE, Game.ATTACK, Game.ATTACK, Game.RANGED_ATTACK, Game.HEAL],
	[Game.TOUGH, Game.TOUGH, Game.TOUGH, Game.MOVE, Game.ATTACK, Game.ATTACK, Game.RANGED_ATTACK, Game.HEAL]
]
```

And when the spawner attempts to spawn your warrior, if you have no extensions, it'll try to spawn the first one, if it
has one extension with >= 200 energy, it'll hit up the second, if you have two, the third, and if you have four, it will
try to spawn the last definition. This way, when you set up your scripts to make sure that when a warrior dies, he should be
replaced, it will pick the definition that fits your needs without you having to add complex logic.

Further more, you can see what kind of creep will be spawned with your current capabilities manually in the console. It's as simple
as using the command

```javascript
require('roleManager').getRoleBodyParts('warrior')
```

And it will send you a list of body parts that suit the current situation. The logic for selecting what level can also be
overriden by changing the .prototype.getParts() function for a role. For example, if you wanted to select a random defintion
for a warrior, instead of scaling it normally, in your roles_warrior.js file you could define

```javascript
warrior.prototype.getParts = function()
{
	var key = Math.floor(Math.random() * this.parts.length);
	return this.parts[key];
}
```