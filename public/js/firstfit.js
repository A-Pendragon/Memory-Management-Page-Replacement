
<script type="text/javascript">
	var operatingSystem = [

		{name: "Partition #1", partitionSize:100, internalFragmentation:0, jobSizeAllocated:0},	
		{name: "Partition #2", partitionSize:500, internalFragmentation:0, jobSizeAllocated:0},	
		{name: "Partition #3", partitionSize:200, internalFragmentation:0, jobSizeAllocated:0},
		{name: "Partition #4", partitionSize:300, internalFragmentation:0, jobSizeAllocated:0},
		{name: "Partition #5", partitionSize:600, internalFragmentation:0, jobSizeAllocated:0},
	];

	var jobs = [
		{name: "Job #1", jobSize:212, state:false},
		{name: "Job #2", jobSize:417, state:false},
		{name: "Job #3", jobSize:112, state:false},
		{name: "Job #4", jobSize:426, state:false},
	];



	for (var i = 0; i < jobs.length; i++) {

		for (var j = 0; j < operatingSystem.length; j++) {
			if (operatingSystem[j].jobSizeAllocated == 0 && jobs[i].state == false) {
				if(operatingSystem[j].partitionSize >= jobs[i].jobSize){
				operatingSystem[j].jobSizeAllocated = jobs[i].jobSize;
				operatingSystem[j].internalFragmentation = operatingSystem[j].partitionSize - jobs[i].jobSize; 
				jobs[i].state = true;
				}	
			}
		}
	}



</script>
