#!/usr/bin/env python3

import json
import sys
import urllib.request


def get_extension_manifest():
    with open("./ophirofox/manifest.json") as f:
        return json.load(f)


def get_github_releases():
    url = "https://api.github.com/repos/lovasoa/ophirofox/releases"
    return json.load(urllib.request.urlopen(url))


def version_details(release):
    version = release["tag_name"][1:]
    for asset in release["assets"]:
        if asset["name"].endswith(".xpi"):
            yield {
                "version": version,
                "update_link": asset["browser_download_url"],
                "update_info_url": release["html_url"],
            }
            return


def update_manifest():
    manifest = get_extension_manifest()
    return {
        "addons": {
            manifest["browser_specific_settings"]["gecko"]["id"]: {
                "updates": [
                    version
                    for release in get_github_releases()
                    for version in version_details(release)
                    if not release["draft"]
                ]
            }
        }
    }


def main():
    json.dump(obj=update_manifest(), fp=sys.stdout, indent=2)


if __name__ == "__main__":
    main()
