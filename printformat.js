(function() {
	"use strict"

	const	formatDefault = "%v",
			formatTypeOfValue = "%#v",
			formatBaseTwo = "%b",
			formatBaseEight = "%o",
			formatBaseTen = "%d",
			formatUnicodeCodePoint = "%c";

	const allFormats = ["%v", "%#v", "%b", "%o", "%d", "%c"];

	let pft = {
		// check run to audit the validity of parameters
		check(value) {
			// stringToChange holds the value of string to be interpolated	
			let stringToChange = value[0].split(" ");

			// identifiersAndValues holds the matching value pairs
			let identifiersAndValues = {
				// identifiers holds all the identifiers used in the string
				identifiers: [],
				// value holds the values of the remaining parameters
				// which would be typically interpolated
				values: []
			}

			for (let i = 1; i < value.length; i++) {
				identifiersAndValues.values.push(value[i]);
			};

			// check for occurennce of identifiers
			for (let i = 0; i < stringToChange.length; i++) {
				for (let j = 0; j < allFormats.length; j++) {
					if (stringToChange[i] == allFormats[j]) {
						identifiersAndValues.identifiers.push(allFormats[j])
					};
				};
			};
	
			if (identifiersAndValues.identifiers.length == 0) {
				console.error("Error: no string interpolation identifiers")
				return false;
			}

			if (identifiersAndValues.values.length != identifiersAndValues.identifiers.length) {
				console.error("Error: not enough arguments")
				return false;
			}
			
			return {
				stringToChange,
				identifiersAndValues
			}
		},
		interpolate(baseString, identifiersAndValues) {
			console.log(identifiersAndValues)
			for (let i = 0; i < identifiersAndValues.identifiers.length; i++) {
				for (let j = 0; j < baseString.length; j++) {
					if (baseString[j] == identifiersAndValues.identifiers[i]) {
						baseString[j] = identifiersAndValues.values[i];
						break;
					}
				}
			}
			return baseString;
		},
		print(value) {
			let correct = this.check(arguments);
			let changedString;
			if (correct) {
				changedString = this.interpolate(correct.stringToChange, correct.identifiersAndValues);
			}
			console.log(changedString.join(" "))
		}
	}
	window.pft = pft; // todo: there has to be a better way than this 
})()


// pft.print("hello world there you are %v", "john");
// pft.print("hello world there %v you are %v", "ben", "john");
// pft.print("hello world there you are %b", 89);
// pft.print("hello world there you are %v", "john");

// %v: value in default format
// %b: base 2
// %c: character represented by unicode code point
// %d: base 10
// %o: base 8
// %T: represent type of value
// %#v: go syntax representation of the value
