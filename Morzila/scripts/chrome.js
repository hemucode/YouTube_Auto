var app = {};

app.parent = {};
app.version = function () {return chrome.runtime.getManifest().version};
app.homepage = function () {return chrome.runtime.getManifest().homepage_url};
app.tab = {"open": function (url) {chrome.tabs.create({"url": url, "active": true})}};

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  if (tabId) {
    delete app.parent[tabId];
  }
});

if (!navigator.webdriver) {
  chrome.runtime.setUninstallURL(app.homepage() + "#uninstall", function () {});
  chrome.runtime.onInstalled.addListener(function (e) {
    chrome.management.getSelf(function (result) {
      if (result.installType === "normal") {
        window.setTimeout(function () {
          var previous = e.previousVersion !== undefined && e.previousVersion !== app.version();
          var doupdate = previous && parseInt((Date.now() - config.welcome.lastupdate) / (24 * 3600 * 1000)) > 45;
          if (e.reason === "install" || (e.reason === "update" && doupdate)) {
            app.tab.open(app.homepage());
            config.welcome.lastupdate = Date.now();
          }
        }, 3000);
      }
    });
  });
}
