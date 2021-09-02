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

        ui.action("playtest", () => this.playtest());

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

            this.playtest();
        });
    }

    async loadBundle(bundle) {
        await this.stateManager.loadBundle(bundle);
    }

    playtest() {
        this.playback.copyFrom(this.stateManager);
        this.playback.start();
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
