export const getRandomArrayValue = <T>(array: T[]): T => (
    array[Math.floor(Math.random() * array.length)] as T
)

export function shuffleArray<T>(array: T[]): T[] {
    const shuffledArray = [...array];

    // Fisher-Yates (Knuth) shuffle algorithm
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements at positions i and j
        // @ts-ignore
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
}
