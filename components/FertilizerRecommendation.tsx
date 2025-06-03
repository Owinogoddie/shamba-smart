import * as React from "react";
import { ArrowLeft, Sprout, Loader2, AlertTriangle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface FertilizerRecommendationProps {
  onBack: () => void;
}

interface FertilizerRecommendation {
  fertilizer: string;
  confidence: number;
}

interface PredictionResult {
  primary_recommendation: string;
  confidence: number;
  all_recommendations: FertilizerRecommendation[];
  input_parameters: {
    nitrogen_percent: number;
    phosphorus_ppm: number;
    soil_ph: number;
    potassium_meq_percent: number;
    crop: string;
  };
  validation_warnings: string[];
}

export function FertilizerRecommendation({
  onBack,
}: FertilizerRecommendationProps) {
  const [formData, setFormData] = React.useState({
    nitrogen: "",
    phosphorus: "",
    soilPh: "",
    potassium: "",
    crop: "",
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<PredictionResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear previous results when input changes
    if (result) setResult(null);
    if (error) setError(null);
  };

  const validateForm = () => {
    const { nitrogen, phosphorus, soilPh, potassium, crop } = formData;

    if (!nitrogen || !phosphorus || !soilPh || !potassium || !crop.trim()) {
      return "Please fill in all fields";
    }

    const n = parseFloat(nitrogen);
    const p = parseFloat(phosphorus);
    const ph = parseFloat(soilPh);
    const k = parseFloat(potassium);

    if (n < 0 || n > 5) return "Nitrogen must be between 0-5%";
    if (p < 0 || p > 200) return "Phosphorus must be between 0-200 ppm";
    if (ph < 3 || ph > 10) return "Soil pH must be between 3-10";
    if (k < 0 || k > 10) return "Potassium must be between 0-10 meq%";

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
        nitrogen_percent: parseFloat(formData.nitrogen),
        phosphorus_ppm: parseFloat(formData.phosphorus),
        soil_ph: parseFloat(formData.soilPh),
        potassium_meq_percent: parseFloat(formData.potassium),
        crop: formData.crop.trim().toLowerCase(),
      };

      const response = await fetch(
        "https://godfreyowino-smart-fertilizer-recommender.hf.space/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PredictionResult = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Prediction error:", err);
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
      nitrogen: "",
      phosphorus: "",
      soilPh: "",
      potassium: "",
      crop: "",
    });
    setResult(null);
    setError(null);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return "bg-green-500";
    if (confidence >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getConfidenceBadgeVariant = (confidence: number) => {
    if (confidence >= 70) return "default";
    if (confidence >= 50) return "secondary";
    return "destructive";
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
            <Sprout className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-800">
              Fertilizer Recommendation
            </h1>
            <p className="text-green-600">
              Get personalized fertilizer recommendations for your crops
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800">
              Fertilizer Recommendation
            </CardTitle>
          </div>
          <CardDescription className="text-green-600">
            Get personalized fertilizer recommendations based on soil and crop
            data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nitrogen" className="text-green-800">
                  Nitrogen (0-5%)
                </Label>
                <Input
                  id="nitrogen"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.nitrogen}
                  onChange={(e) =>
                    handleInputChange("nitrogen", e.target.value)
                  }
                  className="border-green-300 focus:border-green-500"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phosphorus" className="text-green-800">
                  Phosphorus (0-200 ppm)
                </Label>
                <Input
                  id="phosphorus"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="200"
                  value={formData.phosphorus}
                  onChange={(e) =>
                    handleInputChange("phosphorus", e.target.value)
                  }
                  className="border-green-300 focus:border-green-500"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="soilPh" className="text-green-800">
                  Soil pH (3-10)
                </Label>
                <Input
                  id="soilPh"
                  type="number"
                  placeholder="7"
                  min="3"
                  max="10"
                  step="0.1"
                  value={formData.soilPh}
                  onChange={(e) => handleInputChange("soilPh", e.target.value)}
                  className="border-green-300 focus:border-green-500"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="potassium" className="text-green-800">
                  Potassium (0-10 meq%)
                </Label>
                <Input
                  id="potassium"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.potassium}
                  onChange={(e) =>
                    handleInputChange("potassium", e.target.value)
                  }
                  className="border-green-300 focus:border-green-500"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="crop" className="text-green-800">
                Crop to be Grown
              </Label>
              <Input
                id="crop"
                type="text"
                placeholder="Enter crop name (e.g., maize, beans, wheat)"
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
                  "Get Fertilizer Recommendation"
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
              <Sprout className="h-5 w-5" />
              Fertilizer Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Validation Warnings */}
            {result.validation_warnings.length > 0 && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700">
                  <div className="font-medium mb-1">Validation Warnings:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {result.validation_warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Primary Recommendation */}
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-800 mb-2">
                {result.primary_recommendation}
              </div>
              <div className="text-green-600 mb-3">Primary Recommendation</div>
              <Badge
                variant={getConfidenceBadgeVariant(result.confidence)}
                className="text-sm"
              >
                {result.confidence}% Confidence
              </Badge>
            </div>

            {/* All Recommendations */}
            <div>
              <h4 className="font-semibold text-green-800 mb-3">
                All Recommendations:
              </h4>
              <div className="space-y-3">
                {result.all_recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded-lg border border-green-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-green-800">
                        {rec.fertilizer}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {rec.confidence}%
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getConfidenceColor(
                          rec.confidence
                        )}`}
                        style={{ width: `${rec.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Parameters Used */}
            <div className="border-t border-green-200 pt-4">
              <h4 className="font-semibold text-green-800 mb-2">
                Input Parameters Used:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="text-green-700">
                  <span className="font-medium">Nitrogen:</span>{" "}
                  {result.input_parameters.nitrogen_percent}%
                </div>
                <div className="text-green-700">
                  <span className="font-medium">Phosphorus:</span>{" "}
                  {result.input_parameters.phosphorus_ppm} ppm
                </div>
                <div className="text-green-700">
                  <span className="font-medium">pH:</span>{" "}
                  {result.input_parameters.soil_ph}
                </div>
                <div className="text-green-700">
                  <span className="font-medium">Potassium:</span>{" "}
                  {result.input_parameters.potassium_meq_percent} meq%
                </div>
                <div className="text-green-700 md:col-span-2">
                  <span className="font-medium">Crop:</span>{" "}
                  {result.input_parameters.crop}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
