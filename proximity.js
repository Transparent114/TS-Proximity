// ==UserScript==
// @name         Proximity_Zh
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  显示选中土地受到的邻近效应
// @author       Transparent
// @match        https://townstar.sandbox-games.com/launch/
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    let isLogging = false;
    let totUpdate = 0;
    let loaded = 0;
    new MutationObserver(function(mutations) {
        if (document.querySelector('.hud .bottom') && loaded == 0) {
            loaded = 1;
            Load_Proximity();
        }
    }).observe(document, {childList: true, subtree: true});
    const proxList = ['Shady','Dirty','Salty','Sandy'];
    const proxList_Zh = ['阴影','污染','盐碱','多沙'];
    const passList = ['Water','Water_Drum','Energy','Crude_Oil','Wheat','Sugarcane','Cotton'];
    const asseList = ['https://townstar.sandbox-games.com/launch/files/assets/24496953/1/icon_water.png',
                      'https://townstar.sandbox-games.com/launch/files/assets/32374821/1/icon_waterDrum.png',
                     'https://townstar.sandbox-games.com/launch/files/assets/24496973/1/icon_energy.png',
                     'https://townstar.sandbox-games.com/launch/files/assets/24496975/1/icon_crudeOil.png',
                     'https://townstar.sandbox-games.com/launch/files/assets/24496952/1/icon_wheat.png',
                     'https://townstar.sandbox-games.com/launch/files/assets/24496957/1/icon_sugarcane.png',
                     'https://townstar.sandbox-games.com/launch/files/assets/24496930/1/icon_cotton.png'];
    let X = -1;
    let Z = -1;
    async function Load_Proximity(){
        if(isLogging) {
            showFrequency();
        }
        let Hud = document.createElement('div');
        Hud.style = 'margin-left:10px'
        let topProxHud = document.createElement('div');
        topProxHud.id = 'prox-proxtophud';
        topProxHud.style = 'width:40%; text-align:center';
        topProxHud.classList.add('bank');
        topProxHud.innerHTML = "邻近效应";
        Hud.appendChild(topProxHud);
        let HudBottom = document.querySelector(".hud .bottom");
        HudBottom.insertBefore(Hud, HudBottom.querySelector('.left').nextSibling);
        var i = 0;
        for(i = 0;i < proxList.length; i++) {
            let Ele = document.createElement('div');
            Ele.id = 'prox-'+proxList[i];
            Ele.style = 'width:40%; margin-left:4px';
            Ele.classList.add('bank', 'contextual');
            Ele.innerHTML = proxList_Zh[i]+': 0';
            Ele.style.display = 'none';
            Hud.appendChild(Ele);
        }
        let EleProxNone = document.createElement('div');
        EleProxNone.id = 'prox-none';
        EleProxNone.style = 'width:40%; margin-left:4px';
        EleProxNone.classList.add('bank', 'contextual');
        EleProxNone.innerHTML = '无';
        EleProxNone.style.display='none';
        Hud.appendChild(EleProxNone);
        let topPassHud = document.createElement('div');
        topPassHud.id = 'prox-passtophud';
        topPassHud.style = 'width:40%; margin-left:4px';
        topPassHud.classList.add('bank');
        topPassHud.innerHTML = '被动物品';
        Hud.appendChild(topPassHud);
        for(i = 0;i < passList.length; i++) {
            let Ele = document.createElement('div');
            Ele.id = 'prox-'+passList[i];
            Ele.style = 'width:40%; margin-left:4px';
            Ele.classList.add('bank', 'contextual');
            Ele.innerHTML = '<img class="hud-craft-icon" src="'+asseList[i]+'">'+'<p class="hud-craft-amount">0</p>';
            Ele.style.display = 'none';
            Hud.appendChild(Ele);
        }
        let ElePassNone = document.createElement('div');
        ElePassNone.id = 'prox-passnone';
        ElePassNone.style = 'width:40%; margin-left:4px';
        ElePassNone.classList.add('bank', 'contextual');
        ElePassNone.innerHTML = '无';
        ElePassNone.style.display='none';
        Hud.appendChild(ElePassNone);
        Show_Proximity();
    }
    function Clear_Hud() {
        var i = 0;
        for(i = 0;i < proxList.length; i++) {
            document.getElementById('prox-'+proxList[i]).style.display = 'none';
        }
        document.getElementById('prox-none').style.display = 'none';
        for(i =0;i < passList.length; i++) {
            document.getElementById('prox-'+passList[i]).style.display = 'none';
        }
        document.getElementById('prox-passnone').style.display = 'none';
    }
    function Show_Proximity() {
        let x=Game.town.selectedObject.townX;
        let z=Game.town.selectedObject.townZ;
        if(x == X && z == Z) {
            setTimeout(Show_Proximity, 500);
            return;
        }
        X = x;
        Z = z;
        if(isLogging){
            console.log('Update Proximity.');
            totUpdate++;
        }
        Clear_Hud();
        let prox = Game.town.GetProximityEffects(x,z);
        let hasProx = 0;
        let hasPass = 0;
        if(prox.Shady != undefined) {
            hasProx = 1;
            document.getElementById('prox-Shady').innerHTML = '阴影: '+prox.Shady.toString();
            document.getElementById('prox-Shady').style.display = '';
        }
        if(prox.Dirty != undefined) {
            hasProx = 1;
            document.getElementById('prox-Dirty').innerHTML = '污染: '+prox.Dirty.toString();
            document.getElementById('prox-Dirty').style.display = '';
        }
        if(prox.Salty != undefined) {
            hasProx = 1;
            document.getElementById('prox-Salty').innerHTML = '盐碱: '+prox.Salty.toString();
            document.getElementById('prox-Salty').style.display = '';
        }
        if(prox.Sandy != undefined) {
            hasProx = 1;
            document.getElementById('prox-Sandy').innerHTML = '多沙: '+prox.Sandy.toString();
            document.getElementById('prox-Sandy').style.display = '';
        }
        if(prox.Water != undefined) {
            hasPass = 1;
            document.getElementById('prox-Water').innerHTML = '<img class="hud-craft-icon" src="'+asseList[0]+'">'+'<p class="hud-craft-amount">'+prox.Water.toString()+'</p>';
            document.getElementById('prox-Water').style.display = '';
        }
        if(prox.Water_Drum != undefined) {
            hasPass = 1;
            document.getElementById('prox-Water_Drum').innerHTML = '<img class="hud-craft-icon" src="'+asseList[1]+'">'+'<p class="hud-craft-amount">'+prox.Water_Drum.toString()+'</p>';
            document.getElementById('prox-Water_Drum').style.display = '';
        }
        if(prox.Energy != undefined) {
            hasPass = 1;
            document.getElementById('prox-Energy').innerHTML = '<img class="hud-craft-icon" src="'+asseList[2]+'">'+'<p class="hud-craft-amount">'+prox.Energy.toString()+'</p>';
            document.getElementById('prox-Energy').style.display = '';
        }
        if(prox.Crude_Oil != undefined) {
            hasPass = 1;
            document.getElementById('prox-Crude_Oil').innerHTML = '<img class="hud-craft-icon" src="'+asseList[3]+'">'+'<p class="hud-craft-amount">'+prox.Crude_Oil.toString()+'</p>';
            document.getElementById('prox-Crude_Oil').style.display = '';
        }
        if(prox.Wheat != undefined) {
            hasPass = 1;
            document.getElementById('prox-Wheat').innerHTML = '<img class="hud-craft-icon" src="'+asseList[4]+'">'+'<p class="hud-craft-amount">'+prox.Wheat.toString()+'</p>';
            document.getElementById('prox-Wheat').style.display = '';
        }
        if(prox.Sugarcane != undefined) {
            hasPass = 1;
            document.getElementById('prox-Sugarcane').innerHTML = '<img class="hud-craft-icon" src="'+asseList[5]+'">'+'<p class="hud-craft-amount">'+prox.Sugarcane.toString()+'</p>';
            document.getElementById('prox-Sugarcane').style.display = '';
        }
        if(prox.Cotton != undefined) {
            hasPass = 1;
            document.getElementById('prox-Cotton').innerHTML = '<img class="hud-craft-icon" src="'+asseList[6]+'">'+'<p class="hud-craft-amount">'+prox.Cotton.toString()+'</p>';
            document.getElementById('prox-Cotton').style.display = '';
        }
        if(hasProx == 0) {
            document.getElementById('prox-none').style.display = '';
        }
        if(hasPass == 0) {
            document.getElementById('prox-passnone').style.display = '';
        }
        setTimeout(Show_Proximity, 500);
    }
    function showFrequency() {
        console.log("Update:"+((totUpdate/10).toString())+"/s");
        totUpdate = 0;
        setTimeout(showFrequency,10000);
    }
    async function waitForSelecting() {
        while (Game.town.selectedObject.townX == undefined) {
            await new Promise( resolve => requestAnimationFrame(resolve) )
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
})();
