import { type z } from "zod";

// This validator removes fields with an error
// It ignores fields that are not in schema
export const excludingValidator = <T extends z.ZodSchema>(schema: T) => (data: z.infer<T>) => {
    const response = schema.safeParse(data);

    if (response.success === false) {
        const errorPaths = response.error.issues.map((issue) => issue.path);

        let filteredData = data;
        errorPaths.forEach(
            (error) => (filteredData = filterByPath(filteredData, error))
        );

        return filteredData;
    }

    return data;
};

// if error happened => set undefined instead of that data
function filterByPath(filteredData: object, error: (string | number)[]): object {
    const dataCopy = {...filteredData}
    const errorKey = error[0];

    // Delete property with error
    // @ts-ignore
    dataCopy[errorKey] = undefined

    return dataCopy;
}