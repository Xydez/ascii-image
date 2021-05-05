const ASCII_WIDTH = 69;
const ASCII_HEIGHT = 34;
const ASCII_RAMP = [' ', '.', '\'', '`', '^', '"', ',', ':', ';', 'I', 'l', '!', 'i', '>', '<', '~', '+', '_', '-', '?', ']', '[', '}', '{', '1', ')', '(', '|', '\\', '/', 't', 'f', 'j', 'r', 'x', 'n', 'u', 'v', 'c', 'z', 'X', 'Y', 'U', 'J', 'C', 'L', 'Q', '0', 'O', 'Z', 'm', 'w', 'q', 'p', 'd', 'b', 'k', 'h', 'a', 'o', '*', '#', 'M', 'W', '&', '8', '%', 'B', '@', '$'].reverse();

function convertFile(event: Event)
{
	let input = event.target as HTMLInputElement;

	let reader = new FileReader();
	reader.onload = (event) =>
	{
		const img = new Image();
		img.onload = () =>
		{
			//let img_output = document.getElementById("img-output") as HTMLImageElement;
			let img_canvas = document.getElementById("img-output") as HTMLCanvasElement;
			let img_context = img_canvas.getContext("2d") as CanvasRenderingContext2D;

			let width = img_canvas.width;
			let height = img_canvas.height;
			//img_canvas.width = img.width;
			//img_canvas.height = img.height;

			img_context.drawImage(img, 0, 0, width, height);
			let data = img_context.getImageData(0, 0, width, height);

			let block_width = Math.floor(1 / ASCII_WIDTH * width);
			let block_height = Math.floor(1 / ASCII_HEIGHT * height);

			let text = "";

			for (let y = 0; y < ASCII_HEIGHT; y++)
			{
				let row = "";

				for (let x = 0; x < ASCII_WIDTH; x++)
				{
					let x_pos = Math.floor(x / ASCII_WIDTH * width);
					let y_pos = Math.floor(y / ASCII_HEIGHT * height);

					let brightness_values = [];

					for (let yo = 0; yo < block_height; yo++)
					{
						for (let xo = 0; xo < block_width; xo++)
						{
							let i = 4 * (width * (y_pos + yo) + x_pos + xo);

							let r = data.data[i];
							let g = data.data[i + 1];
							let b = data.data[i + 2];
							let a = data.data[i + 3];

							let pixel_brightness = (r + g + b) * (a / 255) / 3 / 255;
							brightness_values.push(pixel_brightness);
						}
					}

					let block_brightness = brightness_values.reduce((prev, val) => prev + val) / brightness_values.length;
					let char = ASCII_RAMP[Math.floor(block_brightness * (ASCII_RAMP.length - 1))];

					row += char;
				}

				text += row + "\n";
			}

			/*
			let ascii_canvas = document.getElementById("ascii-output") as HTMLCanvasElement;
			let ascii_context = ascii_canvas.getContext("2d");

			ascii_canvas.width = img.width;
			ascii_canvas.height = img.height;

			for (let i = 0; i < rows.length; i++)
			{
				ascii_context?.fillText(rows[i], 0, i * 12);
			}
			*/

			let ascii_output = document.getElementById("ascii-output") as HTMLTextAreaElement;
			ascii_output.value = text;
		};

		img.src = event.target?.result as string;
	};

	//reader.readAsDataURL(input.files![0]);
	reader.readAsDataURL(input.files![0]);
}

function clear()
{
	let img_canvas = document.getElementById("img-output") as HTMLCanvasElement;
	let img_context = img_canvas.getContext("2d") as CanvasRenderingContext2D;

	img_context.clearRect(0, 0, img_canvas.width, img_canvas.height);

	let ascii_output = document.getElementById("ascii-output") as HTMLTextAreaElement;
	ascii_output.value = "";
}

let img_input = document.getElementById("img-input") as HTMLInputElement;
img_input.addEventListener("change", (event) => convertFile(event));

let clear_btn = document.getElementById("clear-btn") as HTMLButtonElement;
clear_btn.addEventListener("click", (event) => clear());
