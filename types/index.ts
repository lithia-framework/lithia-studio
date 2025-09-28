export type Route = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  path: string;
  dynamic: boolean;
  filePath: string;
  sourceFilePath?: string;
  regex: string;
};
