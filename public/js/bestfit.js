	var operatingSystem = [

		{name: "Partition #1", partitionSize:100, internalFragmentation:0, jobSizeAllocated:0, busy:false},
		{name: "Partition #2", partitionSize:500, internalFragmentation:0, jobSizeAllocated:0, busy:false},
		{name: "Partition #3", partitionSize:200, internalFragmentation:0, jobSizeAllocated:0, busy:false},
		{name: "Partition #4", partitionSize:300, internalFragmentation:0, jobSizeAllocated:0, busy:false},
		{name: "Partition #5", partitionSize:600, internalFragmentation:0, jobSizeAllocated:0, busy:false},
	];

	var jobs = [
		{name: "Job #1", jobSize:212},
		{name: "Job #2", jobSize:417},
		{name: "Job #3", jobSize:112},
		{name: "Job #4", jobSize:426},
	];

	var candidate = [];
	var candidateIndex = [];

	function findBestCandidate(candidate_1,candidate_2, index_1, index_2){
		if(candidate_1.partitionSize > candidate_2.partitionSize){
			var best =  index_2;
		}
		else{
			best = index_1;		
		}
		return best;
	}


	
	for (var i = 0; i < 4; i++) {				//finds the qualified partition for the job
		for (var j = 0; j < operatingSystem.length; j++) {
			if(jobs[i].jobSize <= operatingSystem[j].partitionSize  && operatingSystem[j].busy == false) {
				candidate.push(operatingSystem[j]);
				candidateIndex.push(j);
			}
		
		}	


		for (var z = 1; z < candidate.length; z++) {		//finds the best fit for the job
			var bestCandidate = findBestCandidate(candidate[z-1],candidate[z],candidateIndex[z-1],candidateIndex[z]);
		}	
		// candidate = [];
		operatingSystem[bestCandidate].jobSizeAllocated = jobs[i].jobSize;
		operatingSystem[bestCandidate].internalFragmentation = operatingSystem[bestCandidate].partitionSize - jobs[i].jobSize;
		operatingSystem[bestCandidate].busy = true;
	}	