import * as React from "react";
import { ArrowLeft, Sprout, Loader2, AlertTriangle, Leaf } from "lucide-react";
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

interface OrganicFertilizerResult {
  predicted_rate_tons_per_acre: number;
  confidence_interval: {
    lower: number;
    upper: number;
    std: number;
  };
  model_performance: {
    test_r2: number;
    test_rmse: number;
    test_mae: number;
  };
  input_parameters: {
    nitrogen_percent: number;
    phosphorus_ppm: number;
    potassium_meq_percent: number;
    soil_ph: number;
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
  const [organicResult, setOrganicResult] =
    React.useState<OrganicFertilizerResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear previous results when input changes
    if (result) setResult(null);
    if (organicResult) setOrganicResult(null);
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
    setOrganicResult(null);

    try {
      const baseRequestBody = {
        nitrogen_percent: parseFloat(formData.nitrogen),
        phosphorus_ppm: parseFloat(formData.phosphorus),
        soil_ph: parseFloat(formData.soilPh),
        potassium_meq_percent: parseFloat(formData.potassium),
      };

      const fertilizerRequestBody = {
        ...baseRequestBody,
        crop: formData.crop.trim().toLowerCase(),
      };

      // Make both API calls simultaneously
      const [fertilizerResponse, organicResponse] = await Promise.all([
        fetch(
          "https://godfreyowino-smart-fertilizer-recommender.hf.space/predict",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(fertilizerRequestBody),
          }
        ),
        fetch(
          "https://godfreyowino-organic-fertilizer-predictor.hf.space/predict",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(baseRequestBody),
          }
        ),
      ]);

      if (!fertilizerResponse.ok) {
        throw new Error(
          `Fertilizer API error! status: ${fertilizerResponse.status}`
        );
      }

      if (!organicResponse.ok) {
        throw new Error(
          `Organic fertilizer API error! status: ${organicResponse.status}`
        );
      }

      const [fertilizerData, organicData] = await Promise.all([
        fertilizerResponse.json() as Promise<PredictionResult>,
        organicResponse.json() as Promise<OrganicFertilizerResult>,
      ]);

      setResult(fertilizerData);
      setOrganicResult(organicData);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to get fertilizer recommendations. Please try again."
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
    setOrganicResult(null);
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

  // const getConfidenceRating = (
  //   rate: number,
  //   interval: { lower: number; upper: number }
  // ) => {
  //   const range = interval.upper - interval.lower;
  //   const relativeUncertainty = range / rate;

  //   if (relativeUncertainty < 0.5)
  //     return { rating: "High", variant: "default" as const };
  //   if (relativeUncertainty < 1.0)
  //     return { rating: "Medium", variant: "secondary" as const };
  //   return { rating: "Low", variant: "destructive" as const };
  // };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
              Fertilizer Recommendations
            </h1>
            <p className="text-green-600">
              Get both conventional and organic fertilizer recommendations
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800">
              Fertilizer Recommendations
            </CardTitle>
          </div>
          <CardDescription className="text-green-600">
            Get personalized conventional and organic fertilizer recommendations
            based on soil and crop data
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
                    Getting Recommendations...
                  </>
                ) : (
                  "Get Fertilizer Recommendations"
                )}
              </Button>
              {(result || organicResult || error) && (
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

      {/* Results Grid */}
      {(result || organicResult) && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Conventional Fertilizer Recommendations */}
          {result && (
            <Card className="bg-green-50/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Sprout className="h-5 w-5" />
                  Conventional Fertilizer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Validation Warnings */}
                {result.validation_warnings.length > 0 && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-700">
                      <div className="font-medium mb-1">
                        Validation Warnings:
                      </div>
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
                  <div className="text-xl font-bold text-green-800 mb-2">
                    {result.primary_recommendation}
                  </div>
                  <div className="text-green-600 mb-3">
                    Primary Recommendation
                  </div>
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
                  <div className="space-y-2">
                    {result.all_recommendations
                      .slice(0, 3)
                      .map((rec, index) => (
                        <div
                          key={index}
                          className="bg-white p-3 rounded-lg border border-green-100"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-green-800 text-sm">
                              {rec.fertilizer}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {rec.confidence}%
                            </Badge>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${getConfidenceColor(
                                rec.confidence
                              )}`}
                              style={{ width: `${rec.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Organic Fertilizer Recommendations */}
          {organicResult && (
            <Card className="bg-amber-50/80 backdrop-blur-sm border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-800 flex items-center gap-2">
                  <Leaf className="h-5 w-5" />
                  Organic Fertilizer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Validation Warnings */}
                {organicResult.validation_warnings.length > 0 && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-700">
                      <div className="font-medium mb-1">
                        Validation Warnings:
                      </div>
                      <ul className="list-disc list-inside space-y-1">
                        {organicResult.validation_warnings.map(
                          (warning, index) => (
                            <li key={index}>{warning}</li>
                          )
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Application Rate */}
                <div className="text-center p-4 bg-white rounded-lg border border-amber-200">
                  <div className="text-2xl font-bold text-amber-800 mb-2">
                    {organicResult.predicted_rate_tons_per_acre.toFixed(2)}{" "}
                    tons/acre
                  </div>
                  <div className="text-amber-600 mb-3">
                    Recommended Application Rate
                  </div>
                  {/* <Badge
                    variant={
                      getConfidenceRating(
                        organicResult.predicted_rate_tons_per_acre,
                        organicResult.confidence_interval
                      ).variant
                    }
                    className="text-sm"
                  >
                    {
                      getConfidenceRating(
                        organicResult.predicted_rate_tons_per_acre,
                        organicResult.confidence_interval
                      ).rating
                    }{" "}
                    Confidence
                  </Badge> */}
                </div>

                {/* Confidence Interval */}
                

                {/* Model Performance */}
                {/* <div className="bg-white p-3 rounded-lg border border-amber-100">
                  <h4 className="font-semibold text-amber-800 mb-2 text-sm">
                    Model Performance:
                  </h4>
                  <div className="text-xs text-amber-700 space-y-1">
                    <div>
                      R² Score:{" "}
                      {organicResult.model_performance.test_r2.toFixed(2)}
                    </div>
                    <div>
                      RMSE:{" "}
                      {organicResult.model_performance.test_rmse.toFixed(2)}
                    </div>
                    <div>
                      MAE: {organicResult.model_performance.test_mae.toFixed(2)}
                    </div>
                  </div>
                </div> */}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Input Parameters Summary */}
      {(result || organicResult) && (
        <Card className="bg-gray-50/80 backdrop-blur-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800 text-lg">
              Input Parameters Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="text-gray-700">
                <span className="font-medium">Nitrogen:</span>{" "}
                {formData.nitrogen}%
              </div>
              <div className="text-gray-700">
                <span className="font-medium">Phosphorus:</span>{" "}
                {formData.phosphorus} ppm
              </div>
              <div className="text-gray-700">
                <span className="font-medium">pH:</span> {formData.soilPh}
              </div>
              <div className="text-gray-700">
                <span className="font-medium">Potassium:</span>{" "}
                {formData.potassium} meq%
              </div>
              <div className="text-gray-700 md:col-span-2">
                <span className="font-medium">Crop:</span> {formData.crop}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
