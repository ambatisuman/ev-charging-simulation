import React, { useMemo } from "react";
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

interface EVChargingCalculatorProps {
  chargePoints: number;
  arrivalMultiplier: number;
  consumption: number;
  chargingPower: number;
}

const EVChargingCalculator: React.FC<EVChargingCalculatorProps> = ({
  chargePoints,
  arrivalMultiplier,
  consumption,
  chargingPower,
}) => {
  const chargingCalculations = useMemo(() => {
    // Charging events calculation
    const chargingEventsPerDay = Math.floor(
      chargePoints *
        (arrivalMultiplier / 100) *
        (24 / (consumption / chargingPower))
    );

    // Energy calculations
    const energyPerCharge = consumption;
    const totalChargingEvents = {
      day: chargingEventsPerDay,
      week: chargingEventsPerDay * 7,
      month: chargingEventsPerDay * 30,
      year: chargingEventsPerDay * 365,
    };

    const totalEnergyCharged = {
      day: chargingEventsPerDay * energyPerCharge,
      week: totalChargingEvents.week * energyPerCharge,
      month: totalChargingEvents.month * energyPerCharge,
      year: totalChargingEvents.year * energyPerCharge,
    };

    // Hourly power demand simulation
    const hourlyPowerDemand = Array.from({ length: 12 }, (_, i) => {
      const hour = i * 2;
      const mockedBaseIntensity =
        hour < 6
          ? 20 // Late night until early morning
          : hour < 9
          ? 50 // Morning hours
          : hour < 17
          ? 150 // Peak daytime
          : hour < 20
          ? 100 // Evening hours
          : 40; // Late night again

      return {
        hour: `${hour}:00`,
        power: Math.min(
          180,
          Math.max(10, Math.random() * mockedBaseIntensity + 10)
        ),
      };
    });

    // Weekly data generation
    const weeklyData = [
      {
        day: "Mon",
        events: Math.floor(totalChargingEvents.day),
        energy: Math.floor(totalEnergyCharged.day),
      },
      {
        day: "Tue",
        events: Math.floor(totalChargingEvents.day),
        energy: Math.floor(totalEnergyCharged.day),
      },
      {
        day: "Wed",
        events: Math.floor(totalChargingEvents.day),
        energy: Math.floor(totalEnergyCharged.day),
      },
      {
        day: "Thu",
        events: Math.floor(totalChargingEvents.day),
        energy: Math.floor(totalEnergyCharged.day),
      },
      {
        day: "Fri",
        events: Math.floor(totalChargingEvents.day),
        energy: Math.floor(totalEnergyCharged.day),
      },
      {
        day: "Sat",
        events: Math.floor(totalChargingEvents.day),
        energy: Math.floor(totalEnergyCharged.day),
      },
      {
        day: "Sun",
        events: Math.floor(totalChargingEvents.day),
        energy: Math.floor(totalEnergyCharged.day),
      },
    ];

    return {
      hourlyPowerDemand,
      weeklyData,
      totalChargingEvents,
      totalEnergyCharged,
      peakPowerDemand: Math.min(chargePoints * chargingPower, 180),
    };
  }, [chargePoints, arrivalMultiplier, consumption, chargingPower]);

  return (
    <div className='space-y-6'>
      {/* Daily power usage chart */}
      <Card>
        <h2 className='text-xl font-semibold mb-4'>Hourly Power Demand</h2>
        <div className='h-64 mb-6'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={chargingCalculations.hourlyPowerDemand}>
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
        <table className='w-full border'>
          <thead>
            <tr>
              <th className='border p-2'>Hour</th>
              <th className='border p-2'>Power (kW)</th>
            </tr>
          </thead>
          <tbody>
            {chargingCalculations.hourlyPowerDemand.map((point, index) => (
              <tr key={index}>
                <td className='border p-2'>{point.hour}</td>
                <td className='border p-2'>{point.power.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Weekly power usage visualization */}
      <Card>
        <h2 className='text-xl font-semibold mb-4'>Weekly Overview</h2>
        <div className='h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={chargingCalculations.weeklyData}>
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
          <h3 className='text-lg font-semibold mb-2'>
            Total Energy Charged (kWh)
          </h3>
          <table className='w-full'>
            <tbody>
              <tr>
                <td>Per Day:</td>
                <td>
                  {chargingCalculations.totalEnergyCharged.day.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td>Per Week:</td>
                <td>
                  {chargingCalculations.totalEnergyCharged.week.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td>Per Month:</td>
                <td>
                  {chargingCalculations.totalEnergyCharged.month.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td>Per Year:</td>
                <td>
                  {chargingCalculations.totalEnergyCharged.year.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </Card>

        <Card>
          <h3 className='text-lg font-semibold mb-2'>Charging Events</h3>
          <table className='w-full'>
            <tbody>
              <tr>
                <td>Per Day:</td>
                <td>{chargingCalculations.totalChargingEvents.day}</td>
              </tr>
              <tr>
                <td>Per Week:</td>
                <td>{chargingCalculations.totalChargingEvents.week}</td>
              </tr>
              <tr>
                <td>Per Month:</td>
                <td>{chargingCalculations.totalChargingEvents.month}</td>
              </tr>
              <tr>
                <td>Per Year:</td>
                <td>{chargingCalculations.totalChargingEvents.year}</td>
              </tr>
            </tbody>
          </table>
        </Card>
        <Card>
          <h3 className='text-lg font-semibold mb-2'>Peak Power Demand</h3>
          <p className='text-lg font-normal'>
            {chargingCalculations.peakPowerDemand} kW
          </p>
          <p className='text-sm text-gray-500'>Maximum this week</p>
        </Card>
      </div>
    </div>
  );
};

export default EVChargingCalculator;
