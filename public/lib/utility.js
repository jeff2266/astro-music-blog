function isValidMixUrl(url) {
    const urlObject = url ? new URL(url) : null;
    if (urlObject?.protocol !== 'https:') {
        console.error('Only HTTPS URLs are supported');
        return false;
    }
    if (urlObject?.hostname !== 'www.mixcloud.com' && urlObject?.hostname !== 'mixcloud.com') {
        console.error('Only Mixcloud URLs are supported');
        return false;
    }
    return true;
}

export default async function setCurrentMix(url) {
    // Check if widget exists
    const o = document.getElementById("mc-player")
    var needWidgetLoad = true;
    if (!o) {
        const c = document.getElementById("mc-player-container");
        if (c) {
            c.innerHTML = await getWidget(url);
            c.firstElementChild.id = "mc-player";
        }
    }

    if (!needWidgetLoad)
        return;
    const widget = Mixcloud.PlayerWidget(document.getElementById("mc-player"));
    widget.ready.then(() => widget.load(mixUrlToKey(url), true)
        .then()
        .catch((e) => console.error(`Mixcloud widget could not load ${url}`, e)));
}

function mixUrlToKey(url) {
    if (!isValidMixUrl(url)) {
        throw new Error('Invalid Mixcloud URL');
    }
    return new URL(url).pathname
}

async function getWidget(url) {
    if (!isValidMixUrl(url)) {
        throw new Error('Invalid Mixcloud URL');
    }
    const urlObject = new URL(url);
    urlObject.hostname = 'api.mixcloud.com';
    urlObject.pathname += 'embed-html';

    const result = await fetch(urlObject.toString())
    return await result.text()
}

const playButtons = document.querySelectorAll("[data-play-button]");
playButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const widget = Mixcloud.PlayerWidget(document.getElementById("mc-player"));
        widget?.ready.then(() => widget.play().then(() => console.log("Playing")).catch(e => console.error("Could not play", e)));
    })
});

document.getElementById("playBtn").addEventListener("click", () => {
    console.log("Play button clicked");
    var iframeElement = document.querySelector('iframe');
    var widget = SC.Widget(iframeElement);
    console.log("Widget obtained", widget);
    widget.play();
});

window.setCurrentMix = setCurrentMix;
