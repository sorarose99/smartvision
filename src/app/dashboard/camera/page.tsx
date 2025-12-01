'use client';
import React, { useContext, useState } from 'react';
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
import { BrainCircuit, Loader, Video } from 'lucide-react';
import { analyzeParking, ParkingAnalysisOutput } from '@/ai/flows/analyze-parking';
import { generateTrafficWarningMessage, TrafficWarningOutput } from '@/ai/flows/generate-traffic-warning-message';
import { DemoSwitcher } from '@/components/demo/demo-switcher';
import { Textarea } from '@/components/ui/textarea';
import { analyzeScene } from '@/ai/flows/analyze-scene';
import Image from 'next/image';
import { AnalysisContext } from '@/context/AnalysisContext';
import { useRouter } from 'next/navigation';


export default function InputPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [question, setQuestion] = useState('');
  const [status, setStatus] = useState('Idle');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [analysisResult, setAnalysisResult] = useState<object | null>(null);

  const { setParkingAnalysis, setTrafficAnalysis } = useContext(AnalysisContext);
  const router = useRouter();


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 2); // Limit to 2 files
      setFiles(selectedFiles);

      const newPreviews: string[] = [];
      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          newPreviews.push(event.target?.result as string);
          if (newPreviews.length === selectedFiles.length) {
            setFilePreviews(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      });
       if(selectedFiles.length === 0){
        setFilePreviews([]);
      }
    }
  };

  const handleSimpleAnalysis = async (scenario: 'traffic' | 'parking') => {
    if (files.length === 0 || filePreviews.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Input missing',
        description: 'Please upload a file to analyze.',
      });
      return;
    }
    
    const inputFrame = filePreviews[0];

    setIsLoading(true);
    setStatus(`Analyzing ${scenario}...`);
    setAnalysisResult(null);

    try {
      if (scenario === 'parking') {
        const result: ParkingAnalysisOutput = await analyzeParking({
          totalSpots: 60, // This could be dynamic based on locationId
          videoFrame: inputFrame,
        });
         setAnalysisResult(result);
         setParkingAnalysis(result);
         router.push('/dashboard/parking-status');

      } else {
        const result: TrafficWarningOutput = await generateTrafficWarningMessage({
          trafficLevel: 'heavy',
          congestionDetails: 'Accident detected on video feed.',
        });
         setAnalysisResult(result);
         setTrafficAnalysis(result);
         router.push('/dashboard/signage');
      }

      setStatus('Analysis complete. Navigating to live monitor...');
      toast({
        title: 'Analysis Complete',
        description: `The ${scenario} analysis has finished. Redirecting...`,
      });

    } catch (err: any) {
      console.error(err);
      setStatus('Error: ' + (err.message || 'An unknown error occurred.'));
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: err.message || 'Something went wrong during analysis.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdvancedAnalysis = async () => {
    if (files.length === 0) {
        toast({
            variant: "destructive",
            title: "Input missing",
            description: "Please upload at least one image or video frame.",
        });
        return;
    }
     if (!question) {
        toast({
            variant: "destructive",
            title: "Input missing",
            description: "Please enter a question to ask the AI.",
        });
        return;
    }

    setIsLoading(true);
    setStatus('Performing advanced analysis...');
    setAnalysisResult(null);

     try {
        const result = await analyzeScene({
            media: filePreviews,
            question: question,
        });
        
        setAnalysisResult(result);
        setStatus('Analysis complete.');
        toast({
            title: "Advanced Analysis Complete",
            description: `The AI has answered your question.`
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
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Camera Processor & Live Demo
        </h1>
        <p className="text-muted-foreground">
          Upload your own image(s) to drive the live monitors, or watch a pre-built simulation below.
        </p>
      </div>

       <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className='flex flex-col gap-6'>
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Video /> Manual Input Source
                </CardTitle>
                <CardDescription>
                Upload an image to analyze. The result will update the relevant live monitor page.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                <Label htmlFor="file-upload">
                    Upload up to 2 images (the first will be used for simple analysis)
                </Label>
                <Input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-2"
                    multiple
                />
                </div>
                <div className="flex gap-4">
                    {filePreviews.map((preview, index) => (
                        <div key={index} className="relative w-1/2 aspect-video rounded-md overflow-hidden border">
                            <Image src={preview} alt={`Preview ${index + 1}`} layout="fill" objectFit="cover" />
                        </div>
                    ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    className="w-full sm:w-auto"
                    onClick={() => handleSimpleAnalysis('traffic')}
                    disabled={isLoading || files.length === 0}
                >
                    {isLoading && status.includes('traffic') ? <Loader className="mr-2 animate-spin" /> : null}
                    Analyze Traffic & View Signage
                </Button>
                <Button
                    className="w-full sm:w-auto"
                    variant="secondary"
                    onClick={() => handleSimpleAnalysis('parking')}
                    disabled={isLoading || files.length === 0}
                >
                    {isLoading && status.includes('parking') ? <Loader className="mr-2 animate-spin" /> : null}
                    Analyze Parking & View Status
                </Button>
                </div>
            </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BrainCircuit /> Advanced AI Analysis
                    </CardTitle>
                    <CardDescription>
                        Ask a specific question about the uploaded image(s). The AI will identify the context and answer. (Does not update monitors).
                    </CardDescription>
                </CardHeader>
                 <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="ai-question">Your Question</Label>
                        <Textarea 
                            id="ai-question"
                            placeholder="e.g., 'Is the blue car in the first image still there in the second image?' or 'How many available parking spots are on the left side?'"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <div className='flex items-center gap-4'>
                        <Button
                            className="w-full sm:w-auto"
                            onClick={handleAdvancedAnalysis}
                            disabled={isLoading || files.length === 0 || !question}
                        >
                            {isLoading && status.includes('advanced') ? <Loader className="mr-2 animate-spin" /> : null}
                            Ask AI
                        </Button>
                        <div className="ml-auto text-sm text-muted-foreground pt-2">Status: {status}</div>
                    </div>
                 </CardContent>
            </Card>
        </div>


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

      <DemoSwitcher />
    </div>
  );
}
