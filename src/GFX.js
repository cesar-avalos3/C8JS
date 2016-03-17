function clearScreen()
{
	context.clearRect(0,0,context.width, context.height);
}

var PIXEL_SIZE = 8;

//Initialize ImageBuffer
var imageBuffer = new Array(32);
for( x = 0; x < 32; x++)
	{
		imageBuffer[x] = new Array(64);
	}


//Draw the imageBuffer
function drawToScreen()
{
	for(x = 0; x < 32; x++)
	{
		for(y = 0; y < 64; y++)
		{
			context.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
		}
	}
}