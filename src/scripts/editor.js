/**
 * @typedef {Object} Message
 * @property {string} options
 * @property {string} script
 */

/**
 * @typedef {Object} Thread
 * @property {string} name
 * @property {Message[]} messages
 */

class GuyalogueEditor {
    /**
     * @param {GuyaloguePlayback} playback 
     */
    constructor(playback) {
        this.playback = playback;
        
        this.stateManager = new maker.StateManager(getManifest);

        this.iframe = ONE("#playtest");

        const scriptInput = /** @type {HTMLTextAreaElement} */ (ONE(`[name="script"]`));
        scriptInput.addEventListener("change", () => {
            this.stateManager.makeChange(async (data) => {
                data.script = scriptInput.value;
            });
        });
        
        const dialoguesInput = /** @type {HTMLTextAreaElement} */ (ONE(`[name="dialogues"]`));
        dialoguesInput.addEventListener("change", () => {
            this.stateManager.makeChange(async (data) => {
                data.dialogues = dialoguesInput.value;
            });
        });

        this.stateManager.addEventListener("change", () => {
            const data = this.stateManager.present;
            scriptInput.value = data.script;
            dialoguesInput.value = data.dialogues;

            // enable/disable undo/redo buttons
            this.actions.undo.disabled = !this.stateManager.canUndo;
            this.actions.redo.disabled = !this.stateManager.canRedo;

            this.playtest();
        });

        this.actions = {
            playtest:  ui.action("playtest", () => this.playtest()),

            // editor toolbar
            undo: ui.action("undo", () => this.stateManager.undo()),
            redo: ui.action("redo", () => this.stateManager.redo()),

            // editor menu
            save: ui.action("save", () => this.save()),
            export_: ui.action("export", () => this.exportProject()),
            import_: ui.action("import", () => this.importProject()),
            reset: ui.action("reset", () => this.resetProject()),
        };

        this.actions.playtest.disabled = true;
        this.actions.undo.disabled = true;
        this.actions.redo.disabled = true;
    }

    async loadBundle(bundle) {
        await this.stateManager.loadBundle(bundle);
        this.actions.playtest.disabled = false;
    }

    async playtest() {
        //await this.playback.copyFrom(this.stateManager);
        //await this.playback.start();

        const html = await this.makeExportHTML();
        this.iframe.srcdoc = html;
    }

    async save() {
        // visual feedback that saving is occuring
        this.actions.save.disabled = true;
        const timer = sleep(250);

        // make bundle and save it
        const bundle = await this.stateManager.makeBundle();
        storage.save(bundle, "slot0");
        
        // successful save, no unsaved changes
        this.unsavedChanges = false;

        // allow saving again when enough time has passed to see visual feedback
        await timer;
        this.actions.save.disabled = false;
    }

    async makeExportHTML() {
        // make a standalone bundle of the current project state and the 
        // resources it depends upon
        const bundle = await this.stateManager.makeBundle();

        // make a copy of this web page
        const clone = /** @type {HTMLElement} */ (document.documentElement.cloneNode(true));
        // remove some unwanted elements from the page copy
        ALL("[data-empty]", clone).forEach((element) => element.replaceChildren());
        ALL("[data-editor-only]", clone).forEach((element) => element.remove());
        ALL("[data-hidden-in-editor]", clone).forEach((element) => element.hidden = false);
        // insert the project bundle data into the page copy 
        ONE("#bundle-embed", clone).innerHTML = JSON.stringify(bundle);

        // default to player mode
        clone.setAttribute("data-app-mode", "player");
        const html = clone.outerHTML;

        return html;
    }

    async exportProject() {
        const html = await this.makeExportHTML();

        // prompt the browser to download the page
        const name = "guyalogue.html";
        const blob = maker.textToBlob(html, "text/html");
        maker.saveAs(blob, name);
    }

    async importProject() {
        // ask the browser to provide a file
        const [file] = await maker.pickFiles("text/html");
        // read the file and turn it into an html page
        const text = await maker.textFromFile(file);
        const html = await maker.htmlFromText(text);
        // extract the bundle from the imported page
        const bundle = maker.bundleFromHTML(html);
        // load the contents of the bundle into the editor
        await this.loadBundle(bundle);
    } 

    async resetProject() {
        // open a blank project in the editor
        await this.loadBundle(maker.bundleFromHTML(document, "#editor-embed"));
    }
}

/**
 * @param {string} text 
 */
function testParseDialogues(text) {
    const lines = text.split("\n");

    /** @type {Thread[]} */
    const threads = [];
    let thread = undefined;
    let message = undefined;

    function endThread() {
        endMessage();
        if (thread) threads.push(thread);
        thread = undefined;
    }

    function newThread(name) {
        thread = { name, messages: [] };
    }

    function endMessage() {
        if (message) {
            message.script = message.script.replace(/\s+$/g, "");
            thread.messages.push(message);
        }
        message = undefined;
    }

    function newMessage(options) {
        message = { options, script: "" };
    }

    function appendScript(line) {
        if (message) {
            message.script += line + "\n";
        } else {
            console.log("ERROR NO MESSAGE TO APPEND", line);
        }
    }

    for (const line of lines) {
        if (line.startsWith("//")) {
        } else if (line.startsWith("#")) {
            endThread();
            const [, label] = line.match(/#(\w+)/);
            newThread(label);
        } else if (line.startsWith("[")) {
            endMessage();
            const [, list] = line.match(/\[(.*)\]/);
            newMessage(list);
        } else {
            appendScript(line.startsWith("\\") ? line.slice(1) : line);
        }
    }

    endMessage();
    endThread();

    return threads;
}
