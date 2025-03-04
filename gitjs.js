
// -------

var fs = require("fs");
var nodePath = require("path");

// Main Git API functions
// ----------------------

var gitlet = module.exports = {

  // **init()** initializes the current directory as a new repository.
  init: function(opts) {

    // Abort if already a repository.
    if (files.inRepo()) { return; }

    opts = opts || {};

    // Create a JS object that mirrors the Git basic directory
    // structure.
    var gitletStructure = {
      HEAD: "ref: refs/heads/master\n",

      // If `--bare` was passed, write to the Git config indicating
      // that the repository is bare.  If `--bare` was not passed,
      // write to the Git config saying the repository is not bare.
      config: config.objToStr({ core: { "": { bare: opts.bare === true }}}),

      objects: {},
      refs: {
        heads: {},
      }
    };

    // Write the standard Git directory structure using the
    // `gitletStructure` JS object.  If the repository is not bare,
    // put the directories inside the `.gitlet` directory.  If the
    // repository is bare, put them in the top level of the
    // repository.
    files.writeFilesFromTree(opts.bare ? gitletStructure : { ".gitlet": gitletStructure },
                             process.cwd());
  },

  // **add()** adds files that match `path` to the index.
  add: function(path, _) {
    files.assertInRepo();
    config.assertNotBare();

    // Get the paths of all the files matching `path`.
    var addedFiles = files.lsRecursive(path);

    // Abort if no files matched `path`.
    if (addedFiles.length === 0) {
      throw new Error(files.pathFromRepoRoot(path) + " did not match any files");

    // Otherwise, use the `update_index()` Git command to actually add
    // the files.
    } else {
      addedFiles.forEach(function(p) { gitlet.update_index(p, { add: true }); });
    }
  },

}