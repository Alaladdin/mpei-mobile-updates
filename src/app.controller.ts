import { Controller, Get, Query, Res, StreamableFile } from '@nestjs/common';
import { AppService } from './app.service';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import type { Response } from 'express';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('check')
    async getApkInfo(@Query('channel') channel) {
        return this.appService.getApkInfo(channel);
    }

    @Get('download')
    async downloadApk(@Res({ passthrough: true }) res: Response, @Query('channel') channel) {
        const downloadInfo = await this.appService.getDownloadInfo(channel);
        const fileStat = await stat(downloadInfo.path);
        const fileStream = createReadStream(downloadInfo.path);

        return new StreamableFile(fileStream, {
            type: 'application/vnd.android.package-archive',
            disposition: `attachment; filename="${downloadInfo.name}"`,
            length: fileStat.size,
        });
    }
}
