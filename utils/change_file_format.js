const fs = require("fs");
const path = require("path");
const { parseCLIArgs } = require("./comand_line_arguments_parser");

//TODO does not convert files in directories pogchamp
/**
 *
 * @class FileFormat
 * @classdesc formats files to given fileFormat
 */
class FileFormat {
	/**
	 * Represents a constructor function.
	 * @param {Object} options - The options object.
	 * @param {string} options.rootDirectory - The root directory.
	 * @param {string} options.currentFileFormat - The current file format.
	 * @param {string} options.formatToFormatTo - The format to convert to.
	 * @param {string[]} options.excludeDirectories - The directories to exclude.
	 * @param {boolean} options.isDryRun - Flag indicating if it's a dry run.
	 */
	constructor({
		currentFileFormat,
		formatToFormatTo,
		rootDirectory = __dirname,
		excludeDirectories = ["node_modules", "dist", "build"],
		isLog = true,
		isDryRun = false,
		isInProjectFolder = true,
	}) {
		if (process.argv.length > 2) {
			const args = parseCLIArgs(process.argv);

			//TODO isnt there a better way to do this?
            //TODO well now this is total bullshit, need to fix this asap
            //TODO do this with Object.entries ??
			if (args) {
				args.rootDirectory
					? (rootDirectory = args.rootDirectory)
					: false;
                console.log(rootDirectory,' rootDirectory')
                console.log(args.rootDirectory,' args root directory')
				args.currentFileFormat
					? (currentFileFormat = args.currentFileFormat)
					: false;
				args.formatToFormatTo
					? (formatToFormatTo = args.formatToFormatTo)
					: false;
				args.excludeDirectories
					? (excludeDirectories = excludeDirectories)
					: false;
				args.isDryRun ? (isDryRun = args.isDryRun) : false,
					args.isLog ? (isLog = args.isLog) : false;
				args.isInProjectFolder ? isInProjectFolder : false;
				//TODO set to false and make it find outer src folder and make it root
			}
		}
		this.rootDirectory = this.getRootDirectoryAbsolutePath(rootDirectory);
        console.log(this.rootDirectory,' rootDirectory')
		this.currentFileFormat = currentFileFormat;
		this.formatToFormatTo = formatToFormatTo;
		this.excludeDirectories = excludeDirectories;
		isDryRun ? (this.isLog = true) : (this.isLog = false);
		this.isDryRun = isDryRun;
		this.isLog = isLog;

		console.log(excludeDirectories, " exclude diretcories");
	}
	init() {
		const directories = [];
		fs.readdir(
			this.rootDirectory,
			{ withFileTypes: true },
			(err, files) => {
				files.forEach((file) => {
					const filePath = file.path;
					if (
						fs.lstatSync(filePath).isDirectory() &&
						!this.excludeDirectories.includes(filePath)
					) {
						directories.push(filePath);
					}
				});
			}
		);

		let directoriesTouched = 0;
		let filesTouched = 0;
		const { changed, filesChanged } = this.renameFilesInDirectory(
			this.rootDirectory
		);
		filesTouched += filesChanged;
		directoriesTouched += changed ? 1 : 0;

		directories.forEach((directory) => {
			const { changed, filesChanged } =
				this.renameFilesInDirectory(directory);
			if (changed) {
				directoriesTouched += 1;
				filesTouched += filesChanged;
			}
		});
		if (this.isLog) {
			console.dirxml(
				"Directories touched = " +
					directoriesTouched +
					", files changed = " +
					filesTouched
			);
		}
	}
	getRootDirectoryAbsolutePath(directory) {
		const filePath = path.resolve(directory);
		if (!fs.lstatSync(filePath).isDirectory()) {
			throw Error("No such directory you dumbass");
		}
		return filePath;
	}

	renameFilesInDirectory(directory) {
		let filesChanged = 0;
		const files = fs.readdirSync(directory, { withFileTypes: true });
		for (const file of files) {
			const format = file.name.split(".").at(-1);
			const filePath = file.path + "/" + file.name;

			if (
				format === this.currentFileFormat &&
				fs.lstatSync(filePath).isFile()
			) {
				const newFileName = file.name
					.slice(0)
					.replace(format, this.formatToFormatTo);
				if (this.isDryRun) {
					filesChanged += 1;
					continue;
				}
				const newFilePath = directory + "/" + newFileName;

				fs.renameSync(filePath, newFilePath); //does not return error on incorrect input(?), returns undefined on success. GENIUS
				if (!fs.existsSync(filePath)) {
					// if changed
					filesChanged += 1;
				}
			}
		}

		const isDirectoryChanged = filesChanged > 0;
		return { changed: isDirectoryChanged, filesChanged };
	}
}

const fileFormat = new FileFormat({
	rootDirectory: "src",
	currentFileFormat: "js",
	formatToFormatTo: "ts",
	isDryRun: false,
});
fileFormat.init();
