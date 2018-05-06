module.exports = {
    "make_targets": {
        "win32": [],
        "darwin": ["dmg"],
        "linux": []
    },
    "electronPackagerConfig": {
        "packageManager": "yarn",
        "protocol": "mmmmh://",
        "icon": "./icon/app.png"
    },
    "electronInstallerDMG": {
        "icon": "./icon/app.icns",
        "format": "ULFO"
    },
    "electronWinstallerConfig": {
        "name": "mmmmh"
    },
    "electronInstallerDebian": {},
    "electronInstallerRedhat": {},
    "github_repository": {
        "owner": "MiYogurt",
        "name": "mmmmh",
        "options": {
            protocol: 'https',
            host: 'api.github.com'
        }
    },
    "publish_targets": {
        "darwin": ["github"]
    },
    "windowsStoreConfig": {
        "packageName": "mmmmh",
        "name": "mmmmh"
    }
}