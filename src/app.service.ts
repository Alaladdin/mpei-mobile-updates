import { HttpException, Injectable } from '@nestjs/common';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import * as apkReader from 'adbkit-apkreader';
import { APK_NOT_FOUND_ERROR, DEFAULT_RELEASE_CHANNELS, RELEASE_CHANNELS, UNEXPECTED_ERROR } from './app.constants';
import { IApkApplication, IFileInfo, ReleaseChannel } from './app.interfaces';

@Injectable()
export class AppService {
    async getApkInfo(channel: ReleaseChannel): Promise<IApkApplication> {
        const apkFilePathByChannel = await this.getFileInfoByReleaseChannel(channel);

        if (apkFilePathByChannel) {
            return apkReader
                .open(apkFilePathByChannel.path)
                .then((reader) => reader.readManifest())
                .then(
                    (manifest): IApkApplication => ({
                        package: manifest.package,
                        version: manifest.versionName,
                    }),
                )
                .catch((e) => {
                    console.log(e);
                    throw new HttpException(UNEXPECTED_ERROR, 500);
                });
        }

        throw new HttpException(APK_NOT_FOUND_ERROR, 404);
    }

    async getDownloadInfo(channel: ReleaseChannel): Promise<IFileInfo> {
        const apkFileInfoByChannel = await this.getFileInfoByReleaseChannel(channel);

        if (apkFileInfoByChannel) {
            return apkFileInfoByChannel;
        }

        throw new HttpException(APK_NOT_FOUND_ERROR, 404);
    }

    private async getFileInfoByReleaseChannel(channel: ReleaseChannel): Promise<IFileInfo> {
        const apkFolderPath = path.join(process.cwd(), 'assets/apk');
        const apksFilesList = await fs.readdir(apkFolderPath);
        const releaseChannel = RELEASE_CHANNELS.includes(channel) ? channel : DEFAULT_RELEASE_CHANNELS;
        const apkFileNameByChannel = apksFilesList.find((path) => path.includes(releaseChannel));

        return {
            name: apkFileNameByChannel,
            path: path.join(apkFolderPath, apkFileNameByChannel),
        };
    }
}
