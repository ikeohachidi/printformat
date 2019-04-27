(function() {
	"use strict"

	const	formatDefault = "%v",
			// Base formatting
			formatBaseTwo = "%b",
			formatBaseEight = "%o",
			formatBaseTen = "%d",
			formatBaseSixteen = "%x",
			formatUnicodeCodePoint = "%c", // todo: not done yet
			formatTypeOfValue = "%T",
			formatBoolean = "%t",
			// floating point numbers
			formatScientficNotationSmall = "%e",
			formatScientficNotationLarge = "%E";

	const allFormats = ["%v", "%b", "%o", "%d", "%x", "%c", "%T", "%t", "%e", "%E"];

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
		removeUsed(argument, position) {
			argument.values.splice(position, 1)
			argument.identifiers.splice(position, 1)
		},
		interpolate(baseString, identifiersAndValues) {
			for (let i = 0; i < identifiersAndValues.identifiers.length; i++) {
				for (let j = 0; j < baseString.length; j++) {
					if (baseString[j] == identifiersAndValues.identifiers[i]) {

						switch (baseString[j]) {
							case formatDefault:
								baseString[j] = identifiersAndValues.values[i];
								this.removeUsed(identifiersAndValues, i)	
								break;
							case formatBaseTwo:
								let baseTwo = this.toBaseTwo(identifiersAndValues.values[i]);
								baseString[j] = baseTwo;
								this.removeUsed(identifiersAndValues, i)	
								break;
							case formatBaseEight:
								let baseEight = this.toBaseEight(identifiersAndValues.values[i]);
								baseString[j] = baseEight;
								this.removeUsed(identifiersAndValues, i)	
								break;
							case formatBaseTen:
								let baseTen = this.toBaseTen(identifiersAndValues.values[i]);
								baseString[j] = baseEight;
								this.removeUsed(identifiersAndValues, i)	
								break;
							case formatBaseSixteen:
								let baseSixteen = this.toBaseSixteen(identifiersAndValues.values[i])
								baseString[j] = baseSixteen;
								this.removeUsed(identifiersAndValues, i)	
								break;
							case formatBoolean:
								let booleanValue = this.toBoolean(identifiersAndValues.values[i])
								baseString[j] = booleanValue;
								this.removeUsed(identifiersAndValues, i)	
								break;
							case formatTypeOfValue:
								let typeofValue = this.toTypeof(identifiersAndValues.values[i])
								baseString[j] = typeofValue;
								this.removeUsed(identifiersAndValues, i)	
								break;
							// format floating point numbers
							case formatScientficNotationSmall:
								let sciNotationSmall = this.toSciNotationSmall(identifiersAndValues.values[i])
								baseString[j] = sciNotationSmall;
								this.removeUsed(identifiersAndValues, i)	
								break;
							case formatScientficNotationLarge:
								let sciNotationLarge = this.toSciNotationLarge(identifiersAndValues.values[i])
								baseString[j] = sciNotationLarge;
								this.removeUsed(identifiersAndValues, i)	
								break;
						}
						//baseString[j] = identifiersAndValues.values[i];
						//break;
					}
				}
			}
			return baseString;
		},
		format(value) {
			let correct = this.check(arguments);
			let changedString;
			if (correct) {
				changedString = this.interpolate(correct.stringToChange, correct.identifiersAndValues);
			}
			// todo: get a better way to solve this issue
			// issue: if changedString is undefined the whole program crashes with
			// a TypeError
			if (changedString !== undefined) {
				return changedString.join(" ");
			}
		},
		print(value) {
			console.log(this.format(...arguments))
		},
		//***** conversion *****//
		toBoolean(value) {
			if (typeof value !== "boolean") {
				console.error("Error: value is not a boolean type");
			}
			if (value === true) {
				return true;
			}
			return false;
		},
		toTypeof(value) {
			switch (value.constructor) {
				case String:
					return "string";
					break;
				case Number:
					return "number";
					break;
				case Array:
					return "array";
					break;
				case Object:
					return "object";
					break;
				case Function:
					return "function";
					break;
				default:
					console.error("Error: couldn't find value type")
					break;
			}
		},
		toBaseTwo(value) {
			if (typeof value !== "number") {
				console.error("Error: value to change to base two is not number")
				return false;
			}
			return value.toString(2);
		},
		toBaseEight(value) {
			if (typeof value !== "number") {
				console.error("Error: value to change to base Eight is not number")
				return false;
			}
			return value.toString(8);
		},
		formatBaseTen() {
			if (typeof value !== "number") {
				console.error("Error: value to change to base Sixteen is not number")
				return false;
			}
			return value.toString(10)
		},
		toBaseSixteen(value) {
			if (typeof value !== "number") {
				console.error("Error: value to change to base Sixteen is not number")
				return false;
			}
			return value.toString(16)
		},
		toSciNotationSmall(value) {
			if (typeof value !== "number") {
				console.error("Error: value to change to base Sixteen is not number")
				return false;
			}
			return value.toExponential()
		},
		toSciNotationLarge(value) {
			if (typeof value !== "number") {
				console.error("Error: value to change to base Sixteen is not number")
				return false;
			}
			return value.toExponential().toString().toUpperCase();
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
