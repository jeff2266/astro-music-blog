function SoundCloudManager() {
    // null if widget is not loaded
    let state = null;
    let widget = null;

    async function getWidget(url) {
        if (!isValidMixUrl(url)) {
            throw new Error('Invalid SoundCloud URL');
        }
        const urlObject = new URL('https://soundcloud.com/oembed');
        urlObject.searchParams.set("url", sanitizeUrl(url));
        urlObject.searchParams.set("auto_play", "true");
        urlObject.searchParams.set("maxheight", "166");

        const result = await fetch(urlObject.toString())
        const resp = await result.json()
        return resp.html
    }

    function bindEvents() {
        widget.bind(SC.Widget.Events.READY, function () {
            console.log("SoundCloud Widget is ready");
            state = "ready";
        });

        widget.bind(SC.Widget.Events.ERROR, function () {
            console.log("SoundCloud Widget is error");
            state = "error";
        });

        widget.bind(SC.Widget.Events.FINISH, function () {
            console.log("SoundCloud Widget is finished");
            state = "finished";
        });
    }

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
        // Check if widget exists
        if (state === null) {
            const c = document.getElementById("sc-player-container");
            if (c) {
                c.innerHTML = await getWidget(url);
                c.firstElementChild.id = "sc-player";
                widget = SC.Widget("sc-player");
                bindEvents();
            }
        } else {
            widget.load(sanitizeUrl(url), { auto_play: true });
        }
    }

    this.getState = function () { return state; }
}

const soundCloudManager = new SoundCloudManager();
window.setCurrentMix = soundCloudManager.setCurrentMix;
