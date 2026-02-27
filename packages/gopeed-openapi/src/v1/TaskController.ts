/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import {
  CreateTaskWithRequest,
  CreateTaskWithResolveResult,
  Task,
  TaskStatus,
  CreateTaskBatch,
  Result,
  TaskStats,
  PatchTask,
} from '@gopeed/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Put,
  Query,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

@Route('/api/v1/tasks')
@Tags('Tasks')
export class UsersController extends Controller {
  /**
   * Create a download task, there has two ways to create a task:
   * 1. Create a task with resolved id, it depends on the result of /api/v1/resolve API
   * 2. Create a task directly with request
   * @summary Create a task
   */
  @Security('X-Api-Token')
  @Post()
  public async createTask(@Body() req: CreateTaskWithResolveResult | CreateTaskWithRequest): Promise<Result<string>> {
    return null as unknown as Result<string>;
  }

  /**
   * Create a batch of download tasks
   * @summary Create a batch of tasks
   */
  @Security('X-Api-Token')
  @Post('/batch')
  public async createTaskBatch(@Body() req: CreateTaskBatch): Promise<Result<string[]>> {
    return null as unknown as Result<string[]>;
  }

  /**
   * Patch a task, modify the request or options of an existing task.
   * For HTTP protocol, it can modify request info (URL, headers, etc.).
   * For BT protocol, it can modify selectFiles.
   * @summary Patch a task
   * @param id - Task id
   */
  @Security('X-Api-Token')
  @Patch('{id}')
  @SuccessResponse(200)
  public async patchTask(@Path() id: string, @Body() req: PatchTask): Promise<Result<void>> {
    return null as unknown as Result<void>;
  }

  /**
   * Get a task info
   * @summary Get a task
   * @param id - Task id
   */
  @Security('X-Api-Token')
  @Get('{id}')
  public async getTask(@Path() id: string): Promise<Result<Task>> {
    return null as unknown as Result<Task>;
  }

  /**
   * Get task list
   * @summary Get task list
   * @param id - Task id, can be multiple
   * @param status - Filter by task status, can be multiple
   * @param notStatus - Filter by excluding task status, can be multiple
   */
  @Security('X-Api-Token')
  @Get()
  public async getTasks(
    @Query() id: string[] = [],
    @Query() status: TaskStatus[] = [],
    @Query() notStatus: TaskStatus[] = []
  ): Promise<Result<Task[]>> {
    return null as unknown as Result<Task[]>;
  }

  /**
   * Get task stats
   * @summary Get task stats
   * @param id - Task id
   */
  @Security('X-Api-Token')
  @Get('{id}/stats')
  public async stats(@Path() id: string): Promise<Result<TaskStats>> {
    return null as unknown as Result<TaskStats>;
  }

  /**
   * Pause a task
   * @summary Pause a task
   * @param id - Task id
   */
  @Security('X-Api-Token')
  @Put('{id}/pause')
  @SuccessResponse(200)
  public async pauseTask(@Path() id: string): Promise<Result<void>> {
    return null as unknown as Result<void>;
  }

  /**
   * Pause a batch of tasks
   * @summary Pause a batch of tasks
   * @param id - Task id, can be multiple
   * @param status - Filter by task status, can be multiple
   * @param notStatus - Filter by excluding task status, can be multiple
   */
  @Security('X-Api-Token')
  @Put('pause')
  @SuccessResponse(200)
  public async pauseTasks(
    @Query() id: string[] = [],
    @Query() status: TaskStatus[] = [],
    @Query() notStatus: TaskStatus[] = []
  ): Promise<Result<void>> {
    return null as unknown as Result<void>;
  }

  /**
   * Continue a task
   * @summary Continue a task
   * @param id - Task id
   */
  @Security('X-Api-Token')
  @Put('{id}/continue')
  @SuccessResponse(200)
  public async continueTask(@Path() id: string): Promise<Result<void>> {
    return null as unknown as Result<void>;
  }

  /**
   * Continue a batch of tasks
   * @summary Continue a batch of tasks
   * @param id - Task id, can be multiple
   * @param status - Filter by task status, can be multiple
   * @param notStatus - Filter by excluding task status, can be multiple
   */
  @Security('X-Api-Token')
  @Put('continue')
  @SuccessResponse(200)
  public async continueTasks(
    @Query() id: string[] = [],
    @Query() status: TaskStatus[] = [],
    @Query() notStatus: TaskStatus[] = []
  ): Promise<Result<void>> {
    return null as unknown as Result<void>;
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
  public async deleteTask(@Path() id: string, @Query() force = false): Promise<Result<void>> {
    return null as unknown as Result<void>;
  }

  /**
   * Delete tasks
   * @summary Delete tasks
   * @param id - Task id, can be multiple
   * @param status - Filter by task status, can be multiple
   * @param notStatus - Filter by excluding task status, can be multiple
   * @param force - Also delete files
   */
  @Security('X-Api-Token')
  @Delete()
  @SuccessResponse(200)
  public async deleteTasks(
    @Query() id: string[] = [],
    @Query() status: TaskStatus[] = [],
    @Query() notStatus: TaskStatus[] = [],
    @Query() force = false
  ): Promise<Result<void>> {
    return null as unknown as Result<void>;
  }
}
