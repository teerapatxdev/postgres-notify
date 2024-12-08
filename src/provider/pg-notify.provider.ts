import { Client } from 'pg';
import { WebSocketChannelName } from './enum/web-socket.enum';
import { UserNotifyPayload } from './interface/pg-notify.interface';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ExtendedSocket } from './interface/web-socket.interface';

@WebSocketGateway(3333, {
  cors: {
    origin: '*', // หรือระบุเฉพาะ Origin ที่คุณต้องการ
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  namespace: '/userNotify',
})
export class PostgresNotifyProvider implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private readonly pgClient: Client;

  constructor() {
    this.pgClient = new Client({
      user: process.env.PG_DB_USERNAME,
      host: process.env.PG_DB_HOST,
      database: process.env.PG_DB_NAME,
      password: process.env.PG_DB_PASSWORD,
      port: process.env.PG_DB_PORT,
    });

    this.connectDestination();
  }

  afterInit(server: Server) {
    this.server = server;
  }

  @SubscribeMessage('message')
  async handleHelloEvent(@MessageBody() payload: any) {
    this.server.emit('user_notify', payload);
  }

  private async connectDestination() {
    try {
      await this.pgClient.connect();
      await this.pgClient.query(
        `LISTEN ${WebSocketChannelName.USER_NOTIFY_CHANNEL}`,
      );

      this.pgClient.on('notification', async (msg: any) => {
        if (msg?.channel === WebSocketChannelName.USER_NOTIFY_CHANNEL) {
          const payload: UserNotifyPayload = JSON.parse(msg.payload);
          if (payload.operation === 'INSERT') {
            // console.log(payload);
            this.server.emit('INSERT', payload);
          }
          if (payload.operation === 'UPDATE') {
            // console.log(payload);
            this.server.emit('UPDATE', payload);
          }
          if (payload.operation === 'DELETE') {
            // console.log(payload);
            this.server.emit('DELETE', payload);
          }
        }
      });
    } catch (error) {
      console.error('Failed to connect to PostgreSQL', error);
    }
  }
}
