
/**
 * This script retrieves information about the latest releases of the extension on GitHub
 * and updates the extension manifest to provide firefox update information.
 * 
 * You can set the environment variable `GITHUB_TOKEN` with a GitHub access token.
 * 
 * It will fetch release details, check for .xpi files in the assets, and update the manifest with version and download links.
 * 
 * On old node versions, run this script with `node --experimental-fetch update-manifest.js`
 */

/**
 * @typedef {Object} ReleaseAsset
 * @property {string} name - The name of the release asset.
 * @property {string} browser_download_url - The URL to download the release asset.
 */

/**
 * @typedef {Object} GithubRelease
 * @property {string} tag_name - The tag name of the release.
 * @property {string} html_url - The HTML URL of the release on GitHub.
 * @property {boolean} draft - Indicates if the release is a draft.
 * @property {ReleaseAsset[]} assets - An array of release assets.
 */

/**
 * @typedef {Object} Manifest
 * @property {Object} browser_specific_settings - Browser-specific settings in the manifest.
 * @property {Object} browser_specific_settings.gecko - Gecko-specific settings.
 * @property {string} browser_specific_settings.gecko.id - The extension's ID for Gecko-based browsers.
 */

/**
 * @typedef {Object} ManifestUpdate
 * @property {Object} addons - Addons object in the manifest.
 * @property {Object} addons[addonId] - Addon details for a specific ID.
 * @property {ReleaseDetails[]} addons[addonId].updates - An array of release details.
 */

/**
 * @typedef {Object} ReleaseDetails
 * @property {string} version - The version of the release.
 * @property {string} update_link - The URL to download the update.
 * @property {string} update_info_url - The URL with information about the release.
 */

const fs = require('fs');
const path = require('path');

const BASE = path.dirname(__filename);

/**
 * Get the extension manifest.
 * @returns {Manifest} The extension manifest object.
 */
function getExtensionManifest() {
    const manifestPath = path.join(BASE, 'ophirofox', 'manifest.json');
    const manifest = fs.readFileSync(manifestPath, 'utf8');
    return JSON.parse(manifest);
}

/**
 * Get GitHub releases using the fetch API.
 * @returns {Promise<GithubRelease[]>} A Promise that resolves to an array of release objects.
 */
async function getGithubReleases() {
    const token = process.env.GITHUB_TOKEN;
    const headers = token ? { 'authorization': `Bearer ${token}` } : {};
    const url = 'https://api.github.com/repos/lovasoa/ophirofox/releases';

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`Failed to fetch GitHub releases. Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error fetching GitHub releases: ${error.message}`);
    }
}

/**
 * Get details of a release.
 * @param {GithubRelease} release - The release object.
 * @returns {ReleaseDetails|undefined} Details of the release, or undefined if not found.
 */
function versionDetails(release) {
    const version = release.tag_name.slice(1);
    for (const asset of release.assets) {
        if (asset.name.endsWith('.xpi')) {
            return {
                version,
                update_link: asset.browser_download_url,
                update_info_url: release.html_url,
            };
        }
    }
}

/**
 * Update the extension manifest.
 * @returns {ManifestUpdate} The updated manifest object.
 */
async function updateManifest() {
    const manifest = getExtensionManifest();
    const addonId = manifest.browser_specific_settings.gecko.id;

    const updates = [];
    const releases = await getGithubReleases();

    for (const release of releases) {
        if (!release.draft) {
            const details = versionDetails(release);
            if (details) {
                updates.push(details);
            }
        }
    }

    const manifestObj = {
        addons: {
            [addonId]: {
                updates,
            },
        },
    };

    return manifestObj;
}

/**
 * Main function to update and log the manifest.
 */
async function main() {
    const manifestUpdate = await updateManifest();
    console.log(JSON.stringify(manifestUpdate, null, 2));
}

if (require.main === module) {
    main();
}
