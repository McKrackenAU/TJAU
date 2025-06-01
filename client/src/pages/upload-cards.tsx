import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";

export default function UploadCards() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cardName, setCardName] = useState("");
  const [cardSuit, setCardSuit] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const { toast } = useToast();

  // Missing cards based on the logs
  const missingCards = [
    { name: "Three of Cups", suit: "cups", file: "three-of-cups.png" },
    { name: "Two of Swords", suit: "swords", file: "two-of-swords.png" },
    { name: "Three of Swords", suit: "swords", file: "three-of-swords.png" },
    { name: "Four of Swords", suit: "swords", file: "four-of-swords.png" },
    { name: "Five of Swords", suit: "swords", file: "five-of-swords.png" },
    { name: "Six of Swords", suit: "swords", file: "six-of-swords.png" },
    { name: "Seven of Swords", suit: "swords", file: "seven-of-swords.png" },
    { name: "Eight of Swords", suit: "swords", file: "eight-of-swords.png" },
    { name: "Nine of Swords", suit: "swords", file: "nine-of-swords.png" },
    { name: "Ten of Swords", suit: "swords", file: "ten-of-swords.png" },
    { name: "Page of Swords", suit: "swords", file: "page-of-swords.png" },
    { name: "Knight of Swords", suit: "swords", file: "knight-of-swords.png" },
    { name: "Queen of Swords", suit: "swords", file: "queen-of-swords.png" },
    { name: "King of Swords", suit: "swords", file: "king-of-swords.png" },
    { name: "Ace of Pentacles", suit: "pentacles", file: "ace-of-pentacles.png" },
    { name: "Two of Pentacles", suit: "pentacles", file: "two-of-pentacles.png" },
    { name: "Three of Pentacles", suit: "pentacles", file: "three-of-pentacles.png" },
    { name: "Four of Pentacles", suit: "pentacles", file: "four-of-pentacles.png" },
    { name: "Five of Pentacles", suit: "pentacles", file: "five-of-pentacles.png" },
    { name: "Six of Pentacles", suit: "pentacles", file: "six-of-pentacles.png" },
    { name: "Seven of Pentacles", suit: "pentacles", file: "seven-of-pentacles.png" },
    { name: "Eight of Pentacles", suit: "pentacles", file: "eight-of-pentacles.png" },
    { name: "Nine of Pentacles", suit: "pentacles", file: "nine-of-pentacles.png" },
    { name: "Ten of Pentacles", suit: "pentacles", file: "ten-of-pentacles.png" },
    { name: "Page of Pentacles", suit: "pentacles", file: "page-of-pentacles.png" },
    { name: "Knight of Pentacles", suit: "pentacles", file: "knight-of-pentacles.png" },
    { name: "Queen of Pentacles", suit: "pentacles", file: "queen-of-pentacles.png" },
    { name: "King of Pentacles", suit: "pentacles", file: "king-of-pentacles.png" },
    { name: "Ace of Wands", suit: "wands", file: "ace-of-wands.png" },
    { name: "Four of Wands", suit: "wands", file: "four-of-wands.png" },
    { name: "Six of Wands", suit: "wands", file: "six-of-wands.png" }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus("");
    }
  };

  const handleCardSelect = (cardInfo: string) => {
    const [name, suit] = cardInfo.split("|");
    setCardName(name);
    setCardSuit(suit);
  };

  const handleUpload = async () => {
    if (!selectedFile || !cardName || !cardSuit) {
      toast({
        title: "Missing Information",
        description: "Please select a file and card details",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setUploadStatus("");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("cardName", cardName);
      formData.append("cardSuit", cardSuit);

      const response = await fetch("/api/upload-card-image", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setUploadStatus("success");
        toast({
          title: "Upload Successful",
          description: `${cardName} image uploaded successfully`
        });
        
        // Reset form
        setSelectedFile(null);
        setCardName("");
        setCardSuit("");
        const fileInput = document.getElementById("file-input") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        
      } else {
        const error = await response.text();
        setUploadStatus("error");
        toast({
          title: "Upload Failed",
          description: error,
          variant: "destructive"
        });
      }
    } catch (error) {
      setUploadStatus("error");
      toast({
        title: "Upload Error",
        description: "Network error occurred",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-6 w-6" />
            Upload Missing Card Images
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload your custom card images to complete the deck
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Card Selection */}
          <div className="space-y-2">
            <Label htmlFor="card-select">Select Card</Label>
            <Select onValueChange={handleCardSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a missing card" />
              </SelectTrigger>
              <SelectContent>
                {missingCards.map((card) => (
                  <SelectItem key={card.file} value={`${card.name}|${card.suit}`}>
                    {card.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file-input">Select Image File</Label>
            <Input
              id="file-input"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileSelect}
              disabled={uploading}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Selected Card Info */}
          {cardName && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold">Upload Details:</h3>
              <p>Card: {cardName}</p>
              <p>Suit: {cardSuit}</p>
              <p>File will be saved as: {cardSuit}/{cardName.toLowerCase().replace(/\s+/g, '-')}.png</p>
            </div>
          )}

          {/* Upload Status */}
          {uploadStatus === "success" && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>Upload completed successfully!</span>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>Upload failed. Please try again.</span>
            </div>
          )}

          {/* Upload Button */}
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || !cardName || uploading}
            className="w-full"
          >
            {uploading ? "Uploading..." : "Upload Card Image"}
          </Button>

          {/* Missing Cards Summary */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Missing Cards Summary:</h3>
            <p className="text-sm text-muted-foreground">
              Total missing: {missingCards.length} cards
            </p>
            <div className="mt-2 text-xs">
              <p>Cups: 1 missing</p>
              <p>Swords: 13 missing</p>
              <p>Pentacles: 14 missing</p>
              <p>Wands: 3 missing</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}