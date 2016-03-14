      document.addEventListener('DOMContentLoaded', bindButtons);

      function bindButtons(){
        document.getElementById('submit').addEventListener('click', function(event){
          var req = new XMLHttpRequest();
		  var payload = {name:null,reps:null,weight:null,date:null,units:null};
		  payload.name = document.getElementById('name');
		  payload.reps = document.getElementById('reps');
		  payload.weight = document.getElementById('weight');
		  payload.date = document.getElementById('date');
		  payload.units = document.getElementById('units');
		  req.open('GET', 'http://52.34.160.215:3000/insert?name=' + payload.name + '&reps=' + payload.reps + '&weight=' + payload.weight + '&date=' + payload.date + '&lbs=' + payload.units, true);
		  
          req.addEventListener('load', function(event){
			 if (req.status >=200 && req.status <400){
          			var response = JSON.parse(req.rows);
            }
           	 else { 
      console.log("Error in network request: " + request.statusText);
          	}
          })
          req.send(JSON.stringify(payload));
          event.preventDefault();
		  
        })
	  }
