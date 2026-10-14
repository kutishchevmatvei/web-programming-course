import {
    calculateProgress,
    filterTasksByTopic,
    findTask,
    type Answer,
    type TrainingSet,
} from "./domain.js";

const trainingSet: TrainingSet = {
    id: "web-basics-demo",
    title: "Основы веб-программирования",
    tasks: [
        {
            id: "ts-1",
            kind: "single-choice",
            topic: "typescript",
            prompt: "Что выведет этот JavaScript-код?",
            code: 'console.log("10" * 5);',
            options: [
                { id: "a", label: "105" },
                { id: "b", label: "50" },
                { id: "c", label: "Ошибка" },
            ],
        },
        {
            id: "react-1",
            kind: "short-text",
            topic: "react",
            prompt: "Объясните, чем props компонента отличаются от его состояния.",
        },
    ],
};

const answers: Answer[] = [
    { taskId: "ts-1", kind: "single-choice", optionId: "b" },
];

const completedAnswers: Answer[] = [
    ...answers,
    {
        taskId: "react-1",
        kind: "short-text",
        text: "Props передаются компоненту, а состояние хранится внутри него.",
    },
];

const answersWithUnknownTask: Answer[] = [
    ...completedAnswers,
    { taskId: "unknown-task", kind: "short-text", text: "Этот ответ не учитывается." },
];

const otherSet: TrainingSet = {
    id: "css-basics-demo",
    title: "Основы CSS",
    tasks: [
        {
            id: "css-1",
            kind: "short-text",
            topic: "css",
            prompt: "Для чего используется CSS?",
        },
    ],
};

const emptySet: TrainingSet = {
    id: "empty-demo",
    title: "Пустой набор",
    tasks: [],
};

function verify(condition: boolean, message: string): void {
    if (!condition) {
        throw new Error(`Проверка не пройдена: ${message}`);
    }
}

const setBeforeCalls = JSON.stringify(trainingSet);
const answersBeforeCalls = JSON.stringify(answers);

verify(findTask(trainingSet, "ts-1")?.id === "ts-1", "поиск существующего задания");
verify(findTask(trainingSet, "missing") === undefined, "поиск отсутствующего задания");
verify(findTask(emptySet, "ts-1") === undefined, "поиск в пустом наборе");
verify(
    filterTasksByTopic(trainingSet, "type").length === 1,
    "фильтр находит тему по части строки",
);
verify(filterTasksByTopic(trainingSet, "unknown").length === 0, "фильтр без совпадений");
verify(filterTasksByTopic(emptySet, "css").length === 0, "фильтр пустого набора");
verify(filterTasksByTopic(otherSet, "css")[0]?.id === "css-1", "работа со вторым набором");

const noAnswersProgress = calculateProgress(trainingSet, []);
const oneAnswerProgress = calculateProgress(trainingSet, answers);
const fullProgress = calculateProgress(trainingSet, completedAnswers);
const unknownTaskProgress = calculateProgress(trainingSet, answersWithUnknownTask);
const emptyProgress = calculateProgress(emptySet, []);
const differentTaskProgress = calculateProgress(
    { ...trainingSet, tasks: [trainingSet.tasks[1]!] },
    answers,
);
const whitespaceProgress = calculateProgress(
    { ...trainingSet, tasks: [trainingSet.tasks[1]!] },
    [{ taskId: "react-1", kind: "short-text", text: "   " }],
);

verify(
    noAnswersProgress.answered === 0 && noAnswersProgress.total === 2,
    "прогресс без ответов",
);
verify(
    oneAnswerProgress.answered === 1 && oneAnswerProgress.total === 2,
    "прогресс с одним ответом",
);
verify(
    fullProgress.answered === 2 && fullProgress.total === 2,
    "прогресс с полным набором ответов",
);
verify(
    unknownTaskProgress.answered === 2,
    "ответ для неизвестного задания не влияет на прогресс",
);
verify(
    differentTaskProgress.answered === 0 && differentTaskProgress.total === 1,
    "ответ на другое задание не засчитывается для текущего задания",
);
verify(
    emptyProgress.answered === 0 && emptyProgress.total === 0,
    "прогресс пустого набора",
);
verify(whitespaceProgress.answered === 0, "строка из пробелов не считается ответом");
verify(JSON.stringify(trainingSet) === setBeforeCalls, "исходный набор не изменился");
verify(JSON.stringify(answers) === answersBeforeCalls, "исходный массив ответов не изменился");

console.log("Задание ts-1:", findTask(trainingSet, "ts-1"));
console.log("Задания по теме typescript:", filterTasksByTopic(trainingSet, "typescript"));
console.log("Прогресс с одним ответом:", oneAnswerProgress);
console.log("Прогресс с полным набором ответов:", fullProgress);
console.log("Прогресс пустого набора:", emptyProgress);
console.log("Все проверки A1 пройдены.");