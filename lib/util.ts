export function deepAssign(targetOrigin: any, ...rest: any[]) {
    for (const target of rest) {
        for (const key in target) {
            const value = target[key];
            const valueIsObject = typeof value === "object";
            if (targetOrigin.hasOwnProperty(key)) {
                const isSameType = typeof targetOrigin[key] === typeof value;
                if (isSameType && typeof value === "object" && !(value instanceof Array)) {
                    targetOrigin[key] = deepAssign(targetOrigin[key], value);
                } else {
                    targetOrigin[key] = value;
                }
            } else {
                targetOrigin[key] = valueIsObject ? JSON.parse(JSON.stringify(value)) : value;
            }
        }

    }
    return targetOrigin;
}
