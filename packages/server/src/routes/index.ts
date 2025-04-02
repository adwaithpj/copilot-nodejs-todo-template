import express from 'express';
import { Task } from '../models/task';
import { DbService } from '../service/db';

const router = express.Router();

router.get('/', async function(req, res) {
  res.json({ message: 'server up' });
});

router.get('/users/:userId/tasks', async function(req, res) {
  try {
    const { userId } = req.params;

    // TODO: get tasks from database
    const tasks: Task[] = await DbService.getInstance().getTasks(userId);

    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Internal server error' });
  }
});

router.post('/users/:userId/tasks', async function(req, res) {
  try {
    const { userId } = req.params;
    const task = {
      ...req.body,
      userId,
      completed: false
    };

    // TODO: create task in database
    await DbService.getInstance().createTask(task);

    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Internal server error' });
  }
});

router.get('/tasks/:taskId', async function(req, res) {
  try {
    const { taskId } = req.params;

    // TODO: get task from database
    const task = await DbService.getInstance().getTask(taskId);

    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Internal server error' });
  }
});

router.patch('/tasks/:taskId', async function(req, res) {
  try {
    const { taskId } = req.params;

    // TODO: get existing task in database
    const task = await DbService.getInstance().getTask(taskId);
    task.completed = Boolean(req.body?.completed);

    // TODO: update task in database
    const updatedTask = await DbService.getInstance().updateTask(taskId, task);

    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Internal server error' });
  }
});

router.delete('/tasks/:taskId', async function(req, res) {
  try {
    const { taskId } = req.params;

    // TODO: delete task in database
    await DbService.getInstance().deleteTask(taskId);

    res.sendStatus(204);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Internal server error' });
  }
});

export default router;

