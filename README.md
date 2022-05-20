# Overview

This is a project from the Udacity course: Cloud Developer. Serverless application deployments, best practices for security and architecture
is being demonstrated. The project is a TODO list application with image upload for a task.  

## Backend

The backend is built to be deployed on AWS using APIGateway and Lambda functions. These functions are used to create, update, delete, and get
these todos. For image upload, signed urls are used and there is a separate endpoint to receive this signed url.

## Frontend

The frontend is under the client directory. It is built with React to be able to interact with the cloud.

## Deployment

Deployments are done using the Serverless framework. The goal is to have a secure and efficiently working deployment.