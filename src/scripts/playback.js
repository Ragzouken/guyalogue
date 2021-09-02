// async equivalent of Function constructor
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

const ERROR_STYLE = {
    glyphRevealDelay: 0,
    panelColor: "#FF0000",
    textColor: "#FFFFFF",
}

class GuyaloguePlayback extends EventTarget {
    constructor(font) {
        super();
        // home for data of the project we're playing
        this.stateManager = new maker.StateManager(getManifest);
        this.stateBackup = new maker.StateManager(getManifest);
        
        this.temporary = createRendering2D(320, 200);
        this.rendering = createRendering2D(320, 200);

        this.font = font;
        this.dialoguePlayback = new DialoguePlayback(320, 200);
        this.dialoguePlayback.options.font = font;

        this.ready = false;
        this.busy = false;
        this.error = false;

        this.variables = new Map();
        /** @type {Map<string, Thread>} */
        this.threads = new Map();

        this.objectURLs = new Map();
    }

    async init() {
        await this.dialoguePlayback.load();
    }

    /** @type {GuyalogueDataProject} */
    get data() {
        return this.stateManager.present;
    }

    async backup() {
        this.stateBackup.copyFrom(this.stateManager);
    }

    /**
     * @param {maker.StateManager<GuyalogueDataProject>} stateManager 
     */
    async copyFrom(stateManager) {
        this.clear();
        await this.stateManager.copyFrom(stateManager);
        await this.backup();
    }

    /**
     * @param {maker.ProjectBundle<GuyalogueDataProject>} bundle
     */
    async loadBundle(bundle) {
        this.clear();
        await this.stateManager.loadBundle(bundle);
        await this.backup();
    }

    clear() {
        this.ready = false;
        this.error = false;
        this.dialoguePlayback.clear();
        this.variables.clear();
        this.threads.clear();

        this.objectURLs.forEach((url) => URL.revokeObjectURL(url));
    }

    getFileObjectURL(id) {
        const url = this.objectURLs.get(id) 
                 ?? URL.createObjectURL(this.stateManager.resources.get(id));
        this.objectURLs.set(id, url);
        return url;
    } 

    async restart() {
        this.clear();
        await this.stateManager.copyFrom(this.stateBackup);
        this.start();
    }

    async start() {
        this.ready = true;

        const data = this.stateManager.present;
        const threads = testParseDialogues(data.dialogues);

        threads.forEach((thread) => {
            this.threads.set(thread.name, thread);
        });

        await this.runJS(data.script);
    }

    update(dt) {
        if (!this.ready) return;

        // dialogue animation
        this.dialoguePlayback.update(dt);
        // rerender
        this.render();
    }

    render() {
        // clear to background color
        fillRendering2D(this.temporary, "#808080");

        // upscale scene to display area
        this.rendering.drawImage(this.temporary.canvas, 0, 0, 320, 200);

        // render dialogue box if necessary
        if (!this.dialoguePlayback.empty) {
            // redraw dialogue and copy to display area
            this.dialoguePlayback.render();
            this.rendering.drawImage(this.dialoguePlayback.dialogueRendering.canvas, 0, 0);
        }

        // signal, to anyone listening, that rendering happened
        this.dispatchEvent(new CustomEvent("render"));
    }

    async proceed() {
        if (!this.ready) return;

        this.dialoguePlayback.skip();
    }

    async say(script, options={}) {
        await this.dialoguePlayback.queue(script, options);
    }

    showError(text) {
        this.error = true;
        this.dialoguePlayback.clear();
        this.dialoguePlayback.queue(text, ERROR_STYLE);
        this.dialoguePlayback.skip();
        this.dialoguePlayback.render();
        this.rendering.drawImage(this.dialoguePlayback.dialogueRendering.canvas, 0, 0);
        this.dispatchEvent(new CustomEvent("render"));
    }

    async runJS(js) {
        const defines = generateScriptingDefines(this);
        const names = Object.keys(defines).join(", ");
        const preamble = `const { ${names} } = COMMANDS;\n`;

        try {
            const script = new AsyncFunction("COMMANDS", preamble + js);
            await script(defines);
        } catch (e) {
            console.log(e);
            const error = `SCRIPT ERROR:\n${e}`;
            this.showError(error);
        }
    }
}

/**
 * @param {GuyaloguePlayback} playback  
 */
 function generateScriptingDefines(playback) {
    // edit here to add new scripting functions
    const defines = {};
    
    defines.PLAYBACK = playback;

    defines.GET = (key, fallback=undefined) => playback.variables.get(key) ?? fallback;
    defines.SET = (key, value) => playback.variables.set(key, value);

    defines.SAY_THREAD = (name) => {
        const thread = playback.threads.get(name);

        thread.messages.forEach((message) => {
            const style = defines.GET("style/" + message.options, {});
            playback.say(message.script, style);
        });
    };

    return defines;
}
