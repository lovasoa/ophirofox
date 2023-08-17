#!/usr/bin/env python3

import json
import sys
import os
import urllib.request
from pathlib import Path

BASE = Path(__file__).parent


def get_extension_manifest():
    with (BASE / "ophirofox" / "manifest.json").open('r') as f:
        return json.load(f)


def get_github_releases():
    token = os.environ.get("GITHUB_TOKEN")
    return json.load(urllib.request.urlopen(urllib.request.Request(
        url="https://api.github.com/repos/lovasoa/ophirofox/releases",
        headers={"authorization": "Bearer " + token} if token else {},
    )))


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
