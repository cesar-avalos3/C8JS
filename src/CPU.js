//Begin Specifications

//Create a PC that tells the machine where the fuck are we

//Define the instruction sets

//Generate arrays using JS typed arrays
//Uint8Array
//Uint16Array
//Uint32Array
//UintXXArray is in bits

var buffer = new ArrayBuffer();
//ArrayBuffer is in bytes

//Registers
var PC = new Uint16Array(1);
//PC tells where the running code is

var Registers = new Uint8Array(16);
//16 Registers are initialized

var I = new Uint16Array(1);

function instructions(currentData)
{
	var startBit = currentData.charAt(0);
	if(startBit === 0)
	{
		var rest = currentData.substr(1,3);
		switch(rest)
		{
			case "0E0":
				console.log("clear screen");
			break;
			case "0EE":
				console.log("return from a subroutine");
			break;
		}
	}
	else if(startBit == 1)
	{
		var rest = currentData.substr(1,3);
		PC[0] = parseInt("0x" + rest);
		//Jump PC to this location in the memory
	}
	else if(startBit == 2)
	{
		//Increases the stack by 2
		//Puts PC on top of the stack
		var rest = currentData.substr(1,3);
		PC[0] = parseInt("0x" + rest);
	}
	else if(startBit == 3)
	{
		//Check the register Vx, see if they are equal
		//if so, increment PC by 2.
		//Should saneate the thing to prevent from things going out of bounds
		if(Registers[parseInt("0x"+currentData.substr(1))] == parseInt("0x"+currentData.substr(2,3)) )
		{
			PC[0] += 2;
		}
	}
	else if(startBit == 4)
	{
		//Same thing as above, except it checks inequality
		if(Registers[parseInt("0x"+currentData.substr(1))] != parseInt("0x"+currentData.substr(2,3)) )
			{
				PC[0] += 2;
			}	
	}
	else if(startBit == 5)
	{
		//5xy0
		//SE Vx, Vy
		//Compares Vx to Vy, if they are equal increase PC by 2
		//It will ignore the 4th value
		if(Registers[parseInt("0x"+currentData.substr(1))] == Registers[parseInt("0x"+currentData.substr(2)])
		{
			PC[0] += 2;
		}
	}
	else if(startBit == 6)
	{
		//6xkk
		//LD Vx, byte
		//Puts kk into x
		Registers[parseInt("0x"+currentData.substr(1))] = parseInt("0x"+currentData.substr(2,3));
	}
	else if(startBit == 7)
	{
		//7xkk
		//ADD Vx, byte
		//Vx = Vx + kk
		Registers[parseInt("0x"+currentData.substr(1))] += parseInt("0x"+currentData.substr(2,3));
	}
	else if(startBit == 8)
	{
		var lastBit = currentData.substr(3);
		if(lastBit == 0)
		{
			//8xy0
			//Stores the value of Vy onto Vx
			Registers[parseInt("0x"+currentData.substr(1))] = Registers[parseInt("0x"+currentData.substr(2))];
		}
		else if(lastBit == 1)
		{
			//8xy1
			//Performs a bitwise OR on the values of Vx and Vy, storing the result in Vx
			Registers[parseInt("0x"+currentData.substr(1))] = Registers[parseInt("0x"+currentData.substr(1))] | Registers[parseInt("0x"+currentData.substr(2))];	
		}
		else if(lastBit == 2)
		{
			//8xy2
			//AND
			Registers[parseInt("0x"+currentData.substr(1))] = Registers[parseInt("0x"+currentData.substr(1))] & Registers[parseInt("0x"+currentData.substr(2))];				
		}
		else if(lastBit == 3)
		{
			//8xy3
			//XOR
			Registers[parseInt("0x"+currentData.substr(1))] = Registers[parseInt("0x"+currentData.substr(1))] ^ Registers[parseInt("0x"+currentData.substr(2))];				
		}
		else if(lastBit == 4)
		{
			//8xy4
			//Vx and Vy are added together, if the result is greater than 
			//8-bits, VF is set to 1, otherwise its 0. Only 8 bits are stored
			// in Vx
			var sum = Registers[parseInt("0x"+currentData.substr(1))] + Registers[parseInt("0x"+currentData.substr(2))];
			if(sum > 0xFF)
			{
				Registers[0x0F] = 1;
			}
			Registers[parseInt("0x"+currentData.substr(1))] = sum;				
		}
		else if(lastBit == 5)
		{
			//8xy5
			//If Vx > Vy, VF is 1, else 0. Vy is subtracted from Vx
			if(Registers[parseInt("0x"+currentData.substr(1))] > Registers[parseInt("0x"+currentData.substr(2))])
			{
				Registers[0x0F] = 1;
			}
			else
			{
				Registers[0x0F] = 0;
			}
			Registers[parseInt("0x"+currentData.substr(1))] = Registers[parseInt("0x"+currentData.substr(1))] + Registers[parseInt("0x"+currentData.substr(2))];
		}
		else if(lastBit == 6)
		{
			//Something about least sig 
		}
		else if(lastBit == 7)
		{
			if(Registers[parseInt("0x"+currentData.substr(1))] < Registers[parseInt("0x"+currentData.substr2)])
			{
				Registers[0x0F] = 1;
			}
			Registers[parseInt("0x"+currentData.substr(1))] -= Registers[parseInt("0x"+currentData.substr2)]);
		}
		else if(lastBit == 0x0E)
		{
			//Most significant digit of Vx something something something
		}
	}
	else if(startBit == 9)
	{
			if(Registers[parseInt("0x"+currentData.substr(1))] != Registers[parseInt("0x"+currentData.substr2)])
			{
				PC[0] += 2;
			}
	}
	else if(startBit == 0x0A)
	{
		//Set the I register to nnn
		I[0] = parseInt("0x"+currentData.substr(1,3));
	}
	else if(startBit == 0x0B)
	{
		//Jump to memory location nnn
		PC[0] = parseInt("0x"+currentData.substr(1,3));
	}
	else if(startBit == 0x0C)
	{
		//Generates a random number which is then ANDed with kk, the result stored in Vx 
		var random = Math.floor(Math.random() * 255);
		Registers[parseInt("0x"+currentData.substr(1))] = random & parseInt("0x"+currentData.substr(2,3));
	}
	else if(startBit == 0x0D)
	{
		//Display Graphics
	}
	else if(startBit == )
}