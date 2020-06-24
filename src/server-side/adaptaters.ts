import { GetContentFromFiles } from '../domain';

export const getGetContentFromMarkdownFile: GetContentFromFiles = () => Promise.resolve([['foo'], 'foo']);
