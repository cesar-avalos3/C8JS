//Begin Specifications

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

//16 Registers are initialized
var Registers = new Uint8Array(16);

//I stores memory address
var I = new Uint16Array(1);

//The stack itself is Stack
//SP points to the top of the stack
var Stack = new Uint16Array(16);
var SP = new Uint16Array(1);
SP[0] = 0x0; //Initialize SP to 0


// Generic function to handle PC chances
// to prevent issues, when using superCHIP-8
// the program starts at other address than 0x200
function changePC(_newAddress)
{
	return (_newAdress - 0x200);
}

//Pass currentData as toString(16), that 
//is, currentData must be a string like "0x7643"
function instructions(currentData)
{
	var startBit = currentData[0];
	if(startBit === 0)
	{
		var rest = currentData.substr(1,3);
		switch(rest)
		{
			case "0E0":
				console.log("clear screen");
				clearScreen();
			break;
			case "0EE":
				PC[0] = changePC(Stack[SP[0]]);
				SP[0]--;
			break;
		}
	}
	else if(startBit == 1)
	{
		var rest = currentData.substr(1,3);
		PC[0] = changePC((parseInt("0x" + rest) * 4));
		//Jump PC to this location in the memory
	}
	else if(startBit == 2)
	{
		//Increse stack pointer
		//Put PC at the top of the stack.
		SP[0]++;
		Stack[SP[0]] = PC[0];
		var rest = currentData.substr(1,3);
		PC[0] = parseInt("0x" + rest);
	}
	else if(startBit == 3)
	{
		//Check the register Vx, see if they are equal
		//if so, increment PC by 2 (2 for CHIP-8 system is 8 for C8JS).
		//Should saneate the thing to prevent from things going out of bounds
		if(Registers[ parseInt("0x"+currentData[1]) ] == parseInt( "0x"+currentData.substr(2,3) ))
		{
			PC[0] += 8;
		}
	}
	else if(startBit == 4)
	{
		//Same thing as above, except it checks inequality
		if(Registers[ parseInt("0x"+currentData[1]) ] != parseInt("0x"+currentData.substr(2,3)) )
			{
				PC[0] += 8;
			}	
	}
	else if(startBit == 5)
	{
		//5xy0
		//SE Vx, Vy
		//Compares Vx to Vy, if they are equal increase PC by 2
		//It will ignore the 4th value, should be 0, this may cause problems later on.
		if(Registers[parseInt( "0x"+currentData[1] )] == Registers[ parseInt("0x"+currentData.substr[2]) ]
		{
			PC[0] += 8;
		}
	}
	else if(startBit == 6)
	{
		//6xkk
		//LD Vx, byte
		//Puts kk into x
		Registers[ parseInt("0x"+currentData[1]) ] = parseInt("0x"+currentData.substr(2,3));
	}
	else if(startBit == 7)
	{
		//7xkk
		//ADD Vx, byte
		//Vx = Vx + kk
		Registers[ parseInt("0x"+currentData[1]) ] += parseInt("0x"+currentData.substr(2,3));
	}
	else if(startBit == 8)
	{
		var lastBit = parseInt( currentData[3] );
		if(lastBit === 0)
		{
			//8xy0
			//Stores the value of Vy onto Vx
			Registers[ parseInt("0x"+currentData[1]) ] = Registers[ parseInt("0x"+currentData[2]) ];
		}
		else if(lastBit == 1)
		{
			//8xy1
			//Performs a bitwise OR on the values of Vx and Vy, storing the result in Vx
			Registers[ parseInt("0x"+currentData[1]) ] = Registers[ parseInt("0x"+currentData[1]) ] | Registers[ parseInt("0x"+currentData[2]) ] ;				
		}
		else if(lastBit == 2)
		{
			//8xy2
			//AND
			Registers[ parseInt("0x"+currentData[1]) ] = Registers[ parseInt("0x"+currentData[1]) ] & Registers[ parseInt("0x"+currentData[2]) ] ;				
		}
		else if(lastBit == 3)
		{
			//8xy3
			//XOR
			Registers[ parseInt("0x"+currentData[1]) ] = Registers[ parseInt("0x"+currentData[1]) ] ^ Registers[ parseInt("0x"+currentData[2]) ] ;				
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
			if(Registers[parseInt("0x"+currentData.substr(1))] < Registers[parseInt("0x"+currentData[2])])
			{
				Registers[0x0F] = 1;
			}
			Registers[parseInt("0x"+currentData.substr(1))] -= Registers[parseInt("0x"+currentData[2])]);
		}
		else if(lastBit == 0x0E)
		{
			//Most significant digit of Vx something something something
		}
	}
	else if(startBit == 9)
	{
			if(Registers[parseInt( "0x"+currentData[1] )] != Registers[parseInt( "0x"+currentData[2] )] )
			{
				PC[0] += 8;
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
		PC[0] = parseInt("0x"+currentData.substr(1,3)) + Registers[0];
	}
	else if(startBit == 0x0C)
	{
		//Generates a random number which is then ANDed with kk, the result stored in Vx 
		var random = Math.floor(Math.random() * 255);
		Registers[ parseInt("0x"+currentData[1]) ] = random & parseInt("0x"+currentData.substr(2,3));
	}
	else if(startBit == 0x0D)
	{
		//Display Graphics
		for(i = 0; i < parseInt("0x"+currentData[3]); i++)
		{
			//Really inefficient, must rework
			var tempBufferXOR = imageBuffer[ parseInt("0x"+currentData[1]) + i ][ parseInt("0x"+currentData[2]) + i] ^ I[i];
			
			if(tempBufferXOR)
			{
				Registers[0x0F] = 0;
			}
			else
			{
				Registers[0x0F] = 1;
			}
			imageBuffer[ parseInt(("0x"+currentData[1]) + i) % 32 ][ parseInt("0x"+currentData[2]) + i] = tempBufferXOR;		
		}
	}
	return true; //Just in case, keep moving the thingie
}

function 