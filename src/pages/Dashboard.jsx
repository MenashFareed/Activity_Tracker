import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import CalorieChart from "../components/CalorieChart";
import WorkoutChart from "../components/WorkoutChart";
import { CALORIES_PER_HOUR } from "../constants";
import useWorkoutDb from "../hooks/useWorkoutDb";
import moment from 'moment';

function Dashboard() {
  const { isFetchingWorkouts, workouts } = useWorkoutDb();
  const initialData = {
    today: 0,
    week: 0,
    month: 0,
  };

  const [calories, setCalories] = useState(initialData);

  useEffect(() => {
    setCalories(initialData);

    const today = new Date();
    const dayOfYear = format(today, "d");
    const weekNum = format(today, "w");
    const monthNum = format(today, "L");

    const calcCalories = () => {
      for (const { createdAt, secondsPassed } of workouts) {
        const formattedDate = new Date(createdAt.seconds * 1000);
        const day = format(formattedDate, "d");
        const week = format(formattedDate, "w");
        const month = format(formattedDate, "L");

        const newCalories = CALORIES_PER_HOUR * (secondsPassed / 3600);

        if (dayOfYear === day) {
          setCalories((calories) => ({
            ...calories,
            today: calories.today + newCalories,
          }));
        }
        if (weekNum === week) {
          setCalories((calories) => ({
            ...calories,
            week: calories.week + newCalories,
          }));
        }
        if (monthNum === month) {
          setCalories((calories) => ({
            ...calories,
            month: calories.month + newCalories,
          }));
        }
      }
    };

    if (!isFetchingWorkouts && workouts.length) {
      calcCalories();
    }
  }, [isFetchingWorkouts, workouts]);

  const exerciseCount = {};
  const exerciseReps = {};
  let allReps = 0;
  
  workouts.forEach((item) => {
    const workout = item.workout;
    for (const key in workout) {
      const exerciseName = workout[key].exerciseName;
      const sets = workout[key].sets;
      if (exerciseName in exerciseCount) {
        exerciseCount[exerciseName]++;
      } else {
        exerciseCount[exerciseName] = 1;
      }
      for (const setKey in sets) {
        const reps = sets[setKey].reps;
        const createdAt = item.createdAt;
        if (exerciseName in exerciseReps) {
          exerciseReps[exerciseName].totalReps += reps;
          exerciseReps[exerciseName].repData.push({ reps, createdAt });
          allReps += reps;
        } else {
          exerciseReps[exerciseName] = {
            totalReps: reps,
            repData: [{ reps, createdAt }],
          };
          allReps += reps;
        }
      }
    }
  });

  function getTotalRepsForPeriod(activity, period) {
    const repData = exerciseReps[activity].repData;
    const now = moment();
    let totalReps = 0;
  
    if (period === 'today') {
      repData.forEach((rep) => {
        const repDate = moment.unix(rep.createdAt.seconds);
        if (now.isSame(repDate, 'day')) {
          totalReps += rep.reps;
        }
      });
    } else if (period === 'week') {
      repData.forEach((rep) => {
        const repDate = moment.unix(rep.createdAt.seconds);
        if (now.diff(repDate, 'days') <= 7) {
          totalReps += rep.reps;
        }
      });
    } else if (period === 'month') {
      repData.forEach((rep) => {
        const repDate = moment.unix(rep.createdAt.seconds);
        if (now.diff(repDate, 'days') <= 30) {
          totalReps += rep.reps;
        }
      });
    }
  
    return totalReps;
  }

  
  return (
    <div className="space-y-10 w-full">
      <div className="flex space-x-10 items-end">
        <h1 className="text-4xl">Dashboard</h1>
        <Link to="/activity">
          <Button value="New Activity" variant="primary" type="text" />
        </Link>
      </div>
      <main className="lg:flex lg:space-x-10 space-y-5 lg:space-y-0 chart-container">
        <section className="lg:w-72 bg-primary text-white rounded-xl" id="activity-chart">
          <div className="p-10 space-y-10">
            <h2 className="text-lg text-white">Activities</h2>
            <div className="space-y-1">
              <h5 className="font-light text-sm text-white">TOTAL</h5>
              <h3 className="font-light text-6xl text-white">
                {isFetchingWorkouts ? 0 : allReps}
              </h3>
            </div>
          </div>
          <WorkoutChart />
        </section>

{Object.keys(exerciseReps).map((activity) => (
        <section key={activity} className="flex-grow bg-white rounded-xl lg:flex" id="activity-chart">
          <div className="p-10 space-y-10">
            <h2 className="text-lg text-primary">{activity}</h2>
            <div className="space-y-1">
              <h5 className="font-light text-sm text-primary">TODAY</h5>
              <h3 className="font-light text-6xl text-primary">
                {getTotalRepsForPeriod(activity, 'today')}
              </h3>
            </div>
            <div className="space-y-1">
              <h5 className="font-light text-sm text-primary">THIS WEEK</h5>
              <h3 className="font-light text-6xl text-primary">
                {getTotalRepsForPeriod(activity, 'week')}
              </h3>
            </div>
            <div className="space-y-1">
              <h5 className="font-light text-sm text-primary">THIS MONTH</h5>
              <h3 className="font-light text-6xl text-primary">
                {getTotalRepsForPeriod(activity, 'month')}
              </h3>
            </div>
          </div>
          <div className="flex-grow">
            <CalorieChart activity={activity}/>
          </div>
        </section>
      ))}

      </main>
    </div>
  );
}

export default Dashboard;
