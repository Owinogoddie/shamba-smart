import * as React from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegionalRecommendationProps {
  onBack: () => void;
}

export function RegionalRecommendation({
  onBack,
}: RegionalRecommendationProps) {
  const [formData, setFormData] = React.useState({
    county: "",
    crop: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Getting regional recommendation with:", formData);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="border-green-300 text-green-700 hover:bg-green-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-800">
              Region-Based Fertilizer Recommendation
            </h1>
            <p className="text-green-600">
              Get location-specific fertilizer recommendations for Kenya
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800">
              Region-Based Fertilizer Recommendation
            </CardTitle>
          </div>
          <CardDescription className="text-green-600">
            Get location-specific fertilizer recommendations for Kenya
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="county" className="text-green-800">
                County/Region in Kenya
              </Label>
              <Input
                id="county"
                type="text"
                placeholder="Enter county name (e.g., Kiambu, Nakuru, Meru)"
                value={formData.county}
                onChange={(e) => handleInputChange("county", e.target.value)}
                className="border-green-300 focus:border-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crop" className="text-green-800">
                Crop to be Grown
              </Label>
              <Input
                id="crop"
                type="text"
                placeholder="Enter crop name (e.g., maize, coffee, tea, beans)"
                value={formData.crop}
                onChange={(e) => handleInputChange("crop", e.target.value)}
                className="border-green-300 focus:border-green-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Get Regional Recommendation
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
