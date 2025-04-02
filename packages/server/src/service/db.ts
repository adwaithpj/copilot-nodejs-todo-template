// Import Azure cosmos db and task model

import { CosmosClient } from "@azure/cosmos";
import { Task } from "../models/task";

// Create a DbService class to wrap the cosmos sdk with URI and key from an evironment variable
// Connecting to the 'todos' database and 'tasks' container
// and with CRUD methods for tasks
export class DbService {
  private client: CosmosClient;
  private databaseId: string = "todos";
  private containerId: string = "tasks";
  private container: any;

  private static instance: DbService;

  static getInstance(): DbService {
    if (!DbService.instance) {
      DbService.instance = new DbService();
    }
    return DbService.instance;
  }

  constructor() {
    const endpoint = process.env.COSMOS_DB_URI;
    const key = process.env.COSMOS_DB_KEY;



    if (!endpoint || !key) {
      throw new Error("COSMOS_DB_URI and COSMOS_DB_KEY must be set in environment variables");
    }


    this.client = new CosmosClient({ endpoint, key });
    this.container = this.client
      .database(this.databaseId)
      .container(this.containerId);
  }

  async createTask(task: Task): Promise<any | null> {
    const { resource } = await this.container.items.create(task);
    if (!resource) {
      return null;
    }
    return resource;
  }

  async getTask(id: string): Promise<Task> {
    const { resource } = await this.container.item(id, id).read();
    return resource as Task;

  }

  async updateTask(id: string, task: Partial<Task>): Promise<any | null> {
    const { resource } = await this.container.item(id, id).replace(task);
    if (!resource) {
      return null;
    }
    return resource;
  }

  async deleteTask(id: string): Promise<void> {
    await this.container.item(id, id).delete();
  }

  async getTasks(userId:string): Promise<Task[]> {
    const { resources } = await this.container.items
      .query({query:"SELECT * FROM c WHERE c.userId = @userId",
        parameters: [
          { name: "@userId", value: "userId" }
        ]
      }

      )
      .fetchAll();
    return resources as Task[];
  }
}

