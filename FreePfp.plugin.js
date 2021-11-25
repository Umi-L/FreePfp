/**
 * @name FreePfp
 * @description Free animated profile pictures!
 * @version 1.0
 * @author Umi
 */

function getUUIDS(imgList, _uuidList){

    var newUuidList = _uuidList;

    for (var i = 0; i < imgList.length; i++) {
        if (imgList[i].src.includes("https://cdn.discordapp.com/avatars/")) {
            var cuuid = imgList[i].src.replace("https://cdn.discordapp.com/avatars/", "").split('/')[0];

            if (!_uuidList.includes(cuuid)){
                newUuidList.push(cuuid)
            }
        }
    }
    return newUuidList;
}

function replaceBgImage(_class, _people, _replace){
    for (var i = 0; i < _class.length; i++){
        for (var j = 0; j < _people.length; j++){
            if (_class[i].style.backgroundImage.replace('url("https://cdn.discordapp.com/avatars/', "").split('/')[0] == _people[j]){
                _class[i].style.backgroundImage = 'url("' + _replace[j] + '")'
            }
        }
    }
}

function replace(imgList, replaceList, peopleList) {
    replaceBgImage(pfpSpeaking, peopleList, replaceList)

    replaceBgImage(pfpVChannel, peopleList, replaceList)

    for (var i = 0; i < imgList.length; i++) {

        for (var j = 0; j < peopleList.length; j++) {

            if (imgList[i].src.includes("https://cdn.discordapp.com/avatars/")) {
                //console.log(imgList[i].src);
                if (imgList[i].src.replace("https://cdn.discordapp.com/avatars/", "").split('/')[0] == peopleList[j]) {
                    //console.log(imgList[i].src);
                    imgList[i].src = replaceList[j]
                }
            }
        }
    }
}

function fetchPfp(){
    console.log("new pfps");
            
    uuidList = getUUIDS(document.querySelectorAll('img'), uuidList);
    
    console.log("new pfps to check");

    var params = "";
    for (var i = 0; i < uuidList.length; i++){
        if (i != uuidList.length + 1){
            params += uuidList[i] + ",";
        }
        else{
            params += uuidList[i]
        }
    }

    var request = new XMLHttpRequest();
    request.open('GET', 'https://pfp-api-8schg.ondigitalocean.app/api/?uuid='+params, true);
    request.send();

    request.onload = function () {
        var data = JSON.parse(this.response);
        

        for(var user in data) {
            if (!replaceList.includes(user)){
                replaceList.push(data[user]["img"]);
                peopleList.push(data[user]["uuid"]);
            }
        }
        uuidList = [];
    }
}

var replaceList = [];
var peopleList = [];
var uuidList = [];

var vFetchPfp;
var clearCache;

const pfpSpeaking = document.getElementsByClassName("speaking-B2MXPi"); 
const pfpVChannel = document.getElementsByClassName("avatarSmall-1PJoGO"); 

module.exports = class ExamplePlugin {
    start() {
        console.log("--Start FreePFP--\n \n");

        uuidList = getUUIDS(document.querySelectorAll('img'), uuidList);
        console.log(uuidList);

        fetchPfp();
        
        replace(document.querySelectorAll('img'), peopleList, replaceList);

        vFetchPfp = setInterval(fetchPfp, 10000)
    }
    stop(){
        clearInterval(vFetchPfp);
    }

    observer(changes){
        
        var allElements = changes.target.getElementsByTagName("IMG");

        uuidList = getUUIDS(changes.target.getElementsByTagName("IMG"), uuidList);

        if (allElements.length > 0){
            replace(allElements, replaceList, peopleList);
        }

        if (uuidList.length > 222){
            console.log("cache overlimit")
            uuidList = [];;
        }
        
    }
}