export default function extensions() {
    Map.prototype['toJSON'] = function(key: number) {
        const obj = {};
        for (let [key, value] of this) {
            obj[key] = value;
        }

        return obj;
    };

    Object.prototype['isEmpty'] = function() {
        return Object.keys(this).length === 0 && this.constructor === Object;
    };

    Object.prototype['count'] = function() {
        return Object.keys(this).length;
    };
}
