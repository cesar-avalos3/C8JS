var fileIn = document.getElementById('file-in');

var fileOut = document.getElementById('file-out');

fileIn.addEventListener('change',function(e)
	{

		var file   = e.target.files;
		var reader = new FileReader();

		reader.onload = function(e)
		{
			//var view = new Int8Array(reader.result);
			fileOut.innerHTML = hexToString(reader);
		}
      	reader.readAsBinaryString(file[0]);
	});

function hexToString(_fileReader)
{
	var tempString = "";
	var counter = 0;
	for(i = 0; i < _fileReader.result.length; i++)
	{
		tempByte =  _fileReader.result.charCodeAt(i).toString(16);
		if(tempByte.length < 2)
		{
			tempByte = "0" + tempByte;
		}
		tempString += tempByte;
	}
	return tempString;
}