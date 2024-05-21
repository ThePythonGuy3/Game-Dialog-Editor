let avatars = [];
let imageSelector;

let previousButton, nextButton;
let removeButton, copyButton, addButton;
let exportButton, importButton;
let tapeText;

let topDialog, bottomDialog;
let topTitle, bottomTitle, topContent, bottomContent;
let topImage, bottomImage;
let topImageParent, bottomImageParent;

let nameInput, textInput;
let changeAvatarButton;
let topOrBottomCheckbox, showTopCheckbox, showBottomCheckbox, instantaneousCheckbox;

let focusColor = "#3eee3e";

class InGameDialogFeed {
	constructor(faces, characters, text, top, showTop, showBottom, instant) {
		this.faces = faces;
		this.characters = characters;
		this.text = text;
		this.top = top;
		this.showTop = showTop;
		this.showBottom = showBottom;
		this.instant = instant;
	}

	toTape() {
		let tape = [];

		for (let i = 0; i < this.faces.length; i++) {
			tape.push(new DialogFeed(this.faces[i], this.characters[i], this.text[i], this.top[i], this.showTop[i], this.showBottom[i], this.instant[i]));
		}

		return tape;
	}
}

class DialogFeed {
	constructor(face, character, text, top, showTop, showBottom, instant) {
		this.face = face.replace("\\", "/");
		this.character = character;
		this.text = text;
		this.top = top;
		this.showTop = showTop;
		this.showBottom = showBottom;
		this.instant = instant;
	}

	copy() {
		return new DialogFeed(this.face, this.character, this.text, this.top, this.showTop, this.showBottom, this.instant);
	}

	jsonify() {
		return '{face: "' + this.face + '", character: "' + this.character + '", text: "' + this.text + '", top: ' + this.top + ', showTop: ' + this.showTop + ', showBottom: ' + this.showBottom + ', instant: ' + this.instant + '}';
	}
}

function jsonify(tape) {
	let faces = [];
	let characters = [];
	let texts = [];
	let tops = [];
	let showTops = [];
	let showBottoms = [];
	let instants = [];

	for (let feed of tape) {
		faces.push(feed.face);
		characters.push(feed.character);
		texts.push(feed.text);
		tops.push(feed.top.toString());
		showTops.push(feed.showTop.toString());
		showBottoms.push(feed.showBottom.toString());
		instants.push(feed.instant.toString());
	}

	return `{
	"faces": ["` + faces.join('", "').replace("\\", "/") + `"],
	"characters": ["` + characters.join('", "') + `"],
	"text": ["` + texts.join('", "') + `"],
	"top": [` + tops.join(", ") + `],
	"showTop": [` + showTops.join(", ") + `],
	"showBottom": [` + showBottoms.join(", ") + `],
	"instant": [` + instants.join(", ") + `]
}`;
}

let tape = [new DialogFeed("", "", "", false, false, true, false)];

function getLastTape(top, i) {
	for (let j = i - 1; j >= 0; j--) {
		if (tape[j].top == top)
			return j;
	}

	return -1;
}

function updateToTape(i) {
	tape[i].character = nameInput.value;
	tape[i].text = textInput.value;

	tape[i].top = topOrBottomCheckbox.checked;
	tape[i].showTop = showTopCheckbox.checked;
	tape[i].showBottom = showBottomCheckbox.checked;
	tape[i].instant = instantaneousCheckbox.checked;
}

function updateFromTape(i) {
	nameInput.value = tape[i].character;
	textInput.value = tape[i].text;

	topOrBottomCheckbox.checked = tape[i].top;
	showTopCheckbox.checked = tape[i].showTop;
	showBottomCheckbox.checked = tape[i].showBottom;
	instantaneousCheckbox.checked = tape[i].instant;

	if (tape[i].top) {
		topImage.src = tape[i].face;
		topTitle.innerHTML = tape[i].character;
		topContent.innerHTML = tape[i].text;

		let lastIndex = getLastTape(false, i);
		if (i > 0 && lastIndex != -1) {
			bottomImage.src = tape[lastIndex].face;
			bottomTitle.innerHTML = tape[lastIndex].character;
			bottomContent.innerHTML = tape[lastIndex].text;
		} else {
			bottomImage.src = "";
			bottomTitle.innerHTML = "";
			bottomContent.innerHTML = "";
		}
	} else {
		bottomImage.src = tape[i].face;
		bottomTitle.innerHTML = tape[i].character;
		bottomContent.innerHTML = tape[i].text;

		let lastIndex = getLastTape(true, i);
		if (i > 0 && lastIndex != -1) {
			topImage.src = tape[lastIndex].face;
			topTitle.innerHTML = tape[lastIndex].character;
			topContent.innerHTML = tape[lastIndex].text;
		} else {
			topImage.src = "";
			topTitle.innerHTML = "";
			topContent.innerHTML = "";
		}
	}

	let topSrcL = topImage.src.split("/");
	let bottomSrcL = bottomImage.src.split("/");

	topImageParent.style.display = topSrcL[topSrcL.length - 1] == "" ? "none" : "block";
	bottomImageParent.style.display = bottomSrcL[bottomSrcL.length - 1] == "" ? "none" : "block";

	topDialog.style.opacity = tape[i].showTop ? "1" : "0";
	bottomDialog.style.opacity = tape[i].showBottom ? "1" : "0";
}

