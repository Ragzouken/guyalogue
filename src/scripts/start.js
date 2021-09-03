const fearguy = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAhUExURUMAZ/+ApP/RAP+EJr//PAAoWXM5Lv/arBsQI5QhagAAANsjVvkAAAALdFJOU/////////////8ASk8B8gAAAAlwSFlzAAAOwwAADsMBx2+oZAAABN5JREFUeF7tmduSnDgUBG2PLzPz/x9snTqpKxJINLhjHJ2xBklIVbk03pf99vlkXgIvgZfAS+Al8BL48gLf+vB0gtMCNA1h2yGnBOg4gt37rAuQPgVH9lgVIDnzvQfPDM4NWRMgVNA1gE0GZwcsCZB4VA7sPTA4IUD+BL5/32BFQGFkz6IzewoLAkoKmT/W0LFxzbyActb7MSBky7SAYs70/9DPQMqWWYG6X7e38M9buAhNyrFdfM2/A3I2rAjEfr/HGlFO4jje+RIJalkTUEHoD4MYL5hoGh/Eu21/XMASELBAfwWbfpvH3njXbh0nquG8QKe/6I13tl8iYEExUAZeX/XbtNN/nUBGZUbZH5ar/rdSoF91WiAalP0moAVfy/07r+C8gBs0/VrN/fcKFF3qy6vb/nsE/B1YUVXGWtV/k0BUMFgQnaW7BKa5VeBngoUONwnQG/jF3eFxwT0C1Bm1wNbgHgE3+BXRDNiQuEJg7zdQOR425nHmUYHhV2jFgZlP4B4Bg1pgsWbYvyQwNDhEp0lqmBV4yEBnyWlZEzhnoJPEbJgWOP0KdO4KgXPvwA+N+1cEMFhQ4ECAhA4nBKYU2On8jhBUMi8QzpMnKHJY6+PdEdISHYF2EycFmZGJfg5mSI1sBdg3hOAp/gBHBTWRVQGLI30fFTcogZrIggApDjUVzZYOFkNNZEaA01soFnv7EoqjB7of4UxWhYIZ72L7qIFrBCyY0T63CXR4f39nVPBPBEJzhJXMVQK97IBWvdrx5YKLBIgXmubl6qEvl1h2bTAQ2Dcg36GX5eKh1lpmBI5fAQ0OM5bjdcR9AqnaryMs++Pjg6bARiA8nRLIA7sYhQBoTw0COISrBJKQP7pMoGOQBcAENEj1LrBrkLI1sEtiVYA30DAjYOF+TxejEvDdFRadC0O3fwPMRZjarj0D8oXP0lqcjnCBWBnufISaBnx2+PdAXU5q1GxRIPRVP4GeGLZtzoBxWlsU8G+Ace5vX4HNGh+15eK4xjSi5QpFWYP12Z/4BvQnUzbqTIDplrqIboe1AkuyBvXFn8AYCNgAND+Gaoe1Akuyhti3I9BCwiF0G6yUWJI1HAg0Bs03sYxCMmqgLgnk/x4LtgqmhJ1AKQVe4WSBGrbGzTYi7QQKKvBMZySgSoYBm5G2ofit+z979xeIDAVq7BxpAX1gRm9cbcBnU5s5I0C20RtXG9zgmQIyuFaAYKOc5PG/EGBYT2xs5MU4eIaAVuPdjg8M7hBw4oIeXS4g4kSrAY3zhY16ZOf7Bg99hHFSrHu3ho4/G7+ChwTSv6V6/KarXRw/svMKrhIoh4UARwIXC/iNiegKaL9jCT2D8wKOegLFsBBoDUgruUKgGDpPFOCaLsVOi+gYnBAIyQwC3qIVv+mah8Xe6wRKvCTQEWgMniDgT7UvcI9ANGDUCNhAd8MytgYPC2RozZeWuwX6rQW3CxxhIRuDBYFrDAhMTAq4gSDsDHacvMS6wIOQl/gyAlcZkJaZFjD4f0MPQFDBioD1f2yw1QJWa+wBIS0PC9hiBesVtk5Iy1cS6MdrtYT1Cj0gpmFVYJNva2wYvKOArV8l0IMNe1sMNtV8JYFxPM9vFzDIquCRwUoXtjSsCoA+LcYjtOdo038tMGfwXwtM7XoJPFng8/MvUKfh0ugyP1UAAAAASUVORK5CYII=";
const furbguy = "data:image/png;base64,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";

/**
 * Use inline style to resize canvas to fit its parent, preserving the aspect
 * ratio of its internal dimensions.
 * @param {HTMLCanvasElement} canvas 
 */
function fitCanvasToParent(canvas) {
    const [tw, th] = [canvas.parentElement.clientWidth, canvas.parentElement.clientHeight];
    const [sw, sh] = [tw / canvas.width, th / canvas.height];
    let scale = Math.min(sw, sh);
    if (scale > 1) scale = Math.floor(scale); 

    canvas.style.setProperty("width", `${canvas.width * scale}px`);
    canvas.style.setProperty("height", `${canvas.height * scale}px`);
}

async function setupEditor(playback) {
    return new GuyalogueEditor(playback);
}

async function setupPlayback(font) {
    const playback = new GuyaloguePlayback(font);
    await playback.init();

    const playCanvas = /** @type {HTMLCanvasElement} */ (ONE("#playback-canvas"));
    const rendering = playCanvas.getContext("2d");

    const fearimage = await loadImage(fearguy);
    const furbimage = await loadImage(furbguy);

    // update the canvas size whenever the browser window resizes
    window.addEventListener("resize", () => fitCanvasToParent(playCanvas));
        
    // update the canvas size every render just in case..
    playback.addEventListener("render", () => {
        fillRendering2D(rendering, "#808080");
        rendering.drawImage(fearimage, 0, 200-128);
        rendering.drawImage(furbimage, 320-128, 200-128);
        rendering.drawImage(playback.rendering.canvas, 0, 0);

        fitCanvasToParent(playCanvas);
    });

    playCanvas.addEventListener("click", () => playback.proceed());

    // update the canvas size initially
    fitCanvasToParent(playCanvas);
    
    let prev;
    const timer = (next) => {
        prev = prev ?? Date.now();
        next = next ?? Date.now();
        const dt = Math.max(0, (next - prev) / 1000.);
        prev = next;
        window.requestAnimationFrame(timer);
        playback.update(dt);
    }
    timer();
    
    document.documentElement.style.setProperty('--vh', `${window.innerHeight / 100}px`);

    return playback;
}

async function start() {
    const font = await loadBasicFont(ONE("#font-embed"));
    const playback = await setupPlayback(font);

    // determine if there is a project bundle embedded in this page
    const bundle = maker.bundleFromHTML(document);

    if (bundle) {
        // embedded project, load it in the player
        await playback.loadBundle(bundle);
        playback.start();
    } else {
        const editor = await setupEditor(playback);

        // no embedded project, start editor with save or editor embed
        const save = await storage.load("slot0").catch(() => undefined);
        const bundle = save || maker.bundleFromHTML(document, "#editor-embed");
        
        // load bundle
        await editor.loadBundle(bundle);

        ONE("#playback").hidden = true;
        ONE("#editor").hidden = false;
        ONE("#preview").prepend(ONE("#playback-canvas"));

        // unsaved changes warning
        window.addEventListener("beforeunload", (event) => {
            if (!editor.unsavedChanges) return;
            event.preventDefault();
            return event.returnValue = "Are you sure you want to exit?";
        });
    }
}
