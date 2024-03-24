/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { CreateTaskWithRequest, CreateTaskWithResolveResult, Task, TaskStatus } from '@gopeed/types';
import { Body, Controller, Delete, Get, Path, Post, Put, Query, Route, Security, SuccessResponse } from 'tsoa';

@Route('/api/v1/tasks')
export class UsersController extends Controller {
  /**
   * Create a download task, there has two ways to create a task:
   * 1. Create a task with resolved id, it depends on the result of /api/v1/resolve API
   * 2. Create a task directly with request
   * @summary Create a task
   */
  @Security('X-Api-Token')
  @Post()
  public async createTask(@Body() req: CreateTaskWithResolveResult | CreateTaskWithRequest): Promise<string> {
    return null as unknown as string;
  }

  /**
   * Get task info
   * @param id - Task id
   * @returns
   */
  @Security('X-Api-Token')
  @Get('{id}')
  public async getTask(@Path() id: string): Promise<Task> {
    return null as unknown as Task;
  }

  /**
   * Get task list
   * @summary Get task list
   * @param status - Filter by task status, can be multiple
   */
  @Security('X-Api-Token')
  @Get()
  public async getTasks(@Query() status: TaskStatus[] = []): Promise<Task[]> {
    return null as unknown as Task[];
  }

  /**
   * Pause a task
   * @summary Pause a task
   * @param id - Task id
   */
  @Security('X-Api-Token')
  @Put('{id}/pause')
  @SuccessResponse(200)
  public async pauseTask(@Path() id: string): Promise<void> {
    return null as unknown as void;
  }

  /**
   * Continue a task
   * @summary Continue a task
   * @param id - Task id
   */
  @Security('X-Api-Token')
  @Put('{id}/continue')
  @SuccessResponse(200)
  public async continueTask(@Path() id: string): Promise<void> {
    return null as unknown as void;
  }

  /**
   * Pause all tasks
   * @summary Pause all tasks
   */
  @Security('X-Api-Token')
  @Put('pause')
  @SuccessResponse(200)
  public async pauseAllTasks(): Promise<void> {
    return;
  }

  /**
   * Continue all tasks
   * @summary Continue all tasks
   */
  @Security('X-Api-Token')
  @Put('continue')
  @SuccessResponse(200)
  public async continueAllTasks(): Promise<void> {
    return;
  }

  /**
   * Delete a task
   * @summary Delete a task
   * @param id - Task id
   * @param force - Also delete files
   */
  @Security('X-Api-Token')
  @Delete('{id}')
  @SuccessResponse(200)
  public async deleteTask(@Path() id: string, @Query() force = false): Promise<void> {
    return;
  }

  /**
   * Delete tasks
   * @summary Delete tasks
   * @param status - Filter by task status, can be multiple
   * @param force - Also delete files
   */
  @Security('X-Api-Token')
  @Delete()
  @SuccessResponse(200)
  public async deleteTasks(@Query() status: TaskStatus[] = [], @Query() force = false): Promise<void> {
    return;
  }
}
