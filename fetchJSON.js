function randomMultiple(min, max, n) {
    if (min < 0 || max < 0) return console.error("min or max is less than zero");
    if (n > (max - min) + 1) {
        return console.error("Count is greater than max possible");
    }

    var result = [];

    if (n <= max / 2 && max - n <= 1000) {
        while (result.length < n) {
            var rn = Math.floor(Math.random() * max - min + 1) + min;
            !result.includes(rn) && result.push(rn);
        }
    } else {
        for (let i = min; i <= max; i++) result.push(i);
        for (let i = 0; i < 100; i++) {
            var rn1 = Math.floor(Math.random() * result.length);
            var rn2 = Math.floor(Math.random() * result.length);
            [result[rn1], result[rn2]] = [result[rn2], result[rn1]];
        }
        while (result.length > n) {
            result.splice(Math.random() * result.length, 1);
        }
    }

    return result;
}

function filterResourcesByTag(tag, newest = false, count, random = false) {

    if (!resourceJSON || !qs(".categories-container")) {
        setTimeout(() => { filterResourcesByTag(tag) }, 100);
        return false;
    }

    const display = document.getElementById('event-container');

    var html = `<div class="filtered-event">
                    <img src="" class="filev-img" alt="temporary image">
                    <div class="caption"><a href="">Temporary Text</a></div>
                </div>`;
    var parser = new DOMParser();
    const filtered_event = parser.parseFromString(html, "text/html").querySelector(".filtered-event");

    const matching = [];

    for (let resource of resourceJSON) {
        if (resource.tags.includes(tag) || !tag) {
            matching.push(resource);
        }
    }

    if (matching.length == 0) {
        display.innerHTML = "<h2>No resources found matching this tag.</h2>";
        return false;
    }

    display.innerHTML = "";
    for (let i = 0; i < matching.length && i < (count || Infinity); i++) {
        display.appendChild(filtered_event.cloneNode(true));
    }

    var rev = matching.slice().reverse();
    var c = 0;

    if (!random) {
        if (!newest) {
            for (let i in matching) {
                display.querySelectorAll(".filtered-event .filev-img")[i].src = matching[i].image || "/tsa2026/img/placeholder.jpg";
                display.querySelectorAll(".filtered-event .caption a")[i].textContent = matching[i].name;
                display.querySelectorAll(".filtered-event .caption a")[i].href = "/tsa2026/resource/?id=" + i.toString().padStart(6, 0);
                c++;
                if (count && c >= count) {
                    return;
                }
            }
        } else {
            for (let i = count - 1 || rev.length - 1; i >= 0; i--) {
                display.querySelectorAll(".filtered-event .filev-img")[i].src = rev[i].image || "/tsa2026/img/placeholder.jpg";
                display.querySelectorAll(".filtered-event .caption a")[i].textContent = rev[i].name;
                display.querySelectorAll(".filtered-event .caption a")[i].href = "/tsa2026/resource/?id=" + i.toString().padStart(6, 0);
            }
        }
    } else {
        const random = randomMultiple(0, resourceJSON.length - 1, count || resourceJSON.length);
        for (let i in random) {
            display.querySelectorAll(".filtered-event .filev-img")[i].src = resourceJSON[random[i]].image || "/tsa2026/img/placeholder.jpg";
            display.querySelectorAll(".filtered-event .caption a")[i].textContent = resourceJSON[random[i]].name;
            display.querySelectorAll(".filtered-event .caption a")[i].href = "/tsa2026/resource/?id=" + i.toString().padStart(6, 0);
        }
    }
}

var resourceJSON;

(async () => {
    var json = await fetch("/tsa2026/resource/resources.json");
    if (!json.ok) return false;
    resourceJSON = await json.json();

    if (!window.location.href.includes("browse") && !window.location.href.includes("search")) {
        filterResourcesByTag(null, true, 4, true);
    }
    else if (window.location.href.includes("browse")) {
        filterResourcesByTag(null, true, null, true);
    }
})();