var Changeset = require("./etherpad-lite/src/static/js/Changeset");

function main() {
    oldText = "Hello\n";
    newText = "Hello World";

    cs = GenerateChangeset(oldText, newText);
    console.log(cs);

    // Apply changeset to oldText
    generatedtext = Changeset.applyToText(cs, oldText);
    console.log(generatedtext);
}
  
main();

function GenerateChangeset(oldtext, newtext, attribs) {
  // init the changeset builder
  var builder = Changeset.builder(oldtext.length);

  // find the longest common prefix
  var commonLength = 0;
  while (commonLength < oldtext.length && commonLength < newtext.length && oldtext[commonLength] === newtext[commonLength]) {
      commonLength++;
  }

  // keep common prefix
  builder.keep(commonLength);

  // // remove the remaining of the old text
  // if (commonLength < oldtext.length) {
  //     builder.remove(oldtext.length - commonLength);
  // }

  // add the remaining of the new text
  if (commonLength < newtext.length) {
      builder.insert(newtext.substring(commonLength));
  }

  // generate the changeset
  return builder.toString();
}