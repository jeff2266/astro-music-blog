function SoundCloudManager() {

    const widgetOptions = {
        auto_play: true,
        show_comments: false,
        show_artwork: false,
        visual: true
    }
    let widget = SC.Widget("sc-player");
    let next = null;

    widget.bind(SC.Widget.Events.READY, function () {
        widget.bind(SC.Widget.Events.ERROR, function () {
            console.error("SoundCloud Widget error");
        });

        widget.bind(SC.Widget.Events.FINISH, function () {
            if (next) widget.load(next, widgetOptions);
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

    this.setCurrentMix = async function (url, next) {
        const sanitizedUrl = sanitizeUrl(url);
        if (!isValidMixUrl(sanitizedUrl)) {
            console.error('Invalid SoundCloud URL:', url);
            return;
        }
        document.getElementById('sc-player-container').classList.remove('hidden');
        widget.load(sanitizedUrl, widgetOptions);
        this.next = next;
    }

    this.getState = function () { return state; }
}

const soundCloudManager = new SoundCloudManager();
window.setCurrentMix = soundCloudManager.setCurrentMix;
