import { RELEASE_CHANNELS } from './app.constants';

export interface IApkApplication {
    version: string;
    package: string;
}

export interface IFileInfo {
    name: string;
    path: string;
}

export type ReleaseChannel = (typeof RELEASE_CHANNELS)[number];
