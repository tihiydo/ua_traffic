

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import type { Task, TasksProgress } from '../types'
import { tasks } from '../tasks'

type State = {
    isOpened: boolean;
    activeTask: Maybe<Task>;
    isInitializing: boolean;
    tasksProgress: TasksProgress;
};

type Actions = {
    resetActiveTask: () => void
    selectTask: (id: string) => Maybe<Task>;
    setTaskProgress: (id: string, data: { isCompleted: boolean }) => void;
    openGuide: () => void;
    closeGuide: () => void;
}

const GUIDE_KEY = 'guide-data';

export const useGuideStore = create<State & Actions>()(immer(persist((set, get) => ({
    tasksProgress: {
        advertiser: [],
        catalog: [],
        blogger: [],
    },
    activeTask: null,
    isOpened: false,
    isInitializing: false,

    resetActiveTask: () => {
        set(() => ({
            activeTask: null
        }))
    },

    setTaskProgress: (taskId, data) => {
        const task = Object.values(tasks)
            .flat()
            .find((task) => {
                return task.id === taskId
            })


        if (!task) {
            throw new Error('Task doesn\'t exist')
        };

        const taskProgressIndex = get().tasksProgress[task.category]
            .findIndex(t => t.id === task.id)



        set((state: State) => {
            if (taskProgressIndex < 0) {
                state.tasksProgress[task.category].push({
                    completed: data.isCompleted,
                    id: task.id
                })
            } else {
                state.tasksProgress[task.category][taskProgressIndex]!.completed = data.isCompleted
            }
        })
    },

    selectTask: (selectId) => {
        const prevActiveTask = get().activeTask;

        const selectedTask = Object.values(tasks)
            .flat()
            .find(task => (
                task.id === selectId
            ))

        const newActiveTask = prevActiveTask?.id !== selectedTask?.id
            ? selectedTask
            : null

        set({
            activeTask: newActiveTask
        })

        return newActiveTask;
    },

    openGuide: () => {
        set(() => ({
            isOpened: true
        }))
    },
    closeGuide: () => {
        set(() => ({
            activeTask: null,
            isOpened: false
        }))
    }

}), {
    name: GUIDE_KEY,
    getStorage: () => localStorage
})))