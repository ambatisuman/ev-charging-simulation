import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Card } from "../components/Card";

interface HourlyData {
  hour: string;
  power: number;
}

interface WeeklyData {
  day: string;
  events: number;
  energy: number;
}

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

  // Summary statistics simulation data
  const summaryStats = useMemo(() => {
    const chargingEventsPerDay = Math.floor(
      formData.chargePoints *
        (formData.arrivalMultiplier / 100) *
        (24 / (formData.consumption / formData.chargingPower))
    );
    const totalChargingEvents = chargingEventsPerDay * 7;

    // total energy charged per week
    const energyPerCharge = formData.consumption;
    const totalEnergyCharged = totalChargingEvents * energyPerCharge;

    // calculating peak power demand
    const peakPowerDemand = Math.min(
      formData.chargePoints * formData.chargingPower,
      180 // limiting to 180 kW to maintain consistency with original chart
    );

    return {
      totalEnergyCharged: Math.round(totalEnergyCharged),
      peakPowerDemand: Math.round(peakPowerDemand),
      totalChargingEvents: Math.round(totalChargingEvents),
    };
  }, [formData]);

  // Sample data for chart visualizations
  const hourlyData: HourlyData[] = Array.from({ length: 12 }, (_, i) => {
    const hour = i * 2;
    return {
      hour: `${hour}:00`,
      power: Math.min(
        180,
        Math.random() * (hour < 8 ? 50 : hour < 20 ? 150 : 80) + 20
      ),
    };
  });

  const weeklyData: WeeklyData[] = Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    events: Math.floor(summaryStats.totalChargingEvents / 7),
    energy: Math.floor(summaryStats.totalEnergyCharged / 7),
  }));

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

      {/* Daily power usage chart */}
      <Card>
        <h2 className='text-xl font-semibold mb-4'>Daily Power Usage</h2>
        <div className='h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='hour' />
              <YAxis unit='kW' />
              <Tooltip />
              <Legend />
              <Line
                type='monotone'
                dataKey='power'
                stroke='#3b82f6'
                name='Power Demand'
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Weekly power usage visualization */}
      <Card>
        <h2 className='text-xl font-semibold mb-4'>Weekly Overview</h2>
        <div className='h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='day' />
              <YAxis yAxisId='left' />
              <YAxis yAxisId='right' orientation='right' />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId='left'
                dataKey='events'
                fill='#007BFF'
                name='Charging Events'
              />
              <Bar
                yAxisId='right'
                dataKey='energy'
                fill='#10b981'
                name='Energy Consumed (kWh)'
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Summary statistics */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <h3 className='text-lg font-semibold mb-2'>Total Energy Charged</h3>
          <p className='text-3xl font-bold'>
            {summaryStats.totalEnergyCharged.toLocaleString()} kWh
          </p>
          <p className='text-sm text-gray-500'>Last 7 days</p>
        </Card>

        <Card>
          <h3 className='text-lg font-semibold mb-2'>Peak Power Demand</h3>
          <p className='text-3xl font-bold'>
            {summaryStats.peakPowerDemand} kW
          </p>
          <p className='text-sm text-gray-500'>Maximum this week</p>
        </Card>

        <Card>
          <h3 className='text-lg font-semibold mb-2'>Charging Events</h3>
          <p className='text-3xl font-bold'>
            {summaryStats.totalChargingEvents}
          </p>
          <p className='text-sm text-gray-500'>Total this week</p>
        </Card>
      </div>
    </div>
  );
};

export default EVChargingSimulation;
