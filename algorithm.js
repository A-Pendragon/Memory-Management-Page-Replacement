(function () {
    "use strict";
    
    function pageReplacement(pageStream, frameLength, replacementType) {
        let frameHeader = 0;
        let frameStream = [];
        let frame = [];

        for(let pageHeader = 0; pageHeader < pageStream.length; pageHeader++){
            let pageFault = true;
            let currentPage = pageStream[pageHeader];
            let currentFrame = frame[frameHeader];

            let isPageExisting = frame.find(function (page) {
                return page.id === currentPage.id;
            });

            if(isPageExisting){
                pageFault = false;
            }else{
                currentFrame = duplicateObject(currentPage);
                if(frameHeader < frameLength){
                    frameHeader++;
                }else {
                    frameHeader = 0;
                }
            }

            frameStream.push({
                pageFault: pageFault,
                frame: duplicateObject(frame)
            });
        }
    }


    function duplicateObject(object) {
        return JSON.parse(JSON.stringify(object));
    }

})();
