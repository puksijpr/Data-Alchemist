// src/components/PrioritySliders.tsx
import { PriorityWeights } from "@/lib/types";
import * as Slider from "@radix-ui/react-slider";

interface PrioritySliderProps {
  weights: PriorityWeights;
  onUpdate: (weights: PriorityWeights) => void;
}

export function PrioritySliders({ weights, onUpdate }: PrioritySliderProps) {
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);

  const handleSliderChange = (key: keyof PriorityWeights, value: number) => {
    const newWeights = { ...weights, [key]: value };

    const total = Object.values(newWeights).reduce((sum, w) => sum + w, 0);
    if (total > 0) {
      Object.keys(newWeights).forEach((k) => {
        newWeights[k as keyof PriorityWeights] =
          newWeights[k as keyof PriorityWeights] / total;
      });
    }

    onUpdate(newWeights);
  };

  const presets = [
    {
      name: "Maximize Fulfillment",
      weights: {
        priorityLevel: 0.1,
        taskFulfillment: 0.5,
        fairness: 0.1,
        efficiency: 0.2,
        skillMatch: 0.1,
      },
    },
    {
      name: "Fair Distribution",
      weights: {
        priorityLevel: 0.2,
        taskFulfillment: 0.2,
        fairness: 0.4,
        efficiency: 0.1,
        skillMatch: 0.1,
      },
    },
    {
      name: "Minimize Workload",
      weights: {
        priorityLevel: 0.2,
        taskFulfillment: 0.2,
        fairness: 0.2,
        efficiency: 0.3,
        skillMatch: 0.1,
      },
    },
    {
      name: "Skill Optimization",
      weights: {
        priorityLevel: 0.1,
        taskFulfillment: 0.2,
        fairness: 0.1,
        efficiency: 0.2,
        skillMatch: 0.4,
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          Priority Weights Configuration
        </h3>

        {/* Preset Buttons */}
        <div className="mb-8">
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Quick Presets
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => onUpdate(preset.weights)}
                className="text-sm font-medium px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition duration-200"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Individual Sliders */}
        <div className="space-y-6">
          {Object.entries(weights).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <span className="text-sm text-gray-500">
                  {(value * 100).toFixed(0)}%
                </span>
              </div>
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                value={[value * 100]}
                onValueChange={([v]) =>
                  handleSliderChange(key as keyof PriorityWeights, v / 100)
                }
                max={100}
                step={1}
              >
                <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                  <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-5 h-5 bg-white border border-gray-300 shadow-md rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </Slider.Root>
            </div>
          ))}
        </div>

        {/* Total Weight Display */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <p className="text-sm text-gray-600">
            Total weight:{" "}
            <span className="font-medium text-gray-800">
              {(totalWeight * 100).toFixed(0)}%
            </span>
            {Math.abs(totalWeight - 1) > 0.01 && (
              <span className="text-yellow-600 font-medium">
                {" "}
                (auto-normalized)
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
