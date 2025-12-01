'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Copy, KeyRound, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ApiKey = {
  id: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  usage: number;
};

const initialKeys: ApiKey[] = [
  {
    id: '1',
    key: 'sk_live_abc...xyz',
    createdAt: '2023-10-26',
    lastUsed: '2024-05-20',
    usage: 1204,
  },
  {
    id: '2',
    key: 'sk_live_def...uvw',
    createdAt: '2023-11-15',
    lastUsed: '2024-05-21',
    usage: 876,
  },
];

export default function AdminScreensPage() {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialKeys);

  const generateNewKey = () => {
    const newKey = `sk_live_${[...Array(10)]
      .map(() => (~~(Math.random() * 36)).toString(36))
      .join('')}...${[...Array(3)]
      .map(() => (~~(Math.random() * 36)).toString(36))
      .join('')}`;
      
    const newKeyObject: ApiKey = {
      id: (apiKeys.length + 1).toString(),
      key: newKey,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      usage: 0,
    };
    
    setApiKeys([newKeyObject, ...apiKeys]);

    toast({
      title: 'API Key Generated',
      description: 'A new API key has been created successfully.',
    });
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: 'Copied!', description: 'API key copied to clipboard.' });
  };
  
  const deleteKey = (id: string) => {
      setApiKeys(apiKeys.filter(key => key.id !== id));
      toast({
          variant: "destructive",
          title: "API Key Revoked",
          description: "The API key has been deleted."
      })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground">
          Manage API keys and registered screens for your organization.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Manage API keys for accessing SmartVision services.
            </CardDescription>
          </div>
          <Button onClick={generateNewKey}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Generate New Key
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Usage (30d)</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-mono flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-muted-foreground" />
                    {apiKey.key}
                  </TableCell>
                  <TableCell>{apiKey.usage.toLocaleString()}</TableCell>
                  <TableCell>{apiKey.createdAt}</TableCell>
                  <TableCell>{apiKey.lastUsed}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(apiKey.key)}
                        aria-label="Copy Key"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                       <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteKey(apiKey.id)}
                        className="text-destructive hover:text-destructive"
                        aria-label="Delete Key"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">Remember to store your keys securely. They will not be shown again.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
