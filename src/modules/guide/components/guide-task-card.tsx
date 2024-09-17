"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '@/trpc/react';
import Translate from '@/components/Translate';
import { useGuideStore } from '../hooks/use-guide-store';
import { type Task } from '../types';
import { useEffect } from 'react';
import SpinnerLoading from '@/components/ui/custom/spinner-loading';


type Props = {
    task: Task;
};

const GuideTaskCard = ({ task }: Props) => {
    const setTaskProgress = useGuideStore(state => state.setTaskProgress)
    const taskProgress = useGuideStore(state => (
        state.tasksProgress[task.category]
            .find(progressTask => progressTask.id === task.id)
    ))

    const checkTaskCompleted = api.guide.checkTaskCompleted.useMutation();

    useEffect(() => {
        // Task won't be checked if have been already completed
        if (taskProgress?.completed) return;

        checkTaskCompleted.mutate({ taskId: task.id }, {
            onSuccess: (isCompleted) => {
                setTaskProgress(task.id, { isCompleted })
            }
        })
    }, [taskProgress, task.id])

    return (
        <AccordionItem value={task.id} >
            <AccordionTrigger>
                <div className="flex w-full">
                    <div className="w-[15%] flex self-center place-content-center">
                        {
                            !taskProgress
                                ? (
                                    !checkTaskCompleted.isLoading
                                        ? (checkTaskCompleted.data
                                            ? <CheckCircle2 size="20px" strokeWidth={2.0} color="#5ba900" />
                                            : <AlertCircle size="20px" strokeWidth={2.0} color="#4a65ff" />)
                                        : (<SpinnerLoading className="h-[20px] w-[20px] rounded-full" />)
                                )
                                : (taskProgress.completed
                                    ? <CheckCircle2 size="20px" strokeWidth={2.0} color="#5ba900" />
                                    : <AlertCircle size="20px" strokeWidth={2.0} color="#4a65ff" />
                                )
                        }
                    </div>
                    <div className="w-[85%] text-left pr-3">
                        <Translate namespace='guidetasks' itemKey={task.title} />
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div>
                    <Translate namespace='guidetasks' itemKey={task.description} />
                </div>
            </AccordionContent>
        </AccordionItem>
    )


}

export default GuideTaskCard