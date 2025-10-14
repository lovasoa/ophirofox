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
 * @property {boolean} prerelease - Indicates if the release is a pre-release.
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
 * Check if a version uses the old date-based format (obsolete)
 * @param {string} version - The version string to check
 * @returns {boolean} True if the version uses the old format
 */
function isObsoleteVersionFormat(version) {
    const parts = version.split('.');
    if (parts.length < 3) return false;
    
    const thirdPart = parts[2];
    // Si le 3ème élément a 6 chiffres ou plus, c'est probablement l'ancien format de date
    return thirdPart.length >= 6;
}

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
    
    // Filtrer les versions avec l'ancien format obsolète
    if (isObsoleteVersionFormat(version)) {
        console.warn(`Skipping obsolete version format: ${version}`);
        return undefined;
    }
    
    const xpi_asset = release.assets.find(asset => asset.name.endsWith('.xpi'));
    const changelog_asset = release.assets.find(asset => asset.name === 'changelog.txt');
    return xpi_asset && {
        version,
        update_link: xpi_asset.browser_download_url,
        update_info_url:
            changelog_asset ? changelog_asset.browser_download_url : release.html_url,
    };
}

/**
 * Update the extension manifest.
 * @returns {ManifestUpdate} The updated manifest object.
 */
async function updateManifest() {
    const manifest = getExtensionManifest();
    const addonId = manifest.browser_specific_settings.gecko.id;
    const releases = await getGithubReleases();

    return {
        addons: {
            [addonId]: {
                updates: [
                    {
                        version: process.env.OPHIROFOX_VERSION || "0.0.0.0",
                        update_link: "https://github.com/lovasoa/ophirofox/releases/latest/download/ophirofox.xpi",
                        update_info_url: "https://github.com/lovasoa/ophirofox/releases/latest/download/changelog.txt",
                    },
                    ...releases
                        .filter(release => !release.draft && !release.prerelease)
                        .map(versionDetails)
                        .filter(Boolean), // Ceci filtrera aussi les versions obsolètes qui retournent undefined
                ]
            },
        },
    };
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
