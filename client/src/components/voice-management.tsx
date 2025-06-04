
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Trash2, Mic } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Voice {
  voice_id: string;
  name: string;
  description?: string;
  category: string;
}

export default function VoiceManagement() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [voiceName, setVoiceName] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: voicesData, isLoading } = useQuery({
    queryKey: ['/api/admin/voices'],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/voices");
      return res.json();
    }
  });

  const uploadVoiceMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch('/api/admin/upload-voice', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', Object.fromEntries(res.headers.entries()));

      // Get the response text first
      const responseText = await res.text();
      console.log('Raw response:', responseText);

      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}: ${responseText}`);
      }

      // Try to parse as JSON
      try {
        const jsonData = JSON.parse(responseText);
        console.log('Parsed JSON:', jsonData);
        return jsonData;
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        console.error('Response text:', responseText);
        throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 200)}...`);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Voice uploaded and cloned successfully!"
      });
      setSelectedFile(null);
      setVoiceName("");
      setDescription("");
      setIsUploading(false);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/voices'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
      setIsUploading(false);
    }
  });

  const deleteVoiceMutation = useMutation({
    mutationFn: async (voiceId: string) => {
      const res = await apiRequest("DELETE", `/api/admin/voices/${voiceId}`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Voice deleted successfully!"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/voices'] });
    }
  });

  const setMeditationVoiceMutation = useMutation({
    mutationFn: async (voiceId: string) => {
      const res = await apiRequest("POST", "/api/admin/set-meditation-voice", {
        voiceId
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Meditation voice updated successfully!"
      });
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/m4a'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a WAV, MP3, or M4A audio file.",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !voiceName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a file and enter a voice name.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('voiceFile', selectedFile);
    formData.append('voiceName', voiceName.trim());
    formData.append('description', description.trim());

    uploadVoiceMutation.mutate(formData);
  };

  const handleDeleteVoice = (voiceId: string) => {
    if (confirm('Are you sure you want to delete this voice?')) {
      deleteVoiceMutation.mutate(voiceId);
    }
  };

  const handleSetMeditationVoice = (voiceId: string) => {
    setMeditationVoiceMutation.mutate(voiceId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Upload Custom Voice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="voice-file">Audio File</Label>
            <Input
              id="voice-file"
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            <p className="text-sm text-muted-foreground">
              Upload a clear audio sample of your voice (WAV, MP3, or M4A, max 10MB).
              For best results, use a 1-5 minute sample with clear speech.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice-name">Voice Name</Label>
            <Input
              id="voice-name"
              value={voiceName}
              onChange={(e) => setVoiceName(e.target.value)}
              placeholder="Enter a name for this voice"
              disabled={isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this voice..."
              disabled={isUploading}
            />
          </div>

          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || !voiceName.trim() || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading & Processing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Voice
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Voices</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {voicesData?.voices?.map((voice: Voice) => (
                <div key={voice.voice_id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{voice.name}</h4>
                    <p className="text-sm text-muted-foreground">{voice.description}</p>
                    <p className="text-xs text-muted-foreground">Category: {voice.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSetMeditationVoice(voice.voice_id)}
                      disabled={setMeditationVoiceMutation.isPending}
                    >
                      Use for Meditations
                    </Button>
                    {voice.category === 'cloned' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteVoice(voice.voice_id)}
                        disabled={deleteVoiceMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
