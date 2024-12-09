import React, { useState } from "react";
import { Card } from "../components/Card";
import EVChargingCalculator from "../components/EVChargingCalculator";

interface FormData {
  chargePoints: number;
  arrivalMultiplier: number;
  consumption: number;
  chargingPower: number;
}

interface FormErrors {
  chargePoints?: string;
  arrivalMultiplier?: string;
  consumption?: string;
  chargingPower?: string;
}

const EVChargingSimulation: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    chargePoints: 20,
    arrivalMultiplier: 100,
    consumption: 18,
    chargingPower: 11,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Form validation
  const validateForm = (data: FormData): FormErrors => {
    const newErrors: FormErrors = {};
    if (data.chargePoints < 1 || data.chargePoints > 50) {
      newErrors.chargePoints = "Must be between 1 and 50";
    }
    if (data.arrivalMultiplier < 20 || data.arrivalMultiplier > 200) {
      newErrors.arrivalMultiplier = "Must be between 20% and 200%";
    }
    if (data.consumption < 1 || data.consumption > 100) {
      newErrors.consumption = "Must be between 1 and 100 kWh";
    }
    if (data.chargingPower < 1 || data.chargingPower > 50) {
      newErrors.chargingPower = "Must be between 1 and 50 kW";
    }
    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = value === "0" ? "0" : value.replace(/^0+/, "");
    const newFormData = {
      ...formData,
      [name]: sanitizedValue === "" ? "" : Number(sanitizedValue),
    } as FormData;
    setFormData(newFormData);
    setErrors(validateForm(newFormData as FormData));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setErrors(newErrors);
  };

  return (
    <div className='max-w-6xl mx-auto p-4 space-y-6'>
      <h1 className='text-3xl font-bold mb-6'>
        EV Charging Station Simulation
      </h1>

      <Card>
        <h2 className='text-xl font-semibold mb-4'>Simulation Parameters</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Number of Charge Points
              </label>
              <input
                type='number'
                name='chargePoints'
                value={formData.chargePoints}
                onChange={handleInputChange}
                className='w-full p-2 border rounded'
              />
              {errors.chargePoints && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.chargePoints}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>
                Arrival Multiplier (%)
              </label>
              <input
                type='number'
                name='arrivalMultiplier'
                value={formData.arrivalMultiplier}
                onChange={handleInputChange}
                className='w-full p-2 border rounded'
              />
              {errors.arrivalMultiplier && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.arrivalMultiplier}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>
                Consumption (kWh)
              </label>
              <input
                type='number'
                name='consumption'
                value={formData.consumption}
                onChange={handleInputChange}
                className='w-full p-2 border rounded'
              />
              {errors.consumption && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.consumption}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>
                Charging Power (kW)
              </label>
              <input
                type='number'
                name='chargingPower'
                value={formData.chargingPower}
                onChange={handleInputChange}
                className='w-full p-2 border rounded'
              />
              {errors.chargingPower && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.chargingPower}
                </p>
              )}
            </div>
          </div>

          <button
            type='submit'
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors'
            disabled={Object.keys(errors).length > 0}
            onClick={() => {
              // Do nothing for now
            }}
          >
            Update Simulation
          </button>
        </form>
      </Card>

      <div>
        <EVChargingCalculator
          chargePoints={formData.chargePoints}
          arrivalMultiplier={formData.arrivalMultiplier}
          consumption={formData.consumption}
          chargingPower={formData.chargingPower}
        />
      </div>
    </div>
  );
};

export default EVChargingSimulation;
