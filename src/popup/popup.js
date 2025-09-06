"use strict";

function parseURL(url) {
    // A URL of the latest docs looks like:
    // https://docs.nvidia.com/cuda/cuda-quick-start-guide/index.html#local-installer
    // A URL of the archived docs looks like:
    // https://docs.nvidia.com/cuda/archive/12.0.0/cuda-quick-start-guide/index.html#local-installer

    const cudaDocUrlRegex = new RegExp("^https://docs\.nvidia\.com/cuda/(.*?)$");
    const archivePathRegex = new RegExp("^archive/(.+?)/(.*)$");

    let cudaDocUrlParts = url.match(cudaDocUrlRegex);
    if (cudaDocUrlParts === null) {
        return {"id": "UNKNOWN", "path": ""};
    }
    let cudaDocPath = cudaDocUrlParts[1];
    let archiveParts = cudaDocPath.match(archivePathRegex);
    if (archiveParts === null) {
        return {"id": "LATEST", "path": cudaDocPath};
    }
    return {"id": archiveParts[1], "path": archiveParts[2]}
}

function renderPicker(current) {
    chrome.storage.local.get(["versions"]).then(data => {
        var versions;
        if ("versions" in data) {
            versions = data["versions"];
        } else {
            console.error("versions not yet available in local storage");
            versions = [
                {"version": "Latest", "id": "LATEST"}
            ]
        }
        renderPickerWith(versions, current);
    });
}

function renderPickerWith(versions, current) {
    let ul = document.getElementById("picker");
    ul.replaceChildren();  // remove all items
    versions.forEach(record => {
        let li = document.createElement("li");
        var styleClass;
        if (current["id"] === record["id"]) {
            li.textContent = record["version"];
            styleClass = "current";
        } else {
            let a = document.createElement("a");
            var urlPrefix;
            if (record["id"] === "LATEST") {
                urlPrefix = "https://docs.nvidia.com/cuda/";
            } else {
                urlPrefix = "https://docs.nvidia.com/cuda/archive/" + record["id"] + "/";
            }
            a.setAttribute("href", urlPrefix + current["path"]);
            a.addEventListener("click", event => {
                if ((event.ctrlKey || event.shiftKey || event.metaKey || event.which == 2)) {
                    chrome.tabs.create({url: a.href, active: false});
                } else {
                    chrome.tabs.update({url: a.href});
                    renderPickerWith(versions, parseURL(a.href));
                }
                event.stopPropagation();
                event.preventDefault();
            });
            a.textContent = record["version"];
            li.append(a)
            styleClass = "not-current";
        }
        li.setAttribute("class", styleClass);
        ul.append(li);
    });
}

function popUpMain() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        if (tabs.length === 0) {
            console.warn("no active tabs found")
            return;
        }
        renderPicker(parseURL(tabs[0].url));
    });

    document.getElementById("reload-button").addEventListener("click", () => {
        chrome.runtime.sendMessage({action: "reloadVersions"});
    });

    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === "local" && "versions" in changes) {
            popUpMain();
        }
    });
}

(function(){popUpMain();})();
