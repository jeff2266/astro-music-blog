import { useEffect, useState } from "preact/hooks";

export default function Player() {

    const [url, setUrl] = useState<string | null>(typeof window !== 'undefined' ? localStorage.getItem("current") : null);;
    const [embedHtml, setEmbedHtml] = useState<string | null>(null);

    useEffect(() => {
        const handleStorage = (ev: StorageEvent) => ev.key === "current" && setUrl(ev.newValue);
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    useEffect(() => {
        const urlObject = url ? new URL(url) : null;
        if (urlObject?.protocol !== 'https:') {
            console.error('Only HTTPS URLs are supported');
            return (() => setEmbedHtml(null));
        }
        if (urlObject?.hostname !== 'www.mixcloud.com' && urlObject?.hostname !== 'mixcloud.com') {
            console.error('Only Mixcloud URLs are supported');
            return (() => setEmbedHtml(null));
        }

        urlObject.hostname = 'api.mixcloud.com';
        urlObject.pathname += 'embed-html';

        console.log(`Fetching embed HTML from: ${urlObject.toString()}`);
        fetch(urlObject.toString())
            .then(async (resp) => {
                if (!resp.ok) {
                    console.error(`Failed to fetch embed HTML: ${resp.statusText}`);
                    return (() => setEmbedHtml(null));
                }
                setEmbedHtml(await resp.text());
            }).catch((e) => {
                console.error(`Error fetching embed HTML: ${e}`);
                return (() => setEmbedHtml(null));
            });
    }, [url]);


    return (
        embedHtml
            ? <div dangerouslySetInnerHTML={{ __html: embedHtml }} />
            : <div className="h-[120px] min-w-full border"></div>
    )
}
