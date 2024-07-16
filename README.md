# Serverless Employee Management System

A serverless Employee Management System (EMS) built using AWS Lambda, API Gateway, AWS S3, MongoDB Atlas, and AWS Cognito for authentication and authorization. This project demonstrates how to create, read, update, and delete employee records in a serverless architecture with secure access control.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Setup and Installation](#setup-and-installation)
- [Endpoints](#endpoints)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- Employee CRUD operations (Create, Read, Update, Delete)
- User authentication and authorization using AWS Cognito
- Image upload and storage using AWS S3
- Serverless deployment with AWS Lambda and API Gateway
- MongoDB Atlas for database management

## Architecture

1. **Frontend**: A simple frontend to interact with the API (not included in this repo).
2. **Backend**: Serverless functions deployed on AWS Lambda.
3. **Authentication**: Managed by AWS Cognito.
4. **Database**: MongoDB Atlas.
5. **File Storage**: AWS S3 for storing employee images.

## Setup and Installation

### Prerequisites

- Node.js v20.x
- AWS CLI configured with your credentials
- Serverless Framework installed globally (`npm install -g serverless`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/serverless-ems.git
   cd serverless-ems
