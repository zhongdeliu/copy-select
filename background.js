/* global chrome */
function copyTextToClipboard(text) {
    var copyFrom = document.createElement('textarea');
    copyFrom.textContent = text;
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy', true);
    document.body.removeChild(copyFrom);
}

var currentSelectElement = {};

var mainContextMenu = chrome.contextMenus.create({
    title: "Copy select",
    enabled: false
});
var contextMenu = {
    copySingleTextValue: chrome.contextMenus.create({
        title: "Copy (displayed) text value",
        parentId: mainContextMenu,
        onclick: function() {
            copyTextToClipboard(currentSelectElement.options[currentSelectElement.selectedIndex].text);
        }
    }),
    copySingleFormValue: chrome.contextMenus.create({
        title: "Copy form value",
        parentId: mainContextMenu,
        onclick: function() {
            copyTextToClipboard(currentSelectElement.value);
        }
    }),
    sep1: chrome.contextMenus.create({
        type: "separator",
        parentId: mainContextMenu
    }),
    copyAllTextValues: chrome.contextMenus.create({
        title: "Copy all text values",
        parentId: mainContextMenu,
        onclick: function() {
            var text = "";
            [].slice.call(currentSelectElement.options).forEach(function(option) {
                text += option.text + "\n";
            });
            copyTextToClipboard(text);
        }
    }),
    copyAllFormValues: chrome.contextMenus.create({
        title: "Copy all form values",
        parentId: mainContextMenu,
        onclick: function() {
            var text = "";
            [].slice.call(currentSelectElement.options).forEach(function(option) {
                text += option.value + "\n";
            });
            copyTextToClipboard(text);
        }
    }),
    copyAll: chrome.contextMenus.create({
        title: "Copy all",
        parentId: mainContextMenu,
        onclick: function() {
            var text = "";
            [].slice.call(currentSelectElement.options).forEach(function(option) {
                text += option.value + "\t" + option.text + "\n";
            });
            copyTextToClipboard(text);
        }
    })
};


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    currentSelectElement = document.createElement('select');
    currentSelectElement.innerHTML = request.innerHTML;
    currentSelectElement.selectedIndex = request.selectedIndex;

    chrome.contextMenus.update(mainContextMenu, {
        enabled: true
    });

    chrome.contextMenus.update(contextMenu.copySingleTextValue, {
        title: "Copy current text value: " + currentSelectElement.options[currentSelectElement.selectedIndex].text,
    });
    chrome.contextMenus.update(contextMenu.copySingleFormValue, {
        title: "Copy current form value: " + currentSelectElement.value
    });
});


