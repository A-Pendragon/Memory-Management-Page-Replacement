
<script type="text/javascript">

//FCFS
	var processes = [
				{name:"Youtube", arrivalTime: 5, burstTime: 4, completionTime:1, turnAroundTime:0, waitingTime:0},
				{name:"Facebook", arrivalTime: 4, burstTime: 5, completionTime:1, turnAroundTime:0, waitingTime:0},
				{name:"Google", arrivalTime: 3, burstTime: 2, completionTime:1, turnAroundTime:0, waitingTime:0},
				{name:"Anime", arrivalTime: 2, burstTime: 1, completionTime:1, turnAroundTime:0, waitingTime:0},
				{name:"Twitter", arrivalTime: 1, burstTime: 6, completionTime:1, turnAroundTime:0, waitingTime:0},
				{name:"MDN", arrivalTime: 6, burstTime: 3, completionTime:1, turnAroundTime:0, waitingTime:0},
	];

	var timeLine = [];
	timeLine[0] = 0;

	// var arrivalTime = [0,1,2,3,4,5,6]
	// var burstTime = [4,5,2,1,6,3];
	// var CompletionTime = [];
	// var TurnAroundTime = [];
	// var WaitingTime = [];

	//for Completion Time

	
	//for the gantt chart
	var sortedProcesses = processes.sort(function(a,b){ //for the gantt chart
		return a.arrivalTime - b.arrivalTime;
	});

	//for the start and end time

	var currentTime = 0;
	for (var i = 1; i <= processes.length; i++) {
		timeLine[i] = currentTime + sortedProcesses[i-1].burstTime; 
		currentTime = timeLine[i];
	}

	//for Completion Time

	for (var i = 0; i <= processes.length; i++) {
		sortedProcesses[i].completionTime = timeLine[i+1]; 
	}
	//for Turn Around Time

	for (var i = 0; i < processes.length; i++) {
		sortedProcesses[i].turnAroundTime = sortedProcesses[i].completionTime - sortedProcesses[i].arrivalTime;
	}
	//for Waiting Time

	for (var i = 0; i < processes.length; i++) {
		sortedProcesses[i].waitingTime = sortedProcesses[i].turnAroundTime - sortedProcesses[i].burstTime;
	}




</script>
