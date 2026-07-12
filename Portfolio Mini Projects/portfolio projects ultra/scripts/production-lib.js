/**
 * Production support library for 50-in-1 Web projects portfolio.
 * Provides fallback implementations for data persistence, keyboard shortcuts,
 * exports, and error handling.
 */
(function() {
    window.ProductionLib = {
        PersistenceManager: function(projectName) {
            this.projectName = projectName;
            
            this.get = function(key, defaultValue) {
                // Try to use page's internal uLoad if available
                if (typeof window.uLoad === 'function') {
                    return window.uLoad(key, defaultValue);
                }
                try {
                    var v = localStorage.getItem('uapp_' + projectName + '_' + key);
                    return v !== null ? JSON.parse(v) : defaultValue;
                } catch(e) {
                    return defaultValue;
                }
            };
            
            this.set = function(key, value) {
                // Try to use page's internal uSave if available
                if (typeof window.uSave === 'function') {
                    return window.uSave(key, value);
                }
                try {
                    localStorage.setItem('uapp_' + projectName + '_' + key, JSON.stringify(value));
                    return true;
                } catch(e) {
                    return false;
                }
            };
            
            this.appendHistory = function(key, historyItem) {
                var history = this.get(key, []);
                history.unshift(historyItem);
                if (history.length > 50) history.pop();
                this.set(key, history);
            };
        },
        
        ProductionErrorHandler: {
            handle: function(error, source) {
                console.error("Production Error [" + source + "]:", error);
                var message = error && error.message ? error.message : String(error);
                if (typeof window.uToast === 'function') {
                    window.uToast("Error: " + message, "error", 4000);
                }
            }
        },
        
        DataExporter: {
            exportJSON: function(data, filename) {
                if (typeof window.uExportJSON === 'function') {
                    window.uExportJSON(data, filename);
                } else {
                    var blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
                    var a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = (filename || 'export') + '.json';
                    a.click();
                }
            }
        },
        
        KeyboardShortcuts: {
            showHelp: function() {
                var helpText = "Keyboard Shortcuts:\n- Press 'Esc' to clear inputs/close modals\n- Press 'Ctrl + S' to save/export\n- Press 'Ctrl + H' for history";
                if (typeof window.uToast === 'function') {
                    window.uToast(helpText, "info", 4000);
                } else {
                    alert(helpText);
                }
            }
        }
    };
})();
