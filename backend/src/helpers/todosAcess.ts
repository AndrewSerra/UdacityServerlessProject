import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

// const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

export class TodosAccess {

    documentClient: AWS.DynamoDB.DocumentClient;
    todosTableName: string;
    todosTableIndex: string;

    constructor() {
        this.documentClient = new DocumentClient();
        this.todosTableName = process.env.TODOS_TABLE;
        this.todosTableIndex = process.env.TODOS_BY_USER_INDEX;
    }

    async getAllTodos(userId: string): (Promise<TodoItem[]> | null) {

        logger.info(`Searching in table ${this.todosTableName} for all items from user with id ${userId}`)
        
        try {
            const todos = await this.documentClient.query({
                TableName: this.todosTableName,
                IndexName: this.todosTableIndex,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            }).promise()
            
            logger.info(`User with id ${userId} has ${todos.Count} todo items.`)

            return todos.Items as TodoItem[];
        } catch(e: any) {
            logger.error(`Error fetching todos for user with id ${userId}: ${e.message}`)
            return null;
        }
    }

    async getTodo(userId: string, todoId: string): (Promise<TodoItem> | null) {

        logger.info(`Searching in table ${this.todosTableName} for item with id ${todoId} and user with id ${userId}.`)
        
        try {
            const todo = await this.documentClient.get({
                TableName: this.todosTableName,
                Key: {
                    todoId: todoId
                }
            }).promise()
            
            logger.info(`Found todo with id ${todo.Item.id} for user with id ${userId}.`)

            return todo.Item as TodoItem;

        } catch (e: any) {
            logger.error(`Error fetching todo with id ${todoId} for user ${userId}: ${e.message}`)
            return null;
        }
    }

    async createTodo(userId: string, data: TodoItem) {

        logger.info(`Adding new todo with name ${data.name} and id ${data.todoId} for user ${userId}`)

        try {
            await this.documentClient.put({
                TableName: this.todosTableName,
                Item: data
            }).promise()
        } catch (e: any) {
            logger.error(`Error adding new todo with name ${data.name} and id ${data.todoId} for user ${userId}: ${e.message}`)
        }
        return;
    }

    async updateTodo(todoId: string, data: TodoUpdate) {

        logger.info(`Updating todo with name ${data.name} and id ${todoId}`)

        try {

            await this.documentClient.update({
                TableName: this.todosTableName,
                Key: {
                    todoId: todoId
                },
                UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
                ExpressionAttributeNames: {
                    "#name": "name"
                },
                ExpressionAttributeValues: {
                    ":name": data.name,
                    ":dueDate": data.dueDate,
                    ":done": data.done
                }
            }).promise()

        } catch(e: any) {
            logger.error(`Error updating todo with name ${data.name} and id ${todoId}}: ${e.message}`)
        }
        return;
    }

    async deleteTodo(todoId: string) {

        logger.info(`Deleting todo with id ${todoId}`)

        try {
            await this.documentClient.delete({
                TableName: this.todosTableName,
                Key: {
                    todoId: todoId
                }
            }).promise()
        } catch(e: any) {
            logger.error(`Error deleting todo with id ${todoId}: ${e.message}`)
        }
        return;
    }

    async updateAttachmentUrl(todoId: string, newAttachmentUrl: string) {

        logger.info(`Updating attachment url for todo with id ${todoId} in table ${this.todosTableName}`)

        await this.documentClient.update({
            TableName: this.todosTableName,
            Key: {
                todoId: todoId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': newAttachmentUrl
            }
        }).promise()
    }
}