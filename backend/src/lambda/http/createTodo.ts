import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'
import { TodoItem } from '../../models/TodoItem'
import { UserInputError } from '../../utils/errors'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    let statusCode: number;
    let body: string;
    
    try {
      const userId = getUserId(event)
      const newTodoData: CreateTodoRequest = JSON.parse(event.body)

      const newTodo: TodoItem = await createTodo(userId, newTodoData)

      statusCode = 200;
      body = JSON.stringify({
        item: newTodo
      })
    } catch(e: any) {

      if(e instanceof UserInputError) {
        statusCode = 400;
        body = '';
      }
      else {
        statusCode = 500;
        body = '';
      }
    } finally {

      return {
        statusCode: statusCode,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: body
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
