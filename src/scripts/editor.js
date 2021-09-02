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

        const MARIO_STYLE = {
            panelColor: "#FD001F",
            textColor: "#FFFFFF",
            anchorX: 0,
            anchorY: 0,
            lines: 3,
        }
        
        const LUIGI_STYLE = {
            panelColor: "#3DB148",
            textColor: "#FFFFFF",
            anchorX: 1,
            anchorY: 0,
            lines: 3,
        }

        const dialogues = /** @type {HTMLTextAreaElement} */ (ONE(`[name="dialogues"]`));
        dialogues.addEventListener("change", () => {
            const text = dialogues.value;
            const threads = testParseDialogues(text);

            playback.dialoguePlayback.clear();
            threads.forEach((thread) => {
                thread.messages.forEach((message) => {
                    const style = message.options === "mario" ? MARIO_STYLE : LUIGI_STYLE;
                    playback.say(message.script, style);
                });
            });
        });
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
            console.log("ERROR NO MESSAGE TO APPEND");
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

    console.log(threads);

    return threads;
}
