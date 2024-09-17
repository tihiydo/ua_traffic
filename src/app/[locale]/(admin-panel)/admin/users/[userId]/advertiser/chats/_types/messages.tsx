export type Conservations =
{
    id: string
    with: string,
    message: Message[]
}


export type Message =
{
    from: string,
    text: string,
    date: Date
}

export const ExampleMessage : Conservations[] = 
    [
        {
            id: '1',
            with: "Antonenko@gmail.com",
            message: [
                {
                    from: "test",
                    text: "test",
                    date: new Date()
                }
            ]
        },
        {
            id: '2',
            with: "test@gmail.com",
            message: [
                {
                    from: "me",
                    text: "test",
                    date: new Date()
                },
                {
                    from: "test@gmail.com",
                    text: "Памагите, прашууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууууу",
                    date: new Date()
                }
            ]
        },
    ]