const express = require("express");
const cors = require("cors");
const database = require("./database");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

function formatTask(task) {
    return {
        id: task.id,
        title: task.title,
        subject: task.subject,
        completed: Boolean(task.completed)
    };
}

app.get("/", function (request, response) {
    response.status(200).json({
        message: "StudySync API with SQLite is running"
    });
});

app.get("/tasks", function (request, response) {
    try {
        const statement = database.prepare(`
            SELECT id, title, subject, completed
            FROM tasks
            ORDER BY id DESC
        `);

        const tasks = statement.all().map(formatTask);

        response.status(200).json({
            message: "Tasks fetched successfully",
            tasks: tasks
        });
    } catch (error) {
        console.error(error);

        response.status(500).json({
            message: "Failed to fetch tasks"
        });
    }
});

app.get("/tasks/:id", function (request, response) {
    try {
        const taskId = Number(request.params.id);

        if (!Number.isInteger(taskId) || taskId <= 0) {
            return response.status(400).json({
                message: "Invalid task ID"
            });
        }

        const statement = database.prepare(`
            SELECT id, title, subject, completed
            FROM tasks
            WHERE id = ?
        `);

        const task = statement.get(taskId);

        if (!task) {
            return response.status(404).json({
                message: "Task not found"
            });
        }

        response.status(200).json({
            message: "Task fetched successfully",
            task: formatTask(task)
        });
    } catch (error) {
        console.error(error);

        response.status(500).json({
            message: "Failed to fetch task"
        });
    }
});

app.post("/tasks", function (request, response) {
    try {
        const title = request.body.title;
        const subject = request.body.subject;

        if (
            typeof title !== "string" ||
            title.trim() === ""
        ) {
            return response.status(400).json({
                message: "Task title is required"
            });
        }

        const cleanSubject =
            typeof subject === "string" &&
            subject.trim() !== ""
                ? subject.trim()
                : "General";

        const insertStatement = database.prepare(`
            INSERT INTO tasks (title, subject, completed)
            VALUES (?, ?, 0)
        `);

        const result = insertStatement.run(
            title.trim(),
            cleanSubject
        );

        const selectStatement = database.prepare(`
            SELECT id, title, subject, completed
            FROM tasks
            WHERE id = ?
        `);

        const newTask = selectStatement.get(
            Number(result.lastInsertRowid)
        );

        response.status(201).json({
            message: "Task created successfully",
            task: formatTask(newTask)
        });
    } catch (error) {
        console.error(error);

        response.status(500).json({
            message: "Failed to create task"
        });
    }
});

app.put("/tasks/:id", function (request, response) {
    try {
        const taskId = Number(request.params.id);

        if (!Number.isInteger(taskId) || taskId <= 0) {
            return response.status(400).json({
                message: "Invalid task ID"
            });
        }

        const selectStatement = database.prepare(`
            SELECT id, title, subject, completed
            FROM tasks
            WHERE id = ?
        `);

        const currentTask = selectStatement.get(taskId);

        if (!currentTask) {
            return response.status(404).json({
                message: "Task not found"
            });
        }

        let title = currentTask.title;
        let subject = currentTask.subject;
        let completed = currentTask.completed;

        if (request.body.title !== undefined) {
            if (
                typeof request.body.title !== "string" ||
                request.body.title.trim() === ""
            ) {
                return response.status(400).json({
                    message: "Task title cannot be empty"
                });
            }

            title = request.body.title.trim();
        }

        if (request.body.subject !== undefined) {
            if (
                typeof request.body.subject !== "string" ||
                request.body.subject.trim() === ""
            ) {
                return response.status(400).json({
                    message: "Subject cannot be empty"
                });
            }

            subject = request.body.subject.trim();
        }

        if (request.body.completed !== undefined) {
            if (
                typeof request.body.completed !== "boolean"
            ) {
                return response.status(400).json({
                    message: "Completed must be true or false"
                });
            }

            completed = request.body.completed ? 1 : 0;
        }

        const updateStatement = database.prepare(`
            UPDATE tasks
            SET title = ?, subject = ?, completed = ?
            WHERE id = ?
        `);

        updateStatement.run(
            title,
            subject,
            completed,
            taskId
        );

        const updatedTask = selectStatement.get(taskId);

        response.status(200).json({
            message: "Task updated successfully",
            task: formatTask(updatedTask)
        });
    } catch (error) {
        console.error(error);

        response.status(500).json({
            message: "Failed to update task"
        });
    }
});

app.delete("/tasks/:id", function (request, response) {
    try {
        const taskId = Number(request.params.id);

        if (!Number.isInteger(taskId) || taskId <= 0) {
            return response.status(400).json({
                message: "Invalid task ID"
            });
        }

        const selectStatement = database.prepare(`
            SELECT id, title, subject, completed
            FROM tasks
            WHERE id = ?
        `);

        const task = selectStatement.get(taskId);

        if (!task) {
            return response.status(404).json({
                message: "Task not found"
            });
        }

        const deleteStatement = database.prepare(`
            DELETE FROM tasks
            WHERE id = ?
        `);

        deleteStatement.run(taskId);

        response.status(200).json({
            message: "Task deleted successfully",
            task: formatTask(task)
        });
    } catch (error) {
        console.error(error);

        response.status(500).json({
            message: "Failed to delete task"
        });
    }
});

app.use(function (request, response) {
    response.status(404).json({
        message: "API route not found"
    });
});

app.listen(PORT, function () {
    console.log(
        `StudySync API is running at http://localhost:${PORT}`
    );
});