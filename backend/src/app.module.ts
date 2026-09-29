import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { OwnerApplicationModule } from './owner-application/owner-application.module';
import { WorkspaceModule } from './workspaces/workspace.module';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    expandVariables: true
  }),AuthModule, OwnerApplicationModule, WorkspaceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
