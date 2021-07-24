import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }
  getTaskById(id: string): Task {
    const task: Task[] = this.tasks.filter((data: Task) => {
      if (data.id === id) {
        return data;
      }
    });
    return task[0];
  }
  getTaskWithFilters(filterDto: GetTasksFilterDto): Task[]{
    let tasks = this.getAllTasks();
    const { status, search } = filterDto;
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    return tasks;
  }
  deleteTaskById(id: string): Task[] {
    this.tasks = this.tasks.filter((data: Task) => {
      if (data.id !== id) {
        return data;
      }
    });
    return this.tasks;
  }

  patchTaskById(id: string, status: TaskStatus): Task {
    let updatedTask: Task;
    this.tasks = this.tasks.filter((data: Task) => {
      if (data.id === id) {
        updatedTask = data;
        data.status = status;
      }
      return true;
    });
    return updatedTask;
  }
  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }
}
