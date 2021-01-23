// This will open each json in each gear's folder and compile a list that the Rune-Gear application uses to generate a search index and then save it to json.
var fs = require("fs");

const gearslots = [
	"head",
	"amulet",
	"ammo",
	"cape",
	"body",
	"legs",
	"feet",
	"ring",
	"gloves",
	"weapon",
	"shield"
];

gearslots.forEach(async function (slot) {
	var slotpath = `./src/gear/${slot}`;
	var slotdirectory = fs.readdir(slotpath, function (err, files) {
		if (err) {
			console.log(`Errored while trying to read the directory for ${slot}`);
		} else {
			console.log(`Successfully read ${slot}`);

			var thearray = [];
			files.forEach(function (file) {
				if (file != "default.json" && file != "directory.json") {
					var readjson = require(`${slotpath}/${file}`); // Read our individual json
					//console.log(readjson);
					thearray.push({
						name: readjson.name,
						filename: readjson.filename,
						url: readjson.url
					});
				}
			});

			fs.writeFile(
				`./src/gear/${slot}/directory.json`,
				JSON.stringify(thearray),
				function (err) {
					if (err) console.log(err);
					console.log(`Written successfully to ${slot}/directory.json`);
				}
			);
		}
	});
});

var monsterpath = `./src/monster`;
fs.readdir(monsterpath, function (err, files) {
	if (err) {
		console.log(err);
	} else {
		console.log(`Successfully read monster`);

		var thearray = [];
		files.forEach(function (file) {
			if (file != "default.json" && file != "directory.json") {
				var readjson = require(`${monsterpath}/${file}`); // Read our individual json
				//console.log(readjson);
				thearray.push({
					name: readjson[0].name,
					filename: readjson[0].filename,
					url: readjson[0].url
				});
			}
		});

		fs.writeFile(
			`./src/monster/directory.json`,
			JSON.stringify(thearray),
			function (err) {
				if (err) console.log(err);
				console.log(`Written successfully to monster/directory.json`);
			}
		);
	}
});
