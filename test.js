var Changeset = require("./etherpad-lite/src/static/js/Changeset");

function main() {
    let oldText = "\n";
    let newText = "Hello";

    cs = GenerateChangeset(oldText, newText);
    console.log(cs);

    // Apply changeset to oldText
    generatedtext = Changeset.applyToText(cs, oldText);
    console.log(generatedtext);
}
  
main();

function countNewlines(str) {
    return (str.match(/\n/g) || []).length;
  }
  
  function GenerateChangeset(oldtext, newtext, attribs) {
    // init the changeset builder
    var builder = Changeset.builder(oldtext.length);
  
    if (oldtext != "\n") {
      if (oldtext.endsWith("\n")) {
        oldtext = oldtext.slice(0, -1);
      }
    }
  
    // find the longest common prefix
    var commonLength = 0;
    while (commonLength < oldtext.length && commonLength < newtext.length && oldtext[commonLength] === newtext[commonLength]) {
        commonLength++;
    }
  
    // keep common prefix
    builder.keep(commonLength);
  
    // remove the remaining of the old text
    removetextlength = oldtext.length - commonLength;
    if (oldtext == "\n") {
      removetextlength -= 1;
    }
    var removedNewlines = countNewlines(oldtext.substring(commonLength));
  
    console.log(`commonLength: ${commonLength}`);
    console.log(`oldtextlength: ${oldtext.length}`);
    console.log(`newtextlength: ${newtext.length}`);
    console.log(`removetextlength: ${removetextlength}`);
    console.log(`removedNewlines: ${removedNewlines}`);
  
  
    // remove the remaining of the old text
    if (removetextlength > 0) {
        builder.remove(removetextlength, removedNewlines);
    }
  
    // add the remaining of the new text
    if (commonLength < newtext.length) {
      var insertedNewlines = countNewlines(newtext.substring(commonLength));
      builder.insert(newtext.substring(commonLength), null, null, insertedNewlines);
    }
  
    // generate the changeset
    return builder.toString();
  }