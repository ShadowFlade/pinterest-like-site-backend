const fs = require("fs");
const path = require("path");

/**
 *
 * @class FileFormat
 * @classdesc formats files to given fileFormat
 * @param string rootDirectory
 */
class FileFormat {
  constructor(
    rootDirectory,
    currentFileFormat,
    formatToFormatTo,
    excludeDirectories,
  ) {
    this.rootDirectory = this.getRootDirectoryAbsolutePath(rootDirectory);
    this.currentFileFormat = currentFileFormat;
    this.formatToFormatTo = formatToFormatTo;
    this.excludeDirectories = excludeDirectories;
  }
  init() {
    console.log(this.rootDirectory);
    const directories = [];
    fs.readdir(
      this.rootDirectory,
      { withFileTypes: true },
      function (err, files) {
        files.forEach(function (file) {
          if (fs.lstatSync(file).isDirectory()) {
            directories.push(file);
          }
        });
      },
    );

    let directoriesTouched = 0;
    let filesTouched = 0;
    directories.forEach(function (directory) {
      const { changed, filesChanged } = this.renameFilesInDirectory(directory);
      if (changed) {
        directoriesTouched += 1;
        filesTouched += filesChanged;
      }
    });
  }
  getRootDirectoryAbsolutePath(directory) {
    return __dirname.split(directory)[0] + directory;
  }

  renameFilesInDirectory(directory) {
    const filesChanged = 0;
    fs.readdir(directory, { withFileTypes: true }, function (error, files) {
      if (error) {
        console.log(error);
      }
      files.forEach(function (file) {
        /** @type string */
        const format = file.split(".").at(-1);
        if (format === this.currentFileFormat) {
          const newFileName = file.replace(format, "ts");
          if (fs.lstatSync(file).isFile()) {
            fs.rename(file, newFileName, function (err) {
              if (err) throw err;
              filesChanged += 1;
            });
          }
        }
      });
    });
    return { changed: true, filesChanged };
  }
}

const fileFormat = new FileFormat("backend", "js", "ts");
fileFormat.init();
