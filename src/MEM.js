var fileIn = document.getElementById('file-in');

var fileOut = document.getElementById('file-out');

fileIn.addEventListener('change',function(e)
	{

		var file   = e.target.files;
		var reader = new FileReader();

		reader.onload = function(e)
		{
			//var view = new Int8Array(reader.result);
			fileOut.innerHTML = reader.result;


		}
      	reader.readAsText(file[0],'UUID');
	});