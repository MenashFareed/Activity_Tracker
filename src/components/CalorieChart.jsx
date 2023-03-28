import { format, subDays } from "date-fns";
import React, { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import useWorkoutDb from "../hooks/useWorkoutDb";

function CalorieChart({ activity }) {
  const [data, setData] = useState([]);

  const { isFetchingWorkouts, workouts } = useWorkoutDb();

  useEffect(() => {
    let lastDays = [];

    const addEmptyDays = () => {
      const today = new Date();

      for (let i = 6; i >= 0; i--) {
        const day = format(subDays(today, i), "E");
        lastDays.push(day);
        setData((data) => [...data, { day, reps: 0 }]);
      }
    };

    const addRepsPerDay = () => {
      for (const { createdAt, workout } of workouts) {
        if (!workout) continue; 
        let reps = 0;
        Object.entries(workout).forEach(([workoutId, workoutData]) => {
          if (workoutData.exerciseName === activity) {
            Object.entries(workoutData.sets).forEach(([setId, setData]) => {
              if (setData.isFinished) {
                reps += setData.reps;
              }
            });
          }
        });
        const day = format(new Date(createdAt.seconds * 1000), "E");
        const index = lastDays.indexOf(day);
        if (index !== -1) {
          setData((data) => {
            data[index].reps = data[index].reps + reps;
            return data;
          });
        }
      }
    };

    setData([]);
    addEmptyDays();

    if (!isFetchingWorkouts && workouts.length) {
      addRepsPerDay();
    }
  }, [isFetchingWorkouts, workouts, activity]);

  return (
    <ResponsiveContainer width="99%" height={500}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FFB7E4" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#FFB7E4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#FFB7E4", fontSize: 10 }}
          interval={0}
          padding={{ left: 5, right: 5 }}
        />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="reps"
          stroke="#de8cbf"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorUv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default CalorieChart;


