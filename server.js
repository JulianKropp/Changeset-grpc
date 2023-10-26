var messages = require('./changesetproto/changeset_pb');
var services = require('./changesetproto/changeset_grpc_pb');

var grpc = require('@grpc/grpc-js');

function Generate(call, callback) {
  var request = call.request;
  console.log(request);
  oldtext = request.getOldtext();
  newtext = request.getNewtext();
  attribs = request.getAttribs();

  chset = GenerateChangeset(oldtext, newtext, attribs);

  var reply = new messages.GenerateReply();
  reply.setChangeset(chset);

  callback(null, reply);
}

function Ping(call, callback) {
  console.log("Ping");
  var reply = new messages.Nothing();
  callback(null, reply);
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  // Get arguments from process.argv
  const args = process.argv.slice(2);
  var ip = args[0];
  var port = args[1];

  if (!ip || !port) {
    ip = "0.0.0.0"
    port = "50051"
    console.error("No IP or Port specified, using default values")
  }

  console.log(`Addr: ${ip}:${port}`);

  var server = new grpc.Server();
  server.addService(services.ChangesetService, {generate: Generate, ping: Ping});
  server.bindAsync(`${ip}:${port}`, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main();


var Changeset = require("./etherpad-lite/src/static/js/Changeset");
const { timeout } = require('async');

function countNewlines(str) {
  return (str.match(/\n/g) || []).length;
}

function GenerateChangeset(oldtext, newtext, attribs) {
  // Modify oldtext: Add \n to the end if it doesn't have it
  if (!oldtext.endsWith("\n")) {
    oldtext += "\n";
  }

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