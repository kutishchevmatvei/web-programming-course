import { useState } from "react";
import type { Task, TrainingSet } from "./domain";

const trainingSet: TrainingSet = {
    id: "web-basics-demo",
    title: "Основы веб-программирования",
    tasks: [
        {
            id: "ts-1",
            kind: "single-choice",
            topic: "TypeScript",
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
            topic: "React",
            prompt: "Объясните, чем props компонента отличаются от его состояния.",
        },
    ],
};

type TaskListProps = {
    tasks: Task[];
    selectedTaskId: string;
    onChoose: (taskId: string) => void;
};

function TaskList({ tasks, selectedTaskId, onChoose }: TaskListProps) {
    if (tasks.length === 0) {
        return <p className="empty-list">В этом наборе пока нет заданий.</p>;
    }

    return (
        <nav className="task-list" aria-label="Задания набора">
            {tasks.map((task, index) => (
                <button
                    className={`task-button${task.id === selectedTaskId ? " is-selected" : ""}`}
                    key={task.id}
                    type="button"
                    aria-pressed={task.id === selectedTaskId}
                    onClick={() => onChoose(task.id)}
                >
                    <span className="task-number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="task-button-copy">
                        <span className="task-button-topic">{task.topic}</span>
                        <span className="task-button-title">{task.prompt}</span>
                    </span>
                    <span className="task-chevron" aria-hidden="true">→</span>
                </button>
            ))}
        </nav>
    );
}

type TaskCardProps = {
    task: Task;
};

function TaskCard({ task }: TaskCardProps) {
    return (
        <article className="task-card">
            <div className="task-card-meta">
                <span className="eyebrow">{task.topic}</span>
                <span className="kind-label">
                    {task.kind === "single-choice" ? "Выбор ответа" : "Короткий ответ"}
                </span>
            </div>

            <h2>{task.prompt}</h2>

            {task.code !== undefined && (
                <pre className="code-sample"><code>{task.code}</code></pre>
            )}

            {task.kind === "single-choice" ? (
                <ol className="options-list" aria-label="Варианты ответа">
                    {task.options.map((option) => (
                        <li className="option" key={option.id}>
                            <span className="option-marker" aria-hidden="true" />
                            <span>{option.label}</span>
                        </li>
                    ))}
                </ol>
            ) : (
                <p className="text-task-note">
                    Это задание предполагает текстовый ответ. Поле ввода появится в следующем этапе.
                </p>
            )}
        </article>
    );
}

export default function App() {
    const [selectedTaskId, setSelectedTaskId] = useState<string>(
        trainingSet.tasks[0]?.id ?? "",
    );
    const selectedTask = trainingSet.tasks.find((task) => task.id === selectedTaskId);

    return (
        <main className="app-shell">
            <header className="page-header">
                <a className="brand" href="#main" aria-label="Тренажёр — к содержимому">
                    <span className="brand-mark" aria-hidden="true">&lt;/&gt;</span>
                    <span>Тренажёр</span>
                </a>
                <span className="header-note">Практика веб-разработки</span>
            </header>

            <section className="intro" id="main" aria-labelledby="set-title">
                <div className="intro-copy">
                    <p className="eyebrow">Учебный набор</p>
                    <h1 id="set-title">{trainingSet.title}</h1>
                    <p className="intro-description">
                        Разберите задания в своём темпе. Выберите пункт слева, чтобы открыть его.
                    </p>
                </div>
                <div className="count-card" aria-label={`Заданий: ${trainingSet.tasks.length}`}>
                    <span className="count-value">{String(trainingSet.tasks.length).padStart(2, "0")}</span>
                    <span className="count-label">заданий</span>
                </div>
            </section>

            <div className="workspace">
                <section className="catalog-panel" aria-labelledby="catalog-title">
                    <div className="section-heading">
                        <h2 id="catalog-title">Содержание</h2>
                        <span>{trainingSet.tasks.length}</span>
                    </div>
                    <TaskList
                        tasks={trainingSet.tasks}
                        selectedTaskId={selectedTaskId}
                        onChoose={setSelectedTaskId}
                    />
                </section>

                <section className="detail-panel" aria-label="Текущее задание" aria-live="polite">
                    {selectedTask ? (
                        <TaskCard task={selectedTask} />
                    ) : (
                        <div className="empty-state">
                            <span className="empty-state-icon" aria-hidden="true">↖</span>
                            <h2>Задание не выбрано</h2>
                            <p>Выберите задание из списка, чтобы посмотреть подробности.</p>
                        </div>
                    )}
                </section>
            </div>

            <footer className="page-footer">
                <span>Обучение через практику</span>
                <span>Компоненты · props · state</span>
            </footer>
        </main>
    );
}
