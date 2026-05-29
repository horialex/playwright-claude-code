export function hydrate<T extends object>(original: T, response: Partial<T>): T {
    return { ...original, ...response };
}

export function hydrateWith<T extends object, R>(
    original: T,
    response: R,
    mapper: (response: R) => Partial<T>
): T {
    return { ...original, ...mapper(response) };
}
