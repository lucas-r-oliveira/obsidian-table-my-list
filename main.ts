import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting,  } from 'obsidian';

// Remember to rename these classes and interfaces!


export default class TableMyPlugin extends Plugin {
	activeFile = this.app.workspace.getActiveFile();
	
	async logFrontMatter() {
		// The front matter is the properties/metadata part of 
		// the note (in YAML format)

		console.log("logging front matter...")
	
		
		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) {
			new Notice("There is no active file. Open a file first, and then try to use this command again.");
			return;
		}

		await this.app.fileManager.processFrontMatter(activeFile, (frontMatter) => {
			console.log(`frontMatter: ${JSON.stringify(frontMatter)}`);
		})

		return
	}

	async onload() {
		this.addRibbonIcon('smile', "I'm here for testing purposes :)", () => new Notice("Hello, I am working") )

		if (this.activeFile) {
			new Notice("Hello I am active");
			


			//FIXME:
			//const frontMatter = this.extractFrontMatter(fileContent);
			const frontMatter = this.extractFrontMatter()

			if (frontMatter && frontMatter.TABLE_ME) {
				// TODO: do something
				console.log(frontMatter);
			}
		}

		// when pressed, it creates a property called TABLE_ME -> it needs to be an editor callback then, right?
		this.addCommand({
			id: 'enable-table-my-file',
			name: 'Table my file',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				//console.log(this.app.metadataCache;
				this.logFrontMatter();
			}
		})
		



		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {}

	//FIXME: mock
	extractFrontMatter() {
		return {TABLE_ME: true}
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}
