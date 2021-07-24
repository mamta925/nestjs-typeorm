import { Injectable, NotFoundException } from '@nestjs/common';
import {TaskStatus } from './task.status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './dto/task.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}
  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }
  async getTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ id });
    if (!task) {
      throw new NotFoundException(`Task not found :  ${id}`);
    }
    return task;
  }
  async deleteTaskById(id: string): Promise<DeleteResult> {
    const deletedTask = await this.tasksRepository.delete({ id });
    if (!deletedTask.affected) {
      throw new NotFoundException(`Task not found :  ${id}`);
    }
    return deletedTask;
  }

  patchTaskById(id: string, status: TaskStatus): Promise<UpdateResult> {
    return this.tasksRepository.update(id, { status });
  }
  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }
}
