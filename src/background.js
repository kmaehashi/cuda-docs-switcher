"use strict";

function loadVersions() {
    loadVersionsFromLocal().then(loadVersionsFromRemote)
}

function loadVersionsFromLocal() {
    return loadVersionsFromURL(chrome.runtime.getURL("./versions-v1.json"));
}

function loadVersionsFromRemote() {
    return loadVersionsFromURL("https://raw.githubusercontent.com/kmaehashi/cuda-docs-switcher/main/static/versions-v1.json");
}

function loadVersionsFromURL(url) {
    console.log("Loading versions.json file: " + url);
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("response status " + response.status + " " + response.statusText);
            }
            return response.json();
        })
        .then(versions => {
            console.log("Loaded " + versions.length + " entries");
            return chrome.storage.local.set({"versions": versions});
        })
        .then(() => {
            console.log("Data persisted to local storage")
        })
        .catch(error => {
            console.error("Failed loading " + url + ":", error);
        });
}

chrome.runtime.onInstalled.addListener(loadVersions);
chrome.runtime.onStartup.addListener(loadVersions);
chrome.alarms.onAlarm.addListener(loadVersionsFromRemote);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "reloadVersions") {
        loadVersionsFromRemote();
    }
});

let RELEASE = true;
if (RELEASE) {
    chrome.alarms.create("update", {periodInMinutes: 12 * 60});  // every 12 hours
} else {
    console.warn("*** DEVELOPMENT MODE ***");
    chrome.storage.local.clear();
    chrome.alarms.create("update", {delayInMinutes: 0, periodInMinutes: 0.1});
}
