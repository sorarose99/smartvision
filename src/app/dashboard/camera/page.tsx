'use client';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader, Video } from 'lucide-react';
import { analyzeParking } from '@/ai/flows/analyze-parking';
import { generateTrafficWarningMessage } from '@/ai/flows/generate-traffic-warning-message';
import { DemoSwitcher } from '@/components/demo/demo-switcher';


export default function InputPage() {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [status, setStatus] = useState('Idle');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [analysisResult, setAnalysisResult] = useState<object | null>(null);
 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const sendToAnalyze = async (scenario: 'traffic' | 'parking') => {
    let inputFrame: string | null = null;
    
    if (file && filePreview) {
        inputFrame = filePreview;
    } else {
        toast({
            variant: "destructive",
            title: "Input missing",
            description: "Please upload a file to analyze.",
        });
        return;
    }


    setIsLoading(true);
    setStatus('Analyzing...');
    setAnalysisResult(null);

    try {
        let result;
        if (scenario === 'parking') {
            result = await analyzeParking({
                totalSpots: 60, // This could be dynamic based on locationId
                videoFrame: inputFrame,
            });
        } else {
            result = await generateTrafficWarningMessage({
                trafficLevel: 'heavy',
                congestionDetails: 'Accident detected on video feed.'
            });
        }
        
        setAnalysisResult(result);
        setStatus('Analysis complete.');
        toast({
            title: "Analysis Complete",
            description: `The ${scenario} analysis has finished successfully.`
        })
    } catch (err: any) {
        console.error(err);
        setStatus('Error: ' + (err.message || 'An unknown error occurred.'));
        toast({
            variant: 'destructive',
            title: 'Analysis Failed',
            description: err.message || 'Something went wrong during analysis.'
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Camera Processor & Live Demo</h1>
        <p className="text-muted-foreground">
          Watch a live simulation of the AI analysis, or upload your own image for processing.
        </p>
      </div>

      <DemoSwitcher />
      
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Video /> Manual Input Source</CardTitle>
                <CardDescription>Upload a video frame to be analyzed by the AI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            <div>
                <Label htmlFor="file-upload">Upload a video or image frame</Label>
                <Input id="file-upload" type="file" accept="video/*,image/*" onChange={handleFileChange} className="mt-2" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <Button className="w-full sm:w-auto" onClick={()=>sendToAnalyze('traffic')} disabled={isLoading || !file}>
                    {isLoading && <Loader className="mr-2 animate-spin" />}
                    Analyze Traffic
                </Button>
                <Button className="w-full sm:w-auto" variant="secondary" onClick={()=>sendToAnalyze('parking')} disabled={isLoading || !file}>
                    {isLoading && <Loader className="mr-2 animate-spin" />}
                    Analyze Parking
                </Button>
                <div className="ml-auto text-sm text-muted-foreground pt-2">Status: {status}</div>
            </div>
            </CardContent>
        </Card>

        {analysisResult && (
            <Card>
                <CardHeader>
                <CardTitle>Manual Analysis Result</CardTitle>
                <CardDescription>
                    Raw JSON output from the AI model for the uploaded file.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <pre className="p-4 rounded-md bg-muted text-sm overflow-x-auto">
                    <code>{JSON.stringify(analysisResult, null, 2)}</code>
                </pre>
                </CardContent>
            </Card>
        )}
       </div>
    </div>
  );
}
