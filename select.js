[].slice.call(document.getElementsByTagName('select')).forEach(function(element) {
    element.addEventListener('click', function(event) {
        chrome.runtime.sendMessage({
            "innerHTML": element.innerHTML,
            "selectedIndex": element.selectedIndex
        });
    });
});
