const fs = require('fs');
const path = require('path');
const { parseCLIArgs } = require('./comand_line_arguments_parser');

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
		excludeDirectories = ['node_modules', 'dist', 'build'],
		isLog = true,
		isDryRun = false,
		isInProjectFolder = true,
	}) {
		if (process.argv.length > 2) {
			const args = parseCLIArgs(process.argv);

			//TODO isnt there a better way to do this?
			if (args) {
				rootDirectory = args.rootDirectory;
				currentFileFormat = args.currentFileFormat;
				formatToFormatTo = args.formatToFormatTo;
				excludeDirectories = args.excludeDirectories;
				(isDryRun = args.isDryRun), (isLog = args.isLog);
				isInProjectFolder = args.isInProjectFolder;
				//TODO set to false and make it find outer src folder and make it root
			}
		}
		this.rootDirectory = this.getRootDirectoryAbsolutePath(rootDirectory);
		this.currentFileFormat = currentFileFormat;
		this.formatToFormatTo = formatToFormatTo;
		this.excludeDirectories = excludeDirectories;
		isDryRun ? (this.isLog = true) : (this.isLog = false);
		this.isDryRun = isDryRun;
		this.isLog = isLog;
	}
	init() {
		const directories = [];
		fs.readdir(this.rootDirectory, { withFileTypes: true }, (err, files) => {
			files.forEach((file) => {
				const filePath = file.path;
				if (
					fs.lstatSync(filePath).isDirectory() &&
					!this.excludeDirectories.includes(filePath)
				) {
					directories.push(filePath);
				}
			});
		});

		let directoriesTouched = 0;
		let filesTouched = 0;
		const { changed, filesChanged } = this.renameFilesInDirectory(this.rootDirectory);
		filesTouched += filesChanged;
		directoriesTouched += changed ? 1 : 0;

		directories.forEach((directory) => {
			const { changed, filesChanged } = this.renameFilesInDirectory(directory);
			if (changed) {
				directoriesTouched += 1;
				filesTouched += filesChanged;
			}
		});
		if (this.isLog) {
			console.dirxml(
				'Directories touched = ' + directoriesTouched + ', files changed = ' + filesTouched
			);

		}
	}
	getRootDirectoryAbsolutePath(directory) {
		const filePath = path.resolve(directory);
		if (!fs.lstatSync(filePath).isDirectory()) {
			throw Error('No such directory');
		}
		return filePath;
	}

	renameFilesInDirectory(directory) {
		let filesChanged = 0;
		const files = fs.readdirSync(directory, { withFileTypes: true });
		for(const file of files){
			const format = file.name.split('.').at(-1);
			const filePath = file.path + "/" + file.name;

			if (format === this.currentFileFormat 
				&& fs.lstatSync(filePath).isFile()) {
				const newFileName = file.name.slice(0).replace(format, this.formatToFormatTo);
				if (this.isDryRun) {
					filesChanged += 1;
					continue;
				}
				const newFilePath = directory + '/' + newFileName
				
				fs.renameSync(filePath,  newFilePath);//does not return error on incorrect input(?), returns undefined on success. GENIUS
				if(!fs.existsSync(filePath)){// if changed
					filesChanged +=1;
				}
			}
		
			
		}

		const isDirectoryChanged = filesChanged > 0;
		return { changed: isDirectoryChanged, filesChanged };
	}
}

const fileFormat = new FileFormat({
	rootDirectory: 'test_for_file_formatting',
	currentFileFormat: 'ts',
	formatToFormatTo: 'js',
	isDryRun: false,
});
fileFormat.init();
