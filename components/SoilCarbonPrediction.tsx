import * as React from "react";
import { ArrowLeft, Leaf, Loader2 } from "lucide-react";
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

interface SoilCarbonPredictionProps {
  onBack: () => void;
}

interface PredictionResult {
  organic_carbon: number;
  input_parameters: {
    nitrogen: number;
    phosphorus: number;
    ph: number;
    potassium: number;
  };
}

export function SoilCarbonPrediction({ onBack }: SoilCarbonPredictionProps) {
  const [formData, setFormData] = React.useState({
    nitrogen: "",
    phosphorus: "",
    soilPh: "",
    potassium: "",
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
    const { nitrogen, phosphorus, soilPh, potassium } = formData;

    if (!nitrogen || !phosphorus || !soilPh || !potassium) {
      return "Please fill in all fields";
    }

    const n = parseFloat(nitrogen);
    const p = parseFloat(phosphorus);
    const ph = parseFloat(soilPh);
    const k = parseFloat(potassium);

    if (n < 0 || n > 5) return "Nitrogen must be between 0-5%";
    if (p < 0 || p > 200) return "Phosphorus must be between 0-200 ppm";
    if (ph < 3 || ph > 10) return "Soil pH must be between 3-10";
    if (k < 0 || k > 5) return "Potassium must be between 0-5 meq%";

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
        nitrogen: parseFloat(formData.nitrogen),
        phosphorus: parseFloat(formData.phosphorus),
        ph: parseFloat(formData.soilPh),
        potassium: parseFloat(formData.potassium),
      };

      const response = await fetch(
        "https://godfreyowino-organic-carbon-predictor.hf.space/predict",
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
          : "Failed to predict soil carbon. Please try again."
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
            <Leaf className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-800">
              Soil Organic Carbon Prediction
            </h1>
            <p className="text-green-600">
              Analyze soil parameters to predict organic carbon percentage
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800">
              Soil Organic Carbon Prediction
            </CardTitle>
          </div>
          <CardDescription className="text-green-600">
            Enter soil parameters to predict organic carbon percentage
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
                  Potassium (0-5 meq%)
                </Label>
                <Input
                  id="potassium"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="5"
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
                    Predicting...
                  </>
                ) : (
                  "Predict Soil Carbon"
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
              <Leaf className="h-5 w-5" />
              Prediction Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-800">
                  {result.organic_carbon.toFixed(4)}%
                </div>
                <div className="text-green-600">Predicted Organic Carbon</div>
              </div>

              <div className="border-t border-green-200 pt-4">
                <h4 className="font-semibold text-green-800 mb-2">
                  Input Parameters Used:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-green-700">
                    <span className="font-medium">Nitrogen:</span>{" "}
                    {result.input_parameters.nitrogen}%
                  </div>
                  <div className="text-green-700">
                    <span className="font-medium">Phosphorus:</span>{" "}
                    {result.input_parameters.phosphorus} ppm
                  </div>
                  <div className="text-green-700">
                    <span className="font-medium">pH:</span>{" "}
                    {result.input_parameters.ph}
                  </div>
                  <div className="text-green-700">
                    <span className="font-medium">Potassium:</span>{" "}
                    {result.input_parameters.potassium} meq%
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
