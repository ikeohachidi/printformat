(function() {
	"use strict"

	const	formatDefault = "%v",
			formatTypeOfValue = "%#v",
			formatBaseTwo = "%b",
			formatBaseEight = "%o",
			formatBaseTen = "%d",
			formatUnicodeCodePoint = "%c",
			formatBoolean = "%t";

	const allFormats = ["%v", "%#v", "%b", "%o", "%d", "%c", "%t"];

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
			for (let i = 0; i < identifiersAndValues.identifiers.length; i++) {
				for (let j = 0; j < baseString.length; j++) {
					if (baseString[j] == identifiersAndValues.identifiers[i]) {

						switch (baseString[j]) {
							case formatDefault:
								baseString[j] = identifiersAndValues.values[i];
								break;
							case formatBaseTwo:
								let baseTwo = this.toBaseTwo(identifiersAndValues.values[i]);
								console.log(baseTwo)
								baseString[j] = baseTwo;
								break;
						}
						//baseString[j] = identifiersAndValues.values[i];
						//break;
					}
				}
			}
			return baseString;
		},
		getValue(value) {
			let correct = this.check(arguments);
			let changedString;
			if (correct) {
				changedString = this.interpolate(correct.stringToChange, correct.identifiersAndValues);
			}
			return changedString.join(" ");
		},
		print(value) {
			console.log(this.getValue(...arguments))
		},
		// rules for checking
		toBaseTwo(value) {
			if (typeof value !== "number") {
				console.error("Error: value to change to baseTWO is not number")
				return false;
			}
			return value.toString(2);
		}
	}
	window.pft = pft; // todo: there has to be a better way than this 
})()

// %t: boolean true or false
// %v: value in default format
// %b: base 2
// %c: character represented by unicode code point
// %d: base 10
// %o: base 8
// %T: represent type of value
// %#v: go syntax representation of the value
