import * as React from "react";
import { ArrowLeft, MapPin, Loader2 } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RegionalRecommendationProps {
  onBack: () => void;
}

interface FertilizerOption {
  fertilizer: string;
  confidence: number;
  rank: number;
}

interface RecommendationResult {
  primary_recommendation: string;
  confidence: number;
  all_recommendations: FertilizerOption[];
  input_parameters: {
    county: string;
    crop: string;
  };
}

export function RegionalRecommendation({
  onBack,
}: RegionalRecommendationProps) {
  const [formData, setFormData] = React.useState({
    county: "",
    crop: "",
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<RecommendationResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear previous results when input changes
    if (result) setResult(null);
    if (error) setError(null);
  };

  const formatCountyName = (county: string): string => {
    // Capitalize first letter, lowercase the rest
    return county.charAt(0).toUpperCase() + county.slice(1).toLowerCase();
  };

  const formatCropName = (crop: string): string => {
    // Convert to lowercase
    return crop.toLowerCase();
  };

  const validateForm = () => {
    const { county, crop } = formData;

    if (!county.trim()) {
      return "Please enter a county name";
    }

    if (!crop.trim()) {
      return "Please enter a crop name";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const requestBody = {
        county: formatCountyName(formData.county.trim()),
        crop: formatCropName(formData.crop.trim()),
      };

      const response = await fetch(
        "https://godfreyowino-geoagri-fertilizer-recommender.hf.space/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          if (errorData.detail && errorData.detail.includes("Unknown county")) {
            setError(
              "The model was not trained on data for this county. Please try a different county or check the spelling."
            );
          } else {
            setError(
              errorData.detail || "Invalid request. Please check your input."
            );
          }
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return;
      }

      const data: RecommendationResult = await response.json();
      console.log(data);
      setResult(data);
    } catch (err) {
      console.error("Recommendation error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to get fertilizer recommendation. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      county: "",
      crop: "",
    });
    setResult(null);
    setError(null);
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
                placeholder="Enter county name (e.g., Kajiado, Nakuru, Meru)"
                value={formData.county}
                onChange={(e) => handleInputChange("county", e.target.value)}
                className="border-green-300 focus:border-green-500"
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Recommendation...
                  </>
                ) : (
                  "Get Regional Recommendation"
                )}
              </Button>
              {(result || error) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                  disabled={isLoading}
                >
                  Reset
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="bg-green-50/80 backdrop-blur-sm border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Fertilizer Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-lg font-semibold text-green-800">
                  Recommendation for {result.input_parameters.crop} in{" "}
                  {result.input_parameters.county} County
                </div>

                {/* Primary Recommendation */}
                <div className="p-4 bg-white rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-green-800">
                      Primary Recommendation:
                    </h4>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                      {result.confidence.toFixed(1)}% confidence
                    </span>
                  </div>
                  <p className="text-green-700 text-lg font-medium">
                    {result.primary_recommendation}
                  </p>
                </div>
              </div>

              {/* All Recommendations */}
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">
                  All Recommendations (Ranked):
                </h4>
                <div className="space-y-2">
                  {result.all_recommendations.map((recommendation, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        index === 0
                          ? "bg-green-100 border-green-300"
                          : "bg-white border-green-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-green-600">
                            #{recommendation.rank}
                          </span>
                          <span className="font-medium text-green-800">
                            {recommendation.fertilizer}
                          </span>
                        </div>
                        <span className="text-sm text-green-600">
                          {recommendation.confidence.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-green-200 pt-4">
                <h4 className="font-semibold text-green-800 mb-2">
                  Input Parameters Used:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-green-700">
                    <span className="font-medium">County:</span>{" "}
                    {result.input_parameters.county}
                  </div>
                  <div className="text-green-700">
                    <span className="font-medium">Crop:</span>{" "}
                    {result.input_parameters.crop}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
