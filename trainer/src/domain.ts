export type TaskOption = {
    id: string;
    label: string;
};

export type SingleChoiceTask = {
    id: string;
    kind: "single-choice";
    topic: string;
    prompt: string;
    code?: string;
    options: TaskOption[];
};

export type ShortTextTask = {
    id: string;
    kind: "short-text";
    topic: string;
    prompt: string;
    code?: string;
};

export type Task = SingleChoiceTask | ShortTextTask;

export type TrainingSet = {
    id: string;
    title: string;
    tasks: Task[];
};

export type SingleChoiceAnswer = {
    taskId: string;
    kind: "single-choice";
    optionId: string;
};

export type ShortTextAnswer = {
    taskId: string;
    kind: "short-text";
    text: string;
};

export type Answer = SingleChoiceAnswer | ShortTextAnswer;

export type Progress = {
    answered: number;
    total: number;
};

export function findTask(trainingSet: TrainingSet, id: string): Task | undefined {
    return trainingSet.tasks.find((task) => task.id === id);
}

export function filterTasksByTopic(trainingSet: TrainingSet, topic: string): Task[] {
    return trainingSet.tasks.filter((task) => task.topic.includes(topic));
}

export function isAnswered(answer: Answer | undefined): boolean {
    return answer !== undefined && (
        answer.kind === "single-choice" || answer.text.trim() !== ""
    );
}

export function calculateProgress(trainingSet: TrainingSet, answers: Answer[]): Progress {
    let answered = 0;

    for (const task of trainingSet.tasks) {
        const answer = answers.find((item) => item.taskId === task.id);

        if (isAnswered(answer)) {
            answered += 1;
        }
    }

    return {
        answered,
        total: trainingSet.tasks.length,
    };
}