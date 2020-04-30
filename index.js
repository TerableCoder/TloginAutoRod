module.exports = function TerableLogin(mod) {	
	const command = mod.command || mod.require.command;
    let enabled = mod.settings.enabled;
    
	command.add(['tlogin', 'teralogin', 'terablelogin'], {
		$default(name, remove){
            if(!name){
                mod.settings.enabled = !mod.settings.enabled;
                command.message(`TerableLogin ${mod.settings.enabled}`);
            } else{
                name = name.toLowerCase();
                if(!remove){ // add
                    if(!mod.settings.exceptionalCharacters.includes(name)){
                        mod.settings.exceptionalCharacters.push(name);
                        mod.saveSettings();
                    }
                } else{ // remove
                    if(mod.settings.exceptionalCharacters.includes(name)){
                        mod.settings.exceptionalCharacters.splice(mod.settings.exceptionalCharacters.indexOf(name));
                        mod.saveSettings();
                    }
                }
                command.message(`Names: ${mod.settings.exceptionalCharacters}`);
            }
        }
	});
	
    /*
        Let character select screen and client account settings to finish loading. May need to be adjusted for your CPU.
        No delay works but sometimes the "wind sound effect" from the "warping loading screen" will continue to play afterwards if you switch servers.
		If you set the delay too low your UI gets messed up.
    */
    //const delay = 8000;
    const delay = 2000;
    let exceptionalCharacter = true;
	
    //mod.hook('S_LOGIN_ACCOUNT_INFO', 2, (event) => {
    mod.hook('S_GET_USER_LIST', 17, event => {
        if(!enabled) return; // only auto login the first time
        
        if(!mod.settings.exceptionalCharacters.includes(event.characters[0].name)){
            exceptionalCharacter = false;
            mod.setTimeout(()=>{
                mod.toServer('C_SELECT_USER', 1, { id: event.characters[0].id, unk: 0 });
            }, delay);
        } else{
            exceptionalCharacter = true;
        }
        enabled = false;
    });

    /*const BAITS = [206001, 206002, 206003, 206004, 206006, 206007, 206008, 206009];
    const RODS = [206700, 206701, 206702, 206703, 206704, 206705, 206706, 206707, 206708, 206709, 206710, 206711, 206712, 206713, 206714, 206715, 206716, 206717, 206718, 206719, 206720, 206721, 206722, 206723, 206724, 206725, 206726, 206727, 206728];

    let playerLocation = {x: 0, y: 0, z: 0},
    playerAngle = 0;

    function UseItem(item){
		if(!item) return;
		mod.send('C_USE_ITEM', 3, {
			gameId: mod.game.me.gameId,
			id: item.id,
			dbid: item.dbid,
			target: 0n,
			amount: 1,
			dest: {x: 0, y: 0, z: 0},
			loc: playerLocation,
			w: playerAngle,
			unk1: 0,
			unk2: 0,
			unk3: 0,
			unk4: true
        });
	}

    mod.game.on('enter_game', () => { // use bait and rod
        if(false){
        //if(!exceptionalCharacter){
            mod.hookOnce('S_SPAWN_ME', 3, event => {
                Object.assign(playerLocation, event.loc);
                playerAngle = event.w;
                mod.send('C_SHOW_ITEMLIST', 1, {gameId: mod.game.me.gameId, container: 0, pocket: 0, requested: true });
                mod.setTimeout(() => {
                    UseItem(mod.game.inventory.find(BAITS));
                    mod.setTimeout(() => {
                        UseItem(mod.game.inventory.find(RODS));
                    }, 4382 + Math.random()*132);
				}, 3432 + Math.random()*271);
            });
        }
	});*/
}
