'use client';

import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { LithiaContext } from '@/components/contexts/LithiaContext';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { CodeEditor } from '@/components/ui/CodeEditor';
import { LoadingDialog } from '@/components/ui/dialogs';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface RouteForm {
  path: string;
  method:
    | 'None'
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'PATCH'
    | 'HEAD'
    | 'OPTIONS';
}

const HTTP_METHODS = [
  { value: 'None', label: 'None (All Methods)' },
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' },
  { value: 'PATCH', label: 'PATCH' },
  { value: 'HEAD', label: 'HEAD' },
  { value: 'OPTIONS', label: 'OPTIONS' },
];

const DEFAULT_ROUTE_CODE = `import type { LithiaRequest, LithiaResponse } from 'lithia';

export default async function handler(
  req: LithiaRequest,
  res: LithiaResponse
) {
  // Your route logic here
  res.send('Hello from your new route!');
}`;

export default function NewRoutePage() {
  const router = useRouter();
  const { io } = useContext(LithiaContext);
  const [routeCode, setRouteCode] = useState(DEFAULT_ROUTE_CODE);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RouteForm>({
    defaultValues: {
      path: '',
      method: 'None',
    },
  });

  const watchedPath = watch('path');
  const watchedMethod = watch('method');

  useEffect(() => {
    const validateConflicts = async () => {
      if (!watchedPath || !io.isConnected) {
        setConflicts([]);
        return;
      }

      try {
        io.socket?.emit('validate-route-conflicts', {
          path: watchedPath,
          method: watchedMethod,
        });
      } catch (error) {
        console.error('Error validating conflicts:', error);
      }
    };

    const timeoutId = setTimeout(validateConflicts, 300);
    return () => clearTimeout(timeoutId);
  }, [watchedPath, watchedMethod, io]);

  useEffect(() => {
    const handleConflictsValidated = (data: {
      hasConflicts: boolean;
      conflicts: string[];
    }) => {
      setConflicts(data.conflicts);
    };

    const handleValidationError = (error: string) => {
      console.error('Route validation error:', error);
      setConflicts([]);
    };

    io.socket?.on('route-conflicts-validated', handleConflictsValidated);
    io.socket?.on('route-validation-error', handleValidationError);

    return () => {
      io.socket?.off('route-conflicts-validated', handleConflictsValidated);
      io.socket?.off('route-validation-error', handleValidationError);
    };
  }, [io]);

  const onSubmit = async (data: RouteForm) => {
    if (!io.socket || !io.isConnected) {
      toast.error('Not connected to Lithia server');
      return;
    }

    // Validate conflicts immediately before creating route
    try {
      const validationResult = await new Promise<{
        hasConflicts: boolean;
        conflicts: string[];
      }>((resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error('Validation timeout')),
          5000,
        );

        io.socket?.emit('validate-route-conflicts', {
          path: data.path,
          method: data.method,
        });

        const handleValidation = (result: {
          hasConflicts: boolean;
          conflicts: string[];
        }) => {
          clearTimeout(timeout);
          io.socket?.off('route-conflicts-validated', handleValidation);
          io.socket?.off('route-validation-error', handleError);
          resolve(result);
        };

        const handleError = (error: string) => {
          clearTimeout(timeout);
          io.socket?.off('route-conflicts-validated', handleValidation);
          io.socket?.off('route-validation-error', handleError);
          reject(new Error(error));
        };

        io.socket?.on('route-conflicts-validated', handleValidation);
        io.socket?.on('route-validation-error', handleError);
      });

      if (validationResult.hasConflicts) {
        toast.error(
          `Route conflicts detected: ${validationResult.conflicts.join(', ')}`,
        );
        return;
      }
    } catch {
      toast.error('Failed to validate route conflicts');
      return;
    }

    setShowLoadingDialog(true);

    try {
      const fileName = generateFileName();
      const filePath = `src/routes/${fileName}`;

      io.socket.emit('create-route', {
        path: data.path,
        method: data.method === 'None' ? undefined : data.method,
        fileName,
        filePath,
        code: routeCode,
      });

      // Promise que resolve quando a rota é criada
      const createPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout creating route'));
        }, 10000);

        io.socket!.on(
          'route-created',
          (response: { success: boolean; error?: string }) => {
            clearTimeout(timeout);
            if (response.success) {
              toast.success('Route created successfully!');
              resolve();
            } else {
              reject(new Error(response.error || 'Failed to create route'));
            }
          },
        );

        io.socket!.on('route-create-error', (error: string) => {
          clearTimeout(timeout);
          reject(new Error(error));
        });
      });

      // Promise que garante mínimo de 800ms de loading para feedback visual
      const minLoadingPromise = new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 800);
      });

      // Aguarda tanto a criação quanto o tempo mínimo
      await Promise.all([createPromise, minLoadingPromise]);

      setShowLoadingDialog(false);
      router.push('/routes');
    } catch (error) {
      console.error('Error creating route:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to create route',
      );
      setShowLoadingDialog(false);
    }
  };

  const generateFileName = () => {
    if (!watchedPath) return '';

    const cleanPath = watchedPath.replace(/^\//, '').replace(/\/$/, '');

    if (cleanPath === '') {
      const methodSuffix =
        watchedMethod === 'None' ? '' : `.${watchedMethod.toLowerCase()}`;
      return `route${methodSuffix}.ts`;
    }

    const pathParts = cleanPath.split('/');

    if (cleanPath.includes(':')) {
      const folderStructure = pathParts.map((part) =>
        part.startsWith(':') ? `[${part.substring(1)}]` : part,
      );

      const methodSuffix =
        watchedMethod === 'None' ? '' : `.${watchedMethod.toLowerCase()}`;

      return `${folderStructure.join('/')}/route${methodSuffix}.ts`;
    } else {
      // Static route: create folder structure with route.ts
      const methodSuffix =
        watchedMethod === 'None' ? '' : `.${watchedMethod.toLowerCase()}`;

      return `${cleanPath}/route${methodSuffix}.ts`;
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-white/10 p-8 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div>
            <BackButton href="/routes">Back to Routes</BackButton>
            <h1 className="text-foreground text-3xl font-bold">
              Route Builder
            </h1>
            <p className="text-gray-400">Set up a new API route</p>
          </div>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={showLoadingDialog || !watchedPath || !io.isConnected}
            variant="primary"
            size="sm"
          >
            <Save className="h-4 w-4" />
            <span>{showLoadingDialog ? 'Creating...' : 'Create Route'}</span>
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Route Configuration Panel */}
        <div className="w-1/3 overflow-y-auto border-r border-white/10">
          <div className="p-6">
            <h2 className="text-foreground mb-4 text-xl font-semibold">
              Route Configuration
            </h2>

            <form className="space-y-4">
              <div>
                <Input
                  {...register('path', {
                    required: 'Route path is required',
                    pattern: {
                      value: /^\/[a-zA-Z0-9/:_-]*$/,
                      message:
                        'Path must start with / and contain only letters, numbers, /, :, -, and _',
                    },
                  })}
                  label="Route Path"
                  placeholder="/users or /users/:id"
                  className="w-full"
                />
                {errors.path && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.path.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  Use :param for dynamic parameters (e.g., /users/:id)
                </p>
              </div>

              <div>
                <Select
                  value={watchedMethod}
                  onChange={(value) =>
                    setValue('method', value as RouteForm['method'])
                  }
                  options={HTTP_METHODS}
                  label="HTTP Method"
                  className="w-full"
                />
              </div>

              <div className="bg-background-secondary rounded-lg border border-white/10 p-4">
                <h3 className="text-foreground mb-2 text-sm font-medium">
                  Generated File
                </h3>
                <code className="text-sm text-green-400">
                  {generateFileName() || 'Enter a route path to see filename'}
                </code>
                <p className="mt-1 text-xs text-gray-400">
                  This file will be created in your src/routes directory using
                  the standardized route.ts naming convention
                </p>
              </div>

              {conflicts.length > 0 && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                  <h4 className="mb-2 text-sm font-medium text-red-400">
                    Route Conflicts Detected
                  </h4>
                  <ul className="space-y-1 text-xs text-red-300">
                    {conflicts.map((conflict, index) => (
                      <li key={index}>• {conflict}</li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Code Editor Panel */}
        <div className="flex-1">
          <CodeEditor
            value={routeCode}
            onChange={setRouteCode}
            language="typescript"
            height="100%"
            className="h-full"
            showMinimap={false}
            fontSize={14}
            showLineNumbers={true}
            wordWrap="on"
          />
        </div>
      </div>

      <LoadingDialog
        isOpen={showLoadingDialog}
        title="Creating Route"
        message="Please wait while the route is being created..."
        onClose={() => {
          setShowLoadingDialog(false);
          toast.error('Route creation cancelled');
        }}
      />
    </div>
  );
}
