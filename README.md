
# Matrix ChatApp

Introducing my sleek, scalable chat app—built for simplicity and speed. Users can sign up, log in, and start chatting instantly. With core features and fast performance, it scales effortlessly as your community grows. Perfect for friends or work, messaging stays easy and efficient.## Features

- **Fast and Secure Chat System**: Implements robust security measures for a seamless chat experience.
- **Highly Scalable Architecture**: Designed to handle high user demand efficiently with scalable solutions.
- **Socket.io with Redis**: Utilizes Redis for scaling Socket.io, enabling efficient real-time communication.
- **Kafka for Fast Data Handling**: Incorporates Kafka to manage and process high-speed data streams effectively.
- **Real-Time Group Chat**: Offers real-time group chat functionality with optimized performance.
- **Attachment Sending of Any Size**: Supports sending attachments of any size using AWS S3 for reliable storage.
- **Cloud-Based Infrastructure**: Built on a cloud infrastructure to ensure flexibility, reliability, and growth.
- **Unlimited Chat Rooms and Storage**: Provides unlimited chat rooms and storage capacity for users.
- **Minimalist User Interface**: Focuses on a clean and user-friendly design to enhance user experience.
## Badges

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/GPL-3.0)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

This project is open source and available under multiple licenses. Feel free to use it under the terms of the MIT, GPLv3, or AGPL licenses.

## Developer

- [@pranishpaudel](https://github.com/pranishpaudel/) ( Solo Project )


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

#### In Backend folder (Chat Server)

```env
DATABASE_URL=""          # URL of the PostgreSQL server
REDIS_CONNECTION_URL=""  # URL of the Redis server

KAFKA_BROKER_URL=""      # URL of the Kafka broker(s) for message streaming
KAFKA_SASL_USERNAME=""   # SASL username for Kafka authentication
KAFKA_SASL_PASSWORD=""   # SASL password for Kafka authentication
```


#### In Frontend folder (NextJS)

```env
DATABASE_URL=""          # Connection string for the database (PostgreSQL)
JWT_SECRET=""            # Secret key used for signing JSON Web Tokens (JWT)
S3AWS_REGION_ID=""       # AWS region identifier for S3 services (e.g., us-east-1)
S3AWS_BUCKET_NAME=""     # Name of the AWS S3 bucket for storing files
S3AWS_ACCESS_KEY=""      # AWS access key ID for authenticating S3 requests
S3AWS_ACCESS_SECRET=""   # AWS secret access key for authenticating S3 requests
REDIS_URL=""             # Connection string for the Redis server (CAN USE AIVEN TO GET IT)
CHATSERVER_URL=""        # URL of the chat server (related to the chatServer project)
```


## Deployment

#### Backend (Chat Server)

To deploy this project first lets deploy the backend server

```bash
  1) Insert the necessary environment variables for backend server listed above
  2) Replace dummy ca.pem in authCert directory within backend folder to your kafka's ca.pem
  3) Build the server => npm run build
  4) Run the server => npm start
```


#### Frontend (NextJS)

To deploy this project first lets deploy the backend server

```bash
  1) Insert the necessary environment variables for frontend server listed above
  2) Build the server => npm run build
  3) Run the server => npm start
```

## Demo

![chatapp](https://github.com/user-attachments/assets/abcdac7b-82f6-414b-8821-ea122d3cd831)
