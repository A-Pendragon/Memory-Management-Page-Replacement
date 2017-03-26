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

    // let spass = [
    //     { id: 1 },
    //     { id: 2 },
    //     { id: 3 }
    // ];
    //
    // let value = spass.find(function (element) {
    //    return element.id === 2;
    // });
    //
    // value.id = 5;
    // console.log(spass);

    function pageReplacement(pageStream, frameLength, replacementType) {
        let totalPageFault = 0;
        let frameHeader = 0;
        let frameStream = [];
        let frame = [];

        if(replacementType === 'fifo'){
            for(let pageHeader = 0; pageHeader < pageStream.length; pageHeader++){
                let pageFault = true;
                let isPageExisting = (frame.find(function (page) {
                    return page.id === pageStream[pageHeader].id;
                })) !== undefined;
;
                if(isPageExisting){
                    pageFault = false;
                }else{
                    totalPageFault++;
                    frame[frameHeader] = pageStream[pageHeader];
                    frameHeader += frameHeader+1 < frameLength ? 1 : 0;
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
                let isPageExisting = (frame.find(function (page) {
                    return page.id === pageStream[pageHeader].id;
                })) !== undefined;

                if(isPageExisting){
                    pageFault = false;
                }else{
                    totalPageFault++;
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
            for(let pageHeader = 0; pageHeader < pageStream.length; pageHeader++){
                let pageFault = true;
                let pageFound = {};
                let isPageExisting = (pageFound = frame.find(function (page) {
                    return page.id === pageStream[pageHeader].id;
                })) !== undefined;

                if(isPageExisting){
                    pageFault = false;
                    pageFound.reference = true;
                }else{
                    totalPageFault++;
                    while(frame.length === frameLength && frame[frameHeader] !== undefined && frame[frameHeader].reference){
                        frame[frameHeader].reference = false;
                        frameHeader += frameHeader+1 < frameLength ? 1 : 0;
                    }

                    frame[frameHeader] = pageStream[pageHeader];
                    frame[frameHeader].reference = false;
                    frameHeader += frameHeader+1 < frameLength ? 1 : 0;
                }

                frameStream.push({
                    pageFault: pageFault,
                    frame: duplicateObject(frame)
                });
            }
        }

        if(replacementType === "lfu"){
            for(let pageHeader = 0; pageHeader < pageStream.length; pageHeader++){
                let pageFault = true;
                let pageFound = {};
                let isPageExisting = (pageFound = frame.find(function (page) {
                    return page.id === pageStream[pageHeader].id;
                })) !== undefined;

                if(isPageExisting){
                    pageFault = false;
                    pageFound.frequency++;
                }else{
                    totalPageFault++;
                    if(frameHeader < frameLength){
                        frame[frameHeader] = pageStream[pageHeader];
                        frame[frameHeader].frequency = 1;
                        frameHeader++;
                    }else {
                        let pageFrequencies = [];
                        for(let frameCell = 0; frameCell < frame.length; frameCell++){
                            pageFrequencies.push(frame[frameCell].frequency);
                        }

                        let indexOfMinimum = pageFrequencies.indexOf(Math.min.apply(Math, pageFrequencies));
                        frame[indexOfMinimum] = pageStream[pageHeader];
                        frame[indexOfMinimum].frequency = 1;
                    }
                }

                frameStream.push({
                    pageFault: pageFault,
                    frame: duplicateObject(frame)
                });
            }
        }

        return {
            frameStream: frameStream,
            faultRate: totalPageFault / pageStream.length * 100,
            successRate: Math.abs(pageStream.length-totalPageFault) / pageStream.length * 100
        };
    }


    function duplicateObject(object) {
        return JSON.parse(JSON.stringify(object));
    }

})();
