// browser saves will be stored under the id "guyalogue"
const storage = new maker.ProjectStorage("guyalogue");

// type definitions for the structure of guyalogue project data. useful for the
// code editor, ignored by the browser 

/**
 * @typedef {Object} GuyalogueDataProject
 * @property {string} script
 * @property {string} dialogues
 */

/**
 * Return a list of resource ids that a particular project depends on. 
 * @param {GuyalogueDataProject} data 
 * @returns {string[]}
 */
function getManifest(data) {
    return [];
}
