var gAlp = gAlp || {};


gAlp.Observer = {

    subscribers: {any: []/*, special: []*/}, // event type: subscribers

    on: function (type, fn, context) {

        var pushIf = function (h, n) {
                h = h.filter(function (el) {
                    return el.fn !== n;
                });
                h.push({fn: n, context: context, type: type});
                subs[type] = h;//**1 h is A NEW array reASSIGN to subscribers (subs available to this function)
            },
            subs = this.subscribers;


        type = type || 'any';
        context = typeof context === "undefined" ? null : context || this;
        fn = typeof fn === 'function' ? fn : context ? context[fn] : undefined;

        //this line is what allows the attempt to Observe unavailable subscribers
        if (typeof fn === "undefined") {
            return this;
        }
        if (typeof subs[type] === "undefined") {
            subs[type] = [];
        }
        pushIf(subs[type], fn);
        return this;
    },


        remove: function (type, fn, context) {
    context = context || this;
    this.visitSubscribers('unsubscribe', type, fn, context);
    return this;
},

fire: function (type, data, bool) {
    this.visitSubscribers('Publish', type, data, null, bool);
    return this;
},

visitSubscribers: function (action, type, arg, context, bool) {

    var pubtype = type || 'any',
        subscribers = this.subscribers[pubtype],
        i, current,
        max = subscribers ? subscribers.length : 0;

    for (i = 0; i < max; i += 1) {
        current = subscribers[i];
        if (action === 'Publish') {
            current.fn.call(current.context, arg, current.type, bool);

        } else {
            if (current.fn === arg && current.context === context) {
                subscribers.splice(i, 1);
            }
        }
    }
}


};//gAlp.Observer


