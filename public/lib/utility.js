function SoundCloudManager() {
    let state = "error";
    let widget = SC.Widget("sc-player");

    widget.bind(SC.Widget.Events.READY, function () {
        state = "ready";
        widget.bind(SC.Widget.Events.ERROR, function () {
            console.log("SoundCloud Widget is error");
            state = "error";
        });

        widget.bind(SC.Widget.Events.FINISH, function () {
            console.log("SoundCloud Widget is finished");
            state = "finished";
        });
    });

    function isValidMixUrl(url) {
        const urlObject = url ? new URL(url) : null;
        if (urlObject?.protocol !== 'https:') {
            console.error('Only HTTPS URLs are supported');
            return false;
        }
        if (urlObject?.hostname !== 'www.soundcloud.com' && urlObject?.hostname !== 'soundcloud.com') {
            console.error('Only SoundCloud URLs are supported');
            return false;
        }
        return true;
    }

    function sanitizeUrl(url) {
        const urlObject = new URL(url);
        urlObject.search = "";
        return urlObject.toString();
    }

    this.setCurrentMix = async function (url) {
        const sanitizedUrl = sanitizeUrl(url);
        if (!isValidMixUrl(sanitizedUrl)) {
            console.error('Invalid SoundCloud URL:', url);
            return;
        }
        document.getElementById('sc-player-container').classList.remove('hidden');
        widget.load(sanitizedUrl, { auto_play: true, show_comments: false });
    }

    this.getState = function () { return state; }
}

const soundCloudManager = new SoundCloudManager();
window.setCurrentMix = soundCloudManager.setCurrentMix;
