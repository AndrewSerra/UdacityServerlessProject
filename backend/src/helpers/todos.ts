import { TodosAccess } from './todosAcess'
import { TodoStorage } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const logger = createLogger('todos')

const todoAccess = new TodosAccess()
const todoStorage = new TodoStorage()

export async function createTodo(userId: string, data: CreateTodoRequest): Promise<TodoItem> {
    const id = uuid.v4()
    const createDate = new Date().toISOString()

    const newTodo: TodoItem = {
        todoId: id,
        userId: userId,
        createdAt: createDate,
        done: false,
        attachmentUrl: null,
        ...data,
    }

    await todoAccess.createTodo(userId, newTodo);
    return newTodo;
}

export async function updateTodo(userId: string, todoId: string, data: UpdateTodoRequest) {
    
    const targetTodo: TodoItem = await todoAccess.getTodo(userId, todoId)

    if(targetTodo === null) {
        logger.error(`Cannot find todo with id ${todoId} during update.`)
        return;
    }

    await todoAccess.updateTodo(todoId, data);
    return;
}

export async function deleteTodo(userId: string, todoId: string) {

    const targetTodo: TodoItem = await todoAccess.getTodo(userId, todoId)

    if(targetTodo === null) {
        logger.error(`Cannot find todo with id ${todoId} during delete.`)
        return;
    }

    await todoAccess.deleteTodo(todoId);
    return;
}

export async function getTodo(userId: string, todoId: string): Promise<TodoItem | null> {
    
    const targetTodo: TodoItem = await todoAccess.getTodo(userId, todoId)

    if(targetTodo === null) {
        logger.error(`Cannot find todo with id ${todoId} during update.`)
        return null;
    }

    return targetTodo;
}

export async function getAllTodos(userId: string): Promise<TodoItem[]> {

    return await todoAccess.getAllTodos(userId);
}

export async function updateAttachmentUrl(userId: string, todoId: string, attachmentId: string) {

    logger.info(`Updating attachment url for user with id ${userId}, 
        todo with id ${todoId}, and attachment id ${attachmentId}`)

    const attachmentUrl = await todoStorage.getAttachmentUrl(attachmentId)

    const item: TodoItem = await todoAccess.getTodo(userId, todoId)

    if(item === null) {
        logger.error(`Cannot find todo with id ${todoId} during attachment update.`)
        return null;
    }

    await todoAccess.updateAttachmentUrl(todoId,  attachmentUrl)
}

export async function generateSignedUploadUrl(attachmentId: string): Promise<string> {

    logger.info(`Generating signed url for uploading attachment with id ${attachmentId}`)

    const uploadUrl = await todoStorage.getSignedUploadUrl(attachmentId)

    return uploadUrl;
}