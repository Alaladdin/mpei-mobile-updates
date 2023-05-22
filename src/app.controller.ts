import { Controller, Get, Query, Res, StreamableFile } from '@nestjs/common';
import { AppService } from './app.service';
import { createReadStream } from 'fs';
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
        const file = createReadStream(downloadInfo.path);

        res.set({
            'Content-Type': 'application/vnd.android.package-archive',
            'Content-Disposition': `attachment; filename="${downloadInfo.name}"`,
        });

        return new StreamableFile(file);
    }
}
