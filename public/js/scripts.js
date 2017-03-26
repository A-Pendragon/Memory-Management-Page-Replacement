function memoryManagement() {
	var type = $('#type').val();
	var frames = $('#frames').val();
	var jobsInput = $('#jobs').val();
	var jobs = jobsInput.split(',');
	var arr = new Array(jobs.length);

	// Convert to object.
	for(let i = 0; i < arr.length; i++) {
		arr[i] = toObject(jobs[i]);
	}

	var output = pageReplacement(arr, frames, type);
	outputResult(jobs, output.frameStream, frames);
	return false;	// To prevent page refresh.
}

function toObject(arr) {
	let obj = {};
	for (let i = 0; i < arr.length; ++i) {
		if (arr[i] !== undefined) {
			obj.id = Number(arr[i]);
		}
	}
  	return obj;
}

// Create and insert values in new table row.
function outputResult(jobs, output, frameLength) {
	var table = document.getElementById("table");
	var tableHeader = document.getElementById("table-header");
    deleteAllTableRow(tableHeader, table);
	var header = tableHeader.createTHead();
	let row = header.insertRow(-1);
	let cell = [];

	for(let i = 0; i < output.length; i++) {
		cell[i] = row.insertCell(i);
		cell[i].innerHTML = "<b>" + jobs[i] + "</b>";
	}

	// Insert in table
	for(let i = 0; i < frameLength; i++) {
		let row = table.insertRow(-1);

		for(let j = 0; j < output.length; j++) {
			let cols = [];

			cols[j] = row.insertCell(j);

			if(i < output[j].frame.length) {
				cols[j].innerHTML = output[j].frame[i].id;
			}
		}
	}
}

function deleteAllTableRow(tableHeader, table) {
    if(tableHeader.rows.length > 0) {
        tableHeader.deleteRow(0);   
    }
    while(table.rows.length > 0) {
        table.deleteRow(0);
    }   
}

function pageReplacement(pageStream, frameLength, replacementType) {
    let totalPageFault = 0;
    let frameHeader = 0;
    let frameStream = [];
    let frame = [];

    if(replacementType === 'First In First Out'){
        for(let pageHeader = 0; pageHeader < pageStream.length; pageHeader++){
            let pageFault = true;
            let isPageExisting = (frame.find(function (page) {
                return page.id === pageStream[pageHeader].id;
            })) !== undefined;

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

    if(replacementType === "Optimal"){
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

    if(replacementType === "Second Chance"){
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

    if(replacementType === "Least Frequently Used"){
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