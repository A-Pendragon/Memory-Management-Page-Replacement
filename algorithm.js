(function () {
    "use strict";

    console.log(pageReplacement([
        { id: 1 },
        { id: 2 },
        { id: 1 },
        { id: 3 },
        { id: 1 },
        { id: 2 },
        { id: 4 },
        { id: 2 },
        { id: 1 },
        { id: 3 }
    ], 3, "fifo"));

    function pageReplacement(pageStream, frameLength, replacementType) {
        let frameHeader = 0;
        let frameStream = [];
        let frame = [];

        if(replacementType === 'fifo'){
            for(let pageHeader = 0; pageHeader < pageStream.length; pageHeader++){
                let pageFault = true;
                let isPageExisting = (
                    frame.find(function (page) {
                        return page.id === pageStream[pageHeader].id;
                    })
                ) !== undefined;
;

                if(isPageExisting){
                    pageFault = false;
                }else{
                    frame[frameHeader] = pageStream[pageHeader];
                    if(frameHeader+1 < frameLength){
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

            return frameStream;
        }

        if(replacementType === "optimal"){

        }

        if(replacementType === "second chance"){

        }

        if(replacementType === "lfu"){

        }
    }


    function duplicateObject(object) {
        return JSON.parse(JSON.stringify(object));
    }

})();