function updateTape(i) {
	updateToTape(i);
	updateFromTape(i);
}

let tapeIndex = 0;

window.onload = () => {
	document.getElementsByClassName("avatar")[0].onclick = () => {
		tape[tapeIndex].face = "";

		update();
	}

	fetch("indexed.txt")
		.then((res) => res.text())
		.then((text) => {
			avatars = text.split(";");
			imageSelector = document.getElementById("imageSelector");

			for (let avatar of avatars) {
				let image = document.createElement("img");
				image.className = "avatar";

				image.src = avatar;

				image.onclick = () => {
					tape[tapeIndex].face = avatar;

					update();
				}

				imageSelector.appendChild(image);
			}
		})
		.catch((e) => console.error(e));

	previousButton = document.getElementById("previousButton");
	nextButton = document.getElementById("nextButton");

	removeButton = document.getElementById("removeButton");
	copyButton = document.getElementById("copyButton");
	addButton = document.getElementById("addButton");

	exportButton = document.getElementById("exportButton");
	importButton = document.getElementById("importButton");

	fileImport = document.getElementById("fileImport");

	tapeText = document.getElementById("tapeText");

	topDialog = document.getElementById("topDialog");
	bottomDialog = document.getElementById("bottomDialog");

	nameInput = document.getElementById("nameInput");
	textInput = document.getElementById("textInput");

	topOrBottomCheckbox = document.getElementById("topOrBottomCheckbox");
	showTopCheckbox = document.getElementById("showTopCheckbox");
	showBottomCheckbox = document.getElementById("showBottomCheckbox");
	instantaneousCheckbox = document.getElementById("instantaneousCheckbox");

	topTitle = document.getElementById("topTitle");
	bottomTitle = document.getElementById("bottomTitle");
	topContent = document.getElementById("topContent");
	bottomContent = document.getElementById("bottomContent");
	topImage = document.getElementById("topImage");
	bottomImage = document.getElementById("bottomImage");
	topImageParent = topImage.parentElement;
	bottomImageParent = bottomImage.parentElement;

	let update = () => {
		updateTape(tapeIndex);
	}

	let updateShift = () => {
		tapeText.innerHTML = (tapeIndex + 1) + "/" + tape.length;
		updateFromTape(tapeIndex);
	}

	let shiftLeft = () => {
		if (tapeIndex > 0) {
			tapeIndex--;
			updateShift();
		}
	}

	let shiftRight = () => {
		if (tapeIndex < tape.length - 1) {
			tapeIndex++;
			updateShift();
		}
	}

	previousButton.onclick = () => {
		shiftLeft();
	}

	nextButton.onclick = () => {
		shiftRight();
	}

	removeButton.onclick = () => {
		if (tape.length > 1) {
			tape.splice(tapeIndex, 1);
			if (tapeIndex >= tape.length) {
				tapeIndex--;
			}
			updateShift();
		}
	}

	copyButton.onclick = () => {
		tape.splice(tapeIndex + 1, 0, tape[tapeIndex].copy());
		shiftRight();
	}

	addButton.onclick = () => {
		tape.splice(tapeIndex + 1, 0, new DialogFeed("", "", "", false, false, true, false));
		shiftRight();
	}

	nameInput.oninput = () => {
		nameInput.value = nameInput.value.toUpperCase();
		update();
	}

	textInput.oninput = update;

	topOrBottomCheckbox.onchange = update;

	showTopCheckbox.onchange = update;

	showBottomCheckbox.onchange = update;

	exportButton.onclick = () => {
		let blob = new Blob([jsonify(tape)], { type: "text/plain;charset=utf-8" });
		saveAs(blob, "dialog.json", { type: "text/plain;charset=utf-8" });
	}

	importButton.onclick = () => {
		fileImport.click();
	}

	fileImport.onchange = () => {
		let file = fileImport.files[0];

		if (file) {
			let reader = new FileReader();

			reader.readAsText(file, "UTF-8");
			reader.onload = (e) => {
				let contents = e.target.result;
				let importedObject = Object.assign(new InGameDialogFeed, JSON.parse(contents));
				tape = importedObject.toTape();
				updateShift();
			}
		}
	}

	update();
}