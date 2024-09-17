export type TaskCategory = "blogger" | "advertiser" | "catalog";

export type Task = {
    id: string;
    title: string;
    description: string;
    tooltipText: string;
    category: TaskCategory;
    checked: boolean;
}


export type TaskProgress = {
    id: string;
    completed: boolean;
}

export type TasksProgress = Record<TaskCategory, Array<TaskProgress>>