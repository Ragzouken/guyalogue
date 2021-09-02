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

        this.time = 0;
        this.frameCount = 0;
        
        this.ready = false;
        this.busy = false;
        this.error = false;

        this.variables = new Map();

        this.objectURLs = new Map();
        this.music = document.createElement("audio");
        this.autoplay = false;
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

        this.music.removeAttribute("src");
        this.music.pause();
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

        this.say("hello this is a ~~guyalogue~~ test ==:)==", { lines: 3 });
    }

    update(dt) {
        if (!this.ready) return;

        // tile animation
        this.time += dt;
        while (this.time >= .400) {
            this.frameCount += 1;
            this.time -= .4;
        }

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

        if (this.autoplay) {
            this.music.play();
            this.autoplay = false;
        }
    }

    async say(script, options={}) {
        await this.dialoguePlayback.queue(script, options);
    }

    playMusic(src) {
        const playing = !this.music.paused;
        this.music.src = src;
        this.autoplay = true;
        if (playing) this.music.play();
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
}
