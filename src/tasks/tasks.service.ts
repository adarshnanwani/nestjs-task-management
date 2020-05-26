import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';


@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) { }

  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    } else {
      return found;
    }
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTaskById(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`No task with id ${id}`);
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }
}


// export class TasksService {
  // private tasks: Task[] = [];

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;

  //   let tasks = this.getAllTasks();

  //   if (status) {
  //     tasks = tasks.filter(task => task.status === status)
  //   }

  //   if (search) {
  //     tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search))
  //   }

  //   return tasks;
  // }

  // getTaskById(id: string): Task {
  //   const task = this.tasks.find(task => task.id === id);

  //   if (!task) {
  //     throw new NotFoundException(`Task with ID ${id} not found`);
  //   } else {
  //     return task;
  //   }
  // }

  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;

  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN
  //   };

  //   this.tasks.push(task);
  //   return task;
  // }

  // deleteTaskById(id: string): void {
  //   const task = this.tasks.find(task => task.id === id);
  //   if (!task) {
  //     throw new NotFoundException(`Task with ID ${id} not found`);
  //   } else {
  //     this.tasks = this.tasks.filter(task => task.id !== id)
  //   }
  // }

  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //   const task = this.tasks.find(task => task.id === id);
  //   if (!task) {
  //     throw new NotFoundException(`Task with ID ${id} not found`);
  //   } else {
  //     task.status = status;
  //     return task;
  //   }
  // }
// }
