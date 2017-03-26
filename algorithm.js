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
    ], 3, "optimal"));

    function pageReplacement(pageStream, frameLength, replacementType) {
        let frameHeader = 0;
        let frameStream = [];
        let frame = [];

        if(replacementType === 'fifo'){
            for(let pageHeader = 0; pageHeader < pageStream.length; pageHeader++){
                let pageFault = true;
                let isPageExisting = (frame.find(
                    function (page) {
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
        }

        if(replacementType === "optimal"){
            for(let pageHeader = 0; pageHeader < pageStream.length; pageHeader++){
                let pageFault = true;
                let isPageExisting = (
                    frame.find(function (page) {
                        return page.id === pageStream[pageHeader].id;
                    })
                ) !== undefined;

                if(isPageExisting){
                    pageFault = false;
                }else{
                    if(frameHeader < frameLength){
                        frame[frameHeader] = pageStream[pageHeader];
                        frameHeader++;
                    }else {
                        let pageStreamLookUp = pageStream.slice(pageHeader+1, pageStream.length);
                        let pageOptimality = [];

                        for(let frameCell = 0; frameCell < frame.length; frameCell++){
                            let pageNextLocation = pageStreamLookUp.findIndex(function (page) {
                                return page.id === pageStreamLookUp[frameCell].id;
                            });
                            pageOptimality.push(pageNextLocation);
                        }

                        let unusedPage = pageOptimality.find(function (index) {
                            return index === -1;
                        });

                        let indexOfMaximum = unusedPage === undefined ?
                            pageOptimality.indexOf(Math.max.apply(Math, pageOptimality)) : pageOptimality.indexOf(-1);

                        frame[indexOfMaximum] = pageStream[pageHeader];
                    }
                }

                frameStream.push({
                    pageFault: pageFault,
                    frame: duplicateObject(frame)
                });
            }
        }

        if(replacementType === "second chance"){

        }

        if(replacementType === "lfu"){

        }

        return frameStream;
    }


    function duplicateObject(object) {
        return JSON.parse(JSON.stringify(object));
    }

})();
